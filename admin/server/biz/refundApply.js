/**
 * Created by obel on 2019/12/17.
 */
const dao = require('../dao/refundApply');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
    get: {
        '/refundApply/list': getRefundList,
        '/refundApply/:innerid': getRefundDetailById
    },
    put: {
        '/refundApply/update/:innerid': updateRefundApply
    },


};

/**
 * 获取退款申请列表
 * */
async function getRefundList(ctx) {
    let body = ctx.request.query;
    let limit = body.limit;
    let page = body.page;
    let merchant_list = ctx.user.merchant_list;
    let status = body.status;
    let serial_no = body.serial_no;
    let period = body.period;
    if (period) period = period.split(",");
    return dao.getRefundList(limit, page, merchant_list, status, serial_no, period);
}

/**
 * 获取退款详情
 * */
async function getRefundDetailById(ctx) {
    let innerid = ctx.params.innerid;
    return dao.getRefundDetailById(innerid);
}


/**
 * 退款申请处理
 * */
async function updateRefundApply(ctx) {
    let innerid = ctx.params.innerid;
    let obj = {}
    obj.desc = ctx.request.body.desc;
    obj.status = ctx.request.body.status;
    obj.modified_id = ctx.user.innerid
    obj.modified_time = new Date()
    return dao.updateRefundApply(innerid, obj);

}
