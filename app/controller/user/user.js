"use strict";
/**
 * @author fuzemeng
 * @date 2018/11/27
 */
const Controller = require('egg').Controller;

class UserController extends Controller {

  /**
   * this赋值 便捷处理
   * @param param
   */
  constructor(param) {
    super(param);
    this.mysql = this.app.database.object_mysql;
    this.resMsg = this.ctx.resMsg;
    this.enumResType = this.ctx.enumResType;
    this.parameter = this.ctx.helper.parameter;

  }
  /**
   * 接口测试
   */
  async test() {
    this.ctx.body = 'ok，项目接口可正常访问。';
  }
  /**
    * @apiDefine user 用户
    */

  /**
   * @api {post} /user/register 1.用户注册(暂未使用)
   * @apiVersion 1.0.0
   * @apiName register
   * @apiGroup user
   *
   * @apiParam {string} phone 手机号
   * @apiParam {string} pwd 密码
   * @apiParam {string} repwd 密码确认
   *
   * @apiSuccess {number} res_code 状态码
   * @apiSuccess {string} msg 返回详情
   *
   * @apiSuccessExample Success-Response:
   * {
   *   "res_code": 1,
   *   "msg": "注册成功"
   * }
   */

  async register() {
    const { ctx, service, resMsg, enumResType, parameter } = this;
    const param = ctx.request.body;
    const rule = {
      phone: { type: 'string', required: true },
      pwd: { type: 'string', required: true },
      repwd: { type: 'string', required: true }
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
      ctx.body = resMsg.newParamErr(errors);
      return;
    }
    //两次输入密码比对
    if (param.pwd != param.repwd) {
      ctx.body = resMsg.newError(enumResType.err_invalid_param[0], '两次输入密码不一致！');
      return;
    }
    //是否已经注册
    const isRegister = await service.user.user.isRegister(param.phone);
    if (isRegister) {
      ctx.body = resMsg.newError(enumResType.err_repeat_data[0], '用户已存在');
      return;
    }
    //检测通过，插入新用户数据
    const result = await service.user.user.insertUser(param);
    ctx.body = result;
  }

  /**
    * @api {post} /user/login 2.登录
    * @apiVersion 1.0.0
    * @apiName login
    * @apiGroup user
    *
    * @apiParam {string} phone 手机号
    * @apiParam {string} pwd 密码
    *
    * @apiSuccess {number} res_code 状态码
    * @apiSuccess {string} msg 返回详情
    * @apiSuccess {object} data 用户信息
    *
    * @apiSuccessExample Success-Response:
    * {
    *   "res_code": 1,
    *   "msg": "登录成功",
    *   "data": {
    *           "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",
    *           "img_url": "http://cdn.qmzbe.top/timg.jpeg",
    *           "name": "王思匆"
    *          }
    * }
    */
  async login() {
    const { ctx, service, parameter, resMsg } = this;
    const param = ctx.request.body;
    const rule = {
      phone: { type: 'string', required: true },
      pwd: { type: 'string', required: true }
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
      ctx.body = resMsg.newParamErr(errors);
      return;
    }
    const result = await service.user.user.login(param);
    ctx.body = result;
  }
  /**
    * @api {post} /user/logout 3.注销
    * @apiVersion 1.0.0
    * @apiName logout
    * @apiGroup user
    *
    * @apiParam {string} token
    *
    * @apiSuccess {number} res_code 状态码
    * @apiSuccess {string} msg 返回详情
    *
    * @apiSuccessExample Success-Response:
    * {
    *   "res_code": 1,
    *   "msg": "已退出"
    * }
    */
  async logout() {
    const { ctx, service } = this;
    const token = ctx.request.body.token;
    const result = await service.user.user.logout(token);
    ctx.body = result;
  }

}

module.exports = UserController;