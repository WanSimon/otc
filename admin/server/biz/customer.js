/**
 * Created by obel on 2019/12/17.
 */
const dao = require('../dao/customer');
const sc = require("smartacjs");

exports.routers = {
  post: {
  },
  get: {
    '/customer':getCustomerList,
  },
  put:{
  },
  delete:{

  }

};

/**
 * 获取会员列表
 * */
async function getCustomerList(ctx) {
  let body = ctx.request.query;
  let limit = body.limit;
  let page = body.page;
  let name = body.name;
  let phone = body.phone;
  let merchant_id = body.merchant_id
  let merchant_list = ctx.user.merchant_list;
  return dao.getCustomerList(limit,page,merchant_list,name,phone,merchant_id);
}


