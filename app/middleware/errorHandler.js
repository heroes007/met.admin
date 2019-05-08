"use strict";
/**
 * 统一异常处理
 * @author fuzemeng
 * @date 2018/11/20
 */

module.exports = options => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (e) {
      console.error(e.stack)
      if (e.name == 'promptError') {
        console.log(e)
        ctx.body = ctx.resMsg.newError(e.err_code, e.message);
      } else {
        console.error(e)
        ctx.body = ctx.resMsg.newError( ctx.enumResType.system_err_code, '系统发生错误，请联系管理人员');
      }
    }
  };
};