const dao = require('../dao/event');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
  post: {},
  get: {
    '/event/logs': getList,
    '/event/:innerid': getEventById,
  },
  put: {
    '/event/:innerid': handleEvent,
  },
  delete: {}

};

/**
 * 获取商户预警规则列表
 * */
async function getList(ctx) {
  let body = ctx.request.query;
  let limit = body.limit;
  let page = body.page;
  let merchant_id = body.merchant_id;
  let equipment_id = body.equipment_id;
  let status = body.status;
  let period = body.period;
  if (period) period = period.split(",");
  let merchant_list = ctx.user.merchant_list;
  return dao.getList(limit, page, merchant_id, equipment_id, status, period, merchant_list);
}

/**
 * 获取错误事件
 * */
async function getEventById(ctx) {
  let innerid = ctx.params.innerid;
  let log = await dao.getEventById(innerid);
  return log;
}

/**
 * 处理错误事件
 * */
async function handleEvent(ctx) {
  let body = ctx.request.body;
  let innerid = ctx.params.innerid;
  let obj = {};
  obj.resolve_content = body.resolve_content;
  obj.status = body.status;
  return await dao.handleEvent(obj,innerid);
}
