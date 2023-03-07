const sc = require('smartacjs');
const app=sc.app();
const db = app.db;

/**
 * 补货单列表
 * */
exports.getList = (pageSize,pageIndex,merchant_id,equipment_id,merchant_list) => {
  let options = {
    pageSize,
    pageIndex
  };
  let sql = ` SELECT xer.innerid,xer.merchant_id, xer.equipment_id, xer.replenish_no, xer.op_time, xer.op_account_id, xe.name AS device_name, xa.name AS op_name
              FROM xy_equipment_replenish xer
              LEFT JOIN xy_equipment xe ON xe.innerid = xer.equipment_id
              LEFT JOIN xy_account xa ON xa.innerid = xer.op_account_id WHERE xer.isdeleted = 0 AND xer.merchant_id IN (${merchant_list}) `;

  if(merchant_id){
    sql += ` AND xer.merchant_id = '${merchant_id}' `;
  }
  if(equipment_id){
    sql += ` AND xer.equipment_id = '${equipment_id}' `;
  }
  sql += ` ORDER BY xer.created_time DESC ` ;
  return db.getPage(sql,options);
}

/**
 * 补货单列表
 * */
exports.detail = (replenish_id) => {

  let sql = ` SELECT xerd.innerid, xerd.replenish_id, xerd.slot_no, xerd.merchant_product_id, xerd.real_stock, xerd.actual_number, xp.name AS product_name, xmp.product_no
              FROM xy_equipment_replenish_detail xerd
              LEFT JOIN xy_merchant_product xmp ON xmp.innerid = xerd.merchant_product_id
              LEFT JOIN xy_product xp ON xp.innerid = xmp.product_id 
              WHERE xerd.isdeleted = 0 AND xerd.replenish_id = '${replenish_id}' ORDER BY xerd.created_time DESC`;

  return db.execute(sql);
}