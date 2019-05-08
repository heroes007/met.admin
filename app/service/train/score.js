
"use strict";
/**
 *
 * @author fuzemeng
 * @date 2018/11/20
 */
const Service = require('egg').Service;

class ScoreService extends Service {

  constructor(param) {
    super(param);
    this.mysql = this.app.database.object_mysql;
    this.resMsg = this.ctx.resMsg;
    this.moment = this.ctx.helper.moment;
    this.enumResType = this.ctx.enumResType;
  }
  async getScore(param) {
    const { mysql, ctx } = this;
    let sql = `select * from lx_exam_score where 1=1 `;
    if (param.type) sql += ` and type=${param.type} `;
    //此处筛选条件尚未确定清楚
    console.log(param)
    if (param.case_keyword) sql += ` and case_name like '%${param.case_keyword}%' `;
    if (param.start_time) sql += ` and create_time >= '${param.start_time}' `;
    if (param.end_time) sql += ` and create_time <= '${param.end_time}' `;
    if (param.score) {
      const scores = param.score.split('-');
      if (scores[0]) sql += ` and total_score >= ${Number(scores[0])} `;
      if (scores[1]) sql += ` and total_score <= ${Number(scores[1])} `;
    }
    sql += ` order by create_time desc`;
    console.log(sql)
    let results = await mysql.query(sql);
    if (results.length > 0) results = await ctx.helper.dateFormat(results, ['last_time'], 'YYYY-MM-DD HH:mm:ss')
    return this.resMsg.newOk('查询成功', results);

  }

}

module.exports = ScoreService;