const dao = require('../dao/role')
const sc = require("smartacjs");
const app = sc.app();


exports.routers = {
    get: {
        '/role/pairs': getRolePairs,
        '/role': getRoleList,
        '/role/:innerid': getRoleById,
    },
    post: {
        '/role': addRole,
    },
    put: {
        '/role': updateRole,
    },
    delete: {
        '/role/:innerid': delRole
    }
};

/**
 * 获取角色列表
 * */
async function getRoleList(ctx) {
    let body = ctx.request.query;
    let limit = body.limit;
    let page = body.page;
    let name = body.name;
    return dao.getRoleList(limit, page, name);
}

/**
 * 删除角色
 * */
async function delRole(ctx) {
    let innerid = ctx.params.innerid;
    let account = await dao.hasRelatedAccount(innerid);
    if (account.total > 0) throw app.err.relatedData.msg('该角色已绑定账户，无法删除');
    return dao.delRole(innerid);
}

/**
 * 新增角色
 * */
async function addRole(ctx) {
    let menuKeyArr = ctx.request.body.menuKeyArr;
    let name = ctx.request.body.name;
    let creater_id = ctx.user.innerid;
    let created_time = new Date();
    let innerid = sc.guid();
    return dao.addRole(innerid, menuKeyArr, name, creater_id, created_time);
}

/**
 * 修改角色
 * */
async function updateRole(ctx) {
    let innerid = ctx.request.body.innerid;
    let menuKeyArr = ctx.request.body.menuKeyArr;
    let name = ctx.request.body.name;
    let modified_id = ctx.user.innerid;
    let modified_time = new Date();
    return dao.updateRole(innerid, menuKeyArr, name, modified_id, modified_time);
}

/**
 * 查询角色详情
 * */
async function getRoleById(ctx) {
    let innerid = ctx.params.innerid;
    return dao.getRoleById(innerid);
}

/**
 * 获取值对数据
 * */
async function getRolePairs(ctx) {
    return dao.getRolePairs();
}
