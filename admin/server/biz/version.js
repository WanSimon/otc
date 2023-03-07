/**
 * Created by obel on 2019/12/17.
 */
const dao = require('../dao/version');
const sc = require("smartacjs");
const app = sc.app();
const salt = 'xysz';

exports.routers = {
  post: {
    '/version': addVersion
  },
  get: {
    '/version': getList,
    '/version/key': getVersionKey,
    '/version/:innerid': getVersionById,
  },
  put: {
    '/version/:innerid': updateVersion
  },
  delete: {
    '/version/:innerid': delVersion
  }

};

/**
 * 获取版本列表
 * */
async function getList(ctx) {
  let body = ctx.request.query;
  let limit = body.limit;
  let page = body.page;
  let version_no = body.version_no;
  return dao.getList(limit, page, version_no);
}


/**
 * 获取版本详情
 * */
async function getVersionById(ctx) {
  let innerid = ctx.params.innerid;
  return dao.getVersionById(innerid);
}

/**
 * 获取版本详情
 * */
async function getVersionKey(ctx) {
  let key = ctx.request.query.key;
  let innerid = ctx.request.query.innerid;
  return dao.getVersionKey(key, innerid);
}

/**
 * 新增版本
 * */
async function addVersion(ctx) {
  let body = ctx.request.body;
  let obj = {};
  obj.innerid = sc.guid();
  obj.version_no = body.version_no;
  obj.is_latest = body.is_latest;
  obj.modify_content = body.modify_content;
  obj.previous_version_id = body.previous_version_id;
  obj.compatible_version_id = body.compatible_version_id;
  obj.apk_md5 = body.apk_md5;
  obj.download_url = body.download_url;
  obj.creater_id = ctx.user.innerid;
  obj.created_time = new Date();
  obj.isdeleted = 0;
  if (!obj.version_no) throw app.err.missParameter;
  if (obj.is_latest == 1) {
    let res = await dao.getLatest();
    if (res && res.length > 0) {
      await dao.updateVersion({is_latest:0,innerid:res[0].innerid});
    }
  }
  return dao.addVersion(obj);
}

/**
 * 修改版本
 * */
async function updateVersion(ctx) {
  let body = ctx.request.body;
  let obj = {};
  obj.innerid = body.innerid;
  obj.version_no = body.version_no;
  obj.is_latest = body.is_latest;
  obj.modify_content = body.modify_content;
  obj.previous_version_id = body.previous_version_id;
  obj.compatible_version_id = body.compatible_version_id;
  obj.apk_md5 = body.apk_md5;
  obj.download_url = body.download_url;
  obj.modified_id = ctx.user.innerid;
  obj.modified_time = new Date();
  if (!obj.version_no || !obj.innerid) throw app.err.missParameter;
  if (obj.is_latest == 1) {
    let res = await dao.getLatest(obj.innerid);
    if (res.length > 0) {
      await dao.updateVersion({is_latest:0,innerid:res[0].innerid});
    }
  }
  return await dao.updateVersion(obj);
}

/**
 * 删除版本
 * */
async function delVersion(ctx) {
  let innerid = ctx.params.innerid;
  if (!innerid) throw app.err.missParameter;
  return dao.delVersion(innerid);
}
