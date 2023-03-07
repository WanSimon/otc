/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取商户所有子商户（包括商户本身）
 * */
exports.getChildList = (merchant_id) => {
    let sql = `SELECT getChildList(@merchant_id@) AS merchantList`;
    return db.getOne(sql, {merchant_id});
};

/**
 * 获取商户的树形结构
 * */
exports.getTree = (merchant_list) => {
    let sql = `SELECT innerid AS value,shortname AS label,IFNULL(parent_id,0) AS parentId 
             FROM xy_merchant WHERE is_deleted =0 AND innerid in (${merchant_list}) ;`;
    return db.execute(sql);
};

/**
 * 获取单个商户详情
 * */
exports.getMerchantById = (innerid, third_platform_id) => {
    let sql = `SELECT xm.*,xmt.merchant_third_code,xmt.config AS config_third FROM xy_merchant AS xm Left JOIN xy_merchant_third AS xmt ON xm.innerid=xmt.merchant_id AND xmt.third_platform_id = ${third_platform_id} WHERE xm.innerid = @innerid@`
    return db.getOne(sql, {innerid: innerid});
};


/**
 * 获取登陆用户所在商户下能管理设备的商户
 * @param user_merchant_id 用户所在商户
 * @param eqt_merchant_id 设备所在商户
 * */
exports.getDevMerchantList = (user_merchant_id, eqt_merchant_id) => {
    let sql = `SELECT getEqtMerchantList(@user_merchant_id@,@eqt_merchant_id@) AS merchantStr`;
    return db.getOne(sql, {user_merchant_id, eqt_merchant_id});
};

/**
 * 新增商户
 * */
exports.addMerchant = body => {
    return db.insert('xy_merchant', body);
};

/**
 * 新增商户第三方配置(美团)
 * */
exports.addMerchantThird = (innerid, config, merchant_third_code, third_platform_id, merchant_id, creater_id, created_time) => {
    let option = {
        innerid: innerid,
        config: config,
        merchant_third_code: merchant_third_code,
        third_platform_id: third_platform_id,
        merchant_id: merchant_id,
        creater_id: creater_id,
        created_time: created_time
    }
    return db.insert('xy_merchant_third', option);
};

/**
 * 修改商户信息
 * */
exports.updateMerchant = (innerid, body) => {
    return db.update('xy_merchant', body, {innerid});
};

/**
 * 修改商户第三方配置(美团)
 * */
exports.editMerchantThird = async (config_third, merchant_third_code, third_platform_id, merchant_id, modified_id, modified_time) => {
    await db.delete('xy_merchant_third', {merchant_id: merchant_id, third_platform_id: third_platform_id});
    let option = {};
    if (merchant_third_code || config_third.app_name || config_third.app_id || config_third.app_secret) {
        option.innerid = sc.guid();
        option.config = JSON.stringify(config_third);
        option.merchant_third_code = merchant_third_code;
        option.third_platform_id = third_platform_id;
        option.merchant_id = merchant_id;
        option.creater_id = modified_id;
        option.created_time = modified_time;
        return db.insert('xy_merchant_third', option);
    }
};

/**
 * 删除商户
 * */
exports.delMerchant = async (innerid) => {
    //删除商户第三方关联配置的数据
    await db.delete('xy_merchant_third', {merchant_id: innerid});
    return db.update('xy_merchant', {is_deleted: 1}, {innerid});
}

/**
 * 检查是否有设备组绑定该商户
 * */
exports.isExistedDeviceGroup = (innerid) => {
    let sql = `SELECT COUNT(*) AS total FROM xy_equipment_group WHERE merchant_id = @innerid@ AND is_deleted=0 LIMIT 1;`
    return db.getOne(sql, {innerid});
}

/**
 * 检查是否有账户绑定该商户
 * */
exports.isExistedAccount = (innerid) => {
    let sql = `SELECT COUNT(*) AS total FROM xy_account WHERE merchant_id = @innerid@ AND isdeleted=0 LIMIT 1;`
    return db.getOne(sql, {innerid});
}
