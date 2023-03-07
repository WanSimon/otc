/**
 * Created by obel on 2019/12/17.
 */
const conf = require("../../conf");
module.exports = conf;

conf.port = "8080";

// 1：OTC 药机 2：处方药机
conf.mode = 1;

// cloudServer地址
conf.cloudServer = {
  url: "http://192.168.101.71:8080",
  appId: "equipment",
  secretKey: "xy123456",
};
