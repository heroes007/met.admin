"use strict";
/**
 * @author wangchenzhao
 * @date 2018/11/20
 */
const path = require("path");
module.exports = app => {
  app.beforeStart(() => {
    // 配置目录--验证
    const directory = path.join(app.config.baseDir, 'app/validate');
    app.loader.loadToApp(directory, 'validate');

    // 配置mysql
    const mysql_clients = app.config.mysql.clients;
    if (mysql_clients) {
      app.database = {};
      for (let i in mysql_clients) {
        app.database[i] = app.mysql.createInstance(mysql_clients[i]);
      }
    }
  });
};
