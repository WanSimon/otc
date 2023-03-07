/**
 * Created by obel on 2019/12/17.
 */
const dao = require('../dao/deviceGroup');
const deviceDao = require('../dao/device');
const eqtTriggerDao = require('../dao/trigger_eqt');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
    post: {
        '/deviceGroup': addDeviceGroup
    },
    get: {
        '/deviceGroup/pairs': getPairs,
        '/deviceGroup': getDeviceGroupList,
        '/deviceGroup/:innerid': getDeviceGroupById,
    },
    put: {
        '/deviceGroup/status/:innerid': updateDeviceGroupStatus,
        '/deviceGroup/:innerid': updateDeviceGroup
    },
    delete: {
        '/deviceGroup/:innerid': delDeviceGroup
    }

};

/**
 * 获取设备组列表
 * */
async function getDeviceGroupList(ctx) {
    let body = ctx.request.query;
    let limit = body.limit;
    let page = body.page;
    let name = body.name;
    let no = body.no;
    let merchant_id = body.merchant_id;
    let merchant_list = ctx.user.merchant_list;
    return dao.getDeviceGroupList(limit, page, merchant_list, name, no, merchant_id);
}

/**
 * 获取设备组详情
 * */
async function getDeviceGroupById(ctx) {
    let innerid = ctx.params.innerid;
    return dao.getDeviceGroupById(innerid);
}

/**
 * 删除设备组
 * */
async function delDeviceGroup(ctx) {
    let innerid = ctx.params.innerid;
    let isExisted = await dao.isExistedDevice(innerid)
    if (isExisted.total > 0) throw app.err.relatedData.msg('该设备组下有设备存在,无法删除');
    return dao.delDeviceGroup(innerid);
}

/**
 * 更改设备组状态
 * */
async function updateDeviceGroupStatus(ctx) {
    let innerid = ctx.params.innerid;
    let isenable = ctx.request.body.isenable;
    //禁用设备组 禁用下级的设备
    if (!isenable) {
        let deviceIdList = await dao.findDeviceId(innerid)
        if (deviceIdList.idList) {
            let obj = {}
            obj.modified_id = ctx.user.innerid;
            obj.isenable = app.common.EquipmentStatus.ES_Stop
            let idList = deviceIdList.idList.split(',')
            idList.forEach(item => {
                obj.innerid = item
                deviceDao.updateDeviceStatus(obj);
                eqtTriggerDao.eqt_change(item)
            })
        }
    }
    return dao.updateDeviceGroupStatus(innerid, isenable);
}

/**
 * 更改设备组
 * */
async function updateDeviceGroup(ctx) {
    let innerid = ctx.params.innerid;
    let body = ctx.request.body;
    let obj = {};
    obj.modified_id = ctx.user.innerid;
    obj.modified_time = new Date();
    obj.isenable = body.isenable;
    obj.merchant_id = body.merchant_id;
    obj.contacts = body.contacts;
    obj.name = body.name;
    obj.phone = body.phone;
    obj.no = body.no;
    obj.province = body.province || '';
    obj.city = body.city || '';
    obj.area = body.area || '';
    obj.addr = body.addr || '';
    obj.longitude = body.longitude;
    obj.latitude = body.latitude;
    obj.remark = body.remark;
    await dao.updateDeviceGroup(innerid, obj);
    return {};
}

/**
 * 新增设备组
 * */
async function addDeviceGroup(ctx) {
    let body = ctx.request.body;
    let obj = {};
    obj.innerid = sc.guid();
    obj.creater_id = ctx.user.innerid;
    obj.created_time = new Date();
    obj.isenable = body.isenable;
    obj.merchant_id = body.merchant_id;
    obj.contacts = body.contacts;
    obj.name = body.name;
    obj.phone = body.phone;
    obj.no = body.no;
    obj.province = body.province || '';
    obj.city = body.city || '';
    obj.area = body.area || '';
    obj.addr = body.addr || '';
    obj.longitude = body.longitude;
    obj.latitude = body.latitude;
    obj.remark = body.remark;
    return dao.addDeviceGroup(obj);
}

/**
 * 获取设备组键值对
 * */
async function getPairs(ctx) {
    return dao.getPairs(ctx.user.merchant_list);
}
