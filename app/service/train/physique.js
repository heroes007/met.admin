
"use strict";
/**
 *
 * @author fuzemeng
 * @date 2018/11/20
 */
const Service = require('egg').Service;

class PhysiqueService extends Service {

  constructor(param) {
    super(param);
    this.mysql = this.app.database.object_mysql;
    this.resMsg = this.ctx.resMsg;
    this.moment = this.ctx.helper.moment;
    this.enumResType = this.ctx.enumResType;
  }


  async getPhysicalExaminationTool() {
    const { resMsg, mysql, service } = this;
    // const result = await mysql.select('physical_examination_tool');
    const sql = ` select * from  physical_examination_tool where  image_file is not null and image_file<>''`;
    console.log(sql)
    const result = await mysql.query(sql);
    return resMsg.newOk('查询成功', result);

  }

  async getPhysicalExaminationCategory() {
    const { resMsg, mysql, service } = this;
    // const sql = ` select * from physical_examination_category where parent_id=0 and img_url is not null and img_url<>''`
    //const result = await mysql.select('physical_examination_category', {where:{parent_id:0}});
    const sql = `SELECT
                     * 
                  FROM
                    physical_examination_category 
                  WHERE
                    img_url <> '' 
                    AND img_url IS NOT NULL 
                    AND parent_id IN ( SELECT id FROM physical_examination_category WHERE parent_id = 0 )     `
                    //此处仍不完善，需要后期根据业务调节
    
    const result = await mysql.query(sql);
    return resMsg.newOk('查询成功', result);

  }

  async getPhysicalExaminationToolPosition(tool_id) {
    const { resMsg, mysql, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const result = await mysql.select('physical_examination_tool_position', { where: { case_id: diagnosiState.case_id, tool_id: tool_id } });
    return resMsg.newOk('查询成功', result);
  }


  async getPhysicalExaminationToolRegion(param) {
    const { resMsg, mysql, service } = this;
    const sql = ` SELECT
                    * 
                  FROM
                    physical_examination_tool_region p1 
                  WHERE
                    p1.tool_id = ${param.tool_id} and p1.category_id=${param.category_id} `
    // AND p1.category_id IN ( SELECT id category_id FROM physical_examination_category WHERE parent_id = ${param.category_id} ) `
    // const opt = {};
    //if (param.tool_id) opt.tool_id = param.tool_id;
    //if (param.category_id) opt.category_id = param.category_id;

    //const result = await mysql.select('physical_examination_tool_region', { where: opt });
    const result = await mysql.query(sql);
    return resMsg.newOk('查询成功', result);

  }

  async getPhysicalExaminationResult(param) {
    const { resMsg, mysql, moment, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const result = await mysql.select('case_physical_examination_result',
      {
        where: {
          case_id: diagnosiState.case_id,
          tool_region_id: param.tool_region_id
        }
      });
    if (result.length === 0) return resMsg.newOk('查询成功', result);
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    for (const iterator of result) {
      iterator.name = param.name;
      iterator.category_name = param.category_name;
      const opt = {
        // user_id: diagnosiState.user_id,
        // case_id: diagnosiState.case_id,
        case_diagnosis_id: diagnosiState.id,
        type: 2,
        content: JSON.stringify(iterator),
        create_time: now,
        last_time: now,
      }
      const result = await mysql.insert('lx_case_basis', opt);
      if (result.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '生成失败');
      iterator.name = param.name;
      const historyOpt = {
        // user_id: diagnosiState.user_id,
        // case_id: diagnosiState.case_id,
        case_diagnosis_id: diagnosiState.id,
        type: `体格检查`,
        type_child: param.category_name,
        content: JSON.stringify(iterator),
        create_time: now
      }
      await mysql.insert('lx_case_history', historyOpt);
    }
    return resMsg.newOk('查询成功', result);
  }
}

module.exports = PhysiqueService;