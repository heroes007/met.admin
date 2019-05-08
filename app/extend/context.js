"use strict";
/**
 * @author fuzemeng
 * @date 2018/11/21
 */
const enumResType = {//token <-900 

  //成功
  ok_code: [1, '操作成功'],
  err_unknown: [-1, '未知错误'],

  //失败
  //1.token
  //token为空
  err_null_token: [-900, 'token为空'],
  //token失效
  err_invalid_token: [-901, 'token失效'],
  //token错误
  err_uncorrect_token: [-902, 'token错误'],
  //token生成错误
  err_create_token: [-903, 'token生成错误'],

  //数据库操作失败
  err_operate_sql: [-500, '数据库操作失败'],


  //暂无数据
  err_no_data: [-600, '暂无数据'],
  //数据重复
  err_repeat_data: [-601, '数据重复'],
  err_illegal_operate: [-602, '非法操作'],


  //参数错误
  err_invalid_param: [-400, '参数错误'],

  // //2.用户
  // //注册失败
  // err_faild_reg: [-200, '注册失败'],
  // //两次输入的密码不一致
  // err_tally_pwd: [-201, '两次输入的密码不一致'],
  // //用户已存在
  // err_repeat_user: [-202, '用户已存在'],
  // //登录失败
  // err_faild_login: [203, '登录失败'],


  // //参数错误 

  // //用户名或密码错误
  // err_invalid_param: -400,




  //3.练习
  //暂无数据
  //




  // 提示msg
  prompt_err_code: 300,

  // 参数失败
  param_err_code: 400,

  // Token失败
  token_err_code: 500,

  // 系统错误
  system_err_code: 600,

  // 重复
  repeat_err_code: 700,

  // 暂无数据
  nodata_err_code: 800
};
module.exports = {
  enumResType: enumResType,
  /**
   * 统一响应
   */
  resMsg: {
    newOk: (msg, data, code) => {
      const returnValue = {
        res_code: code ? code : enumResType.ok_code[0],
        msg: msg ? msg : enumResType.ok_code[1],
      };

      if (data) returnValue.data = data;
      return returnValue;
      // return (data)=>{
      //   if (data) returnValue.data = data;
      //   return returnValue;
      // }; 
      // return ((data)=>{
      //   if (data) returnValue.data = data;
      //   return returnValue;
      // })();     
    },
    newError: (code, msg) => {
      const returnValue = {
        res_code: code ? code : enumResType.err_unknown[0],
        msg: msg ? msg : enumResType.err_unknown[1]
      }
      return returnValue;
    },
    // newOk: (data = [], msg = '成功') => {
    //   return { res_code: enumResType.ok_code, msg, data };
    // },
    // newError: (code, msg = '失败', data = []) => {
    //   if (!code)
    //     code = enumResType.prompt_err_code;
    //   return { res_code: code, msg, data }
    // },
    newParamErr: (data = [], msg = '参数错误') => {
      return { res_code: enumResType.param_err_code, msg, data };
    },
    newRepeatErr: (msg = '数据重复', code) => {
      return { res_code: code | enumResType.err_repeat_user[0], msg };
    },
    newNoDataError: (msg = '暂无数据', code, data = []) => {
      return { res_code: code | enumResType.nodata_err_code, msg, data }
    },


  },
  /**
   * 自定义异常处理
   */
  customError: {
    promptError: function (code, message) {
      let e = new Error(message);
      e.name = 'promptError';
      e.err_code = code;
      throw e;
    }
  }
}