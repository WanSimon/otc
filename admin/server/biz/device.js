const dao = require('../dao/device');
const merchantDao = require('../dao/merchant');
const deviceModeDao = require('../dao/deviceModel');
const deviceAppDao = require('../dao/deviceApp');
const sc = require("smartacjs");
const app = sc.app();
const eqtTriggerDao = require('../dao/trigger_eqt');

exports.routers = {
  post: {
    '/device': addDevice,
    '/device/getDrugChannel': getDeviceDrugChannel,
    '/device/admin/save': saveAdmin
  },
  get: {
    '/device': getDeviceList,
    '/device/pairs': getPairs,
    '/device/:innerid': getDeviceById,
    '/device/temp_hum_history/:innerid': getDeviceTempHumHistory,
    '/device/admin/list': getAdminList,
    '/device/account/list': getDevAccountList,
  },
  put: {
    '/device/:innerid': updateDevice,
    '/device/status/:innerid': updateDeviceStatus,
    '/device/channel/:innerid': updateChannel
  },
  delete: {
    '/device/:innerid': delDevice
  }

};

/**
 * 新增设备
 * */
async function addDevice(ctx) {
  let body = ctx.request.body;
  let obj = {};
  obj.innerid = sc.guid();
  obj.creater_id = ctx.user.innerid;
  obj.created_time = new Date();
  obj.status = app.common.EquipmentStatus.ES_Offline;//离线
  obj.status_flag = sc.guid();
  obj.is_deleted = 0;
  obj.merchant_id = body.merchant_id;
  obj.group_id = body.group_id;
  obj.type = body.type;
  obj.name = body.name;
  obj.mac = body.mac;
  obj.remark = body.remark;
  obj.config_json = JSON.stringify(body.config);
  if (!obj.merchant_id || !obj.group_id || !obj.type || !obj.name || !obj.mac) throw app.err.missParameter;
  //根据 type 查找 drug_channel
  let dbRes = await deviceModeDao.getDeviceModeByType(obj.type);
  obj.drug_channel = dbRes.drug_channel;
  let eqtOrderArr = [];
  // 取药机预生成设备订单数据
  if (obj.type.startsWith('T')) {
    let channelObj = JSON.parse(obj.drug_channel);
    let slot_info_list = channelObj.slot_info_list;
    for (let i = 0; i < slot_info_list.length; i++) {
      eqtOrderArr.push({
        innerid: sc.guid(),
        merchant_id: obj.merchant_id,
        equipment_id: obj.innerid,
        slot_no: slot_info_list[i].slot_no,
        status: app.common.EquipmentOrderStatus.EOS_Free,
        creater_id: obj.creater_id,
        created_time: obj.created_time
      });
    }
  }

  //编号自动生成
  obj.no = await dao.generalNo('E', obj.type);
  await dao.addDevice(obj, eqtOrderArr);
  //设备版本
  let appObj = {};
  appObj.innerid = sc.guid();
  appObj.current_version_id = body.current_version_id;
  appObj.refresh_version_id = body.refresh_version_id;
  appObj.is_force = body.is_force;
  appObj.is_ignore = 0;
  appObj.equipment_id = obj.innerid;
  if (appObj.current_version_id) {
    await deviceAppDao.addDeviceApp({...appObj, creater_id: obj.creater_id, created_time: new Date()});
  }
}

/**
 * 获取设备列表
 * */
async function getDeviceList(ctx) {
  let body = ctx.request.query;
  let limit = body.limit;
  let page = body.page;
  let merchant_id = body.merchant_id;
  let group_id = body.group_id;
  let name = body.name;
  let no = body.no;
  let mac = body.mac;
  let status = body.status;
  let merchant_list = ctx.user.merchant_list;
  return dao.getDeviceList(limit, page, merchant_id, group_id, name, no, mac, status, merchant_list);
}

/**
 *获取单个设备详情
 * */
async function getDeviceById(ctx) {
  let innerid = ctx.params.innerid;
  if (!innerid) throw app.err.missParameter;
  let deviceApp = {};
  //设备
  let device = await dao.getDeviceById(innerid);
  //设备版本
  let dbRes = await deviceAppDao.getDeviceAppById(innerid);
  if (dbRes && dbRes.length > 0) deviceApp = dbRes[0];
  return {...device, ...deviceApp};
}

/**
 *获取单个设备的温湿度历史记录
 * */
async function getDeviceTempHumHistory(ctx) {
  let body = ctx.request.query;
  let innerid = ctx.params.innerid;
  let created_time = body.created_time ? body.created_time.split(',') : null;
  return await dao.getDeviceTempHumHistory(innerid, created_time);
}

/**
 *获取设备药道数据
 * */
async function getDeviceDrugChannel(ctx) {
  let innerid = ctx.request.body.id;
  let res = await dao.getDeviceDrugChannel(innerid);
  if (res && res.length > 0) {
    try {
      let data = JSON.parse(res[0].drug_channel);
      return data;
    } catch (e) {
      throw app.err.encodeFailed;
    }
  } else {
    throw app.err.noExist;
  }
}

/**
 * 更改设备
 * */
async function updateDevice(ctx) {
  let body = ctx.request.body;
  let innerid = ctx.params.innerid;
  let obj = {};
  obj.status_flag = sc.guid();
  obj.modified_time = new Date();
  obj.modified_id = ctx.user.innerid;
  obj.verification_id = ctx.user.innerid;
  obj.merchant_id = body.merchant_id;
  obj.group_id = body.group_id;
  obj.name = body.name;
  obj.mac = body.mac;
  obj.remark = body.remark;
  obj.config_json = JSON.stringify(body.config);
  if (!innerid || !obj.merchant_id || !obj.group_id || !obj.name || !obj.mac) throw app.err.missParameter;
  await dao.updateDevice(innerid, obj);
  //设备变更触发器
  await eqtTriggerDao.eqt_change(innerid);
  //设备版本
  let appObj = {};
  appObj.innerid = body.device_app_id;
  appObj.current_version_id = body.current_version_id;
  appObj.refresh_version_id = body.refresh_version_id;
  appObj.is_force = body.is_force;
  appObj.equipment_id = innerid;
  if (appObj.current_version_id) {
    if (appObj.innerid) {
      let dbRes = await deviceAppDao.getDeviceAppById(innerid);
      let refresh_version_id = dbRes[0].refresh_version_id || 0;
      appObj.is_ignore = refresh_version_id == appObj.refresh_version_id ? dbRes[0].is_ignore : 0;
      await deviceAppDao.updateDeviceApp({...appObj, modified_id: obj.modified_id, modified_time: new Date()});
    } else {
      appObj.innerid = sc.guid();
      appObj.is_ignore = 0;
      await deviceAppDao.addDeviceApp({...appObj, creater_id: obj.modified_id, created_time: new Date()});
    }
  }
}

/**
 * 删除设备
 * */
async function delDevice(ctx) {
  let innerid = ctx.params.innerid;
  if (!innerid) throw app.err.missParameter;
  return dao.delDevice(innerid);
}

/**
 * 更改设备状态(开启设备需判断设备组是否禁用)
 * */
async function updateDeviceStatus(ctx) {
  let body = ctx.request.body;
  let obj = {};
  obj.innerid = ctx.params.innerid;
  obj.modified_id = ctx.user.innerid;
  obj.isenable = body.isenable;
  //启用设备
  if (obj.isenable == app.common.EquipmentStatus.ES_Offline) {
    //判断设备组是否禁用
    let isDisable = await dao.isDisableDviceGroup(obj.innerid)
    if (!isDisable.isenable) {
      throw app.err.relatedData.msg('该设备所绑定的设备组已被禁用,故无法启用该设备');
    }
  }
  await dao.updateDeviceStatus(obj);
  //设备变更触发器
  await eqtTriggerDao.eqt_change(obj.innerid);
}

/**
 * 更改设备槽道信息
 * */
async function updateChannel(ctx) {
  let body = ctx.request.body;
  let obj = {};
  let innerid = ctx.params.innerid;
  obj.drug_channel = body.drug_channel;
  obj.modified_id = ctx.user.innerid;
  obj.modified_time = new Date();
  await dao.updateChannel(innerid, obj);
  //设备变更触发器
  await eqtTriggerDao.eqt_change(innerid);
}

/**
 * 获取设备管理员
 * */
async function getAdminList(ctx) {
  let equipment_id = ctx.request.query.equipment_id;
  if (!equipment_id) throw app.err.missParameter;
  let data = await dao.getAdminList(equipment_id);
  return data;
}

/**
 * 保存设备管理员
 * */
async function saveAdmin(ctx) {
  let merchant_id = ctx.request.body.merchant_id;
  let equipment_id = ctx.request.body.equipment_id;
  let accountArr = ctx.request.body.accountArr;
  if (!merchant_id || !equipment_id) throw app.err.missParameter;
  let data = await dao.saveAdmin(merchant_id, equipment_id, accountArr, ctx.user.innerid);
  return data;
}

/**
 * 获取登陆用户所在商户下能管理设备的管理员
 * */
async function getDevAccountList(ctx) {
  let merchant_id = ctx.request.query.merchant_id;
  let user_merchant_id = ctx.user.merchant_id;
  let dbRes = await merchantDao.getDevMerchantList(user_merchant_id, merchant_id);
  let merchantArr = dbRes.merchantStr.split(',');
  let merchantStr = merchantArr.map(item => `'${item}'`).join(',');
  return dao.getDevAccountList(merchantStr);

}

/**
 * 获取设备键值对
 * */
async function getPairs(ctx) {
  return dao.getPairs(ctx.user.merchant_list);
}
