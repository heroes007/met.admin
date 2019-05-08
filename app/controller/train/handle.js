"use strict";
/**
 * 处置治疗相关接口
 * @author fuzemeng
 * @date 2018/11/27
 */
const Controller = require('egg').Controller;

class HandleController extends Controller {

  /**
   * 
   * this赋值 便捷处理
   * @param param
   */
  constructor(param) {
    super(param);
    this.mysql = this.app.database.object_mysql;
    this.resMsg = this.ctx.resMsg;
    this.enumResType = this.ctx.enumResType;
    this.parameter = this.ctx.helper.parameter;
  }


   /**
     * @apiDefine handle 处置治疗
     */
 
    /**
     * @api {get} /train/getHandleWay a.查询当前病例处置方式
     * @apiVersion 1.0.0  
     * @apiName getHandleWay
     * @apiGroup handle
     *
     * @apiParam {string} token
     * @apiParam {number} case_id 病例编号
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {object} data 病例处置方式
     *
     * @apiSuccessExample Success-Response:
     * {
            "res_code": 1,
            "msg": "查询成功",
            "data": {
                "patient_handle_way": "作为门诊患者治疗"
            }
        }
     */
  async getHandleWay() {
    const { ctx, service ,parameter, resMsg} = this;
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
    const results = await service.train.handle.getHandleWay(case_id);
    ctx.body = results;
  }
    /**
     * @api {post} /train/chooseHandleWay b.选择处置病人方式
     * @apiVersion 1.0.0  
     * @apiName chooseHandleWay
     * @apiGroup handle
     *
     * @apiParam {string} token
     * @apiParam {string} handle_way   处置方式
     * @apiParam {string} diagnose_result 诊断结果
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     *
     * @apiSuccessExample Success-Response:
     * {
            "res_code": 1,
            "msg": "操作成功"
        }
     */
  async chooseHandleWay() {
    const { ctx, service } = this;
    const param = ctx.request.body;
    const rule = {
      handle_way: { type: 'string', required: true },
      diagnose_result: { type: 'string', required: true }
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const result = await service.train.handle.chooseHandleWay(param);
    ctx.body = result;
  }
    /**
     * @api {get} /train/getTreatment c.获取西药列表、护理常规
     * @apiVersion 1.0.0  
     * @apiName getTreatment
     * @apiGroup handle
     *
     * @apiParam {string} token
     * @apiParam {number} parent_id 查询第一层级，不传
     * @apiParam {number} treatment_category_id 处置类型编号，西药、护理常规等1	护理等级
       2	膳食
       3	体位
       4	护理
       5	操作
       6	西药分类
       7	西药用法
       8	西药次数
       9	中药分类
       10	中药用法
       11	中药次数
       12	其他
       13	操作
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {object} data 获取数据列表
     *
     * @apiSuccessExample Success-Response:
     * {
            "res_code": 1,
            "msg": "查询成功",
            "data": [
                {
                    "id": 1,
                    "treatment_category_id": 1,
                    "name": "特级护理",
                    "parent_id": 0,
                    "add_time": "1999-12-31T16:00:00.000Z",
                    "last_time": "1999-12-31T16:00:00.000Z"
                },
                {
                    "id": 2,
                    "treatment_category_id": 1,
                    "name": "一级护理",
                    "parent_id": 0,
                    "add_time": "1999-12-31T16:00:00.000Z",
                    "last_time": "1999-12-31T16:00:00.000Z"
                },
                {
                    "id": 3,
                    "treatment_category_id": 1,
                    "name": "二级护理",
                    "parent_id": 0,
                    "add_time": "1999-12-31T16:00:00.000Z",
                    "last_time": "1999-12-31T16:00:00.000Z"
                },
                {
                    "id": 4,
                    "treatment_category_id": 1,
                    "name": "三级护理",
                    "parent_id": 0,
                    "add_time": "1999-12-31T16:00:00.000Z",
                    "last_time": "1999-12-31T16:00:00.000Z"
                }
            ]
        }
     */
  async getTreatment() {
    const { ctx, service } = this;
    const param = ctx.query;
    const result = await service.train.handle.getTreatment(param);
    ctx.body = result;
  }
    /**
     * @api {post} /train/addNursePlan d.添加护理方案
     * @apiVersion 1.0.0  
     * @apiName addNursePlan
     * @apiGroup handle
     *
     * @apiParam {string} token
     * @apiParam {string} nursing_grade 护理等级
     * @apiParam {string} nursing_rule 护理常规
     * @apiParam {string} diagnose_result 诊断结果
     * @apiParam {string} illness_name 病情名称
     * @apiParam {string} treat_condition 治疗情况
     * @apiParam {string} posture 体位
     * @apiParam {string} patrol_time 巡视时间
     * @apiParam {string} meals 膳食
     * @apiParam {string} reason 应用理由
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     *
     * @apiSuccessExample Success-Response:
     * {
            "res_code": 1,
            "msg": "操作成功"
        }
     */
  async addNursePlan() {
    const { ctx, service ,parameter, resMsg} = this;
    const param = ctx.request.body;
    const rule = {
      nursing_grade: { type: 'string', required: true },// '护理等级',
      nursing_rule: { type: 'string', required: true },//'护理常规',
      diagnose_result: { type: 'string', required: true },//'诊断结果',
      illness_name: { type: 'string', required: true },// '病情名称',
      treat_condition: { type: 'string', required: true },// '治疗情况',
      posture: { type: 'string', required: true },//'体位',
      // patrol_time: { type: 'string', required: true },//'巡视时间',
      meals: { type: 'string', required: true },//'膳食',
      reason: { type: 'string', required: true },//'应用理由',
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const result = await service.train.handle.addNursePlan(param);
    ctx.body = result;
  }

    /**
     * @api {get} /train/getNursePlan e.查询当前病例护理方案
     * @apiVersion 1.0.0  
     * @apiName getNursePlan
     * @apiGroup handle
     *
     * @apiParam {string} token
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data 病例护理方案
     *
     * @apiSuccessExample Success-Response:
     * {
          "res_code": 1,
          "msg": "查询成功",
          "data": [
              {
                  "id": 17,
                  "user_id": 8,
                  "case_id": 3,
                  "case_diagnosis_id": 435,
                  "patient_handle_result_id": "1",
                  "nursing_grade": "sdss级护理",
                  "nursing_rule": "神经内科护理常规",
                  "diagnose_result": "诊断结果",
                  "illness_name": "神经病",
                  "treat_condition": "未手术",
                  "posture": "多运动",
                  "patrol_time": null,
                  "meals": "使劲吃就行了",
                  "reason": "没有理由",
                  "create_time": "2019-01-03T03:45:40.000Z",
                  "last_time": "2019-01-03T03:45:40.000Z"
              }
          ]
      }
     */
  async getNursePlan() {
    const { ctx, service } = this;
    const result = await service.train.handle.getNursePlan();
    ctx.body = result;
  }

    /**
     * @api {post} /train/delNursePlan f.删除护理方案
     * @apiVersion 1.0.0  
     * @apiName delNursePlan
     * @apiGroup handle
     *
     * @apiParam {string} token
     * @apiParam {number} id 护理方案编号
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     *
     * @apiSuccessExample Success-Response:
     * {
            "res_code": 1,
            "msg": "操作成功"
        }
     */
  async delNursePlan() {
    const { ctx, service, resMsg, parameter } = this;
    const param = ctx.request.body;
    const rule = {
      id: { type: 'int', required: true, min: 1 }
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const id = param.id;
    
    const result = await service.train.handle.delNursePlan(id);
    ctx.body = result;
  }

    /**
     * @api {post} /train/updateNursePlan g.修改护理方案
     * @apiVersion 1.0.0  
     * @apiName updateNursePlan
     * @apiGroup handle
     *
     * @apiParam {string} token
     * @apiParam {number} id 护理方案编号
     * @apiParam {string} nursing_rule 护理常规
     * @apiParam {string} illness_name 病情名称
     * @apiParam {string} treat_condition 治疗情况
     * @apiParam {string} posture 体位
     * @apiParam {string} patrol_time 巡视时间
     * @apiParam {string} meals 膳食
     * @apiParam {string} reason 应用理由
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     *
     * @apiSuccessExample Success-Response:
     * {
            "res_code": 1,
            "msg": "操作成功"
        }
     */
  async updateNursePlan() {
    const { ctx, service, parameter, resMsg } = this;
    const param = ctx.request.body;
    const rule = {
      id: { type: 'int', required: true, min: 1 }, //'方案编号',
      nursing_grade: { type: 'string', required: false },// '护理等级',
      nursing_rule: { type: 'string', required: false },//'护理常规',
      diagnose_result: { type: 'string', required: false },//'诊断结果',
      illness_name: { type: 'string', required: false },// '病情名称',
      treat_condition: { type: 'string', required: false },// '治疗情况',
      posture: { type: 'string', required: false },//'体位',
      patrol_time: { type: 'string', required: false },//'巡视时间',
      meals: { type: 'string', required: false },//'膳食',
      reason: { type: 'string', required: false },//'应用理由',
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const result = await service.train.handle.updateNursePlan(param);
    ctx.body = result;
  }

    /**
     * @api {post} /train/addTreatPlan h.添加治疗方案
     * @apiVersion 1.0.0  
     * @apiName addTreatPlan
     * @apiGroup handle
     *
     * @apiParam {string} token
     * @apiParam {string} nursing_rule 护理常规
     * @apiParam {string} drug_type 药物类型
     * @apiParam {string} drug_name 药物名称
     * @apiParam {string} drug_use_dose 药物剂量
     * @apiParam {string} drug_use_method 药物用法
     * @apiParam {string} drug_use_interval 时间间隔
     * @apiParam {string} grug_use_reason 应用理由
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     *
     * @apiSuccessExample Success-Response:
     * {
            "res_code": 1,
            "msg": "操作成功"
        }
     */
  async addTreatPlan() {
    const { ctx, service, parameter, resMsg } = this;
    const param = ctx.request.body;
    const rule = {
      drug_type: { type: 'string', required: true }, //'药物类型',
      drug_name: { type: 'string', required: true }, //'药物名称',
      drug_use_dose: { type: 'string', required: true }, //'药物剂量',
      drug_use_method: { type: 'string', required: true }, //'药物用法',
      // drug_use_interval: { type: 'string', required: true }, //'时间间隔',
      drug_use_reason: { type: 'string', required: true }, //'应用理由',
      drug_first_id:{ type: 'int', required: true, min: 1 },
      drug_second_id:{ type: 'int', required: true, min: 1 },
      drug_third_id:{ type: 'int', required: true, min: 1 }
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const result = await service.train.handle.addTreatPlan(param);
    ctx.body = result;
  }
 
    /**
     * @api {get} /train/getTreatPlan i.查询治疗方案
     * @apiVersion 1.0.0  
     * @apiName getTreatPlan
     * @apiGroup handle
     *
     * @apiParam {string} token
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data 病例治疗方案
     *
     * @apiSuccessExample Success-Response:
     * {
          "res_code": 1,
          "msg": "查询成功",
          "data": [
              {
                  "id": 13,
                  "user_id": 8,
                  "case_id": 3,
                  "case_diagnosis_id": 435,
                  "patient_handle_result_id": 1,
                  "drug_type": "西药",
                  "drug_name": "青霉素",
                  "drug_use_dose": "qid",
                  "drug_use_method": "静脉注射",
                  "drug_use_interval": "时间间隔",
                  "drug_use_reason": "咳嗽",
                  "create_time": "2018-12-20T12:25:59.000Z",
                  "last_time": "2018-12-20T12:25:59.000Z",
                  "drug_first_id": 6,
                  "drug_second_id": 82,
                  "drug_third_id": 83
              }
          ]
      }         
     */
  async getTreatPlan() {
    const { ctx, service } = this;
    const result = await service.train.handle.getTreatPlan();
    ctx.body = result;
  }


    /**
     * @api {post} /train/delTreatPlan j.删除治疗方案
     * @apiVersion 1.0.0  
     * @apiName delTreatPlan
     * @apiGroup handle
     *
     * @apiParam {string} token
     * @apiParam {number} id 治疗方案编号
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     *
     * @apiSuccessExample Success-Response:
     * {
            "res_code": 1,
            "msg": "操作成功"
        }
     */
  async delTreatPlan() {
    const { ctx, service, parameter, resMsg } = this;
    const param = ctx.request.body;
    const rule = {
      id: { type: 'int', required: true, min: 1 }
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const id = param.id;
    const result = await service.train.handle.delTreatPlan(id);
    ctx.body = result;
  }

    /**
     * @api {post} /train/updateTreatPlan k.修改治疗方案
     * @apiVersion 1.0.0  
     * @apiName updateTreatPlan
     * @apiGroup handle
     *
     * @apiParam {string} token
     * @apiParam {number} id 治疗编号,
     * @apiParam {string} nursing_rule 护理常规
     * @apiParam {string} drug_type 药物类型
     * @apiParam {string} drug_name 药物名称
     * @apiParam {string} drug_use_dose 药物剂量
     * @apiParam {string} drug_use_method 药物用法
     * @apiParam {string} drug_use_interval 时间间隔
     * @apiParam {string} grug_use_reason 应用理由
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     *
     * @apiSuccessExample Success-Response:
     * {
            "res_code": 1,
            "msg": "操作成功"
        }
     */
  async updateTreatPlan() {
    const { ctx, service , parameter, resMsg} = this;
    const param = ctx.request.body;
    const rule = {
      id: { type: 'int', required: true, min: 1 }, //'方案编号',
      nursing_rule: { type: 'int', required: false, min: 1 }, //'护理常规',
      drug_type: { type: 'string', required: false }, //'药物类型',
      drug_name: { type: 'string', required: false }, //'药物名称',
      drug_use_dose: { type: 'string', required: false }, //'药物剂量',
      drug_use_method: { type: 'string', required: false }, //'药物用法',
      drug_use_interval: { type: 'string', required: false }, //'时间间隔',
      drug_use_reason: { type: 'string', required: false }, //'应用理由',
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const result = await service.train.handle.updateTreatPlan(param);
    ctx.body = result;
  }

}

module.exports = HandleController;