/**
 * Created by obel on 2019/12/17.
 */
const dao = require('../dao/account');
const sc = require("smartacjs");
const app = sc.app();
const salt = 'xysz';

exports.routers = {
  post: {
    '/account':addAccount
  },
  get: {
    '/account':getList,
    '/account/:innerid':getAccountId,
  },
  put:{
    '/account/status/:innerid':updateAccountStatus,
    '/account/:innerid':updateAccount
  },
  delete:{
    '/account/:innerid': delAccount
  }

};

/**
 * 获取账户列表
 * */
async function getList(ctx) {
  let body = ctx.request.query;
  let limit = body.limit;
  let page = body.page;
  let name = body.name;
  let login_id = body.login_id;
  let merchant_id = body.merchant_id;
  let merchant_list = ctx.user.merchant_list;
  return dao.getList(limit,page,name,login_id,merchant_id,merchant_list);
}


/**
 * 获取账户详情
 * */
async function getAccountId(ctx) {
  let innerid = ctx.params.innerid;
  return dao.getAccountId(innerid);
}

/**
 * 更改账户状态
 * */
async function updateAccountStatus(ctx) {
  let innerid = ctx.params.innerid;
  let isvalid = ctx.request.body.isvalid;
  return dao.updateAccountStatus(innerid,isvalid);
}

/**
 * 新增账户
 * */
async function addAccount(ctx) {
  let body = ctx.request.body;
  let obj = {};
  obj.innerid = sc.guid();
  obj.pwd = sc.sha1(`${body.pwd}${salt}`);
  obj.name = body.name;
  obj.mobile = body.mobile;
  obj.merchant_id = body.merchant_id;
  obj.account_role = body.account_role || '';
  obj.login_id = body.mobile;
  obj.idcard = body.idcard;
  obj.email = body.email;
  obj.sex = body.sex;
  obj.remark = body.remark;
  obj.isvalid = body.isvalid;
  obj.head_icon = body.head_icon;
  obj.creater_id = ctx.user.innerid;
  obj.created_time = new Date();
  obj.isdeleted = 0;
  if(!obj.name || !obj.login_id || !obj.merchant_id || !obj.pwd || !obj.account_role || !obj.mobile) throw app.err.missParameter;
  //手机号是否存在
  let isExisted = await dao.isExistedMobile(obj);
  if (isExisted.total > 0) throw app.err.isExisted.msg('该手机号已被使用');
  await dao.addAccount(obj)
  return {}
}

/**
 * 修改账户
 * */
async function updateAccount(ctx) {
  let body = ctx.request.body;
  let obj = {};
  obj.innerid = body.innerid;
  obj.name = ctx.request.body.name;
  obj.merchant_id = body.merchant_id;
  obj.login_id = body.mobile;
  obj.account_role = body.account_role;
  obj.mobile = body.mobile;
  obj.idcard = body.idcard;
  obj.email = body.email;
  obj.sex = body.sex;
  obj.remark = body.remark;
  obj.isvalid = body.isvalid;
  obj.head_icon = body.head_icon;
  if(!obj.name || !obj.login_id || !obj.merchant_id || !obj.account_role || !obj.mobile) throw app.err.missParameter;
  obj.modified_id = ctx.user.innerid;
  //手机号是否存在
  let isExisted = await dao.isExistedMobile(obj);
  if (isExisted.total > 0) throw app.err.isExisted.msg('该手机号已被使用');
  await dao.updateAccount(obj)
  return {}
}

/**
 * 删除账户
 * */
async function delAccount(ctx) {
  let innerid = ctx.params.innerid;
  if (!innerid) throw app.err.missParameter;
  return dao.delAccount(innerid);
}
