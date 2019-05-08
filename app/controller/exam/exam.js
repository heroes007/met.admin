"use strict";
/**
 * 考试相关接口
 * @author fuzemeng
 * @date 2019/02/22
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
     * @apiDefine exam 考试
     */
 
    /**
     * @api {get} /exam/getExamCases 获取考试病例
     * @apiVersion 1.0.0  
     * @apiName getExamCases
     * @apiGroup exam
     *
     * @apiParam {string} token
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data 客观题列表
     *
     * @apiSuccessExample Success-Response:
     *    {
    "res_code": 1,
    "msg": "查询成功",
    "data": [
        {
            "case_id": 3,
            "start_time": "2019-02-23",
            "end_time": "2019-02-25",
            "exam_time": 45,
            "name": "咳嗽007",
            "symptom": "咳嗽",
            "patient_name": "曹××",
            "patient_gender": "Male",
            "patient_age": 17,
            "patient_marital_status": "未婚",
            "patient_nation": "汉族",
            "patient_occupation": "学生",
            "patient_head_portrait_url": "http://www.ygjj.com/bookpic2/2012-11-25/new483876-20121125162750536998.JPG",
            "patient_division": "呼吸内科",
            "degree": 3,
            "state": 1
        },
        {
            "case_id": 4,
            "start_time": "2019-02-25",
            "end_time": "2019-02-26",
            "exam_time": 40,
            "name": "黑便",
            "symptom": "黑便",
            "patient_name": "姚XX",
            "patient_gender": "Male",
            "patient_age": 59,
            "patient_marital_status": "已婚",
            "patient_nation": "汉族",
            "patient_occupation": "干部",
            "patient_head_portrait_url": "http://images.china.cn/attachement/jpg/site1000/20150908/001fd04cec6017589a3f4a.jpg",
            "patient_division": "消化内科",
            "degree": 3,
            "state": 0
        }
    ]
}   
     */
  async getExamCases() {
    const { ctx, service } = this;
    const result = await service.exam.exam.getExamCases();
    ctx.body = result;
  }

      /**
     * @api {get} /exam/endAct 考试/练习结束
     * @apiVersion 1.0.0  
     * @apiName endAct
     * @apiGroup exam
     *
     * @apiParam {string} token
     *
     * @apiSuccess {number} res_code 状态码
     * @apiSuccess {string} msg 返回详情
     * @apiSuccess {array} data 客观题列表
     *
     * @apiSuccessExample Success-Response:
      {
          "res_code": 1,
          "msg": "模拟考试/练习完成"
      }  
     */
  async endAct() {
    const { ctx, service} = this;
    const result = await service.exam.exam.endAct();
    ctx.body = result;
  }

}

module.exports = ExamController;