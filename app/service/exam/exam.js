
"use strict";
/**
 *
 * @author fuzemeng
 * @date 2019/02/22
 */
const Service = require('egg').Service;

class ExamService extends Service {

  constructor(param) {
    super(param);
    this.mysql = this.app.database.object_mysql;
    this.resMsg = this.ctx.resMsg;
    this.moment = this.ctx.helper.moment;
    this.enumResType = this.ctx.enumResType;
  }
  async endAct(){
    const { ctx, resMsg, mysql,enumResType, moment,service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    
    let now = moment();
    const cha = moment.duration(now - moment(diagnosiState.create_time), 'ms').get('minutes');

    let sql = ` update lx_case_diagnosis_state set diagnosis_state=-1,last_time='${now.format('YYYY-MM-DD HH:mm:ss')}' where type=${ctx.__token_info.action} and user_id=${ctx.__token_info.data.id} and  diagnosis_state=1 `;
    const result = await mysql.query(sql);
    if (result.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '操作失败');
    // if(ctx.__token_info.action === 1){
    //     sql = ` select * from lx_case_exam where `
    // }
    return resMsg.newOk(`${ctx.__token_info.action === 1 ? '模拟考试' : '模拟练习'}完成`, {use_time:cha});
  }
  async getExamCases() {
    const { ctx, moment, resMsg, mysql, service } = this;
    //const examState = await service.common.common.getExamState();
    const user_id = ctx.__token_info.data.id;
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    let sql = `
                SELECT
                    c.id,
                    lce.start_time,
                    lce.end_time,
                    lce.exam_time,
                    c.name,
                    c.symptom,
                    c.patient_name,
                    c.patient_gender,
                    c.patient_age,
                    c.patient_marital_status,
                    c.patient_nation,
                    c.patient_occupation,
                    c.patient_head_portrait_url,
                    c.patient_division,
                    c.degree	
                FROM
                    lx_case_exam lce,
                    ${'`case`'} c 
                WHERE
                    c.id = lce.case_id 
                    and lce.end_time > '${now}'
                    AND c.id not in (select case_id from lx_case_diagnosis_state where type = 1 and diagnosis_state=-1 and user_id = ${user_id} )
                    `
        
    let result = await mysql.query(sql);
    //查询有无未完成的考试
    const continues = await mysql.query(`select * from lx_case_diagnosis_state
                                            where user_id=${user_id}
                                            and diagnosis_state in (-2,1)
                                            and type=1
                                        `);
                                        console.log(continues)
    if(continues.length > 0){
        for (const iterator of result) {
            for (const continu of continues) {
                if(iterator.id === continu.case_id) iterator.state = 2;
            }
        }
    }
    
    if(result.length > 0){
        for (const iterator of result) {
            console.log(now > moment(iterator.start_time).format('YYYY-MM-DD HH:mm:ss'))
            if(now > moment(iterator.start_time).format('YYYY-MM-DD HH:mm:ss') && now < moment(iterator.end_time).format('YYYY-MM-DD HH:mm:ss') && (!iterator.state || iterator.state != 2)) iterator.state = 1;//在考试周期内，可以开始考试
            if(now < moment(iterator.start_time).format('YYYY-MM-DD HH:mm:ss')) iterator.state = 0;//不在考试周期内，暂未开放
        }
    }
    result = await ctx.helper.dateFormat(result, ['start_time', 'end_time'], 'YYYY-MM-DD');
    result = await result.sort((x,y) => {return y.state-x.state})
    return resMsg.newOk('查询成功', result);
  }

  
}

module.exports = ExamService;