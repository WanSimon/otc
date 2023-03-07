const sc = require('smartacjs');
const app = sc.app();// 获取全局APP对象
const log=sc.createNamedLog("cloud_interface");
const crypto = require('crypto');


class cloudInterface {
  constructor(url,appId,secretKey) {
    // 统一地址
    this.url = url;
    this.sessionid = null;
    this.appId = appId;
    this.secretKey = secretKey;
    this.routers = {
      refund:"/api/v1/ceorder/refundPay",
      login:"/api/v1/ceauth/webLogin",
      partRefund:"/api/v1/ceorder/partRefund"
    };
  }

  _sign(params){
    let keys = ['appId'];
    for (let key in params){
      if('appId' === key) continue;
      keys.push(key);
    }
    keys.sort();
    let ret = '';
    params.appId = this.appId;
    for (let i = 0; i < keys.length; ++i){
      let key = keys[i];
      if (i !== 0) ret += '&';
      let value = params[key];
      if (typeof value == "string"){
        ret  += key + '=' + value;
      }else{
        ret += key + '=' + JSON.stringify(value);
      }
    }
    ret += this.secretKey;
    return crypto.createHash('md5').update(ret).digest('hex').toLowerCase();
  }

  _signParams(params){
    params.sig = this._sign(params);
    params.appId = this.appId;
    return params;
  }

  /**
   * @param {string} op_account_id 操作退款人id
   * @param {string} trade_no 订单号
   * @param {number} refund_fee 退款金额
   * @param {string} comment 备注
   * */
  async refund(op_account_id,trade_no,refund_fee,comment){
    log.log('refund start.');
    log.debug('input<->op_account_id:%s,trade_no:%s,refund_fee:%d,comment:%s',op_account_id,trade_no,refund_fee,comment);
    let data = {
      op_account_id,
      trade_no,
      refund_fee,
      comment
    };
    let options = {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'sessionid':this.sessionid,
        'loginType':3
      },
      timeout:10000,
      data:this._signParams(data)
    };
    try{
      let res = await sc.httpRequest(this.url+this.routers.refund,options);
      log.debug('output<->%s',res);
      res = JSON.parse(res);
      if(res && res.code == 1000){}
      else {
        throw new Error(res.msg||'unkown error');
      }
    }
    catch (e) {
      log.error('refund fail,err=%s',e);
      throw e;
    }
    log.log('refund end.');
  }

  /**
   * 部分退款
   * @param {string} op_account_id 操作退款人id
   * @param {string} order_id 订单id
   * @param {Array} refund_details_list  [{
        "merchant_product_id":"795a7782-8a2e-468e-a247-1f9eb82e10ed",
        "refund_count":2}]
   * */
  async partRefund(op_account_id,order_id,refund_details_list){

    log.log('partRefund start.');
    log.debug('input<->op_account_id:%s,order_id:%s,refund_details_list:%s',op_account_id,order_id,refund_details_list);
    let data = {
      op_account_id,
      order_id,
      refund_details_list
    };

    let options = {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'sessionid':this.sessionid,
        'loginType':3
      },
      timeout:10000,
      data:this._signParams(data)
    };
    try{
      let res = await sc.httpRequest(this.url+this.routers.partRefund,options);
      log.debug('output<->%s',res);
      res = JSON.parse(res);
      if(res && res.code == 1000){}
      else {
        throw new Error(res.msg||'unkown error');
      }
    }
    catch (e) {
      log.error('partRefund fail,err=%s',e);
      throw e;
    }
    log.log('partRefund end.');
  }

  /**
   * @param {string} login_id 账号
   * @param {string} pwd 密码
   * */
  async login(login_id,pwd){
    log.log('login start.');
    log.debug('input<->login_id:%s,pwd:%s',login_id,pwd);
    let data = {
      login_id,
      pwd
    };
    let options = {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'loginType':3
      },
      timeout:10000,
      data:this._signParams(data)
    };
    try{
      let res = await sc.httpRequest(this.url+this.routers.login,options);
      log.debug('output<->%s',res);
      res = JSON.parse(res);
      if(res && res.code == 1000){
        this.sessionid = res.data.sessionid;
        return this.sessionid;
      }
      else {
        throw new Error(res.msg||'unkown error');
      }
    }
    catch (e) {
      log.error('refund fail,err=%s',e);
      throw e;
    }
    log.log('login end.');
  }
}
module.exports = new cloudInterface(app.conf.cloudServer.url,app.conf.cloudServer.appId,app.conf.cloudServer.secretKey);
