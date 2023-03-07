const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 新增绑定设备商品
 * */
exports.addDeviceProduct = (body) => {
  return db.insert('xy_equipment_product',body);
};

/**
 * 变更绑定设备商品
 * */
exports.updateDeviceProduct = (innerid,body)=>{
  return db.update('xy_equipment_product',body,{innerid});
};

/**
 * 下架设备商品
 * */
exports.delDeviceProduct = (innerid)=>{
  return db.delete(`xy_equipment_product`,{innerid});
};

/**
 * 获取设备商品详情
 * */
exports.getDeviceProductById = (innerid)=>{
  let sql = ` SELECT  xp.name,xp.innerid AS product_id,xep.merchant_id, xep.equipment_id, xep.slot_no, xep.merchant_product_id, xep.real_stock, xep.lock_stock, xep.upper_limit, xep.product_display, xep.product_status,xep.image_comparison,xp.home_thumb_url,xp.product_length,xp.product_height,xp.product_width 
              FROM xy_equipment_product xep
              LEFT JOIN xy_merchant_product xmp ON xep.merchant_product_id = xmp.innerid
              LEFT JOIN xy_product xp ON xp.innerid = xmp.product_id
              WHERE xep.innerid = @innerid@`;
  return db.getOne(sql,{innerid});
};
