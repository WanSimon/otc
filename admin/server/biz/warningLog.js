const dao = require('../dao/warningLog');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
    post: {},
    get: {
        '/warningLog': getList,
        '/warningLog/count': getListCount,
    },
    put: {},
    delete: {}

};

/**
 * 获取商户预警规则列表
 * */
async function getList(ctx) {
    let body = ctx.request.query;
    let limit = body.limit;
    let page = body.page;
    let merchant_id = body.merchant_id;
    let equipment_id = body.equipment_id;
    let period = body.period;
    if (period) period = period.split(",");
    let merchant_list = ctx.user.merchant_list;
    return dao.getList(limit, page, merchant_id, equipment_id, period, merchant_list);
}

/**
 * 获取商户预警数量
 * */
async function getListCount(ctx) {
    let merchant_list = ctx.user.merchant_list;
    return dao.getListCount(merchant_list);
}
