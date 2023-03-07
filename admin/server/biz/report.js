/**
 * Created by obel on 2019/12/17.
 */
const dao = require('../dao/report');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
  get:{
    '/report/month/summary':getOrderMonthSummaryList
  },
  post: {
    '/report/month/summary/status':updateOrderMonthSummaryStatus
  },


};

/**
 * 获取订单月汇总报表
 * */
async function getOrderMonthSummaryList(ctx) {
  let limit = ctx.request.query.limit;
  let page = ctx.request.query.page;
  let merchant_id = ctx.request.query.merchant_id;
  let status = ctx.request.query.status;
  let summary_date = ctx.request.query.summary_date;
  if (summary_date) summary_date = summary_date.split(",");
  let merchant_list = ctx.user.merchant_list;
  return dao.getOrderMonthSummaryList(limit,page,merchant_list,merchant_id,summary_date,status);
}

/**
 * 更改订单月汇总状态
 * */
async function updateOrderMonthSummaryStatus(ctx) {
  let status = ctx.request.body.status;
  let innerid = ctx.request.body.innerid;
  return dao.updateOrderMonthSummaryStatus(innerid,status);
}
