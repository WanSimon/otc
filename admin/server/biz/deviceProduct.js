const dao = require('../dao/deviceProduct');
const sc = require("smartacjs");
const app = sc.app();
const eqtTriggerDao = require('../dao/trigger_eqt');

exports.routers = {
  post: {
    '/device/product': addDeviceProduct
  },
  get: {
    '/device/product/:innerid': getDeviceProductById
  },
  put: {
    '/device/product/:innerid': updateDeviceProduct
  },
  delete: {
    '/device/product/:innerid/:equipment_id': delDeviceProduct
  }

};

/**
 * 新增绑定设备商品
 * */
async function addDeviceProduct(ctx) {
  let body = {
    merchant_product_id: ctx.request.body.merchant_product_id,
    merchant_id: ctx.request.body.merchant_id,
    equipment_id: ctx.request.body.equipment_id,
    slot_no: ctx.request.body.slot_no,
    real_stock: ctx.request.body.real_stock,
    lock_stock: ctx.request.body.lock_stock,
    upper_limit: ctx.request.body.upper_limit,
    product_display: ctx.request.body.product_display,
    image_comparison: ctx.request.body.image_comparison,
    creater_id: ctx.user.innerid,
    created_time: new Date(),
    is_deleted: 0,
    innerid: sc.guid(),
  };
  if (!body.merchant_product_id || !body.merchant_id || !body.equipment_id || !body.slot_no || !(body.real_stock >= 0) || !(body.upper_limit >= 0)) throw app.err.missParameter;
  await dao.addDeviceProduct(body);
  //设备变更触发器
  await eqtTriggerDao.eqt_change(body.equipment_id);
}

/**
 * 变更绑定设备商品
 * */
async function updateDeviceProduct(ctx) {
  let body = {
    merchant_product_id: ctx.request.body.merchant_product_id,
    merchant_id: ctx.request.body.merchant_id,
    equipment_id: ctx.request.body.equipment_id,
    slot_no: ctx.request.body.slot_no,
    real_stock: ctx.request.body.real_stock,
    lock_stock: ctx.request.body.lock_stock,
    upper_limit: ctx.request.body.upper_limit,
    product_display: ctx.request.body.product_display,
    image_comparison: ctx.request.body.image_comparison,
    modified_id: ctx.user.innerid,
    modified_time: new Date(),
  };
  let innerid = ctx.params.innerid;
  if (!innerid || !body.merchant_product_id || !body.merchant_id || !body.equipment_id || !body.slot_no || !(body.real_stock >= 0) || !(body.upper_limit >= 0)) throw app.err.missParameter;
  await dao.updateDeviceProduct(innerid, body);
  //设备变更触发器
  await eqtTriggerDao.eqt_change(body.equipment_id);
}

/**
 * 下架设备商品
 * */
async function delDeviceProduct(ctx) {
  let innerid = ctx.params.innerid;
  let equipment_id = ctx.params.equipment_id;
  if (!innerid || !equipment_id) throw app.err.missParameter;
  await dao.delDeviceProduct(innerid);
  //设备变更触发器
  await eqtTriggerDao.eqt_change(equipment_id);
}

/**
 * 获取设备商品详情
 * */
async function getDeviceProductById(ctx) {
  let innerid = ctx.params.innerid;
  if (!innerid) throw app.err.missParameter;
  return dao.getDeviceProductById(innerid);
}
