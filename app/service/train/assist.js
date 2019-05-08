
"use strict";
/**
 *
 * @author fuzemeng
 * @date 2018/11/20
 */
const Service = require('egg').Service;

class AssistService extends Service {

  constructor(param) {
    super(param);
    this.mysql = this.app.database.object_mysql;
    this.resMsg = this.ctx.resMsg;
    this.moment = this.ctx.helper.moment;
    this.enumResType = this.ctx.enumResType;
  }

  async getAssistantCategory(param) {
    const { mysql, resMsg, service } = this;
    // const diagnosiState = await service.common.common.getdiagnosiState();
    let sql = ` select * from assistant_examination_category where 1=1 `;
    sql += param.parent_id ? ` and parent_id=${param.parent_id} and id<>parent_id ` : ` and id=parent_id `;

    const results = await mysql.query(sql);
    return resMsg.newOk('查询成功', results);
  }


  async getAssistantItems(category_id) {
    const { mysql, resMsg, service } = this;
    const results = await mysql.select('assistant_examination_item', { where: { category_id: category_id } });
    return resMsg.newOk('查询成功', results);
  }


  async addAssistantBasis(itemIdsStr) {
    const { ctx, mysql, resMsg, moment, enumResType, service } = this;
    const user_id = ctx.__token_info.data.id;
    const diagnosiState = await service.common.common.getdiagnosiState();
    let sql = ` SELECT
              caer.id caer_id,
              caer.case_id case_id,
              caer.item_id item_id,
              caer.result_report_url result_report_url,
              caerd.id caerd_id,
              caerd.name name,
              caerd.cost cost
            FROM
              case_assistant_examination_result caer,
              case_assistant_examination_result_detail caerd 
            WHERE caer.id = caerd.result_id 
            AND caer.item_id in (${itemIdsStr})
            AND caer.case_id=${diagnosiState.case_id} `
    const results = await mysql.query(sql);
    console.log(sql)

    if (results.length > 0) {
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      for (const iterator of results) {
        const opt = {
          // user_id: user_id,
          // case_id: diagnosiState.case_id,
          case_diagnosis_id: diagnosiState.id,
          type: 3,
          content: JSON.stringify(iterator),
          create_time: now,
          last_time: now,
        }
        const result = await mysql.insert('lx_case_basis', opt);
        if (result.affectedRows < 1) return resMsg.newError(enumResType.err_operate_sql[0], '辅助检查失败');
        const historyOpt = {
          // user_id: user_id,
          // case_id: diagnosiState.case_id,
          case_diagnosis_id: diagnosiState.id,
          type: `辅助检查`,
          type_child: iterator.name,
          content: JSON.stringify(iterator),
          create_time: now
        }
        await mysql.insert('lx_case_history', historyOpt);
      }
      return resMsg.newOk('操作成功', results);
    } else {
      return resMsg.newError(enumResType.err_operate_sql[0], '辅助检查失败');
    }

  }
  async getAssists() {
    const { mysql, resMsg, service } = this;
    const diagnosiState = await service.common.common.getdiagnosiState();
    const opt = {
      case_diagnosis_id: diagnosiState.id,
      type: 3
    };
    const results = await mysql.select('lx_case_basis', { where: opt });
    let returnValue = [];
    if (results.length > 0) {
      for (const iterator of results) {
        returnValue.push(JSON.parse(iterator.content));
      }
    }

    return resMsg.newOk('查询成功', returnValue);
  }

}

module.exports = AssistService;