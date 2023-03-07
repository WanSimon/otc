'use strict'
let sc = require('smartacjs');
let app = sc.app();// 获取全局APP对象

// 公共定义
let msgTemplate = {
    header: {
        sender: app.conf.instanceName,
        sender_type: app.programType
    }
}

// 消息处理器
function MessageProcessor(name, encoder, processer) {
    sc.assert(encoder);
    console.info("MessageProcessor created!name=%s", name);
    this.encoder = encoder;
    this.name = name;
    this.processer = processer;
    this.log = sc.createNamedLog(name);
}
// 路由请求
MessageProcessor.prototype.onRequest = async function(mq, req) {
    //解码消息
    if (this.encoder) {
        let msg = this.encoder.decode(req.content);
        if (msg) {
            //分拣消息
            for (let k in msg) {
                if (msg[k] === null) delete msg[k];
            }
            let socketId=sc.getSubObject(req,"properties.headers.socket_id");
            if (socketId) this.log.log('recv socketId=%s,msg:%s',socketId, JSON.stringify(msg));
            else this.log.log('recv msg:%s', JSON.stringify(msg));
            for (let key in msg) {
                if (key === 'header') continue;
                if (msg[key] && typeof(msg[key]) === 'object') {
                    if (this.processer[key]) {
                        let body = msg[key];
                        let self = this;
                        // 调用处理器
                      try {
                        await self.processer[key](mq, req, body, msg.header);
                      }
                      catch (e) {
                        if (e && e instanceof app.err.SCError) {
                          // 逻辑错误
                          self.log.error("error!msg=%s,%s", key, e);
                          self.sendResponseError(mq, req, e);
                        }
                        else {
                          // 发送系统错误
                          self.log.error("%s crash!err=%s", key, e);
                          self.sendResponseError(mq, req);
                        }
                      }
                    }
                    else {
                        this.log.info('unknow message "%s",drop!', key);
                        this.sendResponseError(mq, req, app.err.noSupport);
                    }
                    break;
                }
            }
        }
        else {
            this.log.error('decode pb message faile!');
            this.sendResponseError(mq, req, app.err.encodeFailed);
        }
    }
    else
    {
        this.log.error('decode pb message faile!no decoder!');
        this.sendResponseError(mq, req, app.err.encodeFailed);
    }
}
// 发送错误回应
MessageProcessor.prototype.sendResponseError = function (mq, req, err) {
    if (!err) err = app.err.systemError;
    // 给出通用错误回应
    let msg = sc.deepCopy(msgTemplate);
    msg.res_error = {};
    msg.res_error.errcode = err.errcode;
    msg.res_error.errmsg = err.errmsg;
    this.sendResponseRaw(mq, req, msg);
}
// 发送正确回应
MessageProcessor.prototype.sendResponse = function (mq, req, name, content) {
    if (!content) content = {};
    let msg = sc.deepCopy(msgTemplate);
    msg[name] = content;
    this.sendResponseRaw(mq, req, msg);
}
// 发送回应
MessageProcessor.prototype.sendResponseRaw = function (mq, req, res) {
    //TODO:去除N多null字段
    let strResponse = JSON.stringify(res);
    let socketId=sc.getSubObject(res,"properties.headers.socket_id");
    if (socketId) this.log.log('response to %s:%s',socketId,strResponse);
    else this.log.log('response:%s', strResponse);
    let buff = this.encoder.encode(res);
    if (buff) {
        mq.sendResponse(req, buff);
    }
    else {
        this.log.error('encode response fail!res=%s', strResponse);
        mq.sendResponse(req, "encode response fail:" + strResponse);
    }
};
MessageProcessor.prototype.encodeMessage = function (msg_id, body) {
    this.log.log("MessageProcessor encode message,msg_id=%s,body=%s", msg_id, JSON.stringify(body));
    let msg = sc.deepCopy(msgTemplate);
    msg[msg_id] = body;
    let strMsg = JSON.stringify(msg);
    return this.encoder.encode(strMsg);
};
MessageProcessor.prototype.decodeMessage = function (buff) {
    let msg = this.encoder.decode(buff);
    if (msg) {
        for (let k in msg) if (msg[k] === null) delete msg[k];
        this.log.log("MessageProcessor decode message,content=%s", JSON.stringify(msg));
    } else {
        this.log.warn("MessageProcessor decode message fail");
    }
    return msg;
};
module.exports = MessageProcessor;