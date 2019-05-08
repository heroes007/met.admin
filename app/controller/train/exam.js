"use strict";
/**
 * 练习考试相关接口
 * @author fuzemeng
 * @date 2018/11/27
 */
const Controller = require('egg').Controller;

class ExamController extends Controller {

  /**
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
     * @apiDefine train_exam 练习考试
     */
 
    /**
     * @api {get} /train/getObjectivetest 1.获取客观题
     * @apiVersion 1.0.0  
     * @apiName getObjectivetest
     * @apiGroup train_exam
     *
     * @apiParam {string} token
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data 客观题列表
     *
     * @apiSuccessExample Success-Response:
     *       
          {
              "res_code":1,
              "msg":"查询成功",
              "data":[
                  {
                      "question_id":1,
                      "question":"感冒通常是怎么引起的？",
                      "option_id":1,
                      "option_name":"穿的太多",
                      "multiple_selection":0
                  },
                  {
                      "question_id":1,
                      "question":"感冒通常是怎么引起的？",
                      "option_id":3,
                      "option_name":"病毒和天气变化",
                      "multiple_selection":0
                  },
                  {
                      "question_id":1,
                      "question":"感冒通常是怎么引起的？",
                      "option_id":2,
                      "option_name":"吃的太少",
                      "multiple_selection":0
                  }
              ]
          }
     */
  async getObjectivetest() {
    const { ctx, service } = this;
    const result = await service.train.exam.getObjectivetest();
    ctx.body = result;
  }


    /**
     * @api {post} /train/saveObjectivetest 2.保存客观题作答结果
     * @apiVersion 1.0.0  
     * @apiName saveObjectivetest
     * @apiGroup train_exam
     *
     * @apiParam {string} token
     * @apiParam {array} objective_array [{case_ovjectivetest_id:1,//题目编号option_choose_id:'1,2,3'//用户选择选项编号 }]
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     *
     * @apiSuccessExample Success-Response:
     *       
        {
            "res_code":1,
            "msg":"模拟考试完成"
        }
     */
  async saveObjectivetest() {
    const { ctx, service , parameter, resMsg} = this;
    const param = ctx.request.body;
    const rule = {
        objective_array: { type: 'array', required: true },
    }
    const errors = parameter.validate(rule, param);
    if (errors) {
        ctx.body = resMsg.newParamErr(errors);
        return;
    }
    const objectiveArray = param.objective_array;
    const result = await service.train.exam.saveObjectivetest(objectiveArray);
    ctx.body = result;
  }



}

module.exports = ExamController;