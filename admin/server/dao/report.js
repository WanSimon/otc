/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取订单月汇总报表
 * */
exports.getOrderMonthSummaryList = (pageSize, pageIndex, merchant_list, merchant_id, summary_date, status) => {
    let options = {
        pageSize,
        pageIndex
    };
    let sql = `SELECT xmo.innerid,xmo.summary_date, xmo.order_count,xmo.failed_order_count,xmo.wechat_refund_amount,xmo.wechat_pay_amount,
             xmo.ali_pay_amount,xmo.ali_refund_amount,xm.fullname AS short_name,xmo.status
             FROM xy_merchant_order_month_summary AS xmo
             LEFT JOIN xy_merchant xm ON xmo.merchant_id = xm.innerid WHERE 1=1 `;

    if (merchant_id) {
        options.merchant_id = merchant_id;
        sql += ' AND xmo.merchant_id = @merchant_id@ ';
    } else {
        sql += ` AND  xmo.merchant_id in (${merchant_list})`;
    }

    if (summary_date && Array.isArray(summary_date)) {
        let month1 = `${summary_date[0]}`;
        let month2 = `${summary_date[1]}`;
        sql += ` AND xmo.summary_date >= '${month1}' AND xmo.summary_date <= '${month2}'`;
    }
    if (status !== "" && status !== undefined) {
        sql += ` AND xmo.status = '${status}'`;
    }
    sql += ' ORDER BY xmo.summary_date ';

    return db.getPage(sql, options);
};

/**
 * 更改订单月汇总状态
 * */
exports.updateOrderMonthSummaryStatus = (innerid, status) => {
    return db.update('xy_merchant_order_month_summary', {status}, {innerid});
};
