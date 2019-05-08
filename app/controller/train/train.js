"use strict";
/**
 * 训练相关其他接口
 * @author fuzemeng
 * @date 2018/11/27
 */
const Controller = require('egg').Controller;

class TrainController extends Controller {

    /**
     * this赋值 便捷处理
     * @param param
     */
    constructor(param) {
        super(param);
        this.mysql = this.app.database.object_mysql;
        this.resMsg = this.ctx.resMsg;
        this.parameter = this.ctx.helper.parameter;
    }

    /**
      * @apiDefine train 其他接口
      */
    /**
      * @api {post} /train/startTrain a.开始练习(考试)，记录一条此病例的状态数据
      * @apiVersion 1.0.0  
      * @apiName startTrain
      * @apiGroup train
      *
      * @apiParam {string} token
      * @apiParam {number} case_id 病例编号
      * @apiParam {number} type 0练习1考试(20190223--添加)
      *
      * @apiSuccess {number} res_code 状态码
      * @apiSuccess {string} msg 返回详情
      *
      * @apiSuccessExample Success-Response:
      *       
       {
           "res_code":1,
           "msg":"操作成功"
       }
      */
    async startTrain() {
        const { ctx, service, parameter, resMsg } = this;
        const param = ctx.request.body;
        const rule = {
            case_id: { type: 'int', required: true, min: 1 },
            type: { type: 'int', required: true, min: 0 }
        }
        const errors = parameter.validate(rule, param);
        if (errors) {
            ctx.body = resMsg.newParamErr(errors);
            return;
        }
        param.user_id = ctx.__token_info.data.id
        await service.train.train.updateAction({
            user_id:ctx.__token_info.data.id,
            action:param.type
        });
        const results = await service.train.train.insertCaseDiagnosisState(param);
        ctx.body = results;
    }


    /**
      * @api {post} /train/continueTrain b.继续练习(考试)
      * @apiVersion 1.0.0  
      * @apiName continueTrain
      * @apiGroup train
      *
      * @apiParam {string} token
      * @apiParam {number} case_id 病例编号
      * @apiParam {number} type 0练习1考试(20190223--添加)
      *
      * @apiSuccess {number} res_code 状态码
      * @apiSuccess {string} msg 返回详情
      *
      * @apiSuccessExample Success-Response:
      *       
       {
           "res_code":1,
           "msg":"操作成功"
       }
      */
    async continueTrain() {
        const { ctx, service, parameter, resMsg } = this;
        const param = ctx.request.body;
        const rule = {
            case_id: { type: 'int', required: true, min: 1 },
            type: { type: 'int', required: true, min: 0 }
        }
        const errors = parameter.validate(rule, param);
        if (errors) {
            ctx.body = resMsg.newParamErr(errors);
            return;
        }
        
        await service.train.train.updateAction({
            user_id:ctx.__token_info.data.id,
            action:param.type
        });
        // const case_id = param.case_id;
        const results = await service.train.train.continueTrain(param);
        ctx.body = results;
    }


    /**
      * @api {post} /train/getCaseOperate c.查询当前病例练习操作进度
      * @apiVersion 1.0.0  
      * @apiName getCaseOperate
      * @apiGroup train
      *
      * @apiParam {string} token
      * @apiParam {number} case_id 病例编号
      *
      * @apiSuccess {number} res_code 状态码
      * @apiSuccess {string} msg 返回详情
      *
      * @apiSuccessExample Success-Response:
      *       
       {
           "res_code":1,
           "msg":"查询成功",
           "data":{
               "operate_state":1
           }
       }
      */
    async getCaseOperate() {
        const { ctx, service, parameter, resMsg } = this;
        const param = ctx.query;
        const rule = {
            case_id: { convertType: 'int', type: 'int', required: true, min: 1 }
        }
        const errors = parameter.validate(rule, param);
        if (errors) {
            ctx.body = resMsg.newParamErr(errors);
            return;
        }
        const case_id = param.case_id;
        const results = await service.train.train.getCaseOperate(case_id);
        ctx.body = results;
    }

    /**
      * @api {post} /train/reStartTrain d.重新练习
      * @apiVersion 1.0.0  
      * @apiName reStartTrain
      * @apiGroup train
      *
      * @apiParam {string} token
      * @apiParam {number} case_id 病例编号
      * @apiParam {number} type 0练习1考试(20190223--添加)
      *
      * @apiSuccess {number} res_code 状态码
      * @apiSuccess {string} msg 返回详情
      *
      * @apiSuccessExample Success-Response:
      *       
       {
           "res_code":1,
           "msg":"操作成功"
       }
      */
    async reStartTrain() {
        const { ctx, service, parameter, resMsg } = this;
        const param = ctx.request.body;
        const rule = {
            case_id: { type: 'int', required: true, min: 1 },
            type: { type: 'int', required: true, min: 0 }
        }
        const errors = parameter.validate(rule, param);
        if (errors) {
            ctx.body = resMsg.newParamErr(errors);
            return;
        }
        await service.train.train.updateAction({
            user_id:ctx.__token_info.data.id,
            action:param.type
        });
       // const case_id = param.case_id;
        const results = await service.train.train.reStartTrain(param);
        ctx.body = results;
    }
    /**
      * @api {post} /train/checkMark e.检查是否满足下一步的条件
      * @apiVersion 1.0.0  
      * @apiName checkMark
      * @apiGroup train
      *
      * @apiParam {string} token
      * @apiParam {number} mark 操作进度状态值
      *
      * @apiSuccess {number} res_code 状态码
      * @apiSuccess {string} msg 返回详情
      *
      * @apiSuccessExample Success-Response:
      *       
       {
           "res_code":1,
           "msg":"请求通过"
       }
      */
    async checkMark() {
        const { ctx, service } = this;
        const mark = ctx.request.body.mark;
        const results = await service.train.train.checkMark(mark);
        ctx.body = results;
    }

    /**
      * @api {get} /train/getCases f.获取病例列表
      * @apiVersion 1.0.0  
      * @apiName getCases
      * @apiGroup train
      *
      * @apiParam {string} token
      * @apiParam {number} page_num 分页页码
      * @apiParam {number} page_size 显示数量
      *
      * @apiSuccess {number} res_code 状态码
      * @apiSuccess {string} msg 返回详情
      * @apiSuccess {array} data  病例列表
      *
      * @apiSuccessExample Success-Response:
      *       
         {
             "res_code":1,
             "msg":"查询成功",
             "data":{
                 "count":20,
                 "list":[
                     {
                         "id":1,
                         "name":"四肢无力",
                         "symptom":"四肢无力",
                         "case_date":"2011/12/01 00:00:00",
                         "is_emergency_case":0,
                         "patient_name":"韩XX",
                         "patient_gender":"Male",
                         "patient_age":35,
                         "patient_marital_status":"已婚",
                         "patient_nation":"汉族",
                         "patient_occupation":"会计",
                         "patient_contact":"13030000000",
                         "patient_addr":"河北省保定市满城县**家园",
                         "patient_pay_pattern":"城镇职工基本医疗保险",
                         "patient_head_portrait_url":"http://pic1.zhimg.com/v2-7575c64ecd0e2e537f7d5b1be4240a38_b.jpg",
                         "patient_division":"神经内科",
                         "chief_complaint":"四肢无力2小时",
                         "medical_history_representor":"Self",
                         "add_time":"2000/01/01 00:00:00",
                         "lase_time":"2000/01/01 00:00:00",
                         "degree":1,
                         "patient_age_sort":35,
                         "state":0
                     }
                 ]
             }
         }
      */
    async getCases() {
        const { ctx, service, parameter, resMsg } = this;
        const param = ctx.query;
        const rule = {
            page_num: { convertType: 'int', type: 'int', required: true, min: 1 },
            page_size: { convertType: 'int', type: 'int', required: true, min: 1 },
        }
        const errors = parameter.validate(rule, param);
        if (errors) {
            ctx.body = resMsg.newParamErr(errors);
            return;
        }
        param.user_id = ctx.__token_info.data.id;
        const results = await service.train.train.getCases(param);
        ctx.body = results;
    }
    

    /**
      * @api {get} /train/getIquiryByKeyword g.根据关键词查询诊断
      * @apiVersion 1.0.0  
      * @apiName getIquiryByKeyword
      * @apiGroup train
      *
      * @apiParam {string} token
      * @apiParam {string} keyword 关键词
      *
      * @apiSuccess {number} res_code 状态码
      * @apiSuccess {string} msg 返回详情
      * @apiSuccess {array} data  诊断列表
      *
      * @apiSuccessExample Success-Response:
      *       
       {
           "res_code":1,
           "msg":"查询成功",
           "data":[
               {
                   "id":70,
                   "code":"G93.101",
                   "sub_code":"",
                   "name":"缺氧性脑病(肺性脑病)",
                   "name_pinyin":"QYXNBFXNB"
               },
               {
                   "id":380,
                   "code":"I09.801",
                   "sub_code":"",
                   "name":"风湿性肺动脉瓣闭锁不全",
                   "name_pinyin":"FSXFDMBBSB"
               }
           ]
       }
      */
    async getIquiryByKeyword() {
        const { ctx, service, parameter, resMsg } = this;
        const param = ctx.query;
        const rule = {
            keyword: { type: 'string', required: true }
        }
        const errors = parameter.validate(rule, param);
        if (errors) {
            ctx.body = resMsg.newParamErr(errors);
            return;
        }
        const keyword = param.keyword;
        const result = await service.train.train.getIquiryByKeyword(keyword);
        ctx.body = result;
    }


    /**
      * @api {post} /train/doQuasiDiagnosis h.添加拟诊
      * @apiVersion 1.0.0  
      * @apiName doQuasiDiagnosis
      * @apiGroup train
      *
      * @apiParam {string} token
      * @apiParam {array} diagnosis_array 
      [{
        id:拟诊编号，在新增的时候不需要有，修改的时候必须要携带
        case_type_id：病例诊断选项编号
        case_diagnosis_name：诊断名称
        type：诊断类型
      }]
      *
      * @apiSuccess {number} res_code 状态码
      * @apiSuccess {string} msg 返回详情
      *
      * @apiSuccessExample Success-Response:
      *       
         {"res_code":1,"msg":"操作成功"}
      */
    async addQuasiDiagnosis() {
        const { ctx, service , parameter, resMsg} = this;
        const param = ctx.request.body;
        const rule = {
            diagnosis_array: { type: 'string', required: true }
        }
        const errors = parameter.validate(rule, param);
        if (errors) {
            ctx.body = resMsg.newParamErr(errors);
            return;
        }
        const diagnosisArray = param.diagnosis_array;
        const result = await service.train.train.insertQuasiDiagnosis(diagnosisArray);
        ctx.body = result;
    }


    /**
      * @api {get} /train/getQuasiDiagnosis i.查询拟诊
      * @apiVersion 1.0.0  
      * @apiName getQuasiDiagnosis
      * @apiGroup train
      *
      * @apiParam {string} token
      *
      * @apiSuccess {number} res_code 状态码
      * @apiSuccess {string} msg 返回详情
      * @apiSuccess {array} data  拟诊列表
      *
      * @apiSuccessExample Success-Response:
      *       
         {
             "res_code":1,
             "msg":"查询成功",
             "data":[
                 {
                     "id":565,
                     "user_id":8,
                     "case_id":3,
                     "case_diagnosis_id":579,
                     "case_type_id":650,
                     "case_diagnosis_name":"肺动脉高压",
                     "type":1,
                     "create_time":"2019-01-03T10:56:59.000Z",
                     "last_time":"2019-01-03T10:56:59.000Z",
                     "basis":null
                 }
             ]
         }
      */
    async getQuasiDiagnosis() {
        const { ctx, service } = this;
        const result = await service.train.train.getQuasiDiagnosis();
        ctx.body = result;
    }

    /**
       * @api {get} /train/getBasis j.查询依据
       * @apiVersion 1.0.0  
       * @apiName getBasis
       * @apiGroup train
       *
       * @apiParam {string} token
       * @apiParam {string} keyword 关键词
       *
       * @apiSuccess {number} res_code 状态码
       * @apiSuccess {string} msg 返回详情
       * @apiSuccess {array} data  依据列表
       *
       * @apiSuccessExample Success-Response:
       *       
        {
            "res_code":1,
            "msg":"查询成功",
            "data":[
                {
                    "id":919,
                    "user_id":8,
                    "case_id":3,
                    "case_diagnosis_id":579,
                    "type":1,
                    "content":"{"question":"发病以来精神如何？","answer":"没什么问题，挺好的。","time":"2019-01-03 18:59:58"}",
                    "create_time":"2019-01-03T10:59:58.000Z",
                    "last_time":"2019-01-03T10:59:58.000Z"
                },
                {
                    "id":920,
                    "user_id":8,
                    "case_id":3,
                    "case_diagnosis_id":579,
                    "type":1,
                    "content":"{"question":"从第一次发病到现在有多久了？","answer":"2年","time":"2019-01-03 18:59:59"}",
                    "create_time":"2019-01-03T10:59:59.000Z",
                    "last_time":"2019-01-03T10:59:59.000Z"
                }
            ]
        }
       */
    async getBasis() {
        const { ctx, service } = this;
        const keyword = ctx.query.keyword;
        const result = await service.train.train.getBasis(keyword);
        ctx.body = result;
    }



    /**
    * @api {post} /train/doBasis k.添加依据
    * @apiVersion 1.0.0  
    * @apiName doBasis
    * @apiGroup train
    *
    * @apiParam {string} token
    * @apiParam {string} quasi_diagnosis_id 拟诊编号    
    * @apiParam {string} case_diagnosis_name 拟诊名称  
    * @apiParam {string} operate 操作 ADD UPDATE  
    * @apiParam {array} basis_array 依据列表  
   [{
    id:1,／／依据编号
    state:1,-1未关联0不支持1不确定2支持
    content:内容（头疼、发烧）
    type:依据类型问诊、体格、辅助等等
    file_url:文件链接
    },
   ]
    *
    * @apiSuccess {number} res_code 状态码
    * @apiSuccess {string} msg 返回详情
    *
    * @apiSuccessExample Success-Response:
    *       
     {
         "res_code":1,
         "msg":"操作成功"
     }
    */
    async addBasis() {
        const { ctx, service, parameter, resMsg } = this;
        const param = ctx.request.body;
        const rule = {
            quasi_diagnosis_id: { type: 'int', required: true, min: 1 },
            case_diagnosis_name: { type: 'string', required: true },
            basis_array: { type: 'array', required: true }
        }
        const errors = parameter.validate(rule, param);
        if (errors) {
            ctx.body = resMsg.newParamErr(errors);
            return;
        }
        const result = await service.train.train.addBasis(param);
        ctx.body = result;
    }

    /**
       * @api {get} /train/getHistory l.查询操作记录
       * @apiVersion 1.0.0  
       * @apiName getHistory
       * @apiGroup train
       *
       * @apiParam {string} token
       *
       * @apiSuccess {number} res_code 状态码
       * @apiSuccess {string} msg 返回详情
       * @apiSuccess {array} data  操作记录列表
       *
       * @apiSuccessExample Success-Response:
       *       
        {
            "res_code":1,
            "msg":"查询成功",
            "data":[
                {
                    "id":3350,
                    "user_id":8,
                    "case_id":3,
                    "case_diagnosis_id":672,
                    "type":"接诊",
                    "type_child":null,
                    "state":"增加",
                    "content":"{"id":3,"name":"咳嗽007","symptom":"咳嗽","case_date":"2012-05-07T16:00:00.000Z","is_emergency_case":0,"patient_name":"曹××","patient_gender":"Male","patient_age":17,"patient_marital_status":"未婚","patient_nation":"汉族","patient_occupation":"学生","patient_contact":"13000000000","patient_addr":"天津宝坻区","patient_pay_pattern":"其他","patient_head_portrait_url":"http://www.ygjj.com/bookpic2/2012-11-25/new483876-20121125162750536998.JPG","patient_division":"呼吸内科","chief_complaint":"间断咳嗽4月","medical_history_representor":"Self","add_time":"1999-12-31T16:00:00.000Z","lase_time":"1999-12-31T16:00:00.000Z","degree":3,"patient_age_sort":17}",
                    "create_time":"2019/01/07 10:12:48"
                },
                {
                    "id":3351,
                    "user_id":8,
                    "case_id":3,
                    "case_diagnosis_id":672,
                    "type":"问诊",
                    "type_child":null,
                    "state":null,
                    "content":"[{"question":"怎么不舒服，描述一下？","answer":"今天早晨醒来后想上厕所，感觉全身没劲，胳膊抬不起来了，尤其是两条腿，动都不能动了。","time":"2019-01-07 10:12:51"},{"question":"你以前有过类似的症状吗？","answer":"2年前出现过一次，今年夏天也闹过，但都没有这次重。","time":"2019-01-07 10:12:55"},{"question":"在什么情况下这种症状是可以缓解？","answer":"喝钾（氯化钾）或者输点液就能好","time":"2019-01-07 10:12:57"}]",
                    "create_time":"2019/01/07 10:12:51"
                }
            ]
        }
       */
    async getHistory() {
        const { ctx, service } = this;
        const result = await service.train.train.getHistory();
        ctx.body = result;
    }



    /**
    * @api {post} /train/addStudentDecode m.新增解读
    * @apiVersion 1.0.0  
    * @apiName addStudentDecode
    * @apiGroup train
    *
    * @apiParam {string} token
    * @apiParam {string} type 解读类型（拟诊解读，体格检查解读，辅助检查解读，诊断分析解读）      
    * @apiParam {object} decode {   content：放解读的内容   } 
    *
    * @apiSuccess {number} res_code 状态码
    * @apiSuccess {string} msg 返回详情
    *
    * @apiSuccessExample Success-Response:
    *       
     {
         "res_code":1,
         "msg":"操作成功"
     }
    */
    async addStudentDecode() {
        const { ctx, service, parameter, resMsg } = this;
        const param = ctx.request.body;
        const rule = {
            type: { type: 'string', required: true },
            decode: { type: 'object', required: true },
        }
        const errors = parameter.validate(rule, param);
        if (errors) {
            ctx.body = resMsg.newParamErr(errors);
            return;
        }
        const result = await service.train.train.addStudentDecode(param);
        ctx.body = result;
    }



    /**
       * @api {get} /train/getAnalysis n.诊断分析，获取记录
       * @apiVersion 1.0.0  
       * @apiName getAnalysis
       * @apiGroup train
       *
       * @apiParam {string} token
       *
       * @apiSuccess {number} res_code 状态码
       * @apiSuccess {string} msg 返回详情
       * @apiSuccess {array} data  记录列表
       *
       * @apiSuccessExample Success-Response:
       *       
        {
            "res_code":1,
            "msg":"查询成功",
            "data":[
                {
                    "id":3350,
                    "user_id":8,
                    "case_id":3,
                    "case_diagnosis_id":672,
                    "type":"接诊",
                    "type_child":null,
                    "state":"增加",
                    "content":"{"id":3,"name":"咳嗽007","symptom":"咳嗽","case_date":"2012-05-07T16:00:00.000Z","is_emergency_case":0,"patient_name":"曹××","patient_gender":"Male","patient_age":17,"patient_marital_status":"未婚","patient_nation":"汉族","patient_occupation":"学生","patient_contact":"13000000000","patient_addr":"天津宝坻区","patient_pay_pattern":"其他","patient_head_portrait_url":"http://www.ygjj.com/bookpic2/2012-11-25/new483876-20121125162750536998.JPG","patient_division":"呼吸内科","chief_complaint":"间断咳嗽4月","medical_history_representor":"Self","add_time":"1999-12-31T16:00:00.000Z","lase_time":"1999-12-31T16:00:00.000Z","degree":3,"patient_age_sort":17}",
                    "create_time":"2019/01/07 10:12:48"
                },
                {
                    "id":3351,
                    "user_id":8,
                    "case_id":3,
                    "case_diagnosis_id":672,
                    "type":"问诊",
                    "type_child":null,
                    "state":null,
                    "content":"[{"question":"怎么不舒服，描述一下？","answer":"今天早晨醒来后想上厕所，感觉全身没劲，胳膊抬不起来了，尤其是两条腿，动都不能动了。","time":"2019-01-07 10:12:51"},{"question":"你以前有过类似的症状吗？","answer":"2年前出现过一次，今年夏天也闹过，但都没有这次重。","time":"2019-01-07 10:12:55"},{"question":"在什么情况下这种症状是可以缓解？","answer":"喝钾（氯化钾）或者输点液就能好","time":"2019-01-07 10:12:57"}]",
                    "create_time":"2019/01/07 10:12:51"
                }
            ]
        }
       */
    async getAnalysis() {
        const { ctx, service } = this;
        const result = await service.train.train.getAnalysis();
        ctx.body = result;
    }



    /**
       * @api {get} /train/getTotalDiagnose o.获取所有病例的对应的练习次数
       * @apiVersion 1.0.0  
       * @apiName getTotalDiagnose
       * @apiGroup train
       *
       * @apiParam {string} token
       *
       * @apiSuccess {number} res_code 状态码
       * @apiSuccess {string} msg 返回详情
       * @apiSuccess {array} data  记录列表
       *
       * @apiSuccessExample Success-Response:
       *       
        {
            "res_code": 1,
            "msg": "查询成功",
            "data": [
                {
                    "id": 1,
                    "name": "四肢无力",
                    "count": 5
                },
                {
                    "id": 2,
                    "name": "阴道异常出血122",
                    "count": 50
                },
                {
                    "id": 3,
                    "name": "咳嗽007",
                    "count": 352
                },
                {
                    "id": 5,
                    "name": "乏力",
                    "count": 1
                },
                {
                    "id": 6,
                    "name": "腹泻",
                    "count": 9
                }
            ]
        }
       */
    async getTotalDiagnose() {
        const { ctx, service } = this;
        const result = await service.train.train.getTotalDiagnose();
        ctx.body = result;
    }

/**
      * @api {get} /train/getCaseKeys p.获取病例查询关键词列表
      * @apiVersion 1.0.0  
      * @apiName getCaseKeys
      * @apiGroup train
      *
      * @apiParam {string} token
      * @apiParam {string} name_symptom 关键词
      *
      * @apiSuccess {number} res_code 状态码
      * @apiSuccess {string} msg 返回详情
      * @apiSuccess {array} data  病例列表
      *
      * @apiSuccessExample Success-Response:
      *       
         {
             "res_code":1,
             "msg":"查询成功",
             "data":{
                 "count":20,
                 "list":[
                     {
                         "id":1,
                         "name":"四肢无力",
                         "symptom":"四肢无力",
                         "case_date":"2011/12/01 00:00:00",
                         "is_emergency_case":0,
                         "patient_name":"韩XX",
                         "patient_gender":"Male",
                         "patient_age":35,
                         "patient_marital_status":"已婚",
                         "patient_nation":"汉族",
                         "patient_occupation":"会计",
                         "patient_contact":"13030000000",
                         "patient_addr":"河北省保定市满城县**家园",
                         "patient_pay_pattern":"城镇职工基本医疗保险",
                         "patient_head_portrait_url":"http://pic1.zhimg.com/v2-7575c64ecd0e2e537f7d5b1be4240a38_b.jpg",
                         "patient_division":"神经内科",
                         "chief_complaint":"四肢无力2小时",
                         "medical_history_representor":"Self",
                         "add_time":"2000/01/01 00:00:00",
                         "lase_time":"2000/01/01 00:00:00",
                         "degree":1,
                         "patient_age_sort":35,
                         "state":0
                     }
                 ]
             }
         }
      */
     async getCaseKeys() {
        const { ctx, service, parameter, resMsg } = this;
        const param = ctx.query;
        param.user_id = ctx.__token_info.data.id;
        const results = await service.train.train.getCaseKeys(param);
        ctx.body = results;
    }

    // async getOperateResult(){
    //     const { ctx, service} = this;
    //     const result = await service.train.train.getOperateResult();
    //     ctx.body = result;
    //   }
    /**
      * @api {get} /train/getCaseDiagnoseResult q.获取病例诊断结果数量分组
      * @apiVersion 1.0.0  
      * @apiName getCaseDiagnoseResult
      * @apiGroup train
      *
      * @apiParam {string} token
      *
      * @apiSuccess {number} res_code 状态码
      * @apiSuccess {string} msg 返回详情
      * @apiSuccess {array} data  病例列表
      *
      * @apiSuccessExample Success-Response:
      *       
         {
            "res_code": 1,
            "msg": "查询成功",
            "data": {
                "talk": 4,
                "physique": 2,
                "assist": 1,
                "handle": 3
            }
        }
      */
      async getCaseDiagnoseResult(){
        const { ctx, service } = this;
        const result = await service.train.train.getCaseDiagnoseResult();
        ctx.body = result;
      }
      
    async getPhyExamCategory(){
        const { ctx, service } = this;
        const param = ctx.query;
        const result = await service.train.train.getPhyExamCategory(param);
        ctx.body = result;
    }
    
    async getPhyExamRegion(){
        const { ctx, service } = this;
        const param = ctx.query;
        const result = await service.train.train.getPhyExamRegion(param);
        ctx.body = result;
    }
    async getStudentDecode(){
        const { ctx, service } = this;
        const param = ctx.query;
        const result = await service.train.train.getStudentDecode(param);
        ctx.body = result;
    }
}

module.exports = TrainController;