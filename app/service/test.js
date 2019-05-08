// const arr1 = [{
//   id: 1,
//   age: 20
// }, {
//   id: 2,
//   age: 20
// }, {
//   id: 3,
//   age: 20
// }, {
//   id: 4,
//   age: 20
// }];
// const arr2 = [{
//   id: 5,
//   age: 20
// }, {
//   id: 2,
//   age: 20
// }, {
//   id: 3,
//   age: 21
// }, {
//   id: 4,
//   age: 20
// }];

// // if (arr1[100]) {
// //   console.log('arr1[100]')
// // }
// // if (!arr1[100]) {
// //   console.log('!arr1[100]')
// // }
// for (const obj1 of arr1) {
//   for (const obj2 of arr2) {

//   }
// }
// function getDifferent(arr1, arr2) {
//   for (const obj1 of arr1) {

//   }
// }

// // let result = getAddByNoPrimaryKey(arr1, arr2, 'id', 'state', '新增');
// // result = getModify(arr1, arr2, 'id', 'state', '修改');
// // result = getDel(arr1, arr2, 'id', 'state', '删除');
// // console.log(result)

// const result = getChangeArray(arr1, arr2, 'id', 'state', '新增', '修改', '删除');
// console.log(result);
// /**
//  * 获取改动的数据及其状态
//  * @param {Array} oldArray 老数组
//  * @param {Array} newArray 新数组
//  * @param {String} key 区分字段
//  * @param {String} stateKey 状态字段
//  * @param {String} stateValueForAdd 状态值(新增)
//  * @param {String} stateValueForUpd 状态值(修改)
//  * @param {String} stateValueForDel 状态值(删除)
//  */
// function getChangeArray(oldArray, newArray, key, stateKey, stateValueForAdd, stateValueForUpd, stateValueForDel) {
//   const addArray = getAddByNoPrimaryKey(oldArray, newArray, key, stateKey, stateValueForAdd);
//   const updArray = getModify(oldArray, newArray, key, stateKey, stateValueForUpd);
//   const delArray = getDel(oldArray, newArray, key, stateKey, stateValueForDel);
//   const result = addArray.concat(updArray, delArray);
//   return result;
// }
// //非主键类--（用于操作（增删改）的数据都存在主键或者都不存在主键）
// //比较两个数组
// //1.新增,根据某个固定字段来确定，不同就会新增
// /**
//  * 获取新增数据
//  * @param {*} oldArray 老数组
//  * @param {*} newArray 新数组
//  * @param {*} key 区分字段
//  * @param {*} stateKey 状态字段
//  * @param {*} stateValue 状态值
//  */
// function getAddByNoPrimaryKey(oldArray, newArray, key, stateKey, stateValue) {
//   const result = [];
//   for (const newObj of newArray) {
//     let flog = true;
//     for (const oldObj of oldArray) {
//       if (newObj.hasOwnProperty(key)
//         && oldObj.hasOwnProperty(key)
//         && newObj[key] === oldObj[key]) flog = false;
//     }
//     if (flog) {
//       newObj[stateKey] = stateValue;
//       result.push(newObj);
//     }
//   }
//   return result;
// }

// /**
//  * 获取新增数据（主键版）
//  * @param {*} oldArray 老数组
//  * @param {*} newArray 新数组
//  * @param {*} primaryKey 主键区分字段
//  * @param {*} isExist 新数据是否有主键
//  * @param {*} stateKey 状态字段
//  * @param {*} stateValue 状态值
//  */
// function getAddByPrimaryKey(oldArray, newArray, primaryKey, isExist, stateKey, stateValue) {
//   const result = [];
//   for (const newObj of newArray) {
//     if (isExist && newObj.hasOwnProperty(primaryKey)) {
//       let flog = true;
//       for (const oldObj of oldArray) {
//         if (oldObj.hasOwnProperty(primaryKey) && oldObj[primaryKey] === newObj[primaryKey]) flog = false;
//       }
//       if (flog) {
//         newObj[stateKey] = stateValue;
//         result.push(newObj);
//       }
//     } else {
//       newObj[stateKey] = stateValue;
//       result.push(newObj);
//     }
//   }
//   return result;
// }

// /**
//  * 获取修改数据
//  * @param {*} oldArray 老数组
//  * @param {*} newArray 新数组
//  * @param {*} key 主键区分字段
//  * @param {*} stateKey 状态字段
//  * @param {*} stateValue 状态值
//  */
// //2.修改
// function getModify(oldArray, newArray, key, stateKey, stateValue) {
//   const result = [];
//   for (const newObj of newArray) {
//     let flog = false;
//     for (const oldObj of oldArray) {
//       for (const newKey in newObj) {
//         if (newObj.hasOwnProperty(key) &&
//           oldObj.hasOwnProperty(key) &&
//           newObj.hasOwnProperty(newKey) &&
//           oldObj.hasOwnProperty(newKey) &&
//           newObj[key] === oldObj[key] &&
//           newObj[newKey] != oldObj[newKey]) flog = true;
//       }
//     }
//     if (flog) {
//       newObj[stateKey] = stateValue;
//       result.push(newObj);
//     }
//   }
//   return result;
// }
// /**
//  * 获取删除数据
//  * @param {*} oldArray 老数组
//  * @param {*} newArray 新数组
//  * @param {*} primaryKey 主键区分字段
//  * @param {*} stateKey 状态字段
//  * @param {*} stateValue 状态值
//  */
// //3.删除
// function getDel(oldArray, newArray, primaryKey, stateKey, stateValue) {
//   const result = [];
//   for (const oldObj of oldArray) {
//     let flog = true;
//     for (const newObj of newArray) {
//       if (oldObj.hasOwnProperty(primaryKey) &&
//         newObj.hasOwnProperty(primaryKey) &&
//         oldObj[primaryKey] === newObj[primaryKey]) flog = false;
//     }
//     if (flog) {
//       oldObj[stateKey] = stateValue;
//       result.push(oldObj);
//     }
//     return result;
//   }
// }


// console.log(typeof('{}'))
// const a = [];
// console.log(Array.isArray(a))

// const str = '{"res_code":1,"msg":[{"id":5,"img_url":"{\\\"name\\\":\\\"20170630174725.jpg\\\",\\\"url\\\":\\\"http://dscj-app.oss-cn-qingdao.aliyuncs.com/lb/20170705184420.jpg\\\"}","redirect_url":"{\\\"type\\\":\\\"ApplicationPage\\\",\\\"parameters\\\":{\\\"id\\\":42,\\\"title\\\":\\\"明日之星\\\",\\\"content\\\":{\\\"uri\\\":\\\"http://zt.laoshi123.com/mrzx_new\\\"}}}","share_title":"","share_desc":"","share_img_url":"","share_url":""},{"id":6,"img_url":"{\\\"name\\\":\\\"page-1-课堂－明日之星3.png\\\",\\\"url\\\":\\\"http://dscj-app.oss-cn-qingdao.aliyuncs.com/lb/20170608111348.png\\\"}","redirect_url":"{\\\"type\\\":\\\"SubjectDetailPage\\\",\\\"parameters\\\":{\\\"id\\\":3}}","share_title":"","share_desc":"","share_img_url":"","share_url":""},{"id":7,"img_url":"{\\\"name\\\":\\\"page-1-课堂－名师工坊1.png\\\",\\\"url\\\":\\\"http://dscj-app.oss-cn-qingdao.aliyuncs.com//lb/20170608170723.png\\\"}","redirect_url":"{\\\"type\\\":\\\"WebViewPage\\\",\\\"parameters\\\":{\\\"content\\\":{\\\"uri\\\":\\\"http://e.vhall.com/461022891\\\"},\\\"title\\\":\\\"加油德康，你可以的，上吧\\\"}}","share_title":"","share_desc":"","share_img_url":"","share_url":""},{"id":8,"img_url":"{\\\"name\\\":\\\"致歉.png\\\",\\\"url\\\":\\\"http://dscj-app.oss-cn-qingdao.aliyuncs.com/lb/20170726143911.png\\\"}","redirect_url":"{\\\"type\\\":\\\"WebViewPage\\\",\\\"parameters\\\":{\\\"content\\\":{\\\"uri\\\":\\\"http://zt.laoshi123.com/apologize\\\"},\\\"title\\\":\\\"致歉信\\\"}}","share_title":"","share_desc":"","share_img_url":"","share_url":""}]}';
// console.log(JSON.parse(JSON.parse(str).msg[0].img_url));

// const str = '{\"name\":\"20170630174725.jpg\",\"url\":\"http://dscj-app.oss-cn-qingdao.aliyuncs.com/lb/20170705184420.jpg\"}'
// console.log(JSON.parse('{\"name\":\"20170630174725.jpg\",\"url\":\"http://dscj-app.oss-cn-qingdao.aliyuncs.com/lb/20170705184420.jpg\"}'))

// const moment = require('moment');
// console.log(moment().format('LLL'))


// console.log(Math.random());

