/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app=sc.app();
const db = app.db;
const salt = 'xysz';


/**
 * 用户登录
 * */
exports.userLogin = (name,pwd)=>{
  pwd = sc.sha1(`${pwd}${salt}`);
  let sql = `SELECT t1.innerid,t1.name,t1.login_id,t1.merchant_id,t1.account_role,t1.head_icon,t1.isvalid,t2.parent_id ,t1.pwd
             FROM xy_account AS t1 LEFT JOIN xy_merchant AS t2 ON t1.merchant_id=t2.innerid  
             WHERE t1.isdeleted=0 AND t1.login_id = @name@ AND t1.pwd = @pwd@`;
  return db.execute(sql,{name,pwd});
};

/**
 * 用户登录记录
 * */
exports.loginRecord = (pageSize,pageIndex,merchant_id,equipment_id,merchant_list) => {
  let options = {
    pageSize,
    pageIndex
  };
  let sql = ` SELECT xul.login_time, xul.logout_time, xul.login_type, xe.name AS device_name, xa.name AS op_name 
              FROM xy_user_login xul
              LEFT JOIN xy_equipment xe ON xe.innerid = xul.equipment_id
              LEFT JOIN xy_account xa ON xa.innerid = xul.op_account_id
              WHERE 1=1 AND xe.merchant_id in (${merchant_list}) `;

  if (merchant_id) {
    sql += ` AND xe.merchant_id = '${merchant_id}' `;
  }
  if (equipment_id) {
    sql += ` AND xul.equipment_id = '${equipment_id}' `;
  }

  sql += ` ORDER BY xul.login_time DESC ` ;
  return db.getPage(sql,options);
}



