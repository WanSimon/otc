/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取药品列表
 * */
exports.getList = (pageSize, pageIndex, name, bar_code, manufacturer) => {
  let options = {
    pageSize,
    pageIndex
  };
  let sql = `SELECT innerid,name,alias,approval_number,bar_code,product_category_list_id,product_length,product_height,product_width,brand,
                    unit,manufacturer,origin_place,operator_category_id,min_day,max_day,usage_dosage,treatment_course,eat_time,product_function,adverse_reaction,
                    taboo,attention,interactions,specification,expiration_date,product_status,add_source,home_thumb_url,analeptic_flag,ephedrine_flag,sale_status,front_image_url,
                    back_image_url,is_deleted,remark,creater_id,created_time
             FROM xy_product WHERE 1=1 AND is_deleted=0`;
  if (name) {
    sql += ` AND name LIKE '%${name}%' `;
  }
  if (bar_code) {
    sql += ` AND bar_code LIKE '%${bar_code}%' `;
  }
  if (manufacturer) {
    sql += ` AND manufacturer LIKE '%${manufacturer}%' `;
  }
  sql += ` ORDER BY created_time DESC `;
  return db.getPage(sql, options);
};

/**
 * 获取药品详情
 * */
exports.getProductID = (innerid) => {
  let sql = `SELECT xp.innerid,xp.name,xp.alias,xp.approval_number,xp.bar_code,xp.product_category_list_id,xp.product_length,xp.product_height,xp.product_width,xp.brand,
                    xp.unit,xp.manufacturer,xp.origin_place,xp.operator_category_id,xp.min_day,xp.max_day,xp.usage_dosage,xp.treatment_course,xp.eat_time,xp.product_function,xp.adverse_reaction,
                    xp.taboo,xp.attention,xp.interactions,xp.specification,xp.expiration_date,xp.product_status,xp.add_source,xp.home_thumb_url,xp.analeptic_flag,xp.ephedrine_flag,xp.sale_status,xp.front_image_url,
                    xp.back_image_url,xp.product_detail,xp.is_deleted,xp.remark,xp.creater_id,xp.created_time,GROUP_CONCAT(xps.symptom_id) AS symptom_id
             FROM xy_product AS xp 
             LEFT JOIN xy_product_symptom xps ON xp.innerid = xps.product_id 
             WHERE xp.innerid = @innerid@
             GROUP BY xp.innerid `;
  return db.getOne(sql, {innerid});
};


/**
 * 删除药品
 * */
exports.delProduct = async (innerid) => {
  let sql = `update xy_product set is_deleted=1 where innerid in (@innerid@)`;
  return db.execute(sql, {innerid});
};

/**
 * 检查是否能被删除
 * */
exports.checkCanDelete = innerid => {
  let sql = 'SELECT COUNT(innerid) AS total FROM xy_merchant_product WHERE product_id in (@innerid@) AND is_deleted=0';
  return db.getOne(sql, {innerid});
};
/**
 * 更改药品
 * */
exports.updateProduct = async (innerid, obj, imageObj, symptomIds) => {
  let conn = await db.getConnection('xy_product');
  let sqlArr = [];
  sqlArr.push(sc.db().makeSQLUpdate('xy_product', obj, {innerid}));
  sqlArr.push(sc.db().makeSQLDelete('xy_product_image', {product_id: innerid}));
  sqlArr.push(sc.db().makeSQLDelete('xy_product_symptom', {product_id: innerid}));
  for (let val in imageObj) {
    let type = '';
    switch (val) {
      case 'homeImage':
        type = 1;
        break;
      case 'frontImage':
        type = 2;
        break;
      case 'backImage':
        type = 3;
        break;
      case 'comparisonImage':
        type = 4;
        break;
      case 'otherImage':
        type = 10;
        break;
    }
    for (let i = 0; i < imageObj[val].length; i++) {
      let sql = sc.db().makeSQLInsert('xy_product_image', {
        innerid: sc.guid(),
        product_id: innerid,
        sort_no: i + 1,
        image_url: imageObj[val][i],
        type: type,
        is_deleted: 0,
        creater_id: obj.modified_id,
        created_time: obj.modified_time
      });
      sqlArr.push(sql);
    }
  }
  for (let i = 0; i < symptomIds.length; i++) {
    let sql = sc.db().makeSQLInsert('xy_product_symptom', {
      innerid: sc.guid(),
      product_id: innerid,
      symptom_id: symptomIds[i],
      creater_id: obj.modified_id,
      created_time: obj.modified_time
    });
    sqlArr.push(sql);
  }
  let isBeginTransaction = false;
  try {
    await conn.beginTransaction();
    isBeginTransaction = true;

    for (let i = 0; i < sqlArr.length; i++) {
      await conn.query(sqlArr[i]);
    }
    await conn.commit();
  } catch (err) {
    if (conn && isBeginTransaction) {
      conn.rollback();
    }
    throw app.err.dbOpertationFailed;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};


/**
 * 新增药品
 * */
exports.addProduct = async (innerid, obj, imageObj, symptomIds) => {
  let conn = await db.getConnection('xy_product');
  let sqlArr = [];
  sqlArr.push(sc.db().makeSQLInsert('xy_product', {...obj, innerid: innerid}));
  for (let val in imageObj) {
    let type = '';
    switch (val) {
      case 'homeImage':
        type = 1;
        break;
      case 'frontImage':
        type = 2;
        break;
      case 'backImage':
        type = 3;
        break;
      case 'comparisonImage':
        type = 4;
        break;
      case 'otherImage':
        type = 10;
        break;
    }
    for (let i = 0; i < imageObj[val].length; i++) {
      let sql = sc.db().makeSQLInsert('xy_product_image', {
        innerid: sc.guid(),
        product_id: innerid,
        sort_no: i + 1,
        image_url: imageObj[val][i],
        type: type,
        is_deleted: 0,
        creater_id: obj.creater_id,
        created_time: obj.created_time
      });
      sqlArr.push(sql);
    }
  }
  for (let i = 0; i < symptomIds.length; i++) {
    let sql = sc.db().makeSQLInsert('xy_product_symptom', {
      innerid: sc.guid(),
      product_id: innerid,
      symptom_id: symptomIds[i],
      creater_id: obj.creater_id,
      created_time: obj.created_time
    });
    sqlArr.push(sql);
  }
  let isBeginTransaction = false;
  try {
    await conn.beginTransaction();
    isBeginTransaction = true;
    for (let i = 0; i < sqlArr.length; i++) {
      await conn.query(sqlArr[i]);
    }
    await conn.commit();
  } catch (err) {
    if (conn && isBeginTransaction) {
      conn.rollback();
    }
    throw app.err.dbOpertationFailed;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

/**
 * 批量新增药品
 * */
exports.addProductBatch = async (body) => {
  let conn = await db.getConnection('xy_product');
  let now = new Date();
  let isBeginTransaction = false;
  try {
    await conn.beginTransaction();
    isBeginTransaction = true;
    for (let i = 0; i < body.length; i++) {
      let sql = sc.db().makeSQLInsert('xy_product', {
        innerid: body[i].innerid,
        name: body[i].name,
        alias: body[i].name,
        approval_number: body[i].approval_number,
        bar_code: body[i].bar_code,
        product_length: body[i].product_length,
        product_height: body[i].product_height,
        product_width: body[i].product_width,
        specification: body[i].specification,
        brand: body[i].brand,
        manufacturer: body[i].manufacturer,
        origin_place: body[i].origin_place,
        min_day: body[i].min_day,
        max_day: body[i].max_day,
        usage_dosage: body[i].usage_dosage,
        treatment_course: body[i].treatment_course,
        expiration_date: body[i].expiration_date,
        product_function: body[i].product_function,
        adverse_reaction: body[i].adverse_reaction,
        taboo: body[i].taboo,
        attention: body[i].attention,
        interactions: body[i].interactions,
        creater_id: body[i].creater_id,
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
}

/**
 * 获取药品图片
 * */
exports.getProductImage = product_id => {
  let sql = `SELECT image_url,type FROM xy_product_image WHERE product_id=@product_id@ AND is_deleted=0; `;
  return db.execute(sql, {product_id});
};

//键值对
exports.getPairs = (keywords) => {
  let sql = `SELECT innerid,name,bar_code FROM xy_product WHERE is_deleted=0 `;
  if (keywords) {
    sql += ` AND ( name LIKE '%${keywords}%' OR bar_code LIKE '%${keywords}%') `;
  }
  sql += ` LIMIT 10; `;
  return db.execute(sql, {keywords});
};

/**
 * 检查药品唯一性：国际条形码bar_code
 * */
exports.checkUnique = (bar_code, innerid) => {
  let options = {bar_code};
  let sql = 'SELECT COUNT(*) AS num FROM xy_product WHERE bar_code=@bar_code@ AND is_deleted=0';
  if (innerid) {
    options.innerid = innerid;
    sql += ` AND innerid != @innerid@`;
  }
  sql += ` LIMIT 1`;
  return db.getOne(sql, options);
};

/**
 * 批量检查药品唯一性：国际条形码bar_code
 * */
exports.checkUniqueBatch = (barCodeList) => {
  let options = {barCodeList};
  let sql = 'SELECT GROUP_CONCAT(bar_code) AS barCodeList,GROUP_CONCAT(innerid) AS idList FROM xy_product WHERE bar_code IN (@barCodeList@) AND is_deleted=0';
  return db.getOne(sql, options);
};

/**
 * 获取当天自动生成的最后一个国际条码
 * @param {string} prefix 例如：720210107
 * */
exports.getLastAutoBarcode = (prefix) => {
  let sql = ` SELECT bar_code FROM xy_product WHERE bar_code LIKE '${prefix}%' ORDER BY bar_code DESC LIMIT 1 `;
  return db.execute(sql);
};

/**
 * 添加商品摆放
 * */
exports.addProductDisplay = (product_id, displays, creater_id) => {
  let sqlArr = [];
  let now = new Date();
  for (let i = 0; i < displays.length; i++) {
    let options = {
      innerid: sc.guid(),
      product_id,
      display: displays[i].display,
      show_image_url: displays[i].image_id,
      created_time: now,
      creater_id,
    };
    let sql = sc.db().makeSQLInsert('xy_product_display', options);
    sqlArr.push(sql);
  }
  return db.transaction(sqlArr);
};

/**
 * 更新商品摆放
 * */
exports.updateProductDisplay = (displays, modified_id) => {
  let sqlArr = [];
  let now = new Date();
  for (let i = 0; i < displays.length; i++) {
    let options = {
      display: displays[i].display,
      show_image_url: displays[i].image_id,
      modified_time: now,
      modified_id,
    };
    let sql = sc.db().makeSQLUpdate('xy_product_display', options, {innerid: displays[i].innerid});
    sqlArr.push(sql);
  }
  return db.transaction(sqlArr);
};

/**
 * 删除商品摆放
 * */
exports.delProductDisplay = (innerid) => {
  let sql = `DELETE FROM xy_product_display WHERE innerid in (@innerid@)`
  return db.execute(sql, {innerid});
};
/**
 * 获取商品摆放
 * */
exports.getProductDisplay = (innerid) => {
  let sql = `SELECT innerid,display,show_image_url FROM xy_product_display WHERE product_id = @innerid@`
  return db.execute(sql, {innerid});
}

/**
 * 该商品摆放方式是否被使用
 * */
exports.getBeUsedDisplay = (innerid) => {
  let sql = `SELECT innerid,product_display FROM xy_equipment_product WHERE product_display = @innerid@`
  return db.execute(sql, {innerid});
}

/**
 * 获取商品摆放图片用于下拉选择
 * */
exports.getDisplayImage = (product_id,type) => {
  let sql = `SELECT innerid, product_id, sort_no, image_url, type, remark FROM xy_product_image WHERE  is_deleted = 0 AND product_id = @product_id@ AND type in (${type})`
  return db.execute(sql, {product_id});
}
