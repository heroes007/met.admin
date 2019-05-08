"use strict";
/**
 * token 检验
 * @author fuzemeng
 * @date 2018/11/21
 */
module.exports = (token) => {

  return async function checkToken(ctx, next) {
    const { enumResType } = ctx;
    try {
      let token = ctx.method == 'POST' ? ctx.request.body.token : ctx.query.token;
      // console.log({token:token});
      let data = ctx.method == 'POST' ? ctx.request.body : ctx.query;
      console.log(`请求方式：${ctx.method}`);
      console.log(`请求参数：`, data);
      let result = ctx.helper.checkToken(token);
      if (result.res_code != 1) {
        ctx.body = result;
        return;
      }
        const userInfo = await ctx.service.common.template.checkToken(token);
        console.log(userInfo)
      if(!userInfo) {
        ctx.body = ctx.resMsg.newError(enumResType.err_invalid_token[0], 'token不存在');
        return;
      }
      // if(!userInfo.action) {
      //   ctx.body = ctx.resMsg.newError(enumResType.err_illegal_operate[0], enumResType.err_illegal_operate[1]);
      //   return;
      // }
      if(userInfo.action === 0 || userInfo.action === 1) result.action=userInfo.action;
      console.log('=======:',result)
      ctx.__token_info =  result || {};
    } catch (e) {
      console.log(e)
      ctx.body = ctx.resMsg.newError(enumResType.err_uncorrect_token[0], 'token验证失败');
      return;
    }
    await next();
  };
};