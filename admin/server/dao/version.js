/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app = sc.app();
const db = app.db;


/**
 * 获取版本详情
 * */
exports.getVersionById = (innerid) => {
  let sql = 'SELECT innerid,version_no,is_latest,modify_content,previous_version_id,compatible_version_id,apk_md5,download_url FROM xy_app_version WHERE innerid = @innerid@';
  return db.getOne(sql, {innerid});
};

/**
 * 获取版本列表
 * */
exports.getList = (pageSize, pageIndex, version_no) => {
  let options = {
    pageSize,
    pageIndex
  };
  let sql = `SELECT innerid,version_no,is_latest,modify_content,previous_version_id,compatible_version_id,apk_md5,download_url 
  FROM xy_app_version WHERE isdeleted = 0 `;
  //TODO 搜索条件
  if (version_no) {
    sql += ` AND version_no LIKE '%${version_no}%' `;
  }

  sql += ` ORDER BY created_time DESC `;
  return db.getPage(sql, options);
};

/**
 * 新增版本
 * */
exports.addVersion = async (obj) => {
  return db.insert('xy_app_version', obj);
};

/**
 * 更改版本
 * */
exports.updateVersion = async (obj) => {
  return db.update('xy_app_version', obj, {innerid: obj.innerid});
};

/**
 * 删除版本
 * */
exports.delVersion = (innerid) => {
  return db.update('xy_app_version', {isdeleted: 1}, {innerid});
};


exports.getVersionKey = (key, innerid) => {
  let sql = `SELECT innerid,version_no FROM xy_app_version WHERE isdeleted = 0`;
  if (key) {
    sql += ` AND version_no Like '%${key}%' `
  }
  if (innerid) {
    sql += ` AND innerid != '${innerid}'`;
  }
  sql += ' ORDER BY created_time';
  return db.execute(sql);
};

/**
 * 获取最新版本
 * */
exports.getLatest = (innerid) => {
  let sql = `SELECT innerid,version_no,is_latest,modify_content,previous_version_id,compatible_version_id,apk_md5,download_url 
  FROM xy_app_version WHERE isdeleted = 0  AND is_latest = 1`;

  if (innerid) {
    sql += ` AND innerid != '${innerid}'`;
  }
  return db.execute(sql);
};
