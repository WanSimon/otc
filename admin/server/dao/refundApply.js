/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取退款申请列表
 * */
exports.getRefundList = (pageSize, pageIndex, merchant_list, status, serial_no, period) => {
    let options = {
        pageSize,
        pageIndex
    };
    let sql = `SELECT xra.innerid,xra.status,xra.created_time,xo.serial_no,xc.nickname,xc.phone FROM xy_refund_apply AS xra JOIN xy_order AS xo ON  xra.order_id = xo.innerid JOIN xy_customer AS xc ON xra.customer_id =xc.innerid WHERE xo.is_deleted = 0 AND xc.is_deleted = 0 AND xc.status = 1 AND xo.merchant_id IN (${merchant_list})`
    if (status !== "" && status !== undefined) {
        sql += `AND xra.status = '${status}'`
    }
    if (serial_no) {
        sql += `AND xo.serial_no LIKE '%${serial_no}%' `
    }
    if (period && Array.isArray(period)) {
        let time1 = `${period[0]}`;
        let time2 = `${period[1]}`;
        sql += ` AND xra.created_time >= '${time1}' AND xra.created_time <= '${time2}'`;
    }
    sql += `ORDER BY xra.created_time DESC`
    return db.getPage(sql, options);
};

/**
 * 获取退款详情
 * */
exports.getRefundDetailById = (innerid) => {
    let sql = `SELECT xra.innerid,xra.order_id,xra.image_list,xra.remark,xra.desc,xra.status,xo.serial_no,xo.pay_amount,xo.pay_status,xc.nickname,xc.phone FROM xy_refund_apply AS xra JOIN xy_order AS xo ON  xra.order_id = xo.innerid JOIN xy_customer AS xc ON xra.customer_id =xc.innerid WHERE xra.innerid=@innerid@;`
    return db.getOne(sql, {innerid});
};

/**
 * 退款申请处理
 * */
exports.updateRefundApply = (innerid, obj) => {
    return db.update('xy_refund_apply', obj, {innerid});
};

