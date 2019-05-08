
"use strict";
/**
 *
 * @author fuzemeng
 * @date 2018/11/20
 */
const Service = require('egg').Service;

class TalkService extends Service {

  constructor(param) {
    super(param);
    this.mysql = this.app.database.object_mysql;
    this.resMsg = this.ctx.resMsg;
    this.moment = this.ctx.helper.moment;
    this.enumResType = this.ctx.enumResType;
  }


  async getInquiries(param) {
    const { mysql, resMsg, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    console.log(diagnosiState)
    if (!diagnosiState) return newOk('查询成功');
    if (param.talk_group) {//根据分组查询相应数据
      const sql = ` select * from case_history_taking where talk_group='${param.talk_group}' and case_id=${diagnosiState.case_id} `
      const results = await mysql.query(sql);
      let opt = {
        // user_id: user_id,//'用户编号'
        // case_id: caseDiagnosisState.case_id,//'病例编号'
        case_diagnosis_id: diagnosiState.id,//'case_diagnosis_state的编号'
        type: 1//'问诊'
      }
      //检查是否已经存在此问诊记录
      const oldTalks = await mysql.select('lx_case_basis', {where:opt});
      
      for (const result of results) {
        result['click_state'] = 0;
        if(oldTalks.length > 0){
          for (const iterator of oldTalks) {
            const content = JSON.parse(iterator.content);
            // console.log(content.question===result.question)
            if(content.question === result.question) result['click_state'] = 1;
          }
        }
      }
      return resMsg.newOk('查询成功', results);
    }
    if (param.keyword) {//根据关键词查询
      const sql = ` select * from case_history_taking where question like '%${param.keyword}%' and case_id=${diagnosiState.case_id}  `
      const results = await mysql.query(sql);

      // 数据格式处理
      let groups = []
      let groups_value = [];
      for (const iterator of results) {
        if (groups.indexOf(iterator.talk_group) === -1) {
          groups.push(iterator.talk_group);
          //obj.push({group_key:iterator.talk_group});
        }
      }
      for (const key of groups) {
        let group_value = { group_key: key, data: [] }
        for (const iterator of results) {
          if (iterator.talk_group === key) group_value.data.push(iterator);
        }
        groups_value.push(group_value);
      }

      return resMsg.newOk('查询成功', groups_value);
    }
    //查询所有
    const sql = ` select talk_group,count(*) count from case_history_taking where   1=1 and case_id=${diagnosiState.case_id} group by talk_group`;
    const results = await mysql.query(sql);
    return resMsg.newOk('查询成功', results);
  }


  async addTalkBasis(talk_id) {
    const { ctx, mysql, resMsg, moment, enumResType, service } = this;
    //查看问题是否存在
    const question = await mysql.get('case_history_taking', { id: talk_id });
    if (!question) return resMsg.newError(enumResType.err_no_data[0], '此问诊记录不存在');
    //查看用户是否存在诊断练习对应病例的记录
    const user_id = ctx.__token_info.data.id;
    const caseDiagnosisState = await service.common.common.getdiagnosiState();
    let opt = {
      // user_id: user_id,//'用户编号'
      // case_id: caseDiagnosisState.case_id,//'病例编号'
      case_diagnosis_id: caseDiagnosisState.id,//'case_diagnosis_state的编号'
      type: 1//'问诊'
    }
    //检查是否已经存在此问诊记录
    const oldTalks = await mysql.select('lx_case_basis', {where:opt});
    if(oldTalks.length > 0){
      for (const iterator of oldTalks) {
        const content = JSON.parse(iterator.content);
        if(content.question === question.question) return resMsg.newError(enumResType.err_repeat_data[0],'已经存在此问诊记录')
      }
    }

    const questionAnswer = {
      question: question.question,
      answer: question.answer,
      time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    opt.last_time = now;
    opt.create_time = now;
    opt.content = JSON.stringify(questionAnswer);
    const result = await mysql.insert('lx_case_basis', opt);
    if (result.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '处理异常');
    //查看是否已经存在问诊的依据
    // const caseBasis = await mysql.get('case_basis', opt);
    // if (!caseBasis) { //不存在，新增   
    //   opt.last_time = now;
    //   opt.create_time = now;
    //   opt.content = JSON.stringify([questionAnswer]);
    //   const result = await mysql.insert('case_basis', opt);
    //   if (result.affectedRows < 1) return resMsg.newError();
    //   return resMsg.newOk();
    // }
    //存在就修改
    // let content = JSON.parse(caseBasis.content);
    // content.push(questionAnswer);
    // caseBasis.content = JSON.stringify(content);
    // caseBasis.last_time = now;
    // const result = await mysql.update('case_basis', caseBasis);
    // if (result.affectedRows < 1) return resMsg.newError();

    //操作记录
    const historyOpt = {
      // user_id: user_id,//'用户编号'
      // case_id: caseDiagnosisState.case_id,//'病例编号'
      case_diagnosis_id: caseDiagnosisState.id,//'case_diagnosis_state的编号',
      type: '问诊'
    }
    const talkHistory = await mysql.get('lx_case_history', historyOpt);
    if (!talkHistory) {
      historyOpt.content = JSON.stringify([questionAnswer]);
      historyOpt.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
      const historyRet = await mysql.insert('lx_case_history', historyOpt);
      if (historyRet.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '处理异常');
      return resMsg.newOk();
    }
    let historyContent = JSON.parse(talkHistory.content);
    historyContent.push(questionAnswer);
    talkHistory.content = JSON.stringify(historyContent);
    const historyRet = await mysql.update('lx_case_history', talkHistory)
    if (historyRet.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '处理异常');
    return resMsg.newOk();
  }


  async getTalkHistory() {
    const { ctx, mysql, resMsg,  service } = this;
    //查看用户是否存在诊断练习对应病例的记录
    const user_id = ctx.__token_info.data.id;
    const caseDiagnosisState = await service.common.common.getdiagnosiState();
    let opt = {
      // user_id: user_id,//'用户编号'
      // case_id: caseDiagnosisState.case_id,//'病例编号'
      case_diagnosis_id: caseDiagnosisState.id,//'case_diagnosis_state的编号'
      type: '问诊'
    }
    //查看是否已经存在问诊的依据
    let result = [];
    const caseHistory = await mysql.get('lx_case_history', opt);
    if (caseHistory) {
      result = caseHistory.content;
      result = JSON.parse(result);
    }
    return resMsg.newOk('查询成功', result);
  }


}

module.exports = TalkService;