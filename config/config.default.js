"use strict";
/**
 * @author fuzemeng
 * @date 2018/11/20
 */
module.exports = appInfo=> {
    return {
        keys:'my-cookie-secret-key',
        security:{
            csrf:false,
            ignoreJSON: true,
        },
        // domainWhiteList: [
        //     'http://localhost:9000',
        //     'http://localhost:7000',
        //     'http://localhost:3000',
        //     'http://m.tl100.com',
        //     'https://m.tl100.com',
        // ],
        domainWhiteList:'*',
        cors:{
            origin:'*',
            allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
        },
        public_dir : appInfo.baseDir + '/app/public',
        middleware: [ 'errorHandler' ]     
    }
}