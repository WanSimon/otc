/**
 * API Server WebSocket接口SDK
 * Created by Simon on 2017/4/14.
 */
"use strict";
let sc = require('smartacjs');
let app = sc.app();// 获取全局APP对象
//let Promise = sc.Promise;
let rabbit=sc.RabbitMQ();
//let inherits = require('util').inherits;
//let EventEmitter = require('events').EventEmitter;
function WebSocketAPI(mq,service_name) {
    if (typeof(mq)==='string')
    {
        this.mq=rabbit.createConnect(app.conf.mqUrl);
        this.mq.start();
    }
    else
    {
        this.mq=mq;
    }
    if (!service_name)service_name='?';
    this.log=sc.createNamedLog("API WS",service_name);
    this.rpc=sc.RabbitMQ().createRPCClient(mq,"ws.rpc");
    mq.declareExchange("ws.event","direct",false,true);
    // 事件处理队列
    let self=this;
    this.notifyQueue=mq.declareQueue("api_sdk."+service_name,function(msg){
        let jsonMsg;
        try{
            jsonMsg=JSON.parse(msg.content);
        }catch(err){
            self.log.error("Parse api websocket event fail!,msg=%s",msg);
            return;
        }
        let sub=self.subscribes[msg.fields.routingKey];
        if (sub && sub[jsonMsg.evt]){
            try{
                let socket_id=jsonMsg.socket_id;
                self.log.log("event '%s',socket_id=%s",jsonMsg.evt,socket_id);
                // 调用客户代码
                sub[jsonMsg.evt](socket_id);
            }catch(err){
                self.log.error("event '%s' crash in user code!err=%s",jsonMsg.evt,err);
            }
        }
    },false,true);
    // ws订阅集合
    this.subscribes={};
}
// 继承事件触发
//inherits(WebSocketAPI,EventEmitter);

// 订阅事件
WebSocketAPI.prototype.subscribeEvent=function(fun_key,event,callback){
    this.log.info("subscribe event:fun=%s,event=%s",fun_key,event);
    let sub=this.subscribes[fun_key];
    if (sub===undefined){
        sub={};
        sub[event]=callback;
        this.subscribes[fun_key]=sub;
        this.notifyQueue.declareBinding("ws.event",fun_key);
    }else{
        sub[event]=callback;
    }
};

// 请求
WebSocketAPI.prototype.request=function(socket_id,buff){
    let self=this;
    return new Promise(function (resolve, reject){
        let headers={
            socket_id:socket_id,
            msg_type:'request'
        };
        if (!buff){
            reject(new Error("no data"));
            return;
        }
        self.log.log("sending request,socket_id=%s",socket_id);
        let tick=new Date().getTime();
        self.rpc.sendRequest(buff,'',undefined,{headers:headers}).then(function(res){
            let duration=new Date().getTime()-tick;
            self.log.log("recv response,socket_id=%s,duration=%d",socket_id,duration);
            let h5=res.content.toString("utf-8",0,5);
            if (h5!=='error'){
                resolve(res);
            }else{
                let err=res.content.toString('utf-8');
                reject(err);
                self.log.log('request fail!socket_id=%s,err=%s',socket_id,err);
            }
        }).catch(function(err){
            self.log.log("request ws crash!err=%s",err);
            reject(err)
        });

    });
};
// 通知
WebSocketAPI.prototype.notify=function (socket_id, buff) {
    let self=this;
    return new Promise(function (resolve, reject){
        let headers={
            socket_id:socket_id,
            msg_type:'notify'
        };
        if (!buff){
            reject(new Error("no data"));
            return;
        }
        self.log.debug("sending notify,socket_id=%s",socket_id);
        self.rpc.sendRequest(buff,'',undefined,{headers:headers}).then(function(res){
            res=res.content.toString('utf-8');
            if (res==='ok')
            {
                self.log.log('notify success!socket_id=%s',socket_id);
                resolve();
            }else{
                self.log.error("notify fail!,socket_id=%s,err=%s",socket_id,res);
                reject(res);
            }
        }).catch(function(err){
            self.log.log("notify ws crash!err=%s",err);
            reject(err)
        });

    });
};
// 断开
WebSocketAPI.prototype.disconnect=function(socket_id,buff){
    let self=this;
    return new Promise(function (resolve, reject){
        let headers={
            socket_id:socket_id,
            msg_type:'disconnect'
        };
        if (!buff)buff="";
        self.log.debug("sending disconnect,socket_id=%s",socket_id);
        self.rpc.sendRequest(buff,'',undefined,{headers:headers}).then(function(res){
            res=res.content.toString('utf-8');
            if (res==='ok')
            {
                self.log.log('disconnect ws %s success!',socket_id);
                resolve();
            }else{
                self.log.error("disconnect ws %s fail!,err=%s",socket_id,res);
                reject(res);
            }
        }).catch(function(err){
            self.log.log("disconnect ws crash!err=%s",err);
            reject(err);
        });

    });
};
// 检查连接
WebSocketAPI.prototype.check=function(socket_id){
    let self=this;
    return new Promise(function (resolve, reject){
        let headers={
            socket_id:socket_id,
            msg_type:'check'
        };
        self.log.debug("sending check,socket_id=%s",socket_id);
        // 检查连接,2秒超时
        self.rpc.sendRequest("",'',2,{headers:headers}).then(function(res){
            res=res.content.toString('utf-8');
            if (res==='ok')
            {
                self.log.log('check ws %s success!',socket_id);
                resolve(true);
            }else{
                self.log.error("check ws %s fail!,err=%s",socket_id,res);
                resolve(false);
            }
        }).catch(function(err){
            self.log.log("check ws crash!err=%s",err);
            resolve(false);
        });

    });
};

exports.WebSocketAPI=WebSocketAPI;