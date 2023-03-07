const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 成交额
 * */
exports.getTotal = (merchant_list, pay_status, date) => {
  let sql = `SELECT SUM(pay_amount) AS amount FROM xy_order WHERE pay_status = ${pay_status} AND merchant_id in (${merchant_list}) `;
  if (date) {
    sql += ` AND DATE_FORMAT(created_time, '%Y%m' ) = DATE_FORMAT( CURDATE( ) , '%Y%m' )`;
  }
  return db.getOne(sql);
}

/**
 * 药品销量排行
 * */
exports.getProductSales = (pageSize, pageIndex, merchant_list, pay_status) => {
  let options = {
    pageSize,
    pageIndex
  };
  let sql = `SELECT xp.name, SUM(xod.product_count) AS num FROM xy_order_detail xod
  INNER JOIN xy_order xo ON xod.order_id = xo.innerid 
  INNER JOIN xy_merchant_product xmp ON xod.merchant_product_id = xmp.innerid
  INNER JOIN xy_product xp ON xmp.product_id = xp.innerid 
  WHERE DATE_FORMAT(xo.created_time, '%Y%m' ) = DATE_FORMAT( CURDATE( ) , '%Y%m' ) AND xo.pay_status = ${pay_status} AND xo.merchant_id in (${merchant_list})
  GROUP BY xod.merchant_product_id
  ORDER BY num DESC ;`;
  return db.getPage(sql, options);
}

/**
 * 今日交易量
 * */
exports.getOrderCount = (obj) => {
  let sql = `SELECT COUNT(*) AS order_count FROM xy_order WHERE merchant_id in (${obj.merchant_list}) AND order_status = ${obj.order_status}`;
  if (obj.date && Array.isArray(obj.date)) {
    let date1 = `${obj.date[0]}`;
    let date2 = `${obj.date[1]}`;
    sql += ` AND created_time >= '${date1}' AND created_time <= '${date2}';`;
  }
  return db.execute(sql);
};

/**
 * 订单来源
 * */
exports.getOrderSource = ({merchant_list, date, pay_status}) => {
  let sql = `SELECT source,source_id, COUNT(*) AS num FROM xy_order WHERE pay_status = ${pay_status} AND merchant_id in (${merchant_list})`
  if (date && Array.isArray(date)) {
    let date1 = `${date[0]}`;
    let date2 = `${date[1]}`;
    sql += ` AND created_time >= '${date1}' AND created_time <= '${date2}'`;
  }
  sql += ` GROUP BY source,source_id ;`;
  return db.execute(sql);
}

/**
 * 会员数
 * */
exports.getCustomer = () => {
  let sql = `SELECT count(*) AS count FROM xy_customer WHERE is_deleted = 0 ;`;
  return db.getOne(sql);
};

/**
 * 会员增长趋势
 * */
exports.getCustomerTrend = () => {
  let sql = ` SELECT COUNT(*) AS num , date(created_time) AS date_str  FROM xy_customer WHERE DATE_SUB(CURDATE(), INTERVAL 2 DAY) <= date(created_time) GROUP BY date_str;`;
  return db.execute(sql);
};

/**
 * 成交额分布
 * */
exports.getDistribution = (obj) => {
  let sql = '';
  if (obj.type == 'year') {
    sql = `SELECT DATE_FORMAT(created_time, '%Y') AS  date_str, SUM(pay_amount) AS amount FROM xy_order WHERE pay_status = ${obj.pay_status}  AND merchant_id in (${obj.merchant_list})`
  } else if (obj.type == 'month') {
    sql = `SELECT DATE_FORMAT(created_time, '%Y-%m') AS  date_str, SUM(pay_amount) AS amount FROM xy_order WHERE pay_status = ${obj.pay_status}  AND merchant_id in (${obj.merchant_list})`
  } else {
    sql = `SELECT DATE_FORMAT(created_time, '%Y-%m-%d') AS  date_str, SUM(pay_amount) AS amount FROM xy_order WHERE pay_status = ${obj.pay_status}  AND merchant_id in (${obj.merchant_list})`
  }
  if (obj.date && Array.isArray(obj.date)) {
    let date1 = `${obj.date[0]}`;
    let date2 = `${obj.date[1]}`;
    sql += ` AND created_time >= '${date1}' AND created_time <= '${date2}'`;
  }
  sql += ' GROUP BY date_str;'
  return db.execute(sql);
}

/**
 * 成交额占比
 * */
exports.getProportion = ({merchant_list, date, pay_status}) => {
  let sql = `SELECT source,source_id, SUM(pay_amount) AS amount FROM xy_order WHERE pay_status = ${pay_status} AND merchant_id in (${merchant_list})`
  if (date && Array.isArray(date)) {
    let date1 = `${date[0]}`;
    let date2 = `${date[1]}`;
    sql += ` AND created_time >= '${date1}' AND created_time <= '${date2}'`;
  }
  sql += ` GROUP BY source,source_id ;`;
  return db.execute(sql);
}

/**
 * 设备状态总览
 * */
exports.getDeviceStatus = (merchant_list) => {
  let sql = `SELECT status, COUNT(*) AS num from xy_equipment WHERE is_deleted = 0  AND merchant_id in (${merchant_list}) GROUP BY status`
  return db.execute(sql);
}

/**
 * 设备成交额排行
 * */
exports.getDeviceSales = (merchant_list,pay_status) => {
  let sql = `SELECT xe.name , sum(xo.pay_amount) AS amount FROM xy_order xo
      INNER JOIN xy_equipment xe ON xo.equipment_id = xe.innerid
      WHERE xo.pay_status = ${pay_status} AND xe.merchant_id in (${merchant_list})
      GROUP BY xo.equipment_id 
      ORDER BY amount DESC LIMIT 10`
  return db.execute(sql);
}

/**
 * 设备地址分布
 * */
exports.getDeviceAddress = (merchant_list) => {
  let sql = `SELECT COUNT(*) AS num, xeg.province AS name 
  FROM xy_equipment xe 
  LEFT JOIN xy_equipment_group xeg ON xe.group_id = xeg.innerid 
  WHERE xe.is_deleted = 0 AND xe.merchant_id in (${merchant_list})
  GROUP BY xeg.province`
  return db.execute(sql);
}
