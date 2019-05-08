"use strict";
/**
 *
 * @author fuzemeng
 * @date 2018/11/20
 */
const Service = require('egg').Service;

class TrainService extends Service {

  constructor(param) {
    super(param);
    this.mysql = this.app.database.object_mysql;
    this.resMsg = this.ctx.resMsg;
    this.moment = this.ctx.helper.moment;
    this.CASE_HISTORY_TYPE = {
      0: '接诊',
      1: '问诊',
      2: '拟诊',
      3: '体格检查',
      4: '辅助检查',
      5: '诊断分析',
    };
    this.CASE_HISTORY_OPERATE = {
      'DELETE': '删除',
      'ADD': '增加',
      'UPDATE': '修改'
    };
    this.enumResType = this.ctx.enumResType;
  }

  async checkMark(mark) {
    const { mysql, resMsg, enumResType, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const operate_state = diagnosiState.operate_state;
    if (mark - operate_state > 1 || mark < operate_state) return resMsg.newError(enumResType.err_illegal_operate[0], enumResType.err_illegal_operate[1]);
    //if (mark <= operate_state) return resMsg.newOk();
    const opt = {
      id: diagnosiState.id,
      operate_state: mark
    }
    const result = await mysql.update('lx_case_diagnosis_state', opt);
    if (result.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '下一步的请求处理失败');
    return resMsg.newOk('请求通过');
  }


  async getCases(param) {
    const { mysql, resMsg, ctx, service } = this;
    //调用远程数据库，获取病例
    let sql = ` select * from ${'`case`'} where 1=1 `;
    //难易程度
    if (param.degree) sql += ` and degree=${param.degree} `;
    //病例／症状
    if (param.name_symptom) {
      const name_symptoms = JSON.parse(param.name_symptom);
      if(name_symptoms.length > 0){
        let sql_symp = ``;
        for (const iterator of name_symptoms) {
          sql_symp += ` name like '%${iterator}%' or symptom like '%${iterator}%' or`;
        }
        if(sql_symp.length > 0) sql += ` and (${sql_symp.substring(0,sql_symp.length - 2)}) `;
      }
      
    }
    //科别
    if (param.patient_division) sql += ` and patient_division like '%${param.patient_division}%' `;
    //性别
    if (param.patient_gender) sql += ` and patient_gender='${param.patient_gender}' `;
    //年龄（多选）
    if (param.ages) {
      let sqlAge = '';
      let ages = JSON.parse(param.ages);
      for (const iterator of ages) {
        sqlAge += ` (patient_age_sort>=${iterator.start_age} and patient_age_sort<=${iterator.end_age}) or `;
      }
      if (sqlAge.length > 0) {
        sqlAge = sqlAge.substring(0, sqlAge.length - 4);
        sql += ` and (${sqlAge}) `
      }
    }
    //获取总数
    const countRet = await mysql.query(sql);
    const count = countRet.length;
    const pageNum = (param.page_num - 1) * param.page_size;
    sql += ` limit ${pageNum}, ${param.page_size} `;
    console.log(sql)
    //暂时使用本项目临时病例库
    let cases = await mysql.query(sql);
    if (cases.length <= 0) { return resMsg.newOk('查询成功', { count: count, list: [] }); }
    //调用本项目数据库，获取个人练习病例状态库
    sql = ` select * from lx_case_diagnosis_state where user_id=${param.user_id} and diagnosis_state in (-2,1) and type=0`;
    const casesForUser = await mysql.query(sql);
    // 库中无用户练习数据，直接返回病例数据
    // if (casesForUser.length <= 0) { return resMsg.newOk('查询成功', { count: count, list: cases }); }
    for (let caseOne of cases) {
      if (casesForUser.length > 0) {
        for (const iterator of casesForUser) {
          //-1已结束 0未进行 1进行中      
          if (iterator.case_id === caseOne.id) caseOne.state = 1//iterator.diagnosis_state
          // iterator.case_id === caseOne.id ? caseOne.state = iterator.diagnosis_state : caseOne.state = 0;
          // caseOne.case_date = moment(caseOne.case_date).format('YYYY/MM/DD HH:mm:ss');
          // caseOne.add_time = moment(caseOne.add_time).format('YYYY/MM/DD HH:mm:ss');
          // caseOne.lase_time = moment(caseOne.lase_time).format('YYYY/MM/DD HH:mm:ss');

        }
        if (!caseOne.state) caseOne.state = 0;
      } else {
        caseOne.state = 0;
      }
    }
    cases = await ctx.helper.dateFormat(cases, ['case_date', 'add_time', 'lase_time'], 'YYYY/MM/DD HH:mm:ss');
    return resMsg.newOk('查询成功', { count: count, list: cases });
  }
  async getCaseKeys(param) {
    const { mysql, resMsg, ctx, service } = this;
    //调用远程数据库，获取病例
    let sql = ` select symptom from ${'`case`'} where 1=1 `;
    //病例／症状
    if (param.name_symptom) sql += ` and symptom like '%${param.name_symptom}%' group by symptom`;
    let symptoms = await mysql.query(sql);

    return resMsg.newOk('查询成功', symptoms);
  }


  async insertCaseDiagnosisState(param) {
    const { mysql, resMsg, moment, CASE_HISTORY_TYPE, CASE_HISTORY_OPERATE, enumResType, service } = this;
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    delete param.token;
    param.create_time = now;
    param.last_time = now;
    param.diagnosis_state = 1; //默认创建时候为1；
    //检查是否已经存在此病例，已经结束的不算
    let opt = {
      user_id: param.user_id,
      diagnosis_state: 1,
      type: param.type
    }
    //将其他正在进行的病例进入暂停状态
    const stopRet = await mysql.select('lx_case_diagnosis_state', { where: opt });
    if (stopRet.length > 0) {
      for (const iterator of stopRet) {
        const updateOpt = {
          id: iterator.id,
          diagnosis_state: -2
        }
        await mysql.update('lx_case_diagnosis_state', updateOpt)
      }
    }
    //将此病例的其他未完成记录设置为已废弃
    const sql = `select * from lx_case_diagnosis_state 
    where user_id=${param.user_id} 
    and diagnosis_state not in (-1,-3)
    and case_id=${param.case_id}
    and  type=${param.type}
    `
    const otherRet = await mysql.query(sql);
    if (otherRet.length > 0) {
      for (const iterator of otherRet) {
        const updateOpt = {
          id: iterator.id,
          diagnosis_state: -3
        }
        await mysql.update('lx_case_diagnosis_state', updateOpt)
      }
    }
    opt.case_id = param.case_id;
    const results = await mysql.get('lx_case_diagnosis_state', opt);
    if (results) { return resMsg.newError(enumResType.err_repeat_data[0], '此病例尚有未完成的练习'); }
    //新增一条新的病例诊断
    let result = await mysql.insert('lx_case_diagnosis_state', param);
    if (result.affectedRows < 0) { return resMsg.newError(enumResType.err_operate_sql[0], '处理异常'); }
    //增加一条历史记录
    const caseStates = await mysql.select('lx_case_diagnosis_state', { where: opt });
    const cases = await mysql.select('case', { where: { id: param.case_id } });
    const caseOne = cases[0];
    const caseState = caseStates[0];
    opt = {
      // user_id: param.user_id,
      // case_id: param.case_id,
      case_diagnosis_id: caseState.id,
      type: CASE_HISTORY_TYPE['0'],
      state: CASE_HISTORY_OPERATE['ADD'],
      content: JSON.stringify(caseOne),
      create_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    result = await mysql.insert('lx_case_history', opt);
    if (result.affectedRows < 0) { return resMsg.newError(enumResType.err_operate_sql[0], '处理异常'); }
    return resMsg.newOk();
  }
  async continueTrain(param) {
    const { ctx, mysql, resMsg, enumResType, service } = this;

    let opt = {
      user_id: ctx.__token_info.data.id,
      diagnosis_state: 1
    }
    //将其他正在进行的病例进入暂停状态
    const stopRet = await mysql.select('lx_case_diagnosis_state', { where: opt });
    if (stopRet.length > 0) {
      // for (const iterator of stopRet) {
      //   const updateOpt = {
      //     id: iterator.id,
      //     diagnosis_state: -2
      //   }
      //   await mysql.update('case_diagnosis_state', updateOpt)
      // }
      for (let i = 0, len = stopRet.length - 1; i < len; i++) {
        if (i < len) {
          const iterator = stopRet[i];
          const updateOpt = {
            id: iterator.id,
            diagnosis_state: -2
          }
          await mysql.update('lx_case_diagnosis_state', updateOpt)
        }
      }
    }
    // opt.diagnosis_state = [1, 2];
    // opt.diagnosis_state = 1;
    // opt.case_id = case_id;
    // delete opt.id;
    // const result = await mysql.get('lx_case_diagnosis_state', opt);
        //检查是否已经存在此病例暂停或者未结束的，已经结束的不算
    let sql = ` select * from lx_case_diagnosis_state where user_id=${ctx.__token_info.data.id} and case_id=${param.case_id} and diagnosis_state not in (-3, -1) and type=${param.type}`
    const hasCases = await mysql.query(sql);
    if(hasCases.length > 1) return resMsg.newError(enumResType.err_repeat_data[0], '数据错误，请联系管理员');//这种问题，是因为不明原因导致库里存在重复的垃圾数据，状态只可能为-2，1
    if (hasCases.length === 0) return resMsg.newError(enumResType.err_no_data[0], '没有此病例练习的记录');
    //if (result.diagnosis_state > 1) await mysql.update('lx_case_diagnosis_state', { id: result.id, diagnosis_state: 1 });
    if (hasCases.length === 1){
      const elementCase = hasCases[0];
      if (elementCase.diagnosis_state === -2) await mysql.update('lx_case_diagnosis_state', { id: elementCase.id, diagnosis_state: 1 });
    }
    return resMsg.newOk('操作成功', hasCases);
  }

  async getCaseOperate(case_id) {
    const { resMsg, enumResType, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    if (!diagnosiState) return resMsg.newError(enumResType.err_no_data[0], '没有查询到病例进度');
    if (diagnosiState.case_id != case_id) return resMsg.newError(enumResType.err_no_data[0], '无次病例操作信息');
    return resMsg.newOk('查询成功', { operate_state: diagnosiState.operate_state });
  }


  async reStartTrain(param) {
    const { ctx, mysql, resMsg, enumResType, service } = this;
    const opt = {
      user_id: ctx.__token_info.data.id,
      case_id: param.case_id,
      diagnosis_state: 1,
      type:param.type
    }
    const result = await mysql.get('lx_case_diagnosis_state', opt);
    // if (!result) return resMsg.newError(enumResType.err_no_data[0], '没有此病例练习的记录');
    if (result) {
      const updateOpt = {
        id: result.id,
        diagnosis_state: -1
      }
      const updateStateResult = await mysql.update('lx_case_diagnosis_state', updateOpt);
      if (updateStateResult.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql, '操作失败');
    }
    const addStateOpt = {
      user_id: ctx.__token_info.data.id,
      case_id: param.case_id,
      type:param.type
    }
    await this.insertCaseDiagnosisState(addStateOpt);
    return resMsg.newOk();
  }


  async getIquiryByKeyword(keyword) {
    const { mysql, resMsg, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    if (!diagnosiState) return resMsg.newOk('查询成功', []);
    const sql = ` select * from icd10 where name like '%${keyword}%' or name_pinyin like '%${keyword.toUpperCase()}%' `;// and case_id=${diagnosiState.case_id} `;
    const results = await mysql.query(sql);
    return resMsg.newOk('查询成功', results);
  }

  async insertQuasiDiagnosis(diagnosisArray) {//此处暂定为传递空数组为全部删除
    const { ctx, mysql, resMsg, moment, CASE_HISTORY_TYPE, enumResType, service } = this;
    diagnosisArray = JSON.parse(diagnosisArray);
    const diagnosiState = await service.common.common.getdiagnosiState();
    //先查询到所有此病例当先练习的拟诊数据
    const oldRet = await mysql.select('lx_case_quasi_diagnosis', { where: { case_diagnosis_id: diagnosiState.id } });
    // if (oldRet.length < 0) return resMsg.newError(enumResType.err_no_data[0], '修改数据操作失败');
    //删除所有库中当前练习病例的拟诊
    if (oldRet.length > 0) await mysql.delete('lx_case_quasi_diagnosis', { case_diagnosis_id: diagnosiState.id });
    //比较原始和现在的数据的变动情况，写在操作记录中
    const nowRet = await mysql.select('lx_case_quasi_diagnosis', { where: { case_diagnosis_id: diagnosiState.id } });
    const result = ctx.helper.getChangeArray(oldRet, nowRet, 'case_diagnosis_name', 'operate', '添加拟诊', '修改拟诊', '删除拟诊', ['id', 'basis', 'create_time', 'last_time']);

    //插入传递过来的diagnosisArray中的拟诊数据
    if (diagnosisArray.length > 0) {
      for (const ite of diagnosisArray) {
        const now = moment().format('YYYY-MM-DD HH:mm:ss');
        const insertOpt = {
          // user_id: ctx.__token_info.data.id,//'用户编号',
          // case_id: diagnosiState.case_id,//'//病例编号',
          case_diagnosis_id: diagnosiState.id,//'//case_diagnosis_state的编号',
          case_type_id: ite.case_type_id,//'来自case_diagnose（诊断类型编号',
          case_diagnosis_name: ite.case_diagnosis_name,//'诊断名称',
          type: ite.type,//'1.主要诊断 2.次要诊断 3鉴别诊断 4未诊断',
          basis: ite.basis,
          create_time: now,
          last_time: now
        }
        await mysql.insert('lx_case_quasi_diagnosis', insertOpt);
      }

      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      const historyOpt = {
        // user_id: ctx.__token_info.data.id,
        // case_id: diagnosiState.case_id,
        case_diagnosis_id: diagnosiState.id,
        type: CASE_HISTORY_TYPE['2'],
        content: JSON.stringify(result),
        create_time: now
      }
      await mysql.insert('lx_case_history', historyOpt);
      return resMsg.newOk();
    } else {
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      const historyOpt = {
        // user_id: ctx.__token_info.data.id,
        // case_id: diagnosiState.case_id,
        case_diagnosis_id: diagnosiState.id,
        type: CASE_HISTORY_TYPE['2'],
        content: JSON.stringify(result),
        create_time: now
      }
      await mysql.insert('lx_case_history', historyOpt);
      return resMsg.newOk();
    }
  }


  async getQuasiDiagnosis() {
    const { ctx, mysql, resMsg, service } = this;
    const user_id = ctx.__token_info.data.id;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const opt = {
      // user_id: user_id,
      // case_id: diagnosiState.case_id,
      case_diagnosis_id: diagnosiState.id,
    }
    const results = await mysql.select('lx_case_quasi_diagnosis', { where: opt });
    return resMsg.newOk('查询成功', results);
  }

  async getBasis(keyword) {
    const { ctx, mysql, resMsg, service } = this;
    const user_id = ctx.__token_info.data.id;
    const diagnosiState = await service.common.common.getdiagnosiState();

    let sql = ` select * from lx_case_basis where case_diagnosis_id=${diagnosiState.id} `;
    if (keyword) sql += ` 
              and content like '%${keyword}%' `;
    const results = await mysql.query(sql);
    return resMsg.newOk('查询成功', results);
  }
  async addBasis(param) {
    const { ctx, mysql, resMsg, moment, CASE_HISTORY_TYPE, enumResType, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    //查询老数据
    const oldRet = await mysql.get('lx_case_quasi_diagnosis', { case_diagnosis_id: diagnosiState.id, case_diagnosis_name: param.case_diagnosis_name });

    //覆盖老数据
    const case_diagnosis_name = param.case_diagnosis_name;
    const quasi_diagnosis_id = param.quasi_diagnosis_id;
    // const operate = param.operate;
    const basisArray = param.basis_array;
    const basisArrayStr = JSON.stringify(basisArray);
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const opt = {
      id: quasi_diagnosis_id,
      basis: basisArrayStr,
      last_time: now
    }
    const coverRet = await mysql.update('lx_case_quasi_diagnosis', opt);
    if (coverRet.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '添加依据失败');
    //操作记录
    const oldStr = oldRet.basis;
    const oldArray = oldStr != null ? JSON.parse(oldStr) : [];

    const newArrayAdd = await ctx.helper.getAddByNoPrimaryKey(oldArray, basisArray, 'id', 'operate', '添加依据');
    const newArrayDel = await ctx.helper.getDel(oldArray, basisArray, 'id', 'operate', '删除依据');
    const newArrayUpdate =await ctx.helper.getModify(oldArray, basisArray, 'id', 'operate', '修改依据', false);
    const user_id = ctx.__token_info.data.id;
    const content = [];
    if (newArrayAdd.length > 0) {
      content.push({
        type: '添加依据',
        arr: JSON.stringify(newArrayAdd)
      });
    }
    if (newArrayDel.length > 0) {
      content.push({
        type: '删除依据',
        arr: JSON.stringify(newArrayDel)
      });
    }
    if (newArrayUpdate.length > 0) {
      content.push({
        type: '修改依据',
        arr: JSON.stringify(newArrayUpdate)
      });
    }
    const historyOpt = {
      // user_id: user_id,
      // case_id: diagnosiState.case_id,
      case_diagnosis_id: diagnosiState.id,
      type: '依据',
      type_child: case_diagnosis_name,
      content: JSON.stringify(content),
      create_time: now
    }
    await mysql.insert('lx_case_history', historyOpt);
    return resMsg.newOk()
  }

  async getHistory() {
    const { ctx, mysql, resMsg, service } = this;
    const user_id = ctx.__token_info.data.id;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const historyOpt = {
      // user_id: user_id,
      // case_id: diagnosiState.case_id,
      case_diagnosis_id: diagnosiState.id
    }
    let results = await mysql.select('lx_case_history', { where: historyOpt });
    results = await ctx.helper.dateFormat(results, ['create_time'], 'YYYY/MM/DD HH:mm:ss');
    return resMsg.newOk('查询成功', results);
  }


  async addStudentDecode(param) {
    const { ctx, mysql, resMsg, moment, enumResType, service } = this;
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const user_id = ctx.__token_info.data.id;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const historyOpt = {
      // user_id: user_id,
      // case_id: diagnosiState.case_id,
      case_diagnosis_id: diagnosiState.id,
      type: param.type,
      // type_child:iterator.name,
      content: JSON.stringify(param.decode),
      create_time: now
    }
    let result = await mysql.insert('lx_case_history', historyOpt);
    if (result.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '添加解读失败');
    let decodes = ['问诊解答', '体格检查解答', '辅助检查解答', '诊断分析解答'];
    if(param.type === '体格检查解读') {
      historyOpt.type = 2;
    }else{
      if (decodes.indexOf(param.type) === -1) return resMsg.newError(enumResType.err_operate_sql[0], '添加解读失败');
      historyOpt.type = decodes.indexOf(param.type) + 1;
    }
    if (param.child_id) historyOpt.child_id = param.child_id;
    result = await mysql.insert('lx_case_diagnosis_unscramble', historyOpt);
    return resMsg.newOk();
  }
  async getPhyExamCategory(param) {
    const { ctx, mysql, resMsg } = this;
    let sql = ` select * from physical_examination_category where 1=1 `;
    if (param.parent_id) {
      sql += ` and parent_id=${param.parent_id} `
    } else {
      sql += ` and parent_id=0 `
    }
    const result = await mysql.query(sql);
    return resMsg.newOk('查询成功', result);
  }
  async getPhyExamRegion(param) {
    const { ctx, mysql, resMsg } = this;
    let sql = ` select * from physical_examination_tool_region where 1=1 `;
    if (param.category_id) {
      sql += ` and category_id=${param.category_id} `
    }
    if (param.tool_id) {
      sql += ` and tool_id=${param.tool_id} `
    }
    const result = await mysql.query(sql);
    return resMsg.newOk('查询成功', result);
  }

  async getStudentDecode(param) {
    const { ctx, mysql, resMsg, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    console.log(diagnosiState)
    let sql = ` select * from lx_case_diagnosis_unscramble where case_diagnosis_id=${diagnosiState.id} and child_id=${param.child_id} `;
    const result = await mysql.query(sql);
    return resMsg.newOk('查询成功', result);
  }
  async getAnalysis() {
    const { ctx, mysql, resMsg, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const opt = {
      // user_id: ctx.__token_info.data.id,
      // case_id: diagnosiState.case_id,
      case_diagnosis_id: diagnosiState.id
    }
    let results = await mysql.select('lx_case_history', { where: opt });
    if (results.length > 0) {
      results = await ctx.helper.dateFormat(results, ['create_time'], 'YYYY/MM/DD HH:mm:ss');
    }
    return resMsg.newOk('查询成功', results);
  }
  // async dateFormat(array, key){
  //   const {moment, service } = this;
  //   for (const iterator of array) {
  //     iterator[key] = moment(iterator[key]).format('YYYY/MM/DD HH:mm:ss')
  //   }
  //   return array;
  // }



  async getTotalDiagnose() {
    const { mysql, resMsg, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const sql = ` SELECT
                c.id,
                c.name,
                cc.count 
              FROM
                ${'`case`'} c,
                (
                SELECT
                  case_id,
                  COUNT( * ) count 
                FROM
                lx_case_diagnosis_state 
                WHERE
                  user_id = ${diagnosiState.user_id}
                  AND diagnosis_state is not null
                GROUP BY
                  case_id 
                ) cc 
              WHERE
                c.id = cc.case_id `
    const results = await mysql.query(sql);
    console.log(sql)
    return resMsg.newOk('查询成功', results);
  }

  
  async updateAction(param) {
    const { mysql, resMsg, service } = this;
    const sql = ` update lx_user_info set action=${param.action} where id=${param.user_id}`;
    await mysql.query(sql);
    return; 
  }

  async getCaseDiagnoseResult(){
    const { mysql, resMsg, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const result = {
      talk:0,
      physique:0,
      assist:0,
      handle:0,
    }
    let sql = ` select type,count(*) count from lx_case_basis where case_diagnosis_id=${diagnosiState.id} group by type`;
    const result_diagnoses = await mysql.query(sql);
    if(result_diagnoses.length > 0){
      for (const iterator of result_diagnoses) {
        if(iterator.type===1) result.talk = iterator.count;
        if(iterator.type===2) result.physique = iterator.count;
        if(iterator.type===3) result.assist = iterator.count;
      }
    }
    let handle_sum = 0;
    sql = `select count(*) count from lx_patient_nurse_plan where case_diagnosis_id=${diagnosiState.id}`;
    const nurse_plans = await mysql.query(sql);
    if(nurse_plans.length > 0) handle_sum += nurse_plans[0].count;
    sql = `select count(*) count from lx_patient_handle_plan where case_diagnosis_id=${diagnosiState.id}`;
    const handle_plans = await mysql.query(sql);
    if(handle_plans.length > 0) handle_sum += handle_plans[0].count;
    result.handle = handle_sum;
    return resMsg.newOk('查询成功', result);
  }

}

module.exports = TrainService;