
"use strict";
/**
 *
 * @author wangchenzhao
 * @date 2018/11/20
 */
const Service = require('egg').Service;

class UserService extends Service {

  constructor(param) {
    super(param);
    this.mysql = this.app.database.object_mysql;
    this.resMsg = this.ctx.resMsg;
    this.moment = this.ctx.helper.moment;
    this.enumResType = this.ctx.enumResType;
  }

  async insertUser(param) {
    const { moment, mysql, resMsg, enumResType } = this;
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    param.create_time = now;
    param.update_time = now;
    delete param.repwd;
    const result = await mysql.insert('lx_user_info', param);
    if (result.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '注册失败')
    return resMsg.newOk('注册成功');

  }

  async isRegister(phone) {
    const { mysql } = this;
    const results = await mysql.select('lx_user_info', { where: { phone: phone } });
    let returnValue = false;
    if (results.length > 0) { returnValue = true; }
    return returnValue;
  }

  async login(param) {
    const { mysql, moment, resMsg, enumResType } = this;
    //检查是否存在用户
    const results = await mysql.select('lx_user_info', { where: { phone: param.phone, pwd: param.pwd } });
    if (results.length === 0) { return resMsg.newError(enumResType.err_invalid_param[0], '用户名或密码错误'); }
    let userInfo = results[0];
    //获取token
    const token = await this.ctx.helper.createToken({ "id": userInfo.id, "phone": userInfo.phone });
    if (!token) { return resMsg.newError(enumResType.err_create_token[0], enumResType.err_create_token[1]); }
    userInfo.token = token;
    userInfo.last_login_time = moment().format('YYYY-MM-DD HH:mm:ss');
    const result = await mysql.update('lx_user_info', userInfo);
    if (result.affectedRows <= 0) { return resMsg.newError(enumResType.err_operate_sql[0], '登录失败'); }
    return resMsg.newOk('登录成功', {
      token: token,
      img_url: userInfo.img_url,
      name: userInfo.name
    });
  }

  async logout(param) {
    const { ctx, mysql, resMsg } = this;
    const opt = {
      id: ctx.__token_info.data.id,
      token: param.token
    }
    // param.id = ctx.__token_info.data.id;
    const result = await mysql.update('lx_user_info', opt);
    if (result.affectedRows === 1) {
      return resMsg.newOk('已退出');
    }
    return resMsg.newError(enumResType.err_operate_sql[0], '退出失败或已退出');
  }
}

module.exports = UserService;