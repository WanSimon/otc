const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取公告列表
 * */
exports.getNoticeList = (pageSize, pageIndex, place_list, status, type, merchant_id, merchant_list) => {
    let options = {
        pageSize,
        pageIndex
    };
    let sql = `SELECT xn.*,xa.name 
            FROM xy_notice xn 
            LEFT JOIN xy_account xa ON xn.creater_id = xa.innerid 
            WHERE xn.is_deleted = 0 AND xn.merchant_id in (${merchant_list}) `
    if (merchant_id) {
        sql += ` AND xn.merchant_id = '${merchant_id}' `;
    }
    if (place_list !== "" && place_list !== undefined) {
        sql += ` AND xn.place_list = '${place_list}' `;
    }
    if (status !== "" && status !== undefined) {
        sql += ` AND xn.status = '${status}' `;
    }
    if (type !== "" && type !== undefined) {
        sql += ` AND xn.type = '${type}' `;
    }
    sql += ` ORDER BY xn.created_time DESC `;
    return db.getPage(sql, options);
};

/**
 * 获取公告详情
 * */
exports.getNoticeId = (innerid) => {
    let sql = `SELECT * FROM xy_notice WHERE innerid=@innerid@ GROUP BY innerid`;
    return db.getOne(sql, {innerid});
}

/**
 * 删除公告
 * */
exports.delNotice = async (innerid) => {
    return db.update('xy_notice', {is_deleted: 1}, {innerid});
}

/**
 * 下线公告
 * */
exports.cancelNotice = async (innerid) => {
    return db.update('xy_notice', {status: 2}, {innerid});
}

/**
 * 发布公告
 * */
exports.releaseNotice = async (innerid) => {
    return db.update('xy_notice', {status: 1}, {innerid});
}

/**
 * 更改公告
 * */
exports.updateNotice = async (innerid, obj) => {
    return db.update('xy_notice', obj, {innerid});
}

/**
 * 新增公告
 * */
exports.addNotice = async (obj) => {
    return db.insert('xy_notice', obj);
}

/**
 * 获取用户父级id
 * */
exports.getParentList = async (merchant_id) => {
    let sql = `SELECT getParentList(@merchant_id@) AS merchantList`;
    return db.getOne(sql, {merchant_id});
}

/**
 * 获取公告内容
 * */
exports.getNoticeInfo = async (obj) => {
    let sql = `SELECT * FROM xy_notice WHERE merchant_id IN (@merchant_id_list@) AND curdate() >= begin_time AND curdate() <= end_time AND place_list like '%${obj.place_list}%' AND status = @status@ AND is_deleted=0;`;
    return db.execute(sql, obj);
}
