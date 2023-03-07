const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取设备型号列表
 * */
exports.getDeviceModelList = (pageSize, pageIndex, type, name) => {
    let options = {
        pageSize,
        pageIndex
    };
    let sql = ` SELECT innerid,type,name,manufacturer,drug_channel FROM xy_equipment_type WHERE is_deleted=0 `;
    if (type) {
        sql += ` AND xy_equipment_type.type LIKE '%${type}%' `
    }
    if (name) {
        sql += ` AND xy_equipment_type.name LIKE '%${name}%' `
    }
    sql += ` ORDER BY created_time DESC `;
    return db.getPage(sql, options);
};

/**
 * 获取设备型号详情
 * */
exports.getDeviceModelById = (innerid) => {
    let sql = ` SELECT xet.innerid,xet.name, xet.type, xet.manufacturer, xet.hardware_type, xet.thermal_printer_type, xet.laser_printer_type, xet.scanner_type, xet.front_camera_type, xet.channel_camera_type, xet.orifice_camera_type, xet.refrigeration_type, xet.ipc_hardware_type,xet.ipc_software_type,xet.drug_channel,xet.config_json,COUNT( xe.innerid ) AS num 
            FROM xy_equipment_type xet LEFT JOIN xy_equipment xe ON xet.type = xe.type AND xe.is_deleted = 0 WHERE xet.innerid = @innerid@ GROUP BY xet.innerid;`;
    return db.getOne(sql, {innerid});
};

/**
 * 获取设备型号键值对
 * */
exports.getDevicePairs = () => {
    let sql = `SELECT innerid,type,name,config_json FROM xy_equipment_type WHERE is_deleted=0 ;`;
    return db.execute(sql);
};

/**
 * 删除设备型号
 * */

exports.delDeviceModel = (innerid, modified_id) => {
    let options = {
        innerid: innerid,
        modified_id: modified_id
    };
    let sql = 'UPDATE xy_equipment_type SET is_deleted = 1,modified_id = @modified_id@,modified_time= NOW() WHERE innerid = @innerid@ ';
    return db.execute(sql, options);
};

/**
 * 更改设备型号
 * */
exports.updateDeviceModel = (innerid, obj) => {
    return db.update('xy_equipment_type', obj, {innerid});
};
/**
 * 新增设备型号
 * */
exports.addDeviceModel = (obj) => {
    return db.insert('xy_equipment_type', obj);
};

/**
 * 检查设备型号有无设备
 * */
exports.isExistedDevice = (innerid) => {
    let sql = ` SELECT COUNT(t1.innerid) AS total FROM xy_equipment AS t1 LEFT JOIN xy_equipment_type AS t2 ON t1.type=t2.type WHERE t2.innerid = @innerid@ AND t1.is_deleted=0 `;
    return db.getOne(sql, {innerid});
};

/**
 * 检查设备型号type是否唯一
 * */
exports.checkUniqueType = (type) => {
    let sql = ` SELECT COUNT(*) AS num FROM xy_equipment_type WHERE type = @type@ `;
    return db.getOne(sql, {type});
};

/**
 * 根据type获取设备型号
 * */
exports.getDeviceModeByType = (type) => {
    let sql = ` SELECT drug_channel FROM xy_equipment_type WHERE type = @type@ `;
    return db.getOne(sql, {type});
};

/**
 * 生成自编号
 * @param prefix {String} 前缀
 * @param type {String} 设备型号
 * @return no {String} 编号
 * */
exports.generalNo = async (prefix) => {
    let sql = `SELECT type FROM xy_equipment_type ORDER BY type DESC LIMIT 1;`;
    let dbRes = await db.execute(sql);
    let type;
    if (dbRes && dbRes.length > 0) {
        let lastType = dbRes[0].type;
        let endStr = lastType.slice(1);
        type = prefix + (parseInt(endStr) + 1).toString().padStart(3, '0');
    } else {
        type = prefix + "0001";
    }
    return type;
};

/**
 * 更改设备型号槽道信息
 * */
exports.updateChannel = (innerid, options) => {
    return db.update('xy_equipment_type', options, {innerid});
};
