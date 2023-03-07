/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app=sc.app();
const db = app.db;


/**
 * 获取取货单列表
 * */
exports.getList = (equipment_id,serial_no,status)=>{
  let options = {
    equipment_id
  };
  let sql = `SELECT xeo.slot_no,xeo.status,xo.serial_no,xeo.innerid,xeo.order_id
             FROM xy_equipment_order xeo
             LEFT JOIN xy_order xo ON xeo.order_id = xo.innerid WHERE xeo.equipment_id = @equipment_id@ `
  if(serial_no){
    sql +=`AND xo.serial_no LIKE '%${serial_no}%'`
  }
  if(status){
    sql +=`AND xeo.status = '${status}'`
  }

  return db.execute(sql,options);
};

/**
 * 变更
 * */
exports.update = (innerid, updateObj)=>{
  return db.update('xy_equipment_order',updateObj,{innerid});
};



