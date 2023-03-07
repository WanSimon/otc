const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取商户预警规则列表
 * */
exports.getList = (pageSize, pageIndex, merchant_id, equipment_id, period, merchant_list) => {
    let options = {
        pageSize,
        pageIndex
    };
    let sql = `SELECT * FROM xy_equipment_warning_records WHERE 1=1 AND merchant_id in (${merchant_list})`;
    if (merchant_id) {
        sql += ` AND merchant_id = '${merchant_id}' `;
    }
    if (equipment_id) {
        sql += ` AND equipment_id = '${equipment_id}' `;
    }
    if (period && Array.isArray(period)) {
        let time1 = `${period[0]}`;
        let time2 = `${period[1]}`;
        sql += ` AND created_time >= '${time1}' AND created_time <= '${time2}'`;
    }
    sql += ` ORDER BY created_time DESC `;
    return db.getPage(sql,options);
};

/**
 * 获取商户预警数量
 * */
exports.getListCount = (merchant_list) => {
    let sql = `SELECT COUNT(*) AS count FROM xy_equipment_warning_records WHERE 1=1 AND merchant_id in (${merchant_list}) LIMIT 1;`
    return db.getOne(sql);
};
