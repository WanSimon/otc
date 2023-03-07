/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app=sc.app();
const koa = require('koa');
const httpserver = new koa();
const cors = require('koa-cors');
const conf = require('../conf');
const convert = require('koa-convert');
const route = require('./route_control');
const koaBody = require('koa-body');
const serve = require('koa-static');
const path = require('path');

httpserver.use(convert(cors()));
httpserver.use(koaBody({multipart: true}));


httpserver.use(async(ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Headers", "*");
  await next();
});
httpserver.use(serve(path.join(__dirname) + '/public/'));
const init = () => {
  //启动监听
  httpserver.listen(conf.port, () => {
    console.info(`server is starting on port ${conf.port}`);

    //路由加载和控制
    route.init(httpserver);
  });
  /**
   * 全局异常捕获
   */
  httpserver.on("error", (err, ctx) => {
    console.error(`system error :${err};info:${JSON.stringify(ctx)} `);
  });
};

init();
