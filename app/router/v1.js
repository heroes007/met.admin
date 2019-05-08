"use strict";
/**
 * @author fuzemeng
 * @date 2018/11/20
 */
module.exports = app => {
  const { router, rules, controller } = app;

  // 路由统一前缀
  const newRouter = router.namespace('/mtt');

  // 路由中间价
  // const checkParams = app.middleware.checkParams('v1');
  const checkToken = app.middleware.checkToken;

  //测试
  newRouter.get('/test', controller.user.user.test)

  //登录
  newRouter.post('/user/login',  controller.user.user.login);
  //注册
  newRouter.post('/user/register',  controller.user.user.register);
  //注销
  newRouter.post('/user/logout', checkToken(), controller.user.user.logout);

  //检测并且记录操作进度
  newRouter.post('/train/checkMark', checkToken(),  controller.train.train.checkMark);
  //获取病例列表
  newRouter.get('/train/getCases', checkToken(),  controller.train.train.getCases);
  newRouter.get('/train/getCaseKeys', checkToken(),  controller.train.train.getCaseKeys);

  //开始练习，记录一条此病例的状态数据
  newRouter.post('/train/startTrain', checkToken(),  controller.train.train.startTrain);
  //暂停练习
  // newRouter.post('/train/stopTrain', checkToken(),  controller.train.train.stopTrain);
  //继续练习
  newRouter.post('/train/continueTrain', checkToken(),  controller.train.train.continueTrain);
  //查询当前病例练习操作进度
  newRouter.get('/train/getCaseOperate', checkToken(),  controller.train.train.getCaseOperate);
  //重新开始
  newRouter.post('/train/reStartTrain', checkToken(),  controller.train.train.reStartTrain);
  //获取问诊选项
  newRouter.get('/train/getInquiries', checkToken(), controller.train.talk.getInquiries);
  //获取问答记录
  newRouter.get('/train/getTalkHistory', checkToken(), controller.train.talk.getTalkHistory);
  //添加问诊依据（问答记录）
  newRouter.post('/train/addTalkBasis', checkToken(),  controller.train.talk.addTalkBasis);

  //根据关键词查询诊断
  newRouter.get('/train/getIquiryByKeyword', checkToken(),  controller.train.train.getIquiryByKeyword);
  //添加拟诊
  newRouter.post('/train/doQuasiDiagnosis', checkToken(),  controller.train.train.addQuasiDiagnosis);
  //查询拟诊
  newRouter.get('/train/getQuasiDiagnosis', checkToken(), controller.train.train.getQuasiDiagnosis);

  //查询依据
  newRouter.get('/train/getBasis', checkToken(), controller.train.train.getBasis);
  //添加依据
  newRouter.post('/train/doBasis', checkToken(),  controller.train.train.addBasis);
  //查询操作记录
  newRouter.get('/train/getHistory', checkToken(), controller.train.train.getHistory);

  //查询辅助检查分类
  newRouter.get('/train/getAssistantCategory', checkToken(),  controller.train.assist.getAssistantCategory);
  //查询辅助检查选项
  newRouter.get('/train/getAssistantItems', checkToken(),  controller.train.assist.getAssistantItems);


  //检查——添加辅助依据（辅助检查结果）
  newRouter.post('/train/addAssistantBasis', checkToken(),  controller.train.assist.addAssistantBasis);
  //查询辅助检查选项
  newRouter.get('/train/getAssists', checkToken(), controller.train.assist.getAssists);

  //学生解答
  newRouter.post('/train/addStudentDecode', checkToken(),  controller.train.train.addStudentDecode);

  //诊断分析，获取记录
  newRouter.get('/train/getAnalysis', checkToken(), controller.train.train.getAnalysis);

  //选择处置病人方式
  newRouter.post('/train/chooseHandleWay', checkToken(),  controller.train.handle.chooseHandleWay);
  //查询当前病例处置方式
  newRouter.get('/train/getHandleWay', checkToken(),  controller.train.handle.getHandleWay);
  // //查询护理方式
  // newRouter.get('/train/getNursingRoutine', checkToken(), controller.train.train.getNursingRoutine);
  // //获取西药
  // newRouter.get('/train/getWesternMedicine', checkToken(), controller.train.train.getWesternMedicine);
  // //获取中药
  // newRouter.get('/train/getChineseMedicine', checkToken(), controller.train.train.getChineseMedicine);
  newRouter.get('/train/getTreatment', checkToken(), controller.train.handle.getTreatment);

  //添加护理方案
  newRouter.post('/train/addNursePlan', checkToken(),  controller.train.handle.addNursePlan);
  //查询护理方案
  newRouter.get('/train/getNursePlan', checkToken(), controller.train.handle.getNursePlan);
  //删除护理方案
  newRouter.post('/train/delNursePlan', checkToken(),  controller.train.handle.delNursePlan);
  //修改护理方案
  newRouter.post('/train/updateNursePlan', checkToken(),  controller.train.handle.updateNursePlan);

  //添加治疗方案
  newRouter.post('/train/addTreatPlan', checkToken(),  controller.train.handle.addTreatPlan);
  //查询治疗方案
  newRouter.get('/train/getTreatPlan', checkToken(), controller.train.handle.getTreatPlan);
  //删除治疗方案
  newRouter.post('/train/delTreatPlan', checkToken(),  controller.train.handle.delTreatPlan);
  //修改治疗方案
  newRouter.post('/train/updateTreatPlan', checkToken(),  controller.train.handle.updateTreatPlan);

  //获取体格检查工具列表
  newRouter.get('/train/getPhysicalExaminationTool', checkToken(), controller.train.physique.getPhysicalExaminationTool);
  //体格检查分类
  newRouter.get('/train/getPhysicalExaminationCategory', checkToken(), controller.train.physique.getPhysicalExaminationCategory);
  //获取病例中体格检查工具可用体位
  newRouter.get('/train/getPhysicalExaminationToolPosition', checkToken(),  controller.train.physique.getPhysicalExaminationToolPosition);
  //体格检查工具对应部位
  newRouter.get('/train/getPhysicalExaminationToolRegion', checkToken(),  controller.train.physique.getPhysicalExaminationToolRegion);
  //获取体格检查结果
  newRouter.get('/train/getPhysicalExaminationResult', checkToken(),  controller.train.physique.getPhysicalExaminationResult);
  newRouter.get('/train/getPhyExamCategory', checkToken(),controller.train.train.getPhyExamCategory);
  newRouter.get('/train/getPhyExamRegion', checkToken(),controller.train.train.getPhyExamRegion);

  newRouter.get('/train/getStudentDecode', checkToken(),controller.train.train.getStudentDecode);

  //获取客观题
  newRouter.get('/train/getObjectivetest', checkToken(), controller.train.exam.getObjectivetest);
  //保存客观题作答结果
  newRouter.post('/train/saveObjectivetest', checkToken(),  controller.train.exam.saveObjectivetest);

  //获取成绩
  newRouter.get('/train/getScore', checkToken(), controller.train.score.getScore);

  //各病症诊断总数量比
  newRouter.get('/train/getTotalDiagnose', checkToken(), controller.train.train.getTotalDiagnose);
  // //各症状治疗产生的费用比
  // newRouter.get('/train/getScore', checkToken(), controller.train.train.getScore);

  // //练习成绩查询结果
  // newRouter.get('/train/getScore', checkToken(), controller.train.getScore);
  // //最近一季度的成绩
  // newRouter.get('/train/getScore', checkToken(), controller.train.getScore);


  newRouter.get('/train/getCaseDiagnoseResult', checkToken(), controller.train.train.getCaseDiagnoseResult);

  /**
   * @name 考试接口
   * @time 20190222
   */
  //获取考试病例
  newRouter.get('/exam/getExamCases', checkToken(), controller.exam.exam.getExamCases);
  newRouter.get('/exam/endAct', checkToken(), controller.exam.exam.endAct);

}



// "use strict";
// /**
//  * @author fuzemeng
//  * @date 2018/11/20
//  */
// module.exports = app => {
//   const { router, rules, controller } = app;

//   // 路由统一前缀
//   const newRouter = router.namespace('/v1/api');

//   // 路由中间价
//   const checkParams = app.middleware.checkParams('v1');
//   const checkToken = app.middleware.checkToken;

//   //测试
//   newRouter.get('/test', controller.user.user.test)

//   //登录
//   newRouter.post('/user/login',  controller.user.user.login);
//   //注册
//   newRouter.post('/user/register',  controller.user.user.register);
//   //注销
//   newRouter.post('/user/logout', checkToken(), controller.user.user.logout);

//   //检测并且记录操作进度
//   newRouter.post('/train/checkMark', checkToken(),  controller.train.train.checkMark);
//   //获取病例列表
//   newRouter.get('/train/getCases', checkToken(),  controller.train.train.getCases);
//   //开始练习，记录一条此病例的状态数据
//   newRouter.post('/train/startTrain', checkToken(),  controller.train.train.startTrain);
//   //暂停练习
//   // newRouter.post('/train/stopTrain', checkToken(),  controller.train.train.stopTrain);
//   //继续练习
//   newRouter.post('/train/continueTrain', checkToken(),  controller.train.train.continueTrain);
//   //查询当前病例练习操作进度
//   newRouter.get('/train/getCaseOperate', checkToken(),  controller.train.train.getCaseOperate);
//   //重新开始
//   newRouter.post('/train/reStartTrain', checkToken(),  controller.train.train.reStartTrain);
//   //获取问诊选项
//   newRouter.get('/train/getInquiries', checkToken(), controller.train.talk.getInquiries);
//   //获取问答记录
//   newRouter.get('/train/getTalkHistory', checkToken(), controller.train.talk.getTalkHistory);
//   //添加问诊依据（问答记录）
//   newRouter.post('/train/addTalkBasis', checkToken(),  controller.train.talk.addTalkBasis);

//   //根据关键词查询诊断
//   newRouter.get('/train/getIquiryByKeyword', checkToken(),  controller.train.train.getIquiryByKeyword);
//   //添加拟诊
//   newRouter.post('/train/doQuasiDiagnosis', checkToken(),  controller.train.train.addQuasiDiagnosis);
//   //查询拟诊
//   newRouter.get('/train/getQuasiDiagnosis', checkToken(), controller.train.train.getQuasiDiagnosis);

//   //查询依据
//   newRouter.get('/train/getBasis', checkToken(), controller.train.train.getBasis);
//   //添加依据
//   newRouter.post('/train/doBasis', checkToken(),  controller.train.train.addBasis);
//   //查询操作记录
//   newRouter.get('/train/getHistory', checkToken(), controller.train.train.getHistory);

//   //查询辅助检查分类
//   newRouter.get('/train/getAssistantCategory', checkToken(),  controller.train.assist.getAssistantCategory);
//   //查询辅助检查选项
//   newRouter.get('/train/getAssistantItems', checkToken(),  controller.train.assist.getAssistantItems);


//   //检查——添加辅助依据（辅助检查结果）
//   newRouter.post('/train/addAssistantBasis', checkToken(),  controller.train.assist.addAssistantBasis);
//   //查询辅助检查选项
//   newRouter.get('/train/getAssists', checkToken(), controller.train.assist.getAssists);

//   //学生解答
//   newRouter.post('/train/addStudentDecode', checkToken(),  controller.train.train.addStudentDecode);

//   //诊断分析，获取记录
//   newRouter.get('/train/getAnalysis', checkToken(), controller.train.train.getAnalysis);

//   //选择处置病人方式
//   newRouter.post('/train/chooseHandleWay', checkToken(),  controller.train.handle.chooseHandleWay);
//   //查询当前病例处置方式
//   newRouter.get('/train/getHandleWay', checkToken(),  controller.train.handle.getHandleWay);
//   // //查询护理方式
//   // newRouter.get('/train/getNursingRoutine', checkToken(), controller.train.train.getNursingRoutine);
//   // //获取西药
//   // newRouter.get('/train/getWesternMedicine', checkToken(), controller.train.train.getWesternMedicine);
//   // //获取中药
//   // newRouter.get('/train/getChineseMedicine', checkToken(), controller.train.train.getChineseMedicine);
//   newRouter.get('/train/getTreatment', checkToken(), controller.train.handle.getTreatment);

//   //添加护理方案
//   newRouter.post('/train/addNursePlan', checkToken(),  controller.train.handle.addNursePlan);
//   //查询护理方案
//   newRouter.get('/train/getNursePlan', checkToken(), controller.train.handle.getNursePlan);
//   //删除护理方案
//   newRouter.post('/train/delNursePlan', checkToken(),  controller.train.handle.delNursePlan);
//   //修改护理方案
//   newRouter.post('/train/updateNursePlan', checkToken(),  controller.train.handle.updateNursePlan);

//   //添加治疗方案
//   newRouter.post('/train/addTreatPlan', checkToken(),  controller.train.handle.addTreatPlan);
//   //查询治疗方案
//   newRouter.get('/train/getTreatPlan', checkToken(), controller.train.handle.getTreatPlan);
//   //删除治疗方案
//   newRouter.post('/train/delTreatPlan', checkToken(),  controller.train.handle.delTreatPlan);
//   //修改治疗方案
//   newRouter.post('/train/updateTreatPlan', checkToken(),  controller.train.handle.updateTreatPlan);

//   //获取体格检查工具列表
//   newRouter.get('/train/getPhysicalExaminationTool', checkToken(), controller.train.physique.getPhysicalExaminationTool);
//   //体格检查分类
//   newRouter.get('/train/getPhysicalExaminationCategory', checkToken(), controller.train.physique.getPhysicalExaminationCategory);
//   //获取病例中体格检查工具可用体位
//   newRouter.get('/train/getPhysicalExaminationToolPosition', checkToken(),  controller.train.physique.getPhysicalExaminationToolPosition);
//   //体格检查工具对应部位
//   newRouter.get('/train/getPhysicalExaminationToolRegion', checkToken(),  controller.train.physique.getPhysicalExaminationToolRegion);
//   //获取体格检查结果
//   newRouter.get('/train/getPhysicalExaminationResult', checkToken(),  controller.train.physique.getPhysicalExaminationResult);

//   //获取客观题
//   newRouter.get('/train/getObjectivetest', checkToken(), controller.train.exam.getObjectivetest);
//   //保存客观题作答结果
//   newRouter.post('/train/saveObjectivetest', checkToken(),  controller.train.exam.saveObjectivetest);

//   //获取成绩
//   newRouter.get('/train/getScore', checkToken(), controller.train.score.getScore);

//   //各病症诊断总数量比
//   newRouter.get('/train/getTotalDiagnose', checkToken(), controller.train.train.getTotalDiagnose);
//   // //各症状治疗产生的费用比
//   // newRouter.get('/train/getScore', checkToken(), controller.train.train.getScore);

//   // //练习成绩查询结果
//   // newRouter.get('/train/getScore', checkToken(), controller.train.getScore);
//   // //最近一季度的成绩
//   // newRouter.get('/train/getScore', checkToken(), controller.train.getScore);



// }
