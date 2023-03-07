const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取商户预警规则列表
 * */
exports.getList = (pageSize, pageIndex, merchant_id, equipment_id, status, period, merchant_list) => {
  let options = {
    pageSize,
    pageIndex
  };
  let sql = `SELECT xee.innerid, xee.type , xee.fault_code, xe.merchant_id, xee.equipment_id, xee.content, xee.time,xee.resolve_content,xee.status 
    FROM xy_equipment_event AS xee
    LEFT JOIN xy_equipment AS xe ON xee.equipment_id = xe.innerid
    WHERE 1=1 AND xe.merchant_id in (${merchant_list})`;

  if (merchant_id) {
    sql += ` AND xe.merchant_id = '${merchant_id}' `;
  }
  if (equipment_id) {
    sql += ` AND  xee.equipment_id = '${equipment_id}' `;
  }
  if (status !== "" && status !== undefined) {
    sql += ` AND  xee.status = '${status}' `;
  }
  if (period && Array.isArray(period)) {
    let time1 = `${period[0]}`;
    let time2 = `${period[1]}`;
    sql += ` AND  xee.time >= '${time1}' AND xee.time <= '${time2}'`;
  }
  sql += ` ORDER BY  xee.time DESC `;
  return db.getPage(sql, options);
};


exports.getEventById = (innerid) => {
  let sql = `SELECT xee.innerid, xee.type , xee.fault_code, xe.merchant_id, xee.equipment_id, xee.content, xee.time,xee.resolve_content,xee.status,xe.name as equipment_name 
    FROM xy_equipment_event AS xee
    LEFT JOIN xy_equipment AS xe ON xee.equipment_id = xe.innerid
    WHERE 1=1 AND xee.innerid= @innerid@`;
  return db.getOne(sql, {innerid});
}

/**
 * 处理错误事件
 * */

exports.handleEvent = (obj,innerid) => {
  return db.update('xy_equipment_event', obj, {innerid});
}
