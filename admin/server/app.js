
/**
 * Created by obel on 2019/12/17.
 */
/**
 * 服务入口文件
 */
const sc = require('smartacjs');
const app=sc.app();
app.programType="admin";
async function main(){
  // 加载错误定义
  app.err=require("../../public/err");
  // 加载部分资源
  app.res = require("./js/res");
  // 加载http服务器
  app.web=require("./js/http_server");
  // 加载云端server接口
  app.cloud = require('./js/cloud_common_api');

}
// 关闭多进程
sc.isCluster=false;
sc.runMain(main);
