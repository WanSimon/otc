const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 新增设备
 * */
exports.addDevice = (obj, eqtOrderArr) => {
    let sqls = [];
    let sql = sc.db().makeSQLInsert('xy_equipment', obj);
    sqls.push(sql);
    for (let i = 0; i < eqtOrderArr.length; i++) {
        sql = sc.db().makeSQLInsert('xy_equipment_order', eqtOrderArr[i]);
        sqls.push(sql);
    }
    return db.transaction(sqls);
};
/**
 * 获取设备列表
 * */
exports.getDeviceList = (pageSize, pageIndex, merchant_id, group_id, name, no, mac, status, merchant_list) => {
    let options = {
        pageSize,
        pageIndex
    };
    let sql = ` SELECT xe.innerid, xe.no, xe.name, xe.group_id, xe.type, xe.merchant_id, xe.merchant_no, xe.status, xe.verification_id, xe.ipaddr, xe.mac, xecs1.value AS temperature, xecs2.value AS humidity, xecs3.value AS lasttime, xe.remark, xe.is_deleted 
                FROM xy_equipment xe
                LEFT JOIN xy_equipment_current_status xecs1 ON xecs1.key = 'temperature' AND xe.innerid = xecs1.equipment_id
                LEFT JOIN xy_equipment_current_status xecs2 ON xecs2.key = 'humidity' AND xe.innerid = xecs2.equipment_id
                LEFT JOIN xy_equipment_current_status xecs3 ON xecs3.key = 'last_online_time' AND xe.innerid = xecs3.equipment_id 
                WHERE xe.is_deleted = 0 AND xe.merchant_id IN (${ merchant_list }) `
    //TODO 搜索条件
    if (merchant_id) {
        sql += ` AND xe.merchant_id = '${merchant_id}' `;
    }
    if (group_id) {
        sql += ` AND xe.group_id = '${group_id}' `;
    }
    if (name) {
        sql += ` AND xe.name LIKE '%${name}%' `;
    }
    if (no) {
        sql += ` AND xe.no LIKE '%${no}%' `;
    }
    if (mac) {
        sql += ` AND xe.mac LIKE '%${mac}%' `;
    }
    if (status !== "" && status !== undefined) {
        sql += ` AND xe.status = '${status}' `;
    }
    sql += ` ORDER BY xe.created_time DESC `;
    return db.getPage(sql, options);

};

/**
 *获取单个设备详情
 * */
exports.getDeviceById = (innerid) => {
    let sql = `SELECT xe.*,xm.shortname  FROM xy_equipment xe
               LEFT JOIN xy_merchant xm ON xe.merchant_id= xm.innerid 
               LEFT JOIN xy_equipment_type xet ON xet.type = xe.type
               WHERE xe.innerid = @innerid@ `;
    return db.getOne(sql, {innerid});
};

/**
 *获取单个设备的温湿度历史记录
 * */
exports.getDeviceTempHumHistory = (innerid, created_time) => {
    let sql = `SELECT innerid,equipment_id,temperature,humidity ,created_time
      FROM xy_equipment_temp_hum_history
      WHERE equipment_id = @innerid@ AND isdeleted = 0  `;

    if (created_time && Array.isArray(created_time)) {
      let time1 = `${created_time[0]}`;
      let time2 = `${created_time[1]}`;
      sql += ` AND created_time >= '${time1}' AND created_time <= '${time2}'`;
    }
    sql += ` ORDER BY created_time `;
    return db.execute(sql, {innerid});
};

/**
 *获取设备药道数据
 * */

exports.getDeviceDrugChannel = (innerid) => {
    let sql = `SELECT drug_channel FROM xy_equipment WHERE innerid = @innerid@ `;
    return db.execute(sql, {innerid});
};

/**
 * 更改设备
 * */
exports.updateDevice = (innerid, obj) => {
    return db.update('xy_equipment', obj, {innerid});
};
/**
 * 删除设备
 * */
exports.delDevice = (innerid) => {
    return db.update('xy_equipment', {is_deleted: 1}, {innerid});
};

/**
 * 更改设备状态
 * */
exports.updateDeviceStatus = (obj) => {
    let sql = 'UPDATE xy_equipment SET status=@isenable@,modified_id=@modified_id@,modified_time=NOW() WHERE innerid = @innerid@';
    return db.execute(sql, obj);
};

/**
 * 更改设备槽道信息
 * */
exports.updateChannel = (innerid, options) => {
    return db.update('xy_equipment', options, {innerid});
};

/**
 * 获取设备管理员
 * */
exports.getAdminList = (equipment_id) => {
    let sql = `SELECT xa.name AS label,xea.account_id FROM xy_equipment_admin xea
               LEFT JOIN xy_account xa ON xea.account_id = xa.innerid
               WHERE xea.is_deleted = 0 AND xea.equipment_id=@equipment_id@ ;`;
    return db.execute(sql, {equipment_id});
};

/**
 * 获取登陆用户所在商户下能管理设备的管理员
 * */
exports.getDevAccountList = (merchantStr) => {
    let sql = `SELECT xa.name AS label,xa.innerid AS account_id FROM xy_account xa 
               WHERE xa.isdeleted = 0 AND xa.merchant_id in (${merchantStr}); `;
    return db.execute(sql, {});
};

/**
 * 更新设备管理员
 * */
exports.saveAdmin = async (merchant_id, equipment_id, accountArr, creater_id) => {
    let conn = await db.getConnection('equipment');
    let isBeginTransaction = false;
    try {
        await conn.beginTransaction();
        isBeginTransaction = true;
        let deleteSql = sc.db().makeSQLDelete('xy_equipment_admin', {
            equipment_id: equipment_id,
            merchant_id: merchant_id
        });
        await conn.query(deleteSql);
        let now = new Date();
        for (let i = 0; i < accountArr.length; i++) {
            let data = {
                account_id: accountArr[i],
                innerid: sc.guid(),
                equipment_id: equipment_id,
                merchant_id: merchant_id,
                is_deleted: 0,
                creater_id: creater_id,
                created_time: now
            };
            let insertSql = sc.db().makeSQLInsert('xy_equipment_admin', data);
            await conn.query(insertSql);
        }
        await conn.commit();
    } catch (e) {
        if (conn && isBeginTransaction) conn.rollback();
        throw app.err.dbOpertationFailed;
    } finally {
        if (conn) conn.release();
    }
};

/**
 * 获取设备键值对
 * */
exports.getPairs = (merchant_list) => {
    let sql = `SELECT innerid,no,name,type,merchant_id FROM xy_equipment WHERE is_deleted=0 AND merchant_id IN (${merchant_list}) `;
    return db.execute(sql, merchant_list);
};

/**
 * 生成自编号
 * @param prefix {String} 前缀
 * @param type {String} 设备型号
 * @return no {String} 编号
 * */
exports.generalNo = async (prefix, type) => {
    let startStr = prefix + type.slice(1) + new Date().format('yyyyMM');
    let sql = `SELECT no FROM xy_equipment WHERE no LIKE '${startStr}%' ORDER BY no DESC LIMIT 1;`;
    let dbRes = await db.execute(sql);
    let no;
    if (dbRes && dbRes.length > 0) {
        let lastNo = dbRes[0].no;
        let endStr = lastNo.slice(startStr.length);
        no = startStr + (parseInt(endStr) + 1).toString().padStart(6, '0');
    } else {
        no = startStr + "000001";
    }
    return no;
};

/**
 * 判断设备绑定的设备组是否禁用
 * */
exports.isDisableDviceGroup = (innerid) => {
    let sql = `select xeg.isenable from xy_equipment_group xeg  LEFT JOIN xy_equipment xe ON xeg.innerid =xe.group_id where xe.innerid='${innerid}'`
    return db.getOne(sql)
}
