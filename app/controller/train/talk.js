"use strict";
/**
 * 问诊相关接口
 * @author fuzemeng
 * @date 2018/11/27
 */
const Controller = require('egg').Controller;

class TalkController extends Controller {

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
     * @apiDefine talk 问诊
     */
   /**
     * @api {get} /train/getInquiries a.获取问诊选项
     * @apiVersion 1.0.0  
     * @apiName getInquiries
     * @apiGroup talk
     *
     * @apiParam {string} token
     * @apiParam {string} talk_group 分组(不传查询分组，传递查询相应组的数据)
     * @apiParam {string} keyword 关键词(用于问题查询)
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data  问答列表
     *
     * @apiSuccessExample Success-Response:
     *       
      {
          "res_code":1,
          "msg":"查询成功",
          "data":[
              {
                  "id":3,
                  "case_id":3,
                  "question_index":1,
                  "question":"哪里不舒服？",
                  "answer":"胳膊腿都不能动了",
                  "is_necessary":1,
                  "representor":"Self",
                  "is_force_explain":0,
                  "specialistic_explain":"",
                  "add_time":"1999-12-31T16:00:00.000Z",
                  "last_time":"1999-12-31T16:00:00.000Z",
                  "talk_group":"一般问题"
              },
              {
                  "id":4,
                  "case_id":3,
                  "question_index":2,
                  "question":"怎么不舒服，描述一下？",
                  "answer":"今天早晨醒来后想上厕所，感觉全身没劲，胳膊抬不起来了，尤其是两条腿，动都不能动了。",
                  "is_necessary":1,
                  "representor":"Self",
                  "is_force_explain":0,
                  "specialistic_explain":"四肢突发软瘫",
                  "add_time":"1999-12-31T16:00:00.000Z",
                  "last_time":"1999-12-31T16:00:00.000Z",
                  "talk_group":"一般问题"
              }
          ]
      }
     */ 
  async getInquiries() {
    const { ctx, service } = this;
    const result = await service.train.talk.getInquiries(ctx.query);
    ctx.body = result;
  }

   /**
     * @api {post} /train/addTalkBasis b.添加问诊依据（问答记录）
     * @apiVersion 1.0.0  
     * @apiName addTalkBasis
     * @apiGroup talk
     *
     * @apiParam {string} token
     * @apiParam {number} talk_id 问诊选项编号
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
  async addTalkBasis() {
    const { ctx, service, parameter, resMsg } = this;
    const param = ctx.request.body;
    const rule = {
      talk_id: { type: 'int', required: true, min: 1 }
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const talk_id = param.talk_id;
    const result = await service.train.talk.addTalkBasis(talk_id);
    ctx.body = result;
  }

   /**
     * @api {get} /train/getTalkHistory c.获取问答记录
     * @apiVersion 1.0.0  
     * @apiName getTalkHistory
     * @apiGroup talk
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
                    "question":"在什么情况下这种症状是可以缓解？",
                    "answer":"喝钾（氯化钾）或者输点液就能好",
                    "time":"2019-01-03 17:16:53"
                }
            ]
        }
     */ 
  async getTalkHistory() {
    const { ctx, service } = this;
    const result = await service.train.talk.getTalkHistory();
    ctx.body = result;
  }

}

module.exports = TalkController;