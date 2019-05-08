
"use strict";
/**
 *
 * @author fuzemeng
 * @date 2018/11/20
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

  async getObjectivetest() {
    const { ctx, resMsg, mysql, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const sql = ` SELECT
                co.id question_id,
                co.question question,
                coo.id option_id,
                coo.option_name option_name,
                co.multiple_selection 
              FROM
                case_objectivetest co,
                case_objectivetest_option coo 
              WHERE
                co.id = coo.case_ovjectivetest_id 
                and co.case_id=${diagnosiState.case_id}
              ORDER BY
                co.id `
    console.log(sql)
    const result = await mysql.query(sql);
    return resMsg.newOk('查询成功', result);
  }

  async saveObjectivetest(objectiveArray) {
    const { ctx, mysql, resMsg, enumResType, moment, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    let sql = ` SELECT
                co.id question_id,
                co.question question,
                coo.id option_id,
                coo.option_name option_name,
                coo.is_reght  is_reght 
              FROM
                case_objectivetest co,
                case_objectivetest_option coo 
              WHERE
                co.id = coo.case_ovjectivetest_id 
                and co.case_id=${diagnosiState.case_id}
              ORDER BY
                co.id,coo.id `
    const results = await mysql.query(sql);
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    if (results.length === 0) return resMsg.newError(enumResType.err_no_data[0], '数据异常')
    for (const iterator of objectiveArray) {
      let optionsStr = '';
      console.log(results)
      for (let i = 0, len = results.length; i < len; i++) {
        const result = results[i];
        if (iterator.case_ovjectivetest_id === result.question_id && result.is_reght === 1) {
          optionsStr += result.option_id + ',';
        }
      }
      optionsStr = optionsStr.length > 0 ? optionsStr.substring(0, optionsStr.length - 1) : '';
      iterator.option_answer_id = optionsStr;
      iterator.is_reght = 0;
      if (iterator.option_choose_id === optionsStr) iterator.is_reght = 1;
      iterator.case_diagnosis_id = diagnosiState.id;
      iterator.create_time = `${now}`;
      iterator.last_time = `${now}`;
    }
    sql = await ctx.helper.saveArray(objectiveArray, 'lx_case_objectivetest_result');
    if (!sql) return resMsg.newError(enumResType.err_operate_sql[0], '数据异常');
    const result = await mysql.query(sql);
    if (result.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '保存失败');
    return resMsg.newOk('模拟考试完成');
  }

}

module.exports = ExamService;