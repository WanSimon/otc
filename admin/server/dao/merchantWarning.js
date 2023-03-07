const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取商户预警规则列表
 * */
exports.getWarningList = (pageSize,pageIndex,merchant_id,merchant_list)=>{
  let options = {
    pageSize,
    pageIndex
  };
  let sql = `SELECT mw.innerid,mw.config,mw.remark,mw.type,mw.name,m.fullname AS merchant_name
             FROM xy_warning_rule AS mw
             LEFT JOIN xy_merchant m ON mw.merchant_id = m.innerid
             WHERE mw.merchant_id in (${merchant_list}) `;
  if(merchant_id){
    sql += ` AND mw.merchant_id = '${merchant_id}' `;
  }
  return db.getPage(sql,options);
};

/**
 * 根据ID获取商户预警规则
 * */
exports.getWarningId = (innerid)=>{
  let sql = `SELECT mw.innerid,mw.config,mw.remark,mw.type,mw.name,mw.merchant_id,mw.status
             FROM xy_warning_rule AS mw
             WHERE innerid = @innerid@; `;
  return db.getOne(sql,{innerid});
};

/**
 * 删除预警规则
 * */
exports.delWarning = (innerid)=>{
  return db.delete('xy_warning_rule',{innerid})
};

/**
 * 更改预警规则
 * */
exports.updateWarning = async (innerid,obj) => {
  return db.update('xy_warning_rule',obj,{innerid});
}

/**
 * 新增预警规则
 * */
exports.addWarning = async (obj) => {
  return db.insert('xy_warning_rule', obj);
}
