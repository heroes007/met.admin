"use strict";
/**
 * 辅助检查相关接口
 * @author fuzemeng
 * @date 2018/11/27
 */
const Controller = require('egg').Controller;

class AssistController extends Controller {

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
    this.path_all = this.ctx.path_all;
    this.parameter = this.ctx.helper.parameter;
  }

   /**
     * @apiDefine assistant 辅助检查
     */
 
    /**
     * @api {get} /train/getAssistantCategory 1.查询辅助检查分类
     * @apiVersion 1.0.0  
     * @apiName getAssistantCategory
     * @apiGroup assistant
     *
     * @apiParam {string} token
     * @apiParam {number} parent_id 父分类id
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data 辅助检查分类列表
     *
     * @apiSuccessExample Success-Response:
     * {
          "res_code": 1,
          "msg": "查询成功",
          "data": [
              {
                  "id": 5,
                  "name": "血型",
                  "parent_id": 1,
                  "add_time": "2018-11-30T02:35:16.000Z",
                  "last_time": "2018-11-30T02:35:25.000Z"
              }
          ]
      }
     */
  async getAssistantCategory() {
    const { ctx, service, parameter, resMsg } = this;
    const param = ctx.query;
    const rule = {
        parent_id: { convertType: 'int', type: 'int', required: false, min: 1 }
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const result = await service.train.assist.getAssistantCategory(param);
    ctx.body = result;
  }

    /**
     * @api {get} /train/getAssistantItems 2.查询辅助检查选项
     * @apiVersion 1.0.0  
     * @apiName getAssistantItems
     * @apiGroup assistant
     *
     * @apiParam {string} token
     * @apiParam {number} category_id 分类id
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data 辅助检查选项列表
     *
     * @apiSuccessExample Success-Response:
     * {
            "res_code": 1,
            "msg": "查询成功",
            "data": [
                {
                    "id": 1,
                    "name": "心电图",
                    "category_id": 4,
                    "description": "白细胞白细胞白细胞白细胞白细胞白细胞",
                    "add_time": "2018-11-30T02:56:28.000Z",
                    "last_time": "2018-11-30T02:56:34.000Z",
                    "cost": 10
                },
                {
                    "id": 2,
                    "name": "心室造影",
                    "category_id": 4,
                    "description": "中型包细胞比率中型包细胞比率中型包细胞比率中型包细胞比率",
                    "add_time": "2018-11-30T02:57:08.000Z",
                    "last_time": "2018-11-30T02:57:12.000Z",
                    "cost": 20
                }
            ]
        }
     */
  async getAssistantItems() {
    const { ctx, service, parameter, resMsg } = this;
    const param = ctx.query;
    const rule = {
        category_id: { convertType: 'int', type: 'int', required: true, min: 1 }
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const category_id = param.category_id;
    const result = await service.train.assist.getAssistantItems(category_id);
    ctx.body = result;
  }

    /**
     * @api {post} /train/addAssistantBasis 3.添加辅助依据（辅助检查结果）
     * @apiVersion 1.0.0  
     * @apiName addAssistantBasis
     * @apiGroup assistant
     *
     * @apiParam {string} token
     * @apiParam {string} item_ids_str 辅助检查选项的id中间用","隔开的字符串
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data 辅助检查结果列表
     *
     * @apiSuccessExample Success-Response:
     * {
            "res_code":1,
            "msg":"操作成功",
            "data":[
                {
                    "caer_id":5,
                    "case_id":3,
                    "item_id":6,
                    "result_report_url":"[{"type":"image","url":"public/2.jpg"}]",
                    "caerd_id":6,
                    "name":"肺透视（x光片）",
                    "cost":100
                }
            ]
        }
     */
  async addAssistantBasis() {
    const { ctx, service ,parameter, resMsg} = this;
    const param = ctx.request.body;
    const rule = {
        item_ids_str: { type: 'string', required: true },
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const itemIdsStr = param.item_ids_str;
    const result = await service.train.assist.addAssistantBasis(itemIdsStr);
    ctx.body = result;
  }
    /**
     * @api {get} /train/getAssists  4.从依据表查询辅助检查数据
     * @apiVersion 1.0.0  
     * @apiName getAssists
     * @apiGroup assistant
     *
     * @apiParam {string} token
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data 辅助检查结果列表
     *
     * @apiSuccessExample Success-Response:
     * {
            "res_code":1,
            "msg":"查询成功",
            "data":[
                {
                    "caer_id":5,
                    "case_id":3,
                    "item_id":6,
                    "result_report_url":"[{"type":"image","url":"public/2.jpg"}]",
                    "caerd_id":6,
                    "name":"肺透视（x光片）",
                    "cost":100
                }
            ]
        }
     */
  async getAssists() {
    const { ctx, service } = this;
    const result = await service.train.assist.getAssists();
    ctx.body = result;
  }
}

module.exports = AssistController;