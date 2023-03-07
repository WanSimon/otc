/**
 * 设备相关信息变更 更新设备上缓存
 * Created by Administrator on 2020/3/29.
 */

const sc = require('smartacjs');
const app=sc.app();
const db = app.db;

/**
 * 设备变更
 * @param id 设备id
 * */
exports.eqt_change = async id => {
  let sql = 'UPDATE xy_equipment SET status_flag = UUID() WHERE innerid =@innerid@ ';
  await db.execute(sql,{innerid:id});
  await app.session.delEquipment(id);
};

/**
 * 设备组变更
 * @param id 设备组id
 * */
exports.eqt_group_change = async id => {
  let sql = `UPDATE xy_equipment SET status_flag = UUID() WHERE group_id = @group_id@`;
  await db.execute(sql,{group_id:id});
  await app.session.delEquipmentGroup(id);

  let eqt_sql = ` SELECT innerid FROM xy_equipment WHERE group_id = @group_id@`;
  let eqt_list = await db.execute(eqt_sql,{group_id:id});
  for(let i=0;i<eqt_list.length;i++){
    await app.session.delEquipment(eqt_list[i].innerid);
  }
};

/**
 * 租户变更
 * @param id 租户id
 * */
exports.eqt_merchant_change = async id => {
  let sql = `UPDATE xy_equipment SET status_flag = UUID() WHERE merchant_id = @merchant_id@`;
  await db.execute(sql,{merchant_id:id});
  await app.session.delEquipmentGroup(id);

  let eqt_sql = ` SELECT innerid FROM xy_equipment WHERE merchant_id = @merchant_id@`;
  let eqt_list = await db.execute(eqt_sql,{merchant_id:id});
  for(let i=0;i<eqt_list.length;i++){
    await app.session.delEquipment(eqt_list[i].innerid);
  }
};

/**
 * 设备型号变更
 * @param id 设备型号id
 * */
exports.eqt_type_change = async id => {
  let sql = `UPDATE xy_equipment SET status_flag = UUID() WHERE type = @type@`;
  await db.execute(sql,{type:id});

  let eqt_sql = ` SELECT innerid FROM xy_equipment WHERE type = @type@`;
  let eqt_list = await db.execute(eqt_sql,{type:id});
  for(let i=0;i<eqt_list.length;i++){
    await app.session.delEquipment(eqt_list[i].innerid);
  }
};

/**
 * 商家商品变更
 * @param id 商家商品id
 * */
exports.merchant_product_change = async id => {
  //获取包含该商品的设备列表
  let eqt_sql = ` SELECT equipment_id FROM xy_equipment_product WHERE merchant_product_id = @merchant_product_id@`;
  let eqt_list =  await db.execute(eqt_sql,{merchant_product_id:id});
  let eqt_str = eqt_list.map(eqt=>`'${eqt.equipment_id}'`).join(',');
  if(eqt_str){
    let sql = `UPDATE xy_equipment SET status_flag = UUID() WHERE innerid IN (${eqt_str}) `;
    await db.execute(sql);
  }

  await app.session.delMerchantProduct(id);
  for(let i=0;i<eqt_list.length;i++){
    await app.session.delEquipment(eqt_list[i].equipment_id);
  }
};

/**
 * 基础药品变更
 * @param id 基础药品id
 * */
exports.product_change = async id => {
  //获取包含该药品的设备列表
  let eqt_sql = ` SELECT xep.equipment_id
                  FROM xy_equipment_product xep
                  LEFT JOIN xy_merchant_product xmp ON xep.merchant_product_id = xmp.innerid
                  WHERE xmp.product_id = @id@`;
  let eqt_list =  await db.execute(eqt_sql,{id:id});
  let eqt_str = eqt_list.map((eqt)=>{ return `'${eqt.equipment_id}'`;}).join(',');
  if(eqt_str){
    let sql = `UPDATE xy_equipment SET status_flag = UUID() WHERE innerid IN (${eqt_str})`;
    await db.execute(sql);
  }

  await app.session.delProduct(id);
  for(let i=0;i<eqt_list.length;i++){
    await app.session.delEquipment(eqt_list[i].equipment_id);
  }
};

