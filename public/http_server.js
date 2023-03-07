/**
 * Created by Simon on 2017/10/20.
 */
"use strict";
const sc = require('smartacjs');
const url=require('url');
const err=require('./err');
class HTTPServer{
    constructor(name,port,http){
        let self=this;
        this.log=sc.createNamedLog(name);
        if (http===undefined) http = require('http');
        this.server = http.createServer(function (request, response) {
            self.onHTTPRequest(request,response);
        });

        this.server.listen(port, function (err) {
            if (err) {
                console.error('HttpServer Start Error!,%s', err);
                process.exit(4);
            }
            console.log('HttpServer Start OK!Port:%d', port);
        });
        this.router={};
        this.router['*']=function(request,response){
            self.defaultProcess(request,response);
        }

    };
    onHTTPRequest(request, response) {
        const httpRouter = this.router;
        console.log("request route: " + request.url);
        request._url = url.parse(request.url, true);
        //let url_array = request._url.pathname.split('/');
        let processer = httpRouter[request._url.pathname];
        if (processer) {
            try {
                response.setHeader("Access-Control-Allow-Origin", "*");
                response.setHeader('Content-Type', 'text/plain');
                processer(request, response);
            }
            catch (e) {
                console.error("process url crash!url='%s',err='%s'", request._url, e);
                this.httpError(response, err.http.systemError);
            }
        }
        else {
            // 没有处理器,直接处理
            httpRouter["*"](request, response);
        }
    }

    defaultProcess(request, response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Content-Type", "text/javascript;charset=UTF-8");
        // ajax请求时，会先有一次OPTIONS请求
        if (request.method === 'OPTIONS') {
            response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, HEAD, OPTIONS');
            response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
            response.setHeader('Content-Length', 0);
            this.httpError(response, err.http.success);
            return;
        }
        this.httpError(response, err.http.success);
    };

    httpError(response, err) {
        response.statusCode = err.errcode;
        response.end(err.errmsg);
    };

// 发送HTTP回应
    httpResponse(response, obj) {
        response.statusCode = 200;
        if (typeof (obj) !== 'string') {
            obj = JSON.stringify(obj);
        }
        response.end(obj);
    };
    // 接收字符串POST数据
    recvStringData(request,encoding){
        return new Promise(function (resolve, reject){
            if (encoding===undefined) encoding='utf8';
            // 接收消息体
            request.setEncoding(encoding);
            let postData = "";
            request.addListener('data', function (data) {
                postData += data;
            });
            request.addListener('end', function () {

                resolve(postData);
            });
        });
    }
    recvJSONData(request,encoding){
        let self=this;
        return this.recvStringData(request,encoding).then(function(data){
            try{
                return JSON.parse(data);
            }catch(e){
                self.log.log("parse json fail!string=%s",data);
                return null;
            }
        })
    }
}

exports.createServer = function (name,port,http) {
    return new HTTPServer(name,port,http);
};
