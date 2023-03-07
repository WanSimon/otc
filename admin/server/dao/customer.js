/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app=sc.app();
const db = app.db;

/**
 * 获取会员列表
 * */
exports.getCustomerList = (pageSize,pageIndex,merchant_list,name,phone,merchant_id)=>{
  let options = {
    pageSize,
    pageIndex
  };
  let sql = `SELECT xc.innerid, xc.name, xc.nickname, xc.avatar, xc.sex, xc.birthday, xc.phone, xc.idcard, xc.addr, xc.status, xc.register_from, xm.shortname AS merchant_name
             FROM xy_merchant_customer xmc
             LEFT JOIN xy_customer xc ON xc.innerid = xmc.customer_id
             LEFT JOIN xy_merchant xm ON xmc.merchant_id = xm.innerid
             WHERE xc.is_deleted = 0 AND xmc.is_deleted = 0 AND xmc.merchant_id IN (${merchant_list}) `;
  if(merchant_id){
    sql += ` AND (xmc.merchant_id = '${merchant_id}' ) `;
  }
  if(name){
    sql += ` AND (xc.name LIKE '%${name}%' OR xc.nickname LIKE '%${name}%' )`;
  }
  if(phone){
    sql += ` AND (xc.phone LIKE '%${phone}%' ) `
  }
  return db.getPage(sql,options);
};



