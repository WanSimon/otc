/**
 * Created by obel on 2019/12/17.
 * 路由操作
 * 1、程序启动时，加载所有路由
 * 2、路由限制，token验证，权限验证等
 */

const sc = require('smartacjs');
const app=sc.app();
const route = require('koa-router');
const fs = require('fs');
const path = require('path');
const router = new route();

/**
 * 路由初始化
 * @param {} httpserver
 */
exports.init = function (httpserver) {
  loadRoute(httpserver);
  verifiyRoute(httpserver);
};


const whiteRouter = {
  POST:new Set(['/user/login']),
  GET:new Set([]),
  PUT:new Set([]),
  DELETE:new Set([]),
};

/**
 * 路由限制
 * @param httpserver
 */
function verifiyRoute(httpserver) {
  httpserver.use(async (ctx, next) => {
    console.info("rcv method:%s,url:%s", ctx.request.method, ctx.request.url);
    let method = ctx.request.method;
    let url = ctx.request.url;
    //特例路由 放行
    if(whiteRouter[method] && whiteRouter[method].has(url)){
      await next();
      return;
    }
    try {
      let session_id = ctx.request.header.token;
      if(!session_id) throw app.err.noSession;
      let user = await app.session.getUser(session_id);
      if(!user) throw app.err.noSession;

      let last_timestamp = user.last_timestamp;
      let now_timestamp = new Date().getTime();
      // 超过300秒
      if((now_timestamp - last_timestamp) > 300000 ){
        // 重置user
        await app.session.reSetUser(session_id,user);
      }
      else{
        //更新session过期时间
        await app.session.refreshExpire(session_id);
      }

      //TODO 用role字段区分角色, 主要是分离出超级管理员

      //存储用户信息
      ctx.user = user;
      await next();
    }
    catch (e) {
      console.error("handle request [url:%s,method:%s] failed,err=%s", url, method, e);
      ctx.body = {
        errcode: e.errcode || app.err.fail.errcode,
        errmsg: e.errmsg||app.err.fail.errmsg
      };
    }
  });
}

/**
 * 加载路由
 */
function loadRoute(httpserver) {
  let filePath = path.resolve(__dirname, '../biz');
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.error(`router files load ,err :${err} `);
    }
    files.forEach(file => {
      console.info(`load router file :${filePath}\\${file} `);
      let routers = require(`${filePath}/${file}`).routers;
      for (let method in routers) {
        for (let route in routers[method]) {
          router[method](route, async (ctx, next) => {
            try {
              let data = await routers[method][route](ctx, next);
              ctx.body = {
                errcode: app.err.success.errcode,
                data:data||{}
              };
              console.log("handle request [url:%s,method:%s] success,response=%s", route, method, data);
            }
            catch (e) {
              console.error("handle request [url:%s,method:%s] failed,err=%s", route, method, e);
              ctx.body = {
                errcode: e.errcode || app.err.fail.errcode,
                errmsg: e.errmsg||app.err.fail.errmsg
              };
            }
          });
        }
      }
    });
    httpserver.use(router.routes()).use(router.allowedMethods());
  });
}

