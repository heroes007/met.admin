"use strict";
/**
 * 公共服务
 * @author fuzemeng
 * @date 2018/11/20
 */
const Service = require('egg').Service;

class Template extends Service {

    constructor(param) {
        super(param);
        this.mysql = this.app.database.object_mysql;
    }
    async checkToken(token){
      const {mysql} = this;
      const result = await mysql.get('lx_user_info', {token:token});
      return result;
    }
}

module.exports = Template;