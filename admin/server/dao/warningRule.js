const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取商户预警配置列表
 * */
exports.getWarningRuleList = (pageSize, pageIndex, merchant_list, merchant_id) => {
  let options = {
    pageSize,
    pageIndex
  };
  let sql = `SELECT mw.innerid,mw.config,mw.remark,mw.type,mw.name,m.fullname AS merchant_name
             FROM xy_warning_rule AS mw
             LEFT JOIN xy_merchant m ON mw.merchant_id = m.innerid
             WHERE mw.merchant_id  in (${merchant_list}) `;
  if (merchant_id) {
    options.merchant_id = merchant_id;
    sql += ` AND mw.merchant_id = @merchant_id@ `;
  }
  sql += ` ORDER BY mw.created_time DESC `;
  return db.getPage(sql, options);
};

/**
 * 新增商户预警配置
 * */
exports.addWarningRule = (body) => {
  let options = {
    innerid: body.innerid,
    name: body.name,
    config: body.config,
    merchant_id: body.merchant_id,
    creater_id: body.creater_id,
    created_time: body.created_time,
    type: body.type,
    status: body.status,
  };
  return db.insert('xy_warning_rule', options);
};

/**
 * 删除商户预警配置
 * @param innerid 商户预警配置id
 * */
exports.delWarningRule = (innerid) => {
  return db.delete('xy_warning_rule', {innerid})
};

/**
 * 获取单个商户预警配置
 * @param innerid 商户预警配置id
 * */
exports.getWarningRuleById = (innerid) => {
  let sql = `SELECT mw.innerid,mw.config,mw.remark,mw.type,mw.name,mw.merchant_id,mw.status
             FROM xy_warning_rule AS mw
             WHERE innerid = @innerid@; `;
  return db.getOne(sql, {innerid});
};

/**
 * 修改商户预警配置
 * */
exports.editWarningRuele = (body) => {
  let options = {
    name: body.name,
    merchant_id: body.merchant_id,
    modified_id: body.modified_id,
    modified_time: body.modified_time,
    type: body.type,
    status: body.status,
    config: body.config
  };
  return db.update('xy_warning_rule', options, {innerid: body.innerid});
};

/**
 * 获取商户下同一预警类型的数据
 * */
exports.getWarningRuleType = (merchant_id, type) => {
  let sql = `SELECT innerid,type,merchant_id,config FROM xy_warning_rule where merchant_id='${merchant_id}' AND type='${type}'`
  return db.execute(sql);
}
