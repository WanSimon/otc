/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取商户药品列表
 * */
exports.getList = (pageSize, pageIndex, name, bar_code, merchant_id, merchant_list) => {
    let options = {
        pageSize,
        pageIndex
    };
    let sql = `SELECT mp.innerid,mp.product_id,mp.merchant_id,mp.product_type,mp.product_no,mp.batch,mp.batch_number,mp.electronic_monitoring_code,DATE_FORMAT(mp.expire_date, '%Y-%m-%d') AS expire_date,mp.customer_price,mp.price,mp.remark,mp.is_deleted,mp.creater_id,mp.created_time,p.name,p.alias,p.bar_code,p.home_thumb_url,p.approval_number,p.brand,p.manufacturer
             FROM xy_merchant_product AS mp
             LEFT JOIN xy_product AS p ON mp.product_id = p.innerid WHERE 1=1 AND mp.is_deleted = 0 AND mp.merchant_id in (${merchant_list}) `;
    if (merchant_id) {
        sql += ` AND mp.merchant_id = '${merchant_id}' `;
    }
    if (name) {
        sql += ` AND p.name LIKE '%${name}%' `;
    }
    if (bar_code) {
        sql += ` AND p.bar_code LIKE '%${bar_code}%' `;
    }
    sql += ` ORDER BY mp.created_time DESC `;
    return db.getPage(sql, options);
};

/**
 * 获取商户药品详情
 * */
exports.getMerchantProductId = (innerid) => {
    let sql = `SELECT mpt.merchant_product_third_code,mp.innerid,mp.product_id,mp.merchant_id,mp.product_type,mp.batch,DATE_FORMAT(mp.expire_date, '%Y-%m-%d') AS expire_date,mp.batch_number,mp.electronic_monitoring_code,mp.customer_price,mp.price,mp.remark,mp.product_no,p.name,p.alias,p.approval_number,p.bar_code,p.product_category_list_id,p.product_length,p.product_height,p.product_width,p.brand,p.unit,p.manufacturer,p.origin_place,p.operator_category_id,p.min_day,p.max_day,p.usage_dosage,p.treatment_course,p.eat_time,p.product_function,p.adverse_reaction,p.taboo,p.attention,p.interactions,p.specification,p.expiration_date,p.product_status,p.add_source,p.home_thumb_url,p.analeptic_flag,p.ephedrine_flag,p.sale_status,p.front_image_url,p.back_image_url,p.product_detail
    FROM xy_merchant_product AS mp LEFT JOIN xy_product AS p ON mp.product_id = p.innerid
    LEFT JOIN xy_merchant_product_third AS mpt ON mp.innerid=mpt.merchant_product_id AND mpt.third_platform_id = 1  WHERE mp.innerid = @innerid@`;
    return db.execute(sql, {innerid});
};


/**
 * 删除商户药品
 * */
exports.delMerchantProduct = async (innerid) => {
    let sql_del = `DELETE FROM xy_merchant_product_third WHERE merchant_product_id in (@innerid@)`
    await db.execute(sql_del, {innerid});
    let sql = `update xy_merchant_product set is_deleted=1 where innerid in (@innerid@)`
    return db.execute(sql, {innerid});
};

/**
 * 检查是否能被删除
 * */
exports.checkCanDelete = innerid => {
    let sql = 'SELECT COUNT(innerid) AS total FROM xy_equipment_product WHERE merchant_product_id in (@innerid@) AND is_deleted=0';
    return db.getOne(sql, {innerid});
};

//商品名,国际条码模糊搜素商品详情
exports.getPairs = (obj) => {
    let sql = `SELECT t1.innerid,t1.batch,t1.batch_number,t2.name, t2.alias,t2.home_thumb_url,t2.approval_number,t2.bar_code,t2.product_length,t2.product_height,t2.product_width,t2.innerid AS product_id
          FROM xy_merchant_product AS t1 LEFT JOIN xy_product AS t2 ON t1.product_id = t2.innerid  WHERE t1.is_deleted=0 AND t1.merchant_id=@merchant_id@`;
    if (obj.keywords) {
        sql += `AND ( t2.bar_code LIKE '%${obj.keywords}%'  OR t2.name LIKE '%${obj.keywords}%' )`
    }
    sql += ` LIMIT 10; `;
    return db.execute(sql, obj);
};
/**
 * 更改商户药品
 * */
exports.updateMerchantProduct = async (obj, innerid) => {
    return db.update('xy_merchant_product', obj, {innerid});
};

/**
 * 修改商户商品第三方配置(美团)
 * */
exports.updateMerchantProductThird = async (merchant_product_id, mpt_code, third_platform_id, merchant_id, modified_id, modified_time) => {
    await db.delete('xy_merchant_product_third', {
        merchant_product_id: merchant_product_id,
        third_platform_id: third_platform_id
    });
    let option = {};
    if (mpt_code) {
        option.innerid = sc.guid();
        option.merchant_product_id = merchant_product_id;
        option.merchant_product_third_code = mpt_code;
        option.third_platform_id = third_platform_id;
        option.merchant_id = merchant_id;
        option.creater_id = modified_id;
        option.created_time = modified_time;
        return db.insert('xy_merchant_product_third', option);
    }
};

/**
 * 新增商户药品
 * */
exports.addMerchantProduct = async (obj) => {
    return db.insert('xy_merchant_product', obj);
};

/**
 * 新增商户商品第三方编号(美团)
 * */
exports.addMerchantProductThird = async (innerid, mpt_code, third_platform_id, merchant_product_id, merchant_id, creater_id, created_time) => {
    let option = {
        innerid: innerid,
        merchant_product_third_code: mpt_code,
        third_platform_id: third_platform_id,
        merchant_product_id: merchant_product_id,
        merchant_id: merchant_id,
        creater_id: creater_id,
        created_time: created_time
    }
    return db.insert('xy_merchant_product_third', option);
};

/**
 * 批量新增商户药品
 * */
exports.addMerchantProductBatch = async (merchant_id, obj) => {
    let conn = await db.getConnection('xy_merchant_product');
    let now = new Date();
    let isBeginTransaction = false;
    try {
        await conn.beginTransaction();
        isBeginTransaction = true;
        for (let i = 0; i < obj.length; i++) {
            let sql = sc.db().makeSQLInsert('xy_merchant_product', {
                innerid: sc.guid(),
                product_id: obj[i].product_id,
                merchant_id: merchant_id,
                product_no: obj[i].product_no,
                batch: obj[i].batch,
                batch_number: obj[i].batch_number,
                electronic_monitoring_code: obj[i].electronic_monitoring_code,
                expire_date: obj[i].expire_date,
                customer_price: obj[i].customer_price,
                price: obj[i].price,
                created_time: now,
                is_deleted: 0,
            });
            await conn.query(sql);
        }
        await conn.commit();
    } catch (e) {
        if (conn && isBeginTransaction) conn.rollback();
        throw app.err.dbOpertationFailed;
    } finally {
        if (conn) conn.release();
    }
};

//检查商户的商品：商户+药品+批次+批号唯一
exports.checkUnique = (obj, innerid) => {
    let options = {
        product_id: obj.product_id,
        merchant_id: obj.merchant_id,
        batch_number: obj.batch_number,
        batch: obj.batch,
        innerid: innerid,
    };
    let sql = 'SELECT COUNT(innerid) AS total FROM xy_merchant_product WHERE merchant_id = @merchant_id@ AND product_id=@product_id@ AND batch=@batch@ AND batch_number=@batch_number@ AND is_deleted=0';
    if (innerid) {
        sql += ` AND innerid != @innerid@`;
    }
    sql += ` LIMIT 1`;
    console.info(sql);
    return db.execute(sql, options);
};

//检查商户的商品表是否存在相同的国际条码
exports.checkUniqueBatch = (merchant_id, barCodeList) => {
    let options = {
        merchant_id: merchant_id,
        barCodeList: barCodeList.split(',')
    };
    let sql = `SELECT GROUP_CONCAT(xp.bar_code) AS barCodeList FROM xy_merchant_product xmp LEFT JOIN xy_product xp ON xmp.product_id = xp.innerid
               WHERE xmp.merchant_id=@merchant_id@ and  xp.bar_code IN (@barCodeList@) ;`
    return db.getOne(sql, options);
}
