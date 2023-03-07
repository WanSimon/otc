/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app = sc.app();
const db = app.db;


/**
 * 获取设备版本详情
 * */
exports.getDeviceAppById = (equipment_id) => {
  let sql = 'SELECT innerid AS device_app_id, current_version_id, update_time, refresh_version_id, is_force ,is_ignore FROM xy_equipment_app WHERE equipment_id = @equipment_id@';
  return db.execute(sql, {equipment_id});
};

/**
 * 新增设备版本
 * */
exports.addDeviceApp = async (obj) => {
  return db.insert('xy_equipment_app', obj);
};

/**
 * 更改设备版本
 * */
exports.updateDeviceApp = async (obj) => {
  return db.update('xy_equipment_app', obj, {innerid: obj.innerid});
};
