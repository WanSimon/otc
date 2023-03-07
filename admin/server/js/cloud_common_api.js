/**
 * OTC 药机 和 处方机 统一入口
 * 只定义OTC与处方需差异化处理的方法
 * */
const sc = require('smartacjs');
const app = sc.app();
const cloud_interface = require('./cloud_interface');
const mq_interface = require('./mq_interface');

class Cloud_common_api {
  constructor() {
    this.mode = app.conf.mode;

    if(this.mode === app.common.AdminMode.AM_OTC){
      this.api = cloud_interface;
    }else {
      // 创建MQ连接
      app.mq = sc.RabbitMQ().createConnect(app.conf.mqUrl);
      app.mq.start();
      app.mqInterface = new mq_interface(app.mq,app.conf.instanceName,app.programType);
      app.mqInterface.init();
      this.api = app.mqInterface;
    }
  }

  /**
   * 退款
   * @param op_account_id
   * @param trade_no
   * @param refund_fee  单位分
   * @param comment
   * @param login_id
   * @param pwd
   * */
  async refund(op_account_id,trade_no,refund_fee,comment,login_id,pwd){
    if(this.mode === app.common.AdminMode.AM_OTC){
      await this.api.login(login_id,pwd);
    }
    return this.api.refund(op_account_id,trade_no,refund_fee,comment);
  }

  /**
   * 部分退款
   * @param {string} op_account_id 操作退款人id
   * @param {string} order_id 订单id
   * @param {Array} refund_details_list  [{
        "merchant_product_id":"795a7782-8a2e-468e-a247-1f9eb82e10ed",
        "refund_count":2}]
   * @param login_id
   * @param pwd
   * */
  async partRefund(op_account_id,order_id,refund_details_list,login_id,pwd){
    if(this.mode === app.common.AdminMode.AM_OTC){
      await this.api.login(login_id,pwd);
      return this.api.partRefund(op_account_id,order_id,refund_details_list);
    }
    //处方机暂不支持部分退款
  }
}

let cloud_common_api = new Cloud_common_api();

module.exports =  cloud_common_api;
