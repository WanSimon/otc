const Dao = require('../dao/dashboard');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
  get: {
    '/dashboard/total/turnover': getTotal,
    '/dashboard/product/sales': getProductSales,
    '/dashboard/order/count': getOrderCount,
    '/dashboard/customer': getCustomer,
    '/dashboard/turnover/distribution': getDistribution,
    '/dashboard/device/overview': getDeviceOverview,
    '/dashboard/device/address': getDeviceAddress,
  }
};

/**
 * 成交额
 * */

async function getTotal(ctx) {
  let res = {};
  let date = 'month';
  let merchant_list = ctx.user.merchant_list;
  let pay_status = app.common.PayStatus.PS_SUCCESS;
  //成交总额
  let totalAmount = await Dao.getTotal(merchant_list, pay_status);
  if (totalAmount) {
    res.total_amount = totalAmount.amount;
  }
  //本月成交总额
  let monthAmount = await Dao.getTotal(merchant_list, pay_status, date);
  if (monthAmount) {
    res.month_amount = monthAmount.amount;
  }

  return res;
}

/**
 * 药品销量排行
 * */

async function getProductSales(ctx) {
  let body = ctx.request.query;
  let limit = body.limit;
  let page = body.page;
  let merchant_list = ctx.user.merchant_list;
  let pay_status = app.common.PayStatus.PS_SUCCESS;
  return Dao.getProductSales(limit, page, merchant_list, pay_status);
}

/**
 * 订单量
 * */

async function getOrderCount(ctx) {
  let body = ctx.request.query;
  let obj = {};
  let res = {};
  obj.merchant_list = ctx.user.merchant_list;
  obj.date = body.date.split(',');
  obj.order_status = app.common.OrderStatus.OS_Taked;
  obj.pay_status = app.common.PayStatus.PS_SUCCESS;
  //订单量
  let orderCount = await Dao.getOrderCount(obj);
  if (orderCount && orderCount.length > 0) {
    res.order_count = orderCount[0].order_count;
  }
  //订单来源分布
  let orderSource = await Dao.getOrderSource(obj);
  res.order_source = orderSource;

  return res;
}

/**
 * 会员数
 * */

async function getCustomer(ctx) {
  let res = {};
  //总会员数
  let customerCount = await Dao.getCustomer();
    res.customer_count = customerCount.count;
  //会员增长趋势
  let customerTrend = await Dao.getCustomerTrend();
  res.customer_trend = customerTrend;

  return res;
}

/**
 * 成交额分布
 * */
async function getDistribution(ctx) {
  let body = ctx.request.query;
  let obj = {};
  let res = {};
  obj.merchant_list = ctx.user.merchant_list;
  obj.date = body.date.split(',');
  obj.type = body.type;
  obj.pay_status = app.common.PayStatus.PS_SUCCESS;
  //成交额分布
  let distribution = await Dao.getDistribution(obj);
  res.distribution = distribution;
  //成交额占比
  let proportion = await Dao.getProportion(obj);
  res.proportion = proportion;

  return res;
}

/**
 * 设备状态
 * */
async function getDeviceOverview(ctx) {
  let res = {};
  let merchant_list = ctx.user.merchant_list;
  let pay_status = app.common.PayStatus.PS_SUCCESS;
  //设备总览
  let status = await Dao.getDeviceStatus(merchant_list, pay_status);
  res.device_status = status;
  //设备成交额排行
  let sales = await Dao.getDeviceSales(merchant_list, pay_status);
  res.sales = sales;

  return res;
}

/**
 * 设备地址分布
 * */
async function getDeviceAddress(ctx) {
  let merchant_list = ctx.user.merchant_list;
  return Dao.getDeviceAddress(merchant_list);
}
