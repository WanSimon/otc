/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app = sc.app();
const db = app.db;
const salt = 'xysz';


/**
 * 获取账户详情
 * */
exports.getAccountId = (innerid) => {
    let sql = 'SELECT * FROM xy_account WHERE innerid = @innerid@';
    return db.getOne(sql, {innerid});
};

/**
 * 获取账户列表
 * */
exports.getList = (pageSize, pageIndex, name, login_id, merchant_id, merchant_list) => {
    let options = {
        pageSize,
        pageIndex
    };
    let sql = `SELECT * FROM xy_account WHERE isdeleted = 0 AND merchant_id in (${merchant_list}) `;
    //TODO 搜索条件
    if (merchant_id) {
        sql += ` AND merchant_id = '${merchant_id}' `;
    }
    if (name) {
        sql += ` AND name LIKE '%${name}%' `;
    }
    if (login_id) {
        sql += ` AND login_id LIKE '%${login_id}%' `;
    }
    sql += ` ORDER BY created_time DESC `;
    return db.getPage(sql, options);
};

/**
 * 更改账户状态
 * */
exports.updateAccountStatus = async (innerid, isvalid) => {
    return db.update('xy_account', {isvalid}, {innerid});
};

/**
 * 查看手机号是否已存在
 * */
exports.isExistedMobile = async (obj) => {
    let sql = 'SELECT COUNT(innerid) AS total FROM xy_account WHERE login_id = @login_id@ and isdeleted=0';
    if (obj.innerid) {
        sql += ` AND innerid != @innerid@`;
    }
    sql += ` LIMIT 1`;
    return db.getOne(sql, obj);
};

/**
 * 新增账户
 * */
exports.addAccount = async (obj) => {
    return db.insert('xy_account', obj);
};

/**
 * 更改账户
 * */
exports.updateAccount = async (obj) => {
    return db.update('xy_account', obj, {innerid: obj.innerid});
};

/**
 * 删除账户
 * */
exports.delAccount = (innerid) => {
    return db.update('xy_account', {isdeleted: 1}, {innerid});
};
