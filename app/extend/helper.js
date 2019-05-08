"use strict";
/**
 * @author fuzemeng
 * @date 2018/11/20
 */
const fs = require('fs');
const moment = require('moment');
const uuid = require('uuid/v1');
const jwt = require('jwt-simple');
const crypto = require('crypto');
var Parameter = require('parameter');
module.exports = {
  /**
   * 文件读取
   * @param path
   * @returns {Promise<any>}
   */
  readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },

  /**
   *  日期处理
   */
  moment: moment,
  /**
   * 参数校验
   */
  parameter:new Parameter(),
  /**
   * uuid
   * @returns {string | *}
   */
  uuid: function () {
    let uuid = uuid();
    uuid = uuid.replace(/-/g, "").toUpperCase();
    return uuid;
  },

  /**
   * 生成随机数
   * @param min
   * @param max
   * @returns {string}
   */
  getRandomCode: function (min, max) {
    var code = Math.floor(Math.random() * (max - min + 1) + min);
    return code.toString();
  },

  /**
   * post json请求
   * @param url
   * @param data
   * @returns {Promise<*>}
   */
  async postJson(url, data) {
    const { ctx } = this;
    let result = await ctx.curl(url, { method: 'POST', contentType: 'json', dataType: 'json', data });
    return result.data;
  },

  /**
   * md5密码加密
   * @param password
   * @returns {string}
   */
  md5Pwd(password) {
    let md5Pwd = crypto.createHash('md5').update(password).digest('hex');
    return md5Pwd;
  },

  /**
   * jwt Secret
   */
  jwtSecret: 'jstSecret',

 /**
   * 创建token
   * @param data    数据
   * @param minutes 分钟 默认  24 * 60 * 30 30天
   * @param iss     jwt签发者
   * @returns {string | Uint8Array | void}
   */
  createToken(data, minutes = 24 * 60 * 30, iss = 'xgkj') {
    let expires = moment().add(minutes, 'minutes').valueOf();
    let token = jwt.encode({
      iss: iss,
      exp: expires,
      data: data
    }, this.jwtSecret);
    return token;
  },

  /**
   * 检查token
   * @param token
   * @returns {*}
   */
  checkToken(token) {
    const { ctx } = this;
    const { resMsg, enumResType } = ctx;
    if (!token) {
      return resMsg.newError(enumResType.token_err_code, "token为空");
    }
    let decoded = jwt.decode(token, this.jwtSecret);
    if (decoded.exp <= Date.now()) {
      return resMsg.newError(enumResType.token_err_code, "token已过期");
    }
    return resMsg.newOk('', decoded.data);
  },
  /**
    * 获取改动的数据及其状态
    * @param {Array} oldArray 老数组
    * @param {Array} newArray 新数组
    * @param {String} key 区分字段
    * @param {String} stateKey 状态字段
    * @param {String} stateValueForAdd 状态值(新增)
    * @param {String} stateValueForUpd 状态值(修改)
    * @param {String} stateValueForDel 状态值(删除)
    */
  getChangeArray(oldArray, newArray, key, stateKey, stateValueForAdd, stateValueForUpd, stateValueForDel, outkeys) {
    const updArray = this.getModify(oldArray, newArray, key, stateKey, stateValueForUpd, outkeys);
    const delArray = this.getDel(oldArray, newArray, key, stateKey, stateValueForDel);
    const addArray = this.getAddByNoPrimaryKey(oldArray, newArray, key, stateKey, stateValueForAdd);

    const result = addArray.concat(updArray, delArray);
    return result;
  },
  //非主键类--（用于操作（增删改）的数据都存在主键或者都不存在主键）
  //1.新增,根据某个固定字段来确定，不同就会新增
  /**
   * 获取新增数据
   * @param {*} oldArray 老数组
   * @param {*} newArray 新数组
   * @param {*} key 区分字段
   * @param {*} stateKey 状态字段
   * @param {*} stateValue 状态值
   */
  getAddByNoPrimaryKey(oldArray, newArray, key, stateKey, stateValue) {
    if (newArray.length === 0) return [];
    const result = [];
    for (const newObj of newArray) {
      if (oldArray && oldArray.length > 0) {
        let flog = true;
        for (const oldObj of oldArray) {
          if (newObj.hasOwnProperty(key)
            && oldObj.hasOwnProperty(key)
            && newObj[key] === oldObj[key]) flog = false;
        }
        if (flog) {
          newObj[stateKey] = stateValue;
          result.push(newObj);
        }
      } else {
        newObj[stateKey] = stateValue;
        result.push(newObj);
      }
    }
    return result;
  },

  /**
   * 获取新增数据（主键版）
   * @param {*} oldArray 老数组
   * @param {*} newArray 新数组
   * @param {*} primaryKey 主键区分字段
   * @param {*} isExist 新数据是否有主键
   * @param {*} stateKey 状态字段
   * @param {*} stateValue 状态值
   */
  getAddByPrimaryKey(oldArray, newArray, primaryKey, isExist, stateKey, stateValue) {
    const result = [];
    for (const newObj of newArray) {
      if (isExist && newObj.hasOwnProperty(primaryKey)) {
        let flog = true;
        for (const oldObj of oldArray) {
          if (oldObj.hasOwnProperty(primaryKey) && oldObj[primaryKey] === newObj[primaryKey]) flog = false;
        }
        if (flog) {
          newObj[stateKey] = stateValue;
          result.push(newObj);
        }
      } else {
        newObj[stateKey] = stateValue;
        result.push(newObj);
      }
    }
    return result;
  },

  /**
   * 获取修改数据
   * @param {*} oldArray 老数组
   * @param {*} newArray 新数组
   * @param {*} key 主键区分字段
   * @param {*} stateKey 状态字段
   * @param {*} stateValue 状态值
   */
  //2.修改
  getModify(oldArray, newArray, key, stateKey, stateValue, outKeys) {
    if (newArray.length === 0) return [];
    if (!oldArray || oldArray===null || (oldArray && oldArray.length === 0)) return newArray;
    if (!outKeys || outKeys === undefined) outKeys = [];
    const result = [];
    for (const newObj of newArray) {
      let flog = false;
      for (const oldObj of oldArray) {
        for (const newKey in newObj) {
          if (outKeys.indexOf(newKey) === -1) {
            if (newObj.hasOwnProperty(key) &&
              oldObj.hasOwnProperty(key) &&
              newObj.hasOwnProperty(newKey) &&
              oldObj.hasOwnProperty(newKey) &&
              newObj[key] === oldObj[key]) {//newObj[newKey] != oldObj[newKey]
              if (typeof (newObj[newKey]) === 'object' &&
                typeof (oldObj[newKey]) === 'object') {
                if (JSON.stringify(oldObj[newKey]) != JSON.stringify(newObj[newKey])) flog = true;
              } else {
                if (newObj[newKey] != oldObj[newKey]) flog = true;
              }
            }
          }
        }
      }
      if (flog) {
        newObj[stateKey] = stateValue;
        result.push(newObj);
      }
    }
    return result;
  },
  /**
   * 获取删除数据
   * @param {*} oldArray 老数组
   * @param {*} newArray 新数组
   * @param {*} primaryKey 主键区分字段
   * @param {*} stateKey 状态字段
   * @param {*} stateValue 状态值
   */
  //3.删除
  getDel(oldArray, newArray, primaryKey, stateKey, stateValue) {
    
    if (!oldArray || oldArray===null || (oldArray && oldArray.length === 0)) return [];
    const result = [];
    for (const oldObj of oldArray) {
      if (newArray.length === 0) {
        oldObj[stateKey] = stateValue;
        result.push(oldObj);
      } else {
        let flog = true;
        for (const newObj of newArray) {
          if (oldObj.hasOwnProperty(primaryKey) &&
            newObj.hasOwnProperty(primaryKey) &&
            oldObj[primaryKey] === newObj[primaryKey]) flog = false;
        }
        if (flog) {
          oldObj[stateKey] = stateValue;
          result.push(oldObj);
        }
      }
    }
    return result;
  },
  newTime(formatStr) {
    const newTime = formatStr ? moment().format(formatStr) : moment().format();
    return newTime;
  },
  /**
    * @param {*} array 数据集合
    * @param {*} keys ['create_time','last_time']
    */
  dateFormat(array, keys, forMatStr) {
    const { moment } = this;
    for (const iterator of array) {
      for (const key of keys) {
        iterator[key] = moment(iterator[key]).format(forMatStr);
      }
    }
    return array;
  },
  saveArray(array, tableName) {
    const obj = array[0];
    const keys = Object.keys(obj);
    const keyStr = keys.join(',');
    let valueSql = ``;
    for (const iterator of array) {
      let iteratorSql = ``;
      for (const key in iterator) {
        if (iterator.hasOwnProperty(key)) {
          const value = iterator[key];

          if (typeof (iterator[key]) === 'string' || Object.prototype.toString.call(iterator[key]) === '[object Date]') {
            iteratorSql += ` '${value}',`;
          } else {
            iteratorSql += ` ${value},`;
          }
        }
      }
      if (iteratorSql.length > 0) valueSql += ` (${iteratorSql.substring(0, iteratorSql.length - 1)}),`
    }
    if (valueSql.length > 0 && keyStr.length > 0) {
      const sql = ` INSERT INTO ${tableName} (${keyStr}) VALUES ${valueSql.substring(0, valueSql.length - 1)}`;
      return sql;
    }
    return false;
  }

}