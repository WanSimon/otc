/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app=sc.app();
const db = app.db;

//键值对
exports.getCodeTree = (code) => {
  let sql = `SELECT code, item_key, item_value FROM xy_code WHERE 1=1 `;
  code = String(code);
  const data = {code};
  if(-1 != code.indexOf(',')){
    sql += ` AND code IN (${code}) `;  
  }else{
    sql += ` AND code=@code@ `;
  }
  return db.execute(sql, data);
}