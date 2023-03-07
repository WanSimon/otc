/**
 * Copyright © 2015 Smartac Inc. All rights reserved.
 * Created by Simon on 2015/11/6.
 */
module.exports=
  {
    // 通用配置
    mqUrl:"amqp://192.168.101.71",
    // 日志设定
    logLevel:"trace",
    // 数据库连接串
    dbString:{
      host:'192.168.101.71',
      user:'root',
      password:'123456',
      database:'xy_bak',
      port:3306
    },
    //dbString:"MySQL://htbuser:htbdev0519@172.16.0.131/hotspot_v10?multipleStatements=true&charset=utf8mb4",
    // 数据库连接池大小
    dbConnectionSize:20,
    // Redis地址
    redisUrl:"redis://192.168.101.71:6379"
  }
exports.dbRString=exports.dbString;
exports.dbWString=exports.dbString;
