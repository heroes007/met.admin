"use strict";
/**
 * 整个病例训练考试过程中都要用到的方法
 * @author fuzemeng
 * @date 2018/11/20
 */
const Service = require('egg').Service;

class CommonService extends Service {

  constructor(param) {
    super(param);
    this.mysql = this.app.database.object_mysql;
    this.resMsg = this.ctx.resMsg;
    this.moment = this.ctx.helper.moment;
    this.enumResType = this.ctx.enumResType;
  }

 /**
   * 检测用户是否有正在练习中的病例，并且返回病例与用户关系表相应的数据
   */
  async getdiagnosiState() {
    const { ctx, mysql, enumResType } = this;
    const user_id = ctx.__token_info.data.id;
    const diagnosiOpt = {
      user_id: user_id,
      diagnosis_state: 1,
      type:ctx.__token_info.action//0
    }
    const diagnosiState = await mysql.get('lx_case_diagnosis_state', diagnosiOpt);
    if (diagnosiState) return diagnosiState;
    ctx.customError.promptError(enumResType.err_no_data[0], '无正在进行的病例')
  }
   /**
   * 检测用户是否有正在考试中的病例，并且返回病例与用户关系表相应的数据
   */
  async getExamState() {
    const { ctx, mysql, enumResType } = this;
    const user_id = ctx.__token_info.data.id;
    const examOpt = {
      user_id: user_id,
      diagnosis_state: 1,
      type:1
    }
    const examState = await mysql.get('lx_case_diagnosis_state', examOpt);
    if (examState) return examState;
    ctx.customError.promptError(enumResType.err_no_data[0], '您无正在进行考试的病例')
  }

}

module.exports = CommonService;