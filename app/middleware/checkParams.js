"use strict";
/**
 * @author fuzemeng
 * @date 2018/11/21
 */
module.exports = (version) => {
    return function (rule) {
        return async function checkParams(ctx, next) {
            try {
                if (!rule) {
                    let rule_key = ctx.path.substr(ctx.path.lastIndexOf('/') + 1) + 'Req';
                    rule = ctx.app.validate[version][rule_key];
                }
                let data = ctx.method == 'POST' ? ctx.request.body : ctx.query;
                console.log(`请求方式：${ctx.method}`);
                console.log(`请求参数：`, data);
                ctx.validate(rule, data);
            } catch (e) {
                ctx.body = ctx.resMsg.newParamErr(e.errors);
                return;
            }
            await next();
        };
    }
};