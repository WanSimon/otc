const dao = require('../dao/replenish');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
  post: {
  },
  get: {
    '/replenish/list': getList,
    '/replenish/detail': detail,
  },
  put:{
  },
  delete:{
  }   
};

/**
 * 补货单列表
 * */
async function getList(ctx){
  let body = ctx.request.query;
  let limit = body.limit;
  let page = body.page;
  let merchant_id = body.merchant_id;
  let equipment_id = body.equipment_id;
  let merchant_list = ctx.user.merchant_list;
  return dao.getList(limit,page,merchant_id,equipment_id,merchant_list);
}

/**
 * 补货单详情
 * */
async function detail(ctx){
  let replenish_id = ctx.request.query.replenish_id;
  if(!replenish_id)
    throw app.err.missParameter;
  return dao.detail(replenish_id);
}