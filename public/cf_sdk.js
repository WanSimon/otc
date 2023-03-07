/**
 * CF模块SDK
 * Created by Simon on 2016/5/16.
 * shaokaiwei
 */
"use strict";
let sc = require('smartacjs');
let app = sc.app();
//let Promise = sc.Promise;
let _ = sc._;
let path = require('path');
let inherits = require('util').inherits;
let EventEmitter = require('events').EventEmitter;
let rpcClient, pbEncoder, rpcClientWechat, pbEncoderWechat, rpcClientApp, pbEncoderApp, rpcClientAlipay,
    pbEncoderAlipay;
let rpcClientQA,pbEncoderQA;
let _accountMap = {};
/**
 * 消息头
 * @type {{header: {sender: string, sender_type: (string|string|string|string|string|string)}}}
 */
let header = {
    sender: "unknow",
    sender_type: "unknow"
};

// 创建微信帐号
function WeChatAccount(accountId) {
    this._accountId = accountId;
}

// 继承事件驱动类,通知新消息到达
inherits(WeChatAccount, EventEmitter);

/**
 * 发送模板消息
 * function sendTemplateMessage
 * customerSearchCondition 检索条件
 * templateId 微信模板ID
 * url 点击详情跳转的地址
 * content JSON数组 [{key:标题,value:值}]
 * @returns JSON体 {errcode:0,errmsg:'ok'}
 */
WeChatAccount.prototype.sendTemplateMessage = function (customerSearchCondition, templateId, url, content) {
    if (!customerSearchCondition.cf_account_id) {
        customerSearchCondition.cf_account_id = this._accountId;
    }
    let req_obj = {
        header: header,
        req_template_message_send: {
            account_id: this._accountId,
            customer_search_condition: customerSearchCondition,
            template_id: templateId,
            url: url,
            content: content
        }
    };
    return new Promise(function (resolve, reject) {
        rpcClientWechat.sendRequest(pbEncoderWechat.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoderWechat.decode(res.content);
                if (result.res_template_message_send.errcode === 0) {
                    resolve("success");
                } else {
                    // resolve(new Error(result.res_template_message_send.errmsg));
                    resolve(app.err.fail.msg(result.res_template_message_send.errmsg));
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
};
/**
 * 查询粉丝数据
 * function queryFansInfo
 * customerSearchCondition 检索条件
 * @returns JSON体
 */
WeChatAccount.prototype.queryFansInfo = function (customerSearchCondition) {
    if (customerSearchCondition instanceof Array) {

    } else {
        if (!customerSearchCondition.cf_account_id) {
            customerSearchCondition.cf_account_id = this._accountId;
        }
        customerSearchCondition = [customerSearchCondition];
    }

    let req_obj = {
        header: header,
        req_userinfo_query: {
            account_id: this._accountId,
            customer_search_condition: customerSearchCondition
        }
    };
    return new Promise(function (resolve, reject) {
        if (customerSearchCondition.length > 100) {
            // resolve(new Error("query list over limit (100)"));
            resolve(app.err.fail.msg("query list over limit (100)"));
        }
        rpcClientWechat.sendRequest(pbEncoderWechat.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoderWechat.decode(res.content);
                if (result.res_userinfo_query.errcode === 0) {
                    resolve(result.res_userinfo_query.result);
                } else {
                    // resolve(new Error(result.res_userinfo_query.errmsg));
                    resolve(app.err.fail.msg(result.res_userinfo_query.errmsg));
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
};
/**
 * 拉取粉丝openid列表
 * function queryFansList
 * customerSearchCondition 检索条件
 * @returns JSON体
 */
WeChatAccount.prototype.queryFansList = function (customerSearchCondition) {
    let req_obj = {
        header: header,
        req_userinfo_sync: {
            account_id: this._accountId
        }
    }
    if (customerSearchCondition) {
        req_obj.req_userinfo_sync.customer_search_condition = customerSearchCondition;
    }
    return new Promise(function (resolve, reject) {
        rpcClientWechat.sendRequest(pbEncoderWechat.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoderWechat.decode(res.content);
                if (result.res_userinfo_sync.errcode === 0) {
                    let obj = {
                        openid_list: result.res_userinfo_sync.openid_list,
                        next_openid: result.res_userinfo_sync.next_openid
                    };
                    resolve(obj);
                } else {
                    // resolve(new Error(result.res_userinfo_sync.errmsg));
                    resolve(app.err.fail.msg(result.res_userinfo_sync.errmsg));
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
};

/**
 * 发送消息
 * function sendMessage
 * customerSearchCondition 检索条件
 * messageContent JSON体 {type:text,resource_id:资源GUID,content:文本内容} resource_id与content 二选一
 * @returns JSON体 {errcode:0,errmsg:'ok',msg_id:msg_id} 群发成功时才有msg_id
 */
WeChatAccount.prototype.sendMessage = function (customerSearchCondition, messageContent) {
    if (!customerSearchCondition.cf_account_id) {
        customerSearchCondition.cf_account_id = this._accountId;
    }
    let req_obj = {
        header: header,
        req_group_message_send: {
            account_id: this._accountId,
            customer_search_condition: customerSearchCondition,
            message_content: messageContent
        }
    };
    return new Promise(function (resolve, reject) {
        rpcClientWechat.sendRequest(pbEncoderWechat.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoderWechat.decode(res.content);
                if (result.res_group_message_send.errcode === 0) {
                    if (result.res_group_message_send.msg_id) {
                        resolve(result.res_group_message_send.msg_id);
                    } else {
                        resolve('success');
                    }
                } else {
                    // resolve(new Error(result.res_group_message_send.errmsg));
                    resolve(app.err.fail.msg(result.res_group_message_send.errmsg));
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
};
/**
 * 发送文本消息
 * function sendTextMessage
 * @param customerSearchCondition 发送对象
 * @param text 文本消息
 * @returns 成功或者异常错误
 */
WeChatAccount.prototype.sendTextMessage = function (customerSearchCondition, text) {
    if (!customerSearchCondition.cf_account_id) {
        customerSearchCondition.cf_account_id = this._accountId;
    }
    let req_obj = {
        header: header,
        req_group_message_send: {
            account_id: this._accountId,
            customer_search_condition: customerSearchCondition,
            message_content: {
                type: 2,  //TEXT
                content: text
            }
        }
    };
    return new Promise(function (resolve, reject) {
        rpcClientWechat.sendRequest(pbEncoderWechat.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoderWechat.decode(res.content);
                if (result.res_group_message_send.errcode === 0) {
                    if (result.res_group_message_send.msg_id) {
                        resolve(result.res_group_message_send.msg_id);
                    } else {
                        resolve('success');
                    }
                } else {
                    // resolve(new Error(result.res_group_message_send.errmsg));
                    resolve(app.err.fail.msg(result.res_group_message_send.errmsg));
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
};
/**
 * 发送图文消息
 * function sendImageTextMessage
 * @param customerSearchCondition 发送对象
 * @param resourceId 资源ID
 * @returns 成功或者异常错误
 */
WeChatAccount.prototype.sendImageTextMessage = function (customerSearchCondition, resourceId) {
    if (!customerSearchCondition.cf_account_id) {
        customerSearchCondition.cf_account_id = this._accountId;
    }
    let req_obj = {
        header: header,
        req_group_message_send: {
            account_id: this._accountId,
            customer_search_condition: customerSearchCondition,
            message_content: {
                type: 1,  //NEWS
                resource_id: resourceId
            }
        }
    };
    return new Promise(function (resolve, reject) {
        rpcClientWechat.sendRequest(pbEncoderWechat.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoderWechat.decode(res.content);
                if (result.res_group_message_send.errcode === 0) {
                    if (result.res_group_message_send.msg_id) {
                        resolve(result.res_group_message_send.msg_id);
                    } else {
                        resolve('success');
                    }
                } else {
                    // resolve(new Error(result.res_group_message_send.errmsg));
                    resolve(app.err.fail.msg(result.res_group_message_send.errmsg));
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
};
/**
 * 回应消息
 * function feedbackMessage
 * event_id 事件ID
 * messageContent JSON数组 [{type:text,resource_id:资源GUID,content:文本内容}] resource_id与content 二选一
 * @returns 成功或者异常错误
 */
WeChatAccount.prototype.feedbackMessage = function (event_id, messageContent) {
    let req_obj = {
        header: header,
        req_feedback_message: {
            evt_id: event_id,
            message_content: messageContent
        }
    };
    return new Promise(function (resolve, reject) {
        rpcClientWechat.sendRequest(pbEncoderWechat.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoderWechat.decode(res.content);
                if (result.res_feedback_message.errcode === 0) {
                    resolve('success');
                } else {
                    if (result.res_feedback_message.errcode === 11005) {
                        resolve('had been response');
                    } else {
                        // resolve(new Error(result.res_feedback_message.errmsg));
                        resolve(app.err.fail.msg(result.res_feedback_message.errmsg));
                    }
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
};
/**
 * 回应文本消息
 * function feedbackTextMessage
 * event_id 事件ID
 * text 文本内容
 * @returns 成功或者异常错误
 */
WeChatAccount.prototype.feedbackTextMessage = function (event_id, text) {
    let req_obj = {
        header: header,
        req_feedback_message: {
            evt_id: event_id,
            message_content: [{
                type: 2,  //TEXT
                content: text
            }]
        }
    };
    return new Promise(function (resolve, reject) {
        rpcClientWechat.sendRequest(pbEncoderWechat.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoderWechat.decode(res.content);
                if (result.res_feedback_message.errcode === 0) {
                    resolve('success');
                } else {
                    if (result.res_feedback_message.errcode === 11005) {
                        resolve('had been response');
                    } else {
                        // resolve(new Error(result.res_feedback_message.errmsg));
                        resolve(app.err.fail.msg(result.res_feedback_message.errmsg));
                    }
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
};
/**
 * 创建微信带参数二维码Url
 * @param timeout 临时的有效时间，单位:秒，0表示永久
 * @param sceneId 参数ID，临时传32位非0整形 永久传1到64位字符
 * @returns qrcode_url或者异常错误
 */
WeChatAccount.prototype.createQRUrl = function (sceneId, timeout) {
    let req_obj = {};
    if (timeout === 0) {
        req_obj = {
            header: header,
            req_generate_qrcode: {
                account_id: this._accountId,
                store_type: 2,
                scene_str: sceneId
            }
        };
    } else {
        req_obj = {
            header: header,
            req_generate_qrcode: {
                account_id: this._accountId,
                store_type: 1,
                scene_id: sceneId
            }
        };
    }
    return new Promise(function (resolve, reject) {
        rpcClientWechat.sendRequest(pbEncoderWechat.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoderWechat.decode(res.content);
                if (result.res_generate_qrcode.errcode === 0) {
                    resolve(result.res_generate_qrcode.qrcode_url);
                } else {
                    // resolve(new Error(result.res_generate_qrcode.errmsg));
                    resolve(app.err.fail.msg(result.res_generate_qrcode.errmsg));
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
}

/**
 * 长链接转换成短链接
 * function generateShortUrl
 * @param longUrl 长地址
 * @returns shortUrl 短地址
 */
WeChatAccount.prototype.generateShortUrl = function (longUrl) {
    let req_obj = {
        header: header,
        req_generate_short_url: {
            account_id: this._accountId,
            long_url: longUrl
        }
    };
    return new Promise(function (resolve, reject) {
        rpcClientWechat.sendRequest(pbEncoderWechat.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoderWechat.decode(res.content);
                if (result) {
                    if (result.res_generate_short_url.errcode === 0) {
                        resolve(result.res_generate_short_url.short_url);
                    } else {
                        // resolve(new Error(result.res_generate_short_url.errmsg));
                        resolve(app.err.fail.msg(result.res_generate_short_url.errmsg));
                    }
                }
                else {
                    // resolve(new Error("decode response fail!"));
                    resolve(app.err.fail.msg("decode response fail!"));
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
}

/**
 * 获取客服所有会话记录
 * function getChatRecordList
 * @param start_time 开始时间 uint64
 * @param end_time 结束时间 uint64
 * @returns recordlist [] 聊天记录
 */
WeChatAccount.prototype.getChatRecordList = function (start_time, end_time) {
    let req_obj = {
        header: header,
        req_customer_service_chat_record: {
            account_id: this._accountId,
            start_time: start_time,
            end_time: end_time
        }
    };
    return new Promise(function (resolve, reject) {
        rpcClientWechat.sendRequest(pbEncoderWechat.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoderWechat.decode(res.content);
                if (result.res_customer_service_chat_record.errcode === 0) {
                    resolve(result.res_customer_service_chat_record.result);
                } else {
                    // resolve(new Error(result.res_customer_service_chat_record.errmsg));
                    resolve(app.err.fail.msg(result.res_customer_service_chat_record.errmsg));
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
};

/**
 * 微信回调事件
 */
WeChatAccount.prototype.onMessage = function (msg) {
    // 触发事件
    this.emit('message', msg);
}
/**
 * 监听接收回调消息（关注和取消关注）
 * exchange_name cf.wechat.notify
 * exchange_type topic
 * route_key account_id.MSG_EVENT.SUBSCRIBE 和 account_id.MSG_EVENT.UNSUBSCRIBE
 */
function onWechatMessage(msg) {
    let msgObj = pbEncoderWechat.decode(msg.content);
    if (msgObj && msgObj.evt_message_from_wechat) {
        let account = _accountMap[msgObj.evt_message_from_wechat.account_id];
        if (account) {
            if (account instanceof WeChatAccount) {
                // 转交给账户类处理
                account.onMessage(msgObj.evt_message_from_wechat);
            }
            else {
                console.log("wechat message error:account type error!account id=%s", msgObj.account_id);
            }
        }
        else {
            console.log("drop wechat message:%s", JSON.stringify(msgObj));
        }
    } else {
        console.error("cann't decode pb msg!");
    }
}

// 短信帐号
function SMSAccount(accountId) {
    this._accountId = accountId;
}
// 继承事件驱动类


/**
 * 发送短信
 * function sendSMSMessage
 * @param customerSearchCondition 发送对象
 * @param 短信文字内容
 * @returns 成功或者异常错误
 */
SMSAccount.prototype.sendSMSMessage = function (customerSearchCondition, text) {
    let req_obj = {
        header: header,
        req_send_text: {
            account_id: this._accountId,
            customer_search_condition: customerSearchCondition,
            content: text
        }
    };
    return new Promise(function (resolve, reject) {
        rpcClient.sendRequest(pbEncoder.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoder.decode(res.content);
                if (result.res_send_text.errcode === 0) {
                    if (result.res_send_text.result) {
                        resolve(result.res_send_text.result);
                    } else {
                        resolve('success');
                    }
                } else {
                    // resolve(new Error(result.res_send_text.errmsg));
                    resolve(app.err.fail.msg(result.res_send_text.errmsg));
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
};

/**
 * 发送验证码
 * 消息模版中必须含有'@code@'字样进行替换
 * function sendSMSValidateCode
 * @param customerSearchCondition 发送对象
 * @param length 验证码长度，一般4或者6
 * @param messageTemplate 短息模板
 * @param validTime 验证码有效时间，单位:分钟
 * @returns 成功或者异常错误
 */
SMSAccount.prototype.sendAuthCode = function (customerSearchCondition, length, messageTemplate, validTime) {
    let req_obj = {
        header: header,
        req_sms_send_auth_code: {
            account_id: this._accountId,
            customer_search_condition: customerSearchCondition,
            auth_code_digit: length,
            sms_template: messageTemplate,
            valid_time: validTime
        }
    };
    return new Promise(function (resolve, reject) {
        rpcClient.sendRequest(pbEncoder.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoder.decode(res.content);
                if (result.res_sms_send_auth_code.errcode === 0) {
                    resolve('success');
                } else {
                    // resolve(new Error(result.res_sms_send_auth_code.errmsg));
                    resolve(app.err.fail.msg(result.res_sms_send_auth_code.errmsg));
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
};
/**
 * 验证验证码正确性
 * function verifyAuthCode
 * @param auth_key 验证值，格式为：手机号+半角英文冒号:+验证码
 * return 成功或者异常错误
 */
SMSAccount.prototype.verifyAuthCode = function (auth_key) {
    let req_obj = {
        header: header,
        req_sms_check_auth_code: {
            auth_key: auth_key
        }
    };
    return new Promise(function (resolve, reject) {
        rpcClient.sendRequest(pbEncoder.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoder.decode(res.content);
                if (result.res_sms_check_auth_code.errcode === 0) {
                    resolve('success');
                } else {
                    // resolve(new Error(result.res_sms_check_auth_code.errmsg));
                    resolve(app.err.fail.msg(result.res_sms_check_auth_code.errmsg));
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
};

/**
 * 邮件账号
 */
function EmailAccount(accountId) {
    this._accountId = accountId;
}

/**
 * 发送邮件
 * function sendEmailMessage
 * @param customerSearchCondition 发送对象
 * @param subject 邮件主题
 * @param text 邮件正文内容
 * @returns 成功或者异常错误
 */
EmailAccount.prototype.sendEmailMessage = function (customerSearchCondition, subject, text) {
    let req_obj = {
        header: header,
        req_send_text: {
            account_id: this._accountId,
            customer_search_condition: customerSearchCondition,
            content: subject + "@html@" + text
        }
    };
    return new Promise(function (resolve, reject) {
        rpcClient.sendRequest(pbEncoder.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoder.decode(res.content);
                if (result.res_send_text.errcode === 0) {
                    if (result.res_send_text.result) {
                        resolve(result.res_send_text.result);
                    } else {
                        resolve('success');
                    }
                } else {
                    // resolve(new Error(result.res_send_text.errmsg));
                    resolve(app.err.fail.msg(result.res_send_text.errmsg));
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
};


/**
 * APP推送账号
 */
function APPAccount(accountId) {
    this._accountId = accountId;
}

/**
 * 发送APP消息
 * @param customerSearchCondition 发送对象
 * @param content 内容
 * @param subject 主旨
 * @returns {*} JSON体 {errcode:0,errmsg:'ok',message_id:message_id} 发送成功时才有message_id
 */
APPAccount.prototype.sendAppMessage = function (customerSearchCondition, content, subject) {
    if (customerSearchCondition instanceof Array) {

    } else {
        if (!customerSearchCondition.cf_account_id) {
            customerSearchCondition.cf_account_id = this._accountId;
        }
        customerSearchCondition = [customerSearchCondition];
    }
    let req_obj = {
        header: header,
        req_push_message: {
            account_id: this._accountId,
            device_type: [9],   // 全部设备 iOS/Andriod/Winphone
            customer_search_condition: customerSearchCondition,
            message_content: {
                type: 9,  // 全部 通知和消息
                content: content,
                title: subject
            }
        }
    };
    return new Promise(function (resolve, reject) {
        rpcClientApp.sendRequest(pbEncoderApp.encode(JSON.stringify(req_obj)))
            .then(function (res) {
                let result = pbEncoderApp.decode(res.content);
                if (result.res_push_message.errcode === 0) {
                    if (result.res_push_message.message_id) {
                        resolve(result.res_push_message.message_id);
                    } else {
                        resolve('success');
                    }
                } else {
                    // resolve(new Error(result.res_push_message.errmsg));
                    resolve(app.err.fail.msg(result.res_push_message.errmsg));
                }
            })
            .catch(function (err) {
                reject(app.err.systemError.msg(err));
            })
    })
};
// 创建问答帐号
function QAAccount(accountId) {
    this._accountId = accountId;
}
// 查询问题
QAAccount.prototype.query=function(text,context,data){
    let self=this;
    return new Promise(function (resolve, reject){
        if (self.queryTimeout===undefined){
            self.queryTimeout=3;
        }
        let req_obj = {
            header: header,
            req_query_qa: {
                account_id:self._accountId,
                text:text,
                context:context,
                data:data
            }
        };
        console.log("qa query params : %s  ",req_obj);
        // 编码消息
        let buff=pbEncoderQA.encode(JSON.stringify(req_obj));
        if (!buff){
            console.error("cann't send QA query request!encode fail!");
            reject();
            return;
        }
        // 发送请求
        rpcClientQA.sendRequest(buff,"",self.queryTimeout).then(function(res){
            let result = pbEncoderQA.decode(res.content);
            if (result){
                if (result.res_error){
                    console.error("QA query fail!code=%d,msg=%s",result.res_error.errcode,result.res_error.errmsg);
                    reject(new app.err.SCError(result.res_error.errcode,result.res_error.errmsg));
                }else if (result.res_query_qa){
                    resolve(result.res_query_qa);
                }
            }else{
                console.error("QA query fail!decode response fail!");
                reject(new app.err.invalidFormat);
            }
        }).catch(function(err){
            console.error("QA query fail!err=%s",err);
            reject(app.err.systemError.msg(err));
        })
    });
};
/**
 * 初始化
 */
let protocolPath = path.normalize(__dirname + "/../protocol/");
exports.init = function (mq, instanceName, programType) {
    header.sender = instanceName;
    header.sender_type = programType;
    // simon add:MQ可能为连接串,则自己创建连接
    if (typeof (mq) === 'string') {
        mq = sc.RabbitMQ().createConnect(mq);
    }
    if (mq) {
        //短信&邮件
        rpcClient = sc.RabbitMQ().createRPCClient(mq, 'cf.rpc');
        if (rpcClient) {
            pbEncoder = sc.createPBEncoder(protocolPath + "cf.proto.js", "cf", "Message");
            if (!pbEncoder) {
                console.error("create pb cf encoder failed!")
            }
        } else {
            console.error("create rpc client failed!");
        }
        //微信wechat
        rpcClientWechat = sc.RabbitMQ().createRPCClient(mq, 'cf.wechat.rpc');
        if (rpcClientWechat) {
            // simon fix:使用脚本目录进行定位
            pbEncoderWechat = sc.createPBEncoder(protocolPath + "cf_wechat.proto.js", "cf.wechat", "Message");
            if (!pbEncoderWechat) {
                console.error("create pb encoder wechat failed!")
            }
        } else {
            console.error("create rpc client wechat failed!");
        }
        mq.declareExchange('cf.wechat.notify', 'topic', false, true);
        let queue = mq.declareQueue(instanceName + ".wechat.?", onWechatMessage, false, true);
        queue.declareBinding('cf.wechat.notify', '#');
        // //APP
        // rpcClientApp = sc.RabbitMQ().createRPCClient(mq, 'cf.app.rpc');
        // if (rpcClientApp) {
        //     pbEncoderApp = sc.createPBEncoder(protocolPath + "cf_app.proto.js", "cf.app", "Message");
        //     if (!pbEncoderApp) {
        //         console.error("create pb encoder app failed!")
        //     }
        // } else {
        //     console.error("create rpc client app failed!");
        // }
        //支付宝alipay
        rpcClientAlipay = sc.RabbitMQ().createRPCClient(mq, 'cf.alipay.rpc');
        if (rpcClientAlipay) {
            pbEncoderAlipay = sc.createPBEncoder(protocolPath + "cf_alipay.proto.js", "cf.alipay", "Message");
            if (!pbEncoderAlipay) {
                console.error("create pb encoder alipay failed!")
            }
        } else {
            console.error("create rpc client alipay failed!");
        }
        //问答服务QA
        rpcClientQA = sc.RabbitMQ().createRPCClient(mq, 'cf.qa.rpc');
        if (rpcClientQA) {
            pbEncoderQA = sc.createPBEncoder(protocolPath + "cf_qa.proto.js", "cf.qa", "Message");
            if (!pbEncoderQA) {
                console.error("create pb encoder qa failed!")
            }
        } else {
            console.error("create rpc client qa failed!");
        }
    } else {
        console.error("get mq connection failed!");
    }
};
// 创建检索条件
exports.makeCustomerSearchCondition = function (customerId, openId, code, mobile, email, deviceId) {
    return {
        id: customerId,
        wechat_open_id: openId,
        wechat_code: code,
        mobile: mobile,
        email: email,
        app_device_id: deviceId
    };
}

/**
 * 创建微信账户对象
 * @returns {WeChatAccount}
 */
exports.createWeChatAccount = function (accountId) {
    let account = new WeChatAccount(accountId);
    _accountMap[accountId] = account;
    return account;
};
/**
 * 创建短信账户对象
 * @returns {SMSAccount}
 */
exports.createSMSAccount = function (accountId) {
    let account = new SMSAccount(accountId);
    _accountMap[accountId] = account;
    return account;
};
/**
 * 创建邮件账户对象
 * @returns {EmailAccount}
 */
exports.createEmailAccount = function (accountId) {
    let account = new EmailAccount(accountId);
    _accountMap[accountId] = account;
    return account;
};
/**
 * 创建APP账户对象
 * @returns {APPAccoun}
 */
exports.createAPPAccount = function (accountId) {
    let account = new APPAccount(accountId);
    _accountMap[accountId] = account;
    return account;
};
/**
 * 创建支付宝账户对象
 * @returns {AliAccount}
 */
exports.createAlipayAccount = function (accountId) {
    return null;
};
/**
 * 创建支付宝账户对象
 * @returns {AliAccount}
 */
exports.createQAAccount = function (accountId) {
    let account = new QAAccount(accountId);
    _accountMap[accountId] = account;
    return account;
};
/**
 * 查找账户对象
 * @param accountId 账号account_id
 * @returns 账户对象
 */
exports.findAccount = function (accountId) {
    return _accountMap[accountId];
};




