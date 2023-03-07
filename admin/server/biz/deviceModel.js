const dao = require('../dao/deviceModel')
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
    post: {
        '/deviceModel': addDeviceModel
    },
    get: {
        '/deviceModel': getDeviceModelList,
        '/deviceModel/pairs': getDevicePairs,
        '/deviceModel/:innerid': getDeviceModelById,
    },
    put: {
        '/deviceModel/:innerid': updateDeviceModel,
        '/deviceModel/channel/:innerid': updateChannel
    },
    delete: {
        '/deviceModel/:innerid': delDeviceModel
    }
};

/**
 * 获取设备型号列表
 * */
async function getDeviceModelList(ctx) {
    let body = ctx.request.query;
    let limit = body.limit;
    let page = body.page;
    let type = body.type;
    let name = body.name;
    return dao.getDeviceModelList(limit, page, type, name);
}

/**
 * 获取设备型号详情
 * */
async function getDeviceModelById(ctx) {
    let innerid = ctx.params.innerid;
    let deviceModel = await dao.getDeviceModelById(innerid);
    return deviceModel;
}

/**
 * 获取设备型号键值对
 * */
async function getDevicePairs(ctx) {
    return dao.getDevicePairs();
}

/**
 * 删除设备型号
 * */
async function delDeviceModel(ctx) {
    let innerid = ctx.params.innerid;
    let modified_id = ctx.user.innerid;
    let isExisted = await dao.isExistedDevice(innerid);
    if (isExisted.total > 0) throw app.err.relatedData.msg('该设备型号下有设备存在, 无法删除');
    return dao.delDeviceModel(innerid, modified_id);
}

/**
 * 更改设备型号
 * */
async function updateDeviceModel(ctx) {
    let body = ctx.request.body;
    let obj = {};
    obj.modified_id = ctx.user.innerid;
    obj.modified_time = new Date();
    let innerid = ctx.params.innerid;
    obj.type = body.type;
    obj.name = body.name;
    obj.manufacturer = body.manufacturer;
    obj.hardware_type = body.hardware_type;
    obj.thermal_printer_type = body.thermal_printer_type;
    obj.laser_printer_type = body.laser_printer_type;
    obj.channel_camera_type = body.channel_camera_type;
    obj.scanner_type = body.scanner_type;
    obj.front_camera_type = body.front_camera_type;
    obj.orifice_camera_type = body.orifice_camera_type;
    obj.refrigeration_type = body.refrigeration_type;
    obj.ipc_hardware_type = body.ipc_hardware_type;
    obj.ipc_software_type = body.ipc_software_type;
    obj.config_json = JSON.stringify(body.config);
    if (!innerid || !obj.type || !obj.name) throw app.err.missParameter;
    await dao.updateDeviceModel(innerid, obj);
    //设备缓存变更触发器
}

/**
 * 新增设备型号
 * */
async function addDeviceModel(ctx) {
    let body = ctx.request.body;
    let obj = {};
    obj.innerid = sc.guid();
    obj.creater_id = ctx.user.innerid;
    obj.created_time = new Date();
    obj.is_deleted = 0;
    obj.name = body.name;
    obj.manufacturer = body.manufacturer;
    obj.hardware_type = body.hardware_type;
    obj.thermal_printer_type = body.thermal_printer_type;
    obj.laser_printer_type = body.laser_printer_type;
    obj.channel_camera_type = body.channel_camera_type;
    obj.scanner_type = body.scanner_type;
    obj.front_camera_type = body.front_camera_type;
    obj.orifice_camera_type = body.orifice_camera_type;
    obj.refrigeration_type = body.refrigeration_type;
    obj.ipc_hardware_type = body.ipc_hardware_type;
    obj.ipc_software_type = body.ipc_software_type;
    obj.drug_channel = {
        "type": "vendor_v1",
        "container_num": 1,
        "aisleX": Number(body.aisleX) > 0 ? Number(body.aisleX) : 0,
        "aisleY": Number(body.aisleY) > 0 ? Number(body.aisleY) : 0,
        "length": Number(body.length) > 0 ? Number(body.length) : 0,
        "width": Number(body.width) > 0 ? Number(body.width) : 0,
        "height": Number(body.height) > 0 ? Number(body.height) : 0,
    };
    if (!obj.name || obj.drug_channel.aisleX <= 0 || obj.drug_channel.aisleY <= 0 || obj.drug_channel.height <= 0 || obj.drug_channel.length <= 0 || obj.drug_channel.width <= 0) throw app.err.missParameter;
    obj.drug_channel = JSON.stringify(obj.drug_channel);
    obj.config_json = JSON.stringify(body.config);

    obj.type = body.type;
    //校验type是否唯一
    let dbRes = await dao.checkUniqueType(obj.type);
    let num = dbRes.num;
    if (num > 0) {
        throw new app.err.SCError(12, '编号已存在');
    } else {
        await dao.addDeviceModel(obj);
    }

}

/**
 * 更改设备型号槽道信息
 * */
async function updateChannel(ctx) {
    let body = ctx.request.body;
    let obj = {};
    let innerid = ctx.params.innerid;
    obj.drug_channel = body.drug_channel;
    obj.modified_id = ctx.user.innerid;
    obj.modified_time = new Date();
    await dao.updateChannel(innerid, obj);
}
