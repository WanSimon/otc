const dao = require('../dao/stock');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
    get: {
        '/stock/list': getStockList,
        '/stock/event': getStockEventList,
    },
};

/**
 * 获取设备库存列表
 * */
async function getStockList(ctx) {
    let body = ctx.request.query;
    let obj = {};
    obj.name = body.name;
    obj.equipment_id = body.equipment_id;
    let merchant_list = ctx.user.merchant_list;
    return dao.getStockList(obj, merchant_list);
}


/**
 * 获取设备库存事件列表
 * */
async function getStockEventList(ctx) {
    let body = ctx.request.query;
    let limit = body.limit;
    let page = body.page;
    let merchant_id = body.merchant_id;
    let equipment_id = body.equipment_id;
    let op_type = body.op_type;
    let errcode = body.errcode;
    let period = body.period;
    if(period) period = period.split(",");
    let merchant_list = ctx.user.merchant_list;
    return dao.getStockEventList(limit, page, merchant_id, equipment_id, op_type, errcode, period, merchant_list);
}
