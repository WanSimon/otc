const dao = require('../dao/notice');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
    post: {
        '/notice': addNotice,
    },
    get: {
        '/notice': getNoticeList,
        '/notice/display': getNoticeInfo,
        '/notice/:innerid': getNoticeId,
    },
    put: {
        '/notice/:innerid': updateNotice,
        '/notice/release/:innerid': releaseNotice,
        '/notice/cancel/:innerid': cancelNotice,
    },
    delete: {
        '/notice/:innerid': delNotice,
    }

};

/**
 * 获取公告列表
 * */
async function getNoticeList(ctx) {
    let body = ctx.request.query;
    let limit = body.limit;
    let page = body.page;
    let place_list = body.place_list;
    let status = body.status;
    let type = body.type;
    let merchant_id = body.merchant_id;
    let merchant_list = ctx.user.merchant_list;
    return dao.getNoticeList(limit, page, place_list, status, type, merchant_id, merchant_list);
}

/**
 * 获取公告详情
 * */
async function getNoticeId(ctx) {
    let innerid = ctx.params.innerid;
    return dao.getNoticeId(innerid);
}

/**
 * 获取公告内容
 * */
async function getNoticeInfo(ctx) {
    let user_merchant_id = ctx.user.merchant_id;
    //获取商户父级(包括商户本身)
    let parent_list = await dao.getParentList(user_merchant_id)
    let merchantArr = parent_list.merchantList.split(',');
    let obj = {}
    obj.merchant_id_list = merchantArr.slice(0, merchantArr.length - 1)
    obj.place_list = app.common.NoticePlace.NP_Merchant
    obj.status = app.common.NoticeStatus.NS_Online
    return  dao.getNoticeInfo(obj)
}

/**
 * 删除公告
 * */
async function delNotice(ctx) {
    let innerid = ctx.params.innerid;
    return dao.delNotice(innerid)
}

/**
 * 下线公告
 * */
async function cancelNotice(ctx) {
    let innerid = ctx.params.innerid;
    return dao.cancelNotice(innerid);
}

/**
 * 发布公告
 * */
async function releaseNotice(ctx) {
    let innerid = ctx.params.innerid;
    return dao.releaseNotice(innerid);
}

/**
 * 更改公告
 * */
async function updateNotice(ctx) {
    let innerid = ctx.params.innerid;
    let body = ctx.request.body;
    let obj = {};
    obj.merchant_id = body.merchant_id;
    obj.title = body.title;
    obj.begin_time = body.period[0];
    obj.end_time = body.period[1];
    obj.content = body.content;
    obj.type = body.type;
    obj.equipment_group_list = body.equipment_group_list;
    obj.modified_time = new Date();
    obj.place_list = body.place_list;
    console.info(obj.place_list)
    obj.remarks = body.remarks;
    obj.status = body.status || 0;
    obj.creater_id = ctx.user.innerid;
    return dao.updateNotice(innerid, obj);
}

/**
 * 新增公告
 * */
async function addNotice(ctx) {
    let body = ctx.request.body;
    let obj = {};
    obj.innerid = sc.guid();
    obj.merchant_id = body.merchant_id;
    obj.title = body.title;
    obj.begin_time = body.period[0];
    obj.end_time = body.period[1];
    obj.publication_date = new Date();
    obj.content = body.content;
    obj.type = body.type;
    obj.equipment_group_list = body.equipment_group_list;
    obj.created_time = new Date();
    obj.place_list = body.place_list;
    obj.remarks = body.remarks;
    obj.is_deleted = 0;
    obj.status = ctx.request.body.status || 0;
    obj.creater_id = ctx.user.innerid;
    return dao.addNotice(obj);

}
