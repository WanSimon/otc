/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取设备组列表
 * */
exports.getDeviceGroupList = (pageSize, pageIndex, merchant_list, name, no, merchant_id) => {
    let options = {
        pageSize,
        pageIndex
    };
    let sql = `SELECT xeg.innerid,xeg.no,xeg.name,xeg.merchant_id,xm.shortname AS merchant_name,xeg.merchant_no,xeg.isenable,xeg.province,xeg.city,xeg.area,xeg.addr,xeg.longitude,xeg.latitude,xeg.contacts,xeg.phone,xeg.remark,xeg.is_deleted 
             FROM xy_equipment_group xeg 
             LEFT JOIN xy_merchant xm ON xeg.merchant_id = xm.innerid
             WHERE xeg.is_deleted = 0 AND xeg.merchant_id in (${merchant_list}) `;
    if (name) {
        sql += ` AND xeg.name LIKE '%${name}%' `;
    }
    if (no) {
        sql += ` AND xeg.no LIKE '%${no}%' `;
    }
    if (merchant_id) {
        sql += ` AND xeg.merchant_id = '${merchant_id}' `;
    }
    sql += ` ORDER BY xeg.created_time DESC `;
    return db.getPage(sql, options);
};

/**
 * 获取设备组详情
 * */
exports.getDeviceGroupById = (innerid) => {
    let sql = `SELECT xeg.innerid,xeg.no,xeg.name,xeg.merchant_id,xm.shortname AS merchant_name,xeg.merchant_no,xeg.isenable,xeg.province,xeg.city,xeg.area,xeg.addr,xeg.longitude,xeg.latitude,xeg.contacts,xeg.phone,xeg.remark,xeg.remark 
             FROM xy_equipment_group xeg 
             LEFT JOIN xy_merchant xm ON xeg.merchant_id = xm.innerid
             WHERE xeg.innerid = @innerid@ `;
    return db.getOne(sql, {innerid});
};

/**
 * 删除设备组
 * */
exports.delDeviceGroup = async (innerid) => {
    return db.update('xy_equipment_group', {is_deleted: 1}, {innerid});
};

/**
 * 更改设备组状态
 * */
exports.updateDeviceGroupStatus = async (innerid, isenable) => {
    return db.update('xy_equipment_group', {isenable}, {innerid});
};

/**
 * 查找绑定设备组的设备id
 * */
exports.findDeviceId = async (innerid) => {
    let sql = `SELECT GROUP_CONCAT(innerid) AS idList FROM xy_equipment WHERE group_id=@innerid@ AND is_deleted=0`
    return db.getOne(sql, {innerid});
};

/**
 * 更改设备组
 * */
exports.updateDeviceGroup = async (innerid, obj) => {

    let conn = await db.getConnection('eqtGroup');
    let isBeginTransaction = false;
    try {
        await conn.beginTransaction();
        isBeginTransaction = true;
        let groupUpdateSql = sc.db().makeSQLUpdate('xy_equipment_group', obj, {innerid});
        await conn.query(groupUpdateSql);
        //更改设备组下设备对应的商户ID
        let eqtUpdateSql = sc.db().makeSQLUpdate('xy_equipment', {merchant_id: obj.merchant_id}, {group_id: innerid});
        await conn.query(eqtUpdateSql);
        await conn.commit();
    } catch (e) {
        if (conn && isBeginTransaction) conn.rollback();
        throw app.err.dbOpertationFailed;
    } finally {
        if (conn) conn.release();
    }
};

/**
 * 新增设备组
 * */
exports.addDeviceGroup = async (obj) => {
    return db.insert('xy_equipment_group', obj);
};

/**
 * 获取键值对
 * */
exports.getPairs = (merchant_list) => {
    let sql = `SELECT innerid,no,name,merchant_id FROM xy_equipment_group WHERE merchant_id IN (${merchant_list}) AND is_deleted=0`;
    return db.execute(sql, merchant_list);
};

/**
 * 设备组下是否有设备存在
 * */
exports.isExistedDevice = (innerid) => {
    let sql = `SELECT COUNT(*) AS total FROM xy_equipment WHERE group_id = @innerid@ AND is_deleted=0 LIMIT 1;`
    return db.getOne(sql, {innerid});
}
;
