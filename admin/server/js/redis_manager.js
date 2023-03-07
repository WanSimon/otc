/**
 * Created by obel on 2019/12/26.
 */

const sc = require("smartacjs");
const app = sc.app();
const merchantDao = require('../dao/merchant');

class RedisStore {
  constructor() {
    this.redis = app.redis;
    this.log = app.redis.log;
    this.TEMP_PREFIX = "xinyao:temp:";
  }

  async getUser(sid) {
    if(this.redis.isConnected){
      try{
        let data = await this.redis.conn.get(`session:user:${sid}`);
        if(data)
          return JSON.parse(data);
        else {
          return false;
        }
      }
      catch (e){
        this.log.error('get session fail,err=%',e);
        return false;
      }
    }
    else {
      this.log.error('get session fail,redis disconnect!');
      return false;
    }
  }

  async setUser(userInfo) {
    try {
      //默认session保存600秒
      let sid = sc.guid22();
      userInfo.last_timestamp =  new Date().getTime();
      userInfo.session_id = sid;
      await this.redis.conn.set(`session:user:${sid}`, JSON.stringify(userInfo), 'EX', 6000);
      return sid;
    } catch (e) {
      this.log.error('set session fail,err=%',e);
      return false;
    }
  }

  async reSetUser(sid,userInfo) {
    try {
      //获取子商户
      let dbData = await merchantDao.getChildList(userInfo.merchant_id);
      userInfo.merchant_list = dbData.merchantList.split(',').map(item=>{return `'${item}'`}).join(',');
      userInfo.last_timestamp = new Date().getTime();

      //默认session保存600秒
      await this.redis.conn.set(`session:user:${sid}`, JSON.stringify(userInfo), 'EX', 6000);
      return sid;
    } catch (e) {
      this.log.error('set session fail,err=%', e);
      return false;
    }
  }

  async refreshExpire(sid) {
     try {
       //console.info(this.redis.conn)
       await this.redis.conn.expire(`session:user:${sid}`, 6000);
       return sid;
     } catch (e) {
       this.log.error('refresh expire fail,err=%',e);
       return false;
     }
  }

  async delUser(sid) {
    try {
      await this.redis.conn.del(`session:user:${sid}`);
      return true;
    } catch (e) {
      this.log.error('remove session fail,err=%',e);
      return false;
    }
  }

  async delEquipment(equipment_id) {
    try {
      await this.redis.conn.del(`${this.TEMP_PREFIX}equipment:${equipment_id}`);
      return true;
    } catch (e) {
      this.log.error('remove session fail,err=%',e);
      return false;
    }
  }

  async delEquipmentGroup(equipment_group_id) {
    try {
      await this.redis.conn.del(`${this.TEMP_PREFIX}equipment_group:${equipment_group_id}`);
      return true;
    } catch (e) {
      this.log.error('remove session fail,err=%',e);
      return false;
    }
  }

  async delProduct(product_id) {
    try {
      await this.redis.conn.del(`${this.TEMP_PREFIX}product:${product_id}`);
      return true;
    } catch (e) {
      this.log.error('remove session fail,err=%',e);
      return false;
    }
  }

  async delMerchantProduct(merchant_product_id) {
    try {
      await this.redis.conn.del(`${this.TEMP_PREFIX}merchant_product:${merchant_product_id}`);
      return true;
    } catch (e) {
      this.log.error('remove session fail,err=%',e);
      return false;
    }
  }

  //获取编号
  async getSerialNumber(mode){
    try {
      let ret = await this.redis.conn.get(`xinyao:serial_number:${mode}`);
      return ret;
    } catch (e) {
      this.log.error('get %s serial number fail, err=%', mode, e);
      return false;
    }
  }
  //设置编号
  async setSerialNumber(mode, value){
    try {
      await this.redis.conn.set(`xinyao:serial_number:${mode}`, value);
      return true;
    } catch (e) {
      this.log.error('set %s serial number fail, err=%', mode, e);
      return false;
    }
  }
  //自增编号
  async incSerialNumber(mode){
    try {
      await this.redis.conn.incr(`xinyao:serial_number:${mode}`);
      return true;
    } catch (e) {
      this.log.error('incr %s serial number fail, err=%', mode, e);
      return false;
    }
  }
  //删除编号
  async delSerialNumber(mode){
    try {
      await this.redis.conn.del(`xinyao:serial_number:${mode}`);
      return true;
    } catch (e) {
      this.log.error('del %s serial number fail, err=%', mode, e);
      return false;
    }
  }

}

let redisManager = new RedisStore();

module.exports = redisManager;
