const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取设备库存列表
 * */
exports.getStockList = (obj, merchant_list) => {
    let sql = `SELECT t1.*, t2.product_id, t3.name, t3.alias,t3.bar_code FROM xy_equipment_product AS t1 LEFT JOIN xy_merchant_product AS t2 
    ON t1.merchant_product_id = t2.innerid AND t1.merchant_id = t2.merchant_id LEFT JOIN xy_product AS t3 ON 
    t2.product_id = t3.innerid  WHERE t1.is_deleted=0 AND t1.merchant_id in (${merchant_list})`;
    if (obj.name) {
        sql += ` AND t3.name LIKE '%${obj.name}%' `;
    }
    if (obj.equipment_id) {
        sql += ` AND t1.equipment_id = '${obj.equipment_id}' `;
    }
    sql += ` ORDER BY t1.slot_no ASC `;
    return db.execute(sql, obj);

}


/**
 * 获取设备库存事件列表
 * */
exports.getStockEventList = (pageSize, pageIndex, merchant_id, equipment_id, op_type, errcode, period, merchant_list) => {
    let options = {
        pageSize,
        pageIndex
    };
    let sql = `SELECT t1.*, t2.merchant_id,t4.name AS productName FROM xy_equipment_product_history AS t1 
            LEFT JOIN xy_equipment AS t2 ON  t1.equipment_id=t2.innerid 
            LEFT JOIN xy_merchant_product AS t3 ON t1.merchant_product_id=t3.innerid  
            LEFT JOIN xy_product AS t4 ON t3.product_id=t4.innerid WHERE (t1.op_type=0 OR t1.op_type=1 OR t1.op_type=2)
            AND t2.merchant_id in (${merchant_list})`
    if (merchant_id) {
        sql += `AND t2.merchant_id = '${merchant_id}'`
    }
    if (equipment_id) {
        sql += `AND t1.equipment_id = '${equipment_id}'`
    }
    if (op_type !== '' && op_type !== undefined) {
        sql += `AND t1.op_type = '${op_type}' `
    }
    if (errcode !== '' && errcode !== undefined) {
        sql += `AND t1.errcode = '${errcode}' `
    }
    if (period && Array.isArray(period)) {
        let time1 = `${period[0]}`;
        let time2 = `${period[1]}`;
        sql += ` AND t1.op_time >= '${time1}' AND t1.op_time <= '${time2}'`;
    }
    sql += `ORDER BY created_time DESC`
    return db.getPage(sql, options)
}
