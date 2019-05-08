
"use strict";
/**
 *
 * @author fuzemeng
 * @date 2018/11/20
 */
const Service = require('egg').Service;

class HandleService extends Service {

  constructor(param) {
    super(param);
    this.mysql = this.app.database.object_mysql;
    this.resMsg = this.ctx.resMsg;
    this.moment = this.ctx.helper.moment;
    this.enumResType = this.ctx.enumResType;
    this.public_dir = this.app.config.public_dir;
  }
  async getHandleWay(case_id) {
    const { mysql, ctx, resMsg, enumResType, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const result = await mysql.get('lx_patient_handle_result', { case_diagnosis_id: diagnosiState.id });
    if (!result) return resMsg.newError(enumResType.err_no_data[0], '没有查询到病人处置方式数据');
    return resMsg.newOk('查询成功', { patient_handle_way: result.patient_handle_way });
  }

  async chooseHandleWay(param) {
    const { ctx, mysql, resMsg, moment, enumResType, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const opt = {
      // user_id: ctx.__token_info.data.id, //'用户编号',
      // case_id: diagnosiState.case_id, //'病例编号',
      case_diagnosis_id: diagnosiState.id, //'拟诊编号（case_diagnosis_state的编号）',
      diagnose_result: param.diagnose_result,
      patient_handle_way: param.handle_way, //'病人处置方式',
      // nursing_rule:, //'护理常规',

    }
    const isExist = await mysql.get('lx_patient_handle_result', opt);
    if (isExist) return resMsg.newError(enumResType.err_repeat_data[0], '处理结果数据已经存在');

    opt.create_time = now; //'创建时间',
    opt.last_time = now; //'最后操作时间',
    const result = await mysql.insert('lx_patient_handle_result', opt);
    if (result.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '处理失败');
    return resMsg.newOk();
  }

  async addNursePlan(param) {
    const { ctx, mysql, resMsg, enumResType, moment, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const handleResult = await mysql.get('lx_patient_handle_result', { case_diagnosis_id: diagnosiState.id });
    // if (!handleResult) return resMsg.newError(enumResType.err_no_data[0], '没有相应的病例处理结果');
    const opt = {
      // user_id: ctx.__token_info.data.id, //'用户编号',
      // case_id: diagnosiState.case_id, //'病例编号',
      case_diagnosis_id: diagnosiState.id,//'病例对应关系表编号（case_diagnosis_state的编号）',
      patient_handle_result_id: 1,//handleResult.id, //'病例处理结果编号',
      nursing_grade: param.nursing_grade,
      nursing_rule: param.nursing_rule,
      diagnose_result: '诊断结果',//param.diagnose_result,
      illness_name: param.illness_name,
      treat_condition: param.treat_condition,
      posture: param.posture,
      // patrol_time: param.patrol_time,
      meals: param.meals,
      reason: param.reason
    }

    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const isExistOpt = {
      // user_id: ctx.__token_info.data.id, //'用户编号',
      // case_id: diagnosiState.case_id, //'病例编号',
      case_diagnosis_id: diagnosiState.id,//'病例对应关系表编号（case_diagnosis_state的编号）',
      patient_handle_result_id: 1, //handleResult.id,
    }
    const isExist = await mysql.get('lx_patient_nurse_plan', isExistOpt);
    if (isExist) return resMsg.newError(enumResType.err_repeat_data[0], '护理方案已经存在');

    opt.create_time = now; //'创建时间',
    opt.last_time = now; //'最后操作时间',
    const result = await mysql.insert('lx_patient_nurse_plan', opt);
    if (result.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '处理失败');
    return resMsg.newOk();
  }

  async getNursePlan() {
    const { resMsg, mysql, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const result = await mysql.select('lx_patient_nurse_plan', { where: { case_diagnosis_id: diagnosiState.id } });//此处因为没有护理常规表，所以暂时未关联
    return resMsg.newOk('查询成功', result);

  }


  async updateNursePlan(param) {
    const { resMsg, mysql, enumResType, moment, service } = this;
    delete param.token;
    param.last_time = moment().format('YYYY-MM-DD HH:mm:ss');
    const result = await mysql.update('lx_patient_nurse_plan', param);
    if (result.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '修改失败');
    return resMsg.newOk();
  }


  async delNursePlan(id) {
    const { mysql, enumResType, resMsg, service } = this;
    const isExist = await mysql.get('lx_patient_nurse_plan', { id: id });
    if (!isExist) return resMsg.newError(enumResType.err_no_data[0], '数据不存在或者已删除');
    const result = await mysql.delete('lx_patient_nurse_plan', { id: id });
    if (result.affectedRows < 0) return resMsg.newError(enumResType.err_no_data[0], '数据不存在或者已删除');
    return resMsg.newOk();
  }


  async addTreatPlan(param) {
    const { ctx, mysql, resMsg, enumResType, moment, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const handleResult = await mysql.get('lx_patient_handle_result', { case_diagnosis_id: diagnosiState.id });
    // if (!handleResult) return resMsg.newError(enumResType.err_no_data[0], '没有相应的病例处理结果');
    const opt = {
      // user_id: ctx.__token_info.data.id, //'用户编号',
      // case_id: diagnosiState.case_id, //'病例编号',
      case_diagnosis_id: diagnosiState.id,//'病例对应关系表编号（case_diagnosis_state的编号）',
      patient_handle_result_id: 1,//handleResult.id, //'病例处理结果编号',
      drug_type: param.drug_type, //'药物类型',
      drug_name: param.drug_name, //'药物名称',
      drug_use_dose: param.drug_use_dose, //'药物剂量',
      drug_use_method: param.drug_use_method, //'药物用法',
      drug_use_interval: '时间间隔', //param.drug_use_interval, //'时间间隔',
      drug_use_reason: param.drug_use_reason, //'应用理由',
      drug_first_id: param.drug_first_id,
      drug_second_id: param.drug_second_id,
      drug_third_id: param.drug_third_id
    }

    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const isExist = await mysql.get('lx_patient_handle_plan', opt);
    if (isExist) return resMsg.newError(enumResType.err_repeat_data[0], '处理结果数据已经存在');

    opt.create_time = now; //'创建时间',
    opt.last_time = now; //'最后操作时间',
    const result = await mysql.insert('lx_patient_handle_plan', opt);
    if (result.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '处理失败');
    return resMsg.newOk();
  }


  async getTreatPlan() {
    const { resMsg, mysql, service,public_dir} = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    console.log(public_dir);
    const result = await mysql.select('lx_patient_handle_plan', { where: { case_diagnosis_id: diagnosiState.id } });//此处因为没有护理常规表，所以暂时未关联
    return resMsg.newOk('查询成功', result);
  }


  async updateTreatPlan(param) {
    const { resMsg, mysql, enumResType, moment, service } = this;
    delete param.token;
    param.last_time = moment().format('YYYY-MM-DD HH:mm:ss');
    const result = await mysql.update('lx_patient_handle_plan', param);
    if (result.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '修改失败');
    return resMsg.newOk();
  }


  async delTreatPlan(id) {
    const { mysql, enumResType, resMsg, service } = this;
    const isExist = await mysql.get('lx_patient_handle_plan', { id: id });
    if (!isExist) return resMsg.newError(enumResType.err_no_data[0], '数据不存在或者已删除');
    const result = await mysql.delete('lx_patient_handle_plan', { id: id });
    if (result.affectedRows < 0) return resMsg.newError(enumResType.err_no_data[0], '数据不存在或者已删除');
    return resMsg.newOk();
  }

  async getTreatment(param) {
    const { mysql, resMsg, service } = this;
    // const opt = {treatment_category_id:param.treatment_category_id};
    // if(param.parent_id) opt.parent_id = param.parent_id;
    let sql = ` select * from treatment where 1=1 and treatment_category_id=${param.treatment_category_id}`;
    sql += param.parent_id ? ` and parent_id=${param.parent_id} and parent_id<>0` : ` and parent_id=0 `
    const result = await mysql.query(sql);
    return resMsg.newOk('查询成功', result);
  }

}

module.exports = HandleService;