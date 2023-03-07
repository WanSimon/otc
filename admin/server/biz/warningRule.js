const dao = require('../dao/warningRule');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
  post: {
    '/warningRule':addWarningRule,
  },
  get: {
    '/warningRule/type':getWarningRuleType,
    '/warningRule/:id':getWarningRuleById,
    '/warningRule':getWarningRuleList,
  },
  put:{
    '/warningRule':editWarningRuele
  },
  delete:{
    '/warningRule/:id':delWarningRule
  }
};

/**
 * 获取商户预警配置列表
 * */
async function getWarningRuleList(ctx) {
  let body = ctx.request.query;
  let merchant_id = body.merchant_id;
  let limit = body.limit;
  let page = body.page;
  let merchant_list = ctx.user.merchant_list;
  return dao.getWarningRuleList(limit, page,merchant_list,merchant_id);
}

/**
 * 新增商户预警配置
 * */
async function addWarningRule(ctx) {
  let merchant_id = ctx.request.body.merchant_id;
  let name = ctx.request.body.name;
  let type = ctx.request.body.type;
  let status = ctx.request.body.status;
  let config = ctx.request.body.conf;
  if(!merchant_id ||!name ||!type)
    throw app.err.missParameter;
  let innerid = sc.guid();
  let body = {
    innerid,
    merchant_id,
    config,
    name,
    type,
    status,
    creater_id:ctx.user.innerid,
    created_time:new Date()
  };
  await dao.addWarningRule(body);
}

/**
 * 删除商户预警配置
 * */
async function delWarningRule(ctx) {
  let innerid = ctx.params.id;
  if(!innerid)
    throw app.err.missParameter;
  await dao.delWarningRule(innerid);
}

/**
 * 根据ID获取商户预警配置
 * */
async function getWarningRuleById(ctx) {
  let innerid = ctx.params.id;
  return dao.getWarningRuleById(innerid);

}

/**
 * 编辑商户预警配置
 * */
async function editWarningRuele(ctx) {
  let innerid = ctx.request.body.innerid;
  let merchant_id = ctx.request.body.merchant_id;
  let name = ctx.request.body.name;
  let type = ctx.request.body.type;
  let status = ctx.request.body.status;
  let config = ctx.request.body.conf;
  if(!merchant_id ||!name ||!type ||!innerid)
    throw app.err.missParameter;
  let body = {
    innerid,
    merchant_id,
    name,
    type,
    status,
    config,
    modified_id:ctx.user.innerid,
    modified_time:new Date()
  };
  await dao.editWarningRuele(body);
}


/**
 * 获取商户下同一预警类型的数据
 * */
async function getWarningRuleType(ctx) {
  let body = ctx.request.query;
  let merchant_id = body.merchant_id;
  let type = body.type;
  return dao.getWarningRuleType(merchant_id,type);
}
