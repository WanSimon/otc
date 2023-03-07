/**
 * 队列消息处理器
 * Created by Simon on 2017/6/9.
 */
'use strict';
let sc = require('smartacjs');
let app = sc.app();// 获取全局APP对象

// 公共定义
let msgTemplate = {
    header: {
        sender: app.conf.instanceName,
        sender_type: app.programType
    }
};

// 消息处理器
function QueueProcessor(name, encoder, processer) {
    sc.assert(encoder);
    console.info("MessageProcessor created!name=%s", name);
    this.encoder = encoder;
    this.name = name;
    this.processer = processer;
    this.log = sc.createNamedLog(name);
}
// 路由请求
QueueProcessor.prototype.onMessage = async function (data) {
    //解码消息
    if (this.encoder) {
        let msg = this.encoder.decode(data.content);
        if (msg) {
            //分拣消息
            for (let k in msg) {
                if (msg[k] === null) delete msg[k];
            }
            let socketId=sc.getSubObject(data,"properties.headers.socket_id");
            if (socketId) this.log.log('recv socketId=%s,msg:%s', socketId,JSON.stringify(msg));
            else this.log.log('recv msg:%s', JSON.stringify(msg));
            for (let key in msg) {
                if (key === 'header') continue;
                if (!msg.hasOwnProperty(key)) continue;
                if (msg[key] && typeof(msg[key]) === 'object') {
                  if (this.processer[key]) {
                    let body = msg[key];
                    let self = this;
                    // 调用处理器
                    try {
                      await self.processer[key](body, msg.header, data);
                    }
                    catch (e) {
                      if (e && e instanceof app.err.SCError) {
                        // 逻辑错误
                        self.log.error("error!msg=%s,%s", key, e);
                      }
                      else {
                        // 发送系统错误
                        self.log.error("%s crash!err=%s", key, e);
                      }
                    }
                  }
                  else {
                    this.log.info('unknow message "%s",drop!', key);
                  }
                  break;
                }
            }
        }
        else {
            this.log.error('decode pb message faile!');
        }
    }
}
QueueProcessor.prototype.encodeMessage = function (msg_id, body) {
    this.log.log("MessageProcessor encode message,msg_id=%s,body=%s", msg_id, JSON.stringify(body));
    let msg = sc.deepCopy(msgTemplate);
    msg[msg_id] = body;
    let strMsg = JSON.stringify(msg);
    return this.encoder.encode(strMsg);
};
QueueProcessor.prototype.decodeMessage = function (buff) {
    let msg = this.encoder.decode(buff);
    if (msg) {
        for (let k in msg) if (msg[k] === null) delete msg[k];
        this.log.log("MessageProcessor decode message,content=%s", JSON.stringify(msg));
    } else {
        this.log.warn("MessageProcessor decode message fail");
    }
    return msg;
};
module.exports = QueueProcessor;