"use strict";
/**
 * 分数相关接口
 * @author fuzemeng
 * @date 2018/11/27
 */
const Controller = require('egg').Controller;

class ScoreController extends Controller {

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
     * @apiDefine score 分数查询
     */
   /**
     * @api {get} /train/getScore 查询成绩
     * @apiVersion 1.0.0  
     * @apiName getScore
     * @apiGroup score
     *
     * @apiParam {string} token
     * @apiParam {number} type 工具编号
     * @apiParam {double} score 部位名称
     * @apiParam {string} case_keyword 工具名称
     * @apiParam {string} start_time 工具名称
     * @apiParam {string} end_time 工具名称
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data  成绩列表
     *
     * @apiSuccessExample Success-Response:
     *       
        {
            "res_code":1,
            "msg":"查询成功",
            "data":[
                {
                    "id":2,
                    "user_id":1,
                    "case_id":1,
                    "case_diagnosis_id":2,
                    "case_name":"漏疮",
                    "total_score":90,
                    "clinical_behaviour_score":1,
                    "diagnose_sbehaviour_score":2,
                    "treat_handle_score":1,
                    "ability_accomplishment_score":2,
                    "case_write_score":1.5,
                    "objective_score":2.5,
                    "last_time":"2018-12-05 13:12:01",
                    "create_time":"2018-12-05T05:12:05.000Z",
                    "type":2
                },
                {
                    "id":3,
                    "user_id":1,
                    "case_id":1,
                    "case_diagnosis_id":2,
                    "case_name":"咳嗽",
                    "total_score":60,
                    "clinical_behaviour_score":1,
                    "diagnose_sbehaviour_score":2,
                    "treat_handle_score":1,
                    "ability_accomplishment_score":2,
                    "case_write_score":1.5,
                    "objective_score":2.5,
                    "last_time":"2018-12-05 13:12:01",
                    "create_time":"2018-12-05T05:12:05.000Z",
                    "type":2
                }
            ]
        }
     */ 
  async getScore() {
    const { ctx, service, parameter, resMsg } = this;
    const param = ctx.query;
    const rule = {
      type: { convertType: 'int', type: 'int', required: true, min: 1 }
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const result = await service.train.score.getScore(param);
    ctx.body = result;
  }

}

module.exports = ScoreController;