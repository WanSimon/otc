/**
 * Created by obel on 2019/12/17.
 */
const dao = require('../dao/codeType');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
    post: {
        '/codetype':add,
    },
    get: {
        '/codetype': getList,
        '/codetype/key': getListByKey,
        '/codetype/info/:id':getInfo,
    },
    put:{
        '/codetype':update
    },
    delete:{
        '/codetype/:id':del
    }

};

/**
 * 获取配置列表
 * */
async function getList(ctx) {
    let body = ctx.request.query;
    let limit = body.limit;
    let page = body.page;
    let dept_id = body.dept_id;
    let name = body.name;
    let mobile = body.mobile;
    return dao.getList(limit,page,dept_id,name,mobile);
}

async function add(ctx) {
    let body = ctx.request.body;
    let options = {};
    options.innerid = sc.guid();
    options.name = body.name;

    await dao.add(options);
    return {};
}

async function del(ctx) {
    let innerid = ctx.params.id;
    await dao.del(innerid);
}

async function update(ctx) {
    let body = ctx.request.body;
    let options = {};
    let innerid = body.innerid;
    options.name = body.name;
    await dao.update(options,innerid);
    return {};
}

async function getInfo(ctx) {
    let innerid = ctx.params.id;
    return dao.getInfo(innerid);
}

async function getListByKey(ctx) {
    let key = ctx.request.query.key;
    return dao.getListByKey(key);
}





