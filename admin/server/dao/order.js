/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取订单列表
 * */
exports.getOrderList = (pageSize, pageIndex, sort, merchant_list, merchant_id, equipment_id, serial_no, pay_status, order_status, refund_mark, source, source_id, created_time) => {
  let options = {
    pageSize,
    pageIndex
  };
  let sql = `SELECT m.fullname, e.name AS equipment_name,o.innerid as order_id,o.inner_order_no ,o.source,o.source_id,o.order_status,o.pay_status,o.refund_mark,o.amount,o.customer_amount,o.pay_amount,o.refund_amount,o.pay_type,o.created_time,o.id_card,o.serial_no,c.name AS customer_name,oe.pickup_begin_time,oe.pickup_end_time,oe.finish_time 
            FROM xy_order AS o 
            LEFT JOIN xy_equipment AS e ON o.equipment_id = e.innerid
            LEFT JOIN xy_merchant AS m ON o.merchant_id = m.innerid
            LEFT JOIN xy_customer AS c ON o.customer_id = c.innerid 
            LEFT JOIN xy_order_extend AS oe ON o.innerid = oe.order_id
            WHERE  o.merchant_id in (${merchant_list})  `;
  if (merchant_id) {
    options.merchant_id = merchant_id;
    sql += ' AND o.merchant_id = @merchant_id@ ';
  }
  if (equipment_id) {
    options.equipment_id = equipment_id;
    sql += ' AND o.equipment_id = @equipment_id@ ';
  }
  if (source !== "" && source !== undefined) {
    options.source = `${source}`;
    sql += ' AND o.source = @source@';
  }
  if (source_id !== "" && source_id !== undefined) {
    options.source_id = `${source_id}`;
    sql += ' AND o.source_id = @source_id@';
  }
  if (serial_no) {
    options.serial_no = `%${serial_no}%`;
    sql += ' AND o.serial_no LIKE @serial_no@';
  }
  if (pay_status !== "" && pay_status !== undefined) {
    options.pay_status = pay_status;
    sql += ' AND o.pay_status = @pay_status@ ';
  }
  if (order_status !== "" && order_status !== undefined) {
    options.order_status = order_status;
    sql += ' AND o.order_status = @order_status@ ';
  }
  if (refund_mark !== "" && refund_mark !== undefined) {
    options.refund_mark = refund_mark;
    sql += ' AND o.refund_mark = @refund_mark@ ';
  }
  if (created_time && Array.isArray(created_time)) {
    let time1 = `${created_time[0]}`;
    let time2 = `${created_time[1]}`;
    sql += ` AND o.created_time >= '${time1}' AND o.created_time <= '${time2}'`;
  }
  if (sort.hasOwnProperty('prop') && sort.value !== null) {
    sql += ` ORDER BY o.${sort.prop} ${sort.value}`;
  } else {
    sql += ` ORDER BY o.created_time DESC`;
  }

  return db.getPage(sql, options);
};

/**
 * 获取订单导出列表
 * */
exports.getExcelList = (sort, merchant_list, merchant_id, equipment_id, serial_no, pay_status, order_status, refund_mark, source, source_id, created_time) => {
  let options = {};
  let sql = `SELECT m.fullname,o.innerid as order_id, e.name AS equipment_name,o.inner_order_no ,o.source,o.source_id,o.order_status,o.pay_status,o.refund_mark,o.amount,o.customer_amount,o.pay_amount,o.refund_amount,o.pay_type,o.created_time,o.id_card,o.serial_no,c.name AS customer_name,oe.pickup_begin_time,oe.pickup_end_time,oe.finish_time 
            FROM xy_order AS o 
            LEFT JOIN xy_equipment AS e ON o.equipment_id = e.innerid
            LEFT JOIN xy_merchant AS m ON o.merchant_id = m.innerid
            LEFT JOIN xy_customer AS c ON o.customer_id = c.innerid 
            LEFT JOIN xy_order_extend AS oe ON o.innerid = oe.order_id
            WHERE  o.merchant_id in (${merchant_list})  `;
  if (merchant_id) {
    options.merchant_id = merchant_id;
    sql += ' AND o.merchant_id = @merchant_id@ ';
  }
  if (equipment_id) {
    options.equipment_id = equipment_id;
    sql += ' AND o.equipment_id = @equipment_id@ ';
  }
  if (source !== "" && source !== undefined) {
    options.source = `${source}`;
    sql += ' AND o.source = @source@';
  }
  if (source_id !== "" && source_id !== undefined) {
    options.source_id = `${source_id}`;
    sql += ' AND o.source_id = @source_id@';
  }
  if (serial_no) {
    options.serial_no = `%${serial_no}%`;
    sql += ' AND o.serial_no LIKE @serial_no@';
  }
  if (pay_status !== "" && pay_status !== undefined) {
    options.pay_status = pay_status;
    sql += ' AND o.pay_status = @pay_status@ ';
  }
  if (order_status !== "" && order_status !== undefined) {
    options.order_status = order_status;
    sql += ' AND o.order_status = @order_status@ ';
  }
  if (refund_mark !== "" && refund_mark !== undefined) {
    options.refund_mark = refund_mark;
    sql += ' AND o.refund_mark = @refund_mark@ ';
  }
  if (created_time && Array.isArray(created_time)) {
    let time1 = `${created_time[0]}`;
    let time2 = `${created_time[1]}`;
    sql += ` AND o.created_time >= '${time1}' AND o.created_time <= '${time2}'`;
  }
  if (sort.hasOwnProperty('prop') && sort.value !== null) {
    sql += ` ORDER BY o.${sort.prop} ${sort.value}`;
  } else {
    sql += ` ORDER BY o.created_time DESC`;
  }

  return db.execute(sql,options);
};

/**
 * 根据订单编号查询订单
 * */
exports.getOrderBySerialNo = (serial_no) => {
  let sql = ` SELECT innerid FROM xy_order WHERE serial_no = @serial_no@;`;
  return db.execute(sql, {serial_no});
};

/**
 * 获取订单详情
 * */
exports.getOrderDetailByOrderId = (order_id) => {
  let sql = `SELECT xod.innerid,xod.merchant_product_id,xp.name,xp.specification,xp.manufacturer,IFNULL(xod.refund_count,0) AS refund_count,xod.product_count,xmp.product_no,xp.bar_code FROM xy_order_detail xod 
             LEFT JOIN xy_merchant_product xmp ON xod.merchant_product_id = xmp.innerid
             LEFT JOIN xy_product xp ON xp.innerid = xmp.product_id
             WHERE xod.order_id = @order_id@;`;
  return db.execute(sql, {order_id});
};

/**
 * 获取订单取药监控
 * */
exports.getOrderPickupRecord = (order_id) => {
  let sql = `SELECT innerid, merchant_id, equipment_id, order_id, resource_type, resource_id ,result FROM xy_pickup_record where order_id= @order_id@ ORDER BY created_time DESC`;
  return db.execute(sql, {order_id});
};
