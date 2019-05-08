"use strict";
 /**
   * 体格检查相关接口
   * @author fuzemeng
   * @date 2018/11/27
   */
const Controller = require('egg').Controller;

class PhysiqueController extends Controller {

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
     * @apiDefine physicalExamination 体格检查
     */
 
   /**
     * @api {get} /train/getPhysicalExaminationTool a.获取体格检查工具列表
     * @apiVersion 1.0.0  
     * @apiName getPhysicalExaminationTool
     * @apiGroup physicalExamination
     *
     * @apiParam {string} token
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data 体格检查工具列表
     *
     * @apiSuccessExample Success-Response:
     *       
        {
            "res_code":1,
            "msg":"查询成功",
            "data":[
                {
                    "id":2,
                    "name":"体温计",
                    "class_name":"分类一",
                    "image_file":"public/physical_examination_tool/体温计.png",
                    "add_time":"1999-12-31T16:00:00.000Z",
                    "last_time":"1999-12-31T16:00:00.000Z"
                },
                {
                    "id":3,
                    "name":"叩诊锤",
                    "class_name":"分类一",
                    "image_file":"public/physical_examination_tool/叩诊锤.png",
                    "add_time":"1999-12-31T16:00:00.000Z",
                    "last_time":"1999-12-31T16:00:00.000Z"
                }
            ]
        }
     */
  async getPhysicalExaminationTool() {
    const { ctx, service } = this;
    const result = await service.train.physique.getPhysicalExaminationTool();
    ctx.body = result;
  }

   /**
     * @api {get} /train/getPhysicalExaminationCategory b.获取体格检查分类
     * @apiVersion 1.0.0  
     * @apiName getPhysicalExaminationCategory
     * @apiGroup physicalExamination
     *
     * @apiParam {string} token
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data 体格检查分类列表
     *
     * @apiSuccessExample Success-Response:
     *       
        {
            "res_code":1,
            "msg":"查询成功",
            "data":[
                {
                    "id":8,
                    "name":"头颅",
                    "parent_id":7,
                    "add_time":"1999-12-31T16:00:00.000Z",
                    "last_time":"1999-12-31T16:00:00.000Z",
                    "img_url":"["public/physical_examination_tool_region/女_分类/女 正头部 .png","public/physical_examination_tool_region/男_分类/男 正头部.png"]"
                },
                {
                    "id":9,
                    "name":"眼",
                    "parent_id":7,
                    "add_time":"1999-12-31T16:00:00.000Z",
                    "last_time":"1999-12-31T16:00:00.000Z",
                    "img_url":"["public/physical_examination_tool_region/女_分类/女 正头部 .png","public/physical_examination_tool_region/男_分类/男 正头部.png"]"
                }
            ]
        }
     */  
  async getPhysicalExaminationCategory() {
    const { ctx, service } = this;
    const result = await service.train.physique.getPhysicalExaminationCategory();
    ctx.body = result;
  }


   /**
     * @api {get} /train/getPhysicalExaminationToolPosition c.获取病例中体格检查工具可用体位
     * @apiVersion 1.0.0  
     * @apiName getPhysicalExaminationToolPosition
     * @apiGroup physicalExamination
     *
     * @apiParam {string} token
     * @apiParam {number} tool_id 工具编号
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data 体格检查工具可用体位列表
     *
     * @apiSuccessExample Success-Response:
     *       
      {
          "res_code":1,
          "msg":"查询成功",
          "data":[
              {
                  "id":68,
                  "tool_id":4,
                  "name":"第一二胸椎",
                  "category_id":20
              },
              {
                  "id":69,
                  "tool_id":4,
                  "name":"第三四胸椎",
                  "category_id":20
              }
          ]
      }
     */  
  async getPhysicalExaminationToolPosition() {
    const { ctx, service, parameter, resMsg } = this;
    const param = ctx.query;
    const rule = {
        tool_id: { convertType: 'int', type: 'int', required: true, min: 1 }
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const tool_id = param.tool_id;
    const result = await service.train.physique.getPhysicalExaminationToolPosition(tool_id);
    ctx.body = result;
  }

   /**
     * @api {get} /train/getPhysicalExaminationToolRegion d.体格检查工具对应部位
     * @apiVersion 1.0.0  
     * @apiName getPhysicalExaminationToolRegion
     * @apiGroup physicalExamination
     *
     * @apiParam {string} token
     * @apiParam {number} tool_id 工具编号
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data 检查工具对应部位列表
     *
     * @apiSuccessExample Success-Response:
     *       
      {
          "res_code":1,
          "msg":"查询成功",
          "data":[
              {
                  "id":68,
                  "tool_id":4,
                  "name":"第一二胸椎",
                  "category_id":20
              },
              {
                  "id":69,
                  "tool_id":4,
                  "name":"第三四胸椎",
                  "category_id":20
              }
          ]
      }
     */  
  async getPhysicalExaminationToolRegion() {
    const { ctx, service, parameter, resMsg } = this;
    const param = ctx.query;
    const rule = {
        tool_id: { convertType: 'int', type: 'int', required: false, min: 1 },
        category_id:{ convertType: 'int', type: 'int', required: false, min: 1 }
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const result = await service.train.physique.getPhysicalExaminationToolRegion(param);
    ctx.body = result;
  }

   /**
     * @api {get} /train/getPhysicalExaminationResult e.获取体格检查结果
     * @apiVersion 1.0.0  
     * @apiName getPhysicalExaminationResult
     * @apiGroup physicalExamination
     *
     * @apiParam {string} token
     * @apiParam {number} tool_id 工具编号
     * @apiParam {string} name 部位名称
     * @apiParam {string} category_name 工具名称
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data 体格检查结果
     *
     * @apiSuccessExample Success-Response:
     *       
        {
            "res_code":1,
            "msg":"查询成功",
            "data":[
                {
                    "id":6,
                    "case_id":3,
                    "tool_region_id":252,
                    "is_necessary":1,
                    "is_force_explain":1,
                    "specialistic_explain":"专家解释专家解释专家解释专家解释",
                    "result_text":"结果文本结果文本结果文本结果文本",
                    "result_media_type":"audio",
                    "result_media_url":"public/DefaultPhysicalExaminationResult/听诊器_右肺/呼吸音粗糙-20.wav",
                    "add_time":"2018-12-20T03:55:15.000Z",
                    "last_time":"2018-12-20T03:55:18.000Z",
                    "name":"左胸",
                    "category_name":"听诊器"
                }
            ]
        }
     */  
  async getPhysicalExaminationResult() {
    const { ctx, service, resMsg, parameter } = this;
    const param = ctx.query;
    const rule = {
        tool_region_id: { convertType: 'int', type: 'int', required: true, min: 1 },
        name:{ type: 'string', required: true }
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const result = await service.train.physique.getPhysicalExaminationResult(param);
    ctx.body = result;
  }

}

module.exports = PhysiqueController;