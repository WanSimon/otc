/**
 * Created by obel on 2019/12/17.
 */
const orderDao = require('../dao/order');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
  get:{
    '/order/detail':getOrderDetailByOrderId,
    '/order/pickupRecord':getOrderPickupRecord
  },
  post: {
    '/order/list':getOrderList,
    '/order/excel/list':getExcelList,
    '/order/refund':orderRefund,
    '/order/partRefund':partRefund
  },


};

/**
 * 获取订单列表
 * */
async function getOrderList(ctx) {
  let limit = ctx.request.body.limit;
  let page = ctx.request.body.page;
  let merchant_id = ctx.request.body.merchant_id;
  let equipment_id = ctx.request.body.equipment_id;
  let serial_no = ctx.request.body.serial_no;
  let pay_status = ctx.request.body.pay_status;
  let order_status = ctx.request.body.order_status;
  let refund_mark = ctx.request.body.refund_mark;
  let source = ctx.request.body.source;
  let source_id = ctx.request.body.source_id;
  let created_time = ctx.request.body.created_time;
  let sort = ctx.request.body.order;
  if (created_time) created_time = created_time.split(",");
  let merchant_list = ctx.user.merchant_list;
  return orderDao.getOrderList(limit,page,sort,merchant_list,merchant_id,equipment_id,serial_no,pay_status,order_status,refund_mark,source,source_id,created_time);
}

/**
 * 获取订单导出列表
 * */
async function getExcelList(ctx) {
  let merchant_id = ctx.request.body.merchant_id;
  let equipment_id = ctx.request.body.equipment_id;
  let serial_no = ctx.request.body.serial_no;
  let pay_status = ctx.request.body.pay_status;
  let order_status = ctx.request.body.order_status;
  let refund_mark = ctx.request.body.refund_mark;
  let source = ctx.request.body.source;
  let source_id = ctx.request.body.source_id;
  let created_time = ctx.request.body.created_time;
  let sort = ctx.request.body.order;
  if (created_time) created_time = created_time.split(",");
  let merchant_list = ctx.user.merchant_list;
  return orderDao.getExcelList(sort,merchant_list,merchant_id,equipment_id,serial_no,pay_status,order_status,refund_mark,source,source_id,created_time);
}

/**
 * 订单退款
 * */
async function orderRefund(ctx) {
  let trade_no = ctx.request.body.trade_no;
  let refund_fee = ctx.request.body.refund_fee;
  let comment = ctx.request.body.comment||'';
  let op_account_id = ctx.user.innerid;
  await app.cloud.refund(op_account_id,trade_no,refund_fee,comment,ctx.user.login_id,ctx.user.pwd);
}

/**
 * 订单部分退款
 * */
async function partRefund(ctx) {
  let order_id = ctx.request.body.order_id;
  let refund_details_list = ctx.request.body.refund_details_list;
  let op_account_id = ctx.user.innerid;
  await app.cloud.partRefund(op_account_id,order_id,refund_details_list,ctx.user.login_id,ctx.user.pwd);
}

/**
 * 获取订单详情
 * */
async function getOrderDetailByOrderId(ctx) {
  let order_id = ctx.request.query.order_id;
  return orderDao.getOrderDetailByOrderId(order_id);
}

/**
 * 获取订单取药监控
 * */
async function getOrderPickupRecord(ctx) {
  let order_id = ctx.request.query.order_id;
  return orderDao.getOrderPickupRecord(order_id);
}
