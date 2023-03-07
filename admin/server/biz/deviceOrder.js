/**
 * Created by obel on 2019/12/17.
 */
const dao = require('../dao/deviceOrder');
const deviceDao = require('../dao/device');
const orderDao = require('../dao/order');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
  post: {
  },
  get: {
    '/deviceOrder':getList
  },
  put:{
    '/deviceOrder/:innerid':update,
    '/deviceOrder/status/:innerid':updateStatus
  },
  delete:{
  }

};

/**
 * 获取设备取货单列表
 * */
async function getList(ctx) {
  let body = ctx.request.query;
  let equipment_id = body.equipment_id;
  let serial_no = body.serial_no;
  let status = body.status;
  let list = await dao.getList(equipment_id,serial_no,status);
  let dbRes = await deviceDao.getDeviceById(equipment_id);
  let drugChannel = dbRes.drug_channel;
  return {list,drugChannel};
}

/**
 * 取货单变更
 * */
async function update(ctx) {
  let innerid = ctx.params.innerid;
  let status = ctx.request.body.status;

  let updateObj = {
    status
  };
  if(status == app.common.EquipmentOrderStatus.EOS_Free) {
    updateObj.order_id = '';
  }
  else {
    let serial_no = ctx.request.body.serial_no;
    let dbRes = await orderDao.getOrderBySerialNo(serial_no);
    if(dbRes.length===0){
      throw new app.err.SCError(4,'订单号错误');
    }
    updateObj.order_id = dbRes[0].innerid;

  }

  return dao.update(innerid,updateObj);
}

/**
 * 取货单状态变更
 * */
async function updateStatus(ctx) {
  let innerid = ctx.params.innerid;
  let status = ctx.request.body.status;

  let updateObj = {
    status
  };
  if(status == app.common.EquipmentOrderStatus.EOS_Free) updateObj.order_id = '';
  return dao.update(innerid,updateObj);
}



