/**
 * Created by kay on 2016/11/9.
 * 提供发送模板消息的公共方法
 * shaokaiwei
 */
'use strict';
var sc = require('smartacjs');
var app = sc.app();
var _ = sc._;
var Promise = sc.Promise;
var rabbit = sc.RabbitMQ();
var db = sc.db();
var path = require('path');
var _proto_file_path = path.normalize(__dirname + '/../protocol/');
var inited = false;
var _private_data = {};
var log;
// 如果引用的服务没有加载公共的err类，则在这里require进来
if (!!!app.err) {
    app.err = require('./err.js');
}

/**
 * 是否已初始化标识
 * @returns {boolean} true or false
 */
exports.isInited = () => {
    return inited;
};

/**
 * 初始化
 * @param mq rabbitMQ Connection
 * @param dbString mysql的db连接字符串(读取)
 * @param instanceName 实例名
 * @param programType 服务类型
 */
exports.init = (mq, dbString, instanceName, programType) => {
    if (inited) return;
    inited = true;
    if (typeof(mq) == 'string') {
        _private_data.mq = rabbit.createConnect(app.conf.mqUrl);
        _private_data.mq.start();
    } else {
        _private_data.mq = mq;
    }
    if (!instanceName && app.conf.instanceName) instanceName = app.conf.instanceName;
    if (!programType && app.programType) programType = app.programType;
    _private_data.instanceName = instanceName;
    _private_data.programType = programType;
    log = sc.createNamedLog(programType, instanceName+'.'+sc.workIndex);
    if (!!!_private_data.mq) {
        sc.exit(1001, 'init notify_helper mq connection fail! cannot get mq connection!');
    }
    // mysql的读取连接池
    _private_data.poolRead = db.createMySQLConnectionPool(dbString);
    // 声明sr.customer的rpcClient和pbEncoder
    _private_data.rpcCustomerClient = rabbit.createRPCClient(_private_data.mq, 'sr.customer.rpc');
    if (!!!_private_data.rpcCustomerClient) {
        sc.exit(1003, 'init notify_helper sr.customer rpc client fail!');
    }
    _private_data.pbCustomerEncoder = sc.createPBEncoder(_proto_file_path + 'sr_customer.proto.js', 'sr.customer', 'Message');
    if (!!!_private_data.pbCustomerEncoder) {
        sc.exit(1004, 'init notify_helper sr_customer pb encoder fail!');
    }
    // 声明cf的rpcClient和pbEncoder
    _private_data.rpcCfServerClient = rabbit.createRPCClient(_private_data.mq, 'cf.rpc');
    if (!!!_private_data.rpcCfServerClient) {
        sc.exit(1005, 'init notify_helper cf rpc client fail!');
    }
    _private_data.pbCfServerEncoder = sc.createPBEncoder(_proto_file_path + 'cf.proto.js', 'cf', 'Message');
    if (!!!_private_data.pbCfServerEncoder) {
        sc.exit(1006, 'init notify_helper cf pb encoder fail!');
    }
    // 声明cf.wechat的rpcClient和pbEncoder
    _private_data.rpcCfWechatClient = rabbit.createRPCClient(_private_data.mq, 'cf.wechat.rpc');
    if (!!!_private_data.rpcCfWechatClient) {
        sc.exit(1007, 'init notify_helper cf_wechat rpc client fail!');
    }
    _private_data.pbCfWechatEncoder = sc.createPBEncoder(_proto_file_path + 'cf_wechat.proto.js', 'cf.wechat', 'Message');
    if (!!!_private_data.pbCfWechatEncoder) {
        sc.exit(1008, 'init notify_helper cf_wechat pb encoder fail!');
    }
    // 声明cf.app的rpcClient和pbEncoder
    _private_data.rpcCfAppClient = rabbit.createRPCClient(_private_data.mq, 'cf.app.rpc');
    if (!!!_private_data.rpcCfAppClient) {
        sc.exit(1009, 'init notify_helper cf_app rpc client fail!');
    }
    _private_data.pbCfAppEncoder = sc.createPBEncoder(_proto_file_path + 'cf_app.proto.js', 'cf.app', 'Message');
    if (!!!_private_data.pbCfAppEncoder) {
        sc.exit(1010, 'init notify_helper cf_app pb encoder fail!');
    }
    // rpc消息的消息头
    _private_data.header = {
        sender: _private_data.instanceName,
        sender_type: _private_data.programType
    }
};

/**
 * 推送通知（微信/短信/邮件/APP）
 * @param key 模板设定的key值
 * @param cust_id 客户编号
 * @param data JSON体key-value数组
 */
exports.sendTemplateNotify = async function  (key, cust_id, data) {
    log.info('sendTemplateNotify starting...');
    log.info('input<->key=%s, cust_id=%s, data=%s', key, cust_id, JSON.stringify(data));
    if (!key || !cust_id || typeof(data) != 'object') {
        return app.err.missParameter.msg('parameter error');
    }
    try {
        // 根据接收到的参数key，去表cf_template_setting中查询出匹配的设定信息
        let sql = 'select * from cf_template_setting where `key`=@key@;';
        sql = db.makeSQL(sql, { key: key });
        log.info('get template setting sql=%s, time=%s', sql, Date.parse(new Date()));
        let result_template_setting = await getRPoolSync().query(sql);
        log.info('get template setting success, result=%s, time=%s', result_template_setting, Date.parse(new Date()));
        if (result_template_setting && result_template_setting.length > 0) {
            // 组装请求消息体
            let req_obj = {
                header: _private_data.header,
                req_query_customer: {
                    cc: {
                        id: cust_id.toString()
                    }
                }
            };
            // 根据接收到的参数cust_id，调用sr_customer的rpc接口req_query_customer获取到openid/phone/email/deviceid
            log.info('ready to request sr.customer, req_obj=%s, time=%s', JSON.stringify(req_obj), Date.parse(new Date()));
            let res_data = await _private_data.rpcCustomerClient.sendRequest(_private_data.pbCustomerEncoder.encode(req_obj));
            let res_obj = _private_data.pbCustomerEncoder.decode(res_data.content);
            log.info('get response from sr.customer success! res_obj=%s, time=%s', JSON.stringify(res_obj), Date.parse(new Date()));
            if (res_obj.res_query_customer && res_obj.res_query_customer.list_customer && res_obj.res_query_customer.list_customer.length > 0) {
                // 被推送人
                let customer = res_obj.res_query_customer.list_customer[0];
                let customer_search_condition = makeCustomerSearchCondition(customer.cf_account_id, customer.openid, customer.mobile, customer.email, customer.app_device_id);
                // 消息格式
                let info = JSON.parse(result_template_setting[0].info);
                // 推送渠道
                let channel = JSON.parse(result_template_setting[0].channel);
                let url = null;
                // 组装发送的消息内容
                let data_origin = sc.deepCopy(data);
                let data_key_array = [];
                data_origin.forEach(d => {
                    if (d.key == 'url') {
                        url = d.value;
                    } else {
                        if (info.wechat.format[d.key]) {
                            d.color = info.wechat.format[d.key].color;
                            d.key = info.wechat.format[d.key].value;
                        }
                    }
                    data_key_array.push(d.key);
                });
                // 检查是否有固定的参数
                if (info.wechat.format.common && Object.keys(info.wechat.format.common).length > 0) {
                    for (var k in info.wechat.format.common) {
                        if (data_key_array.indexOf(k) == -1) {
                            data_origin.push({
                                key: k,
                                value: info.wechat.format.common[k].value,
                                color: info.wechat.format.common[k].color || null
                            });
                            if (k == 'url') {
                                url = info.wechat.format.common[k].value;
                            }
                        }
                    }
                }
                log.info('wechat content=%s', JSON.stringify(data_origin));
                data.forEach(d => {
                    d.key = '%' + d.key + '%';
                    info.sms.format = info.sms.format.replace(d.key, d.value);
                    info.email.format = info.email.format.replace(d.key, d.value);
                    info.app.format = info.app.format.replace(d.key, d.value);
                });
                log.info('sms content=%s', info.sms.format);
                log.info('email content=%s', info.email.format);
                log.info('app content=%s', info.app.format);
                if (result_template_setting[0].model == 1) {
                    // 优先级
                    let res_p = await prioritySend(channel, info, customer_search_condition, url, data_origin, result_template_setting);
                    return res_p;
                } else {
                    // 并发
                    let res_c = await concurrentSend(channel, info, customer_search_condition, url, data_origin, result_template_setting);
                    return res_c;
                }
            } else {
                return app.err.noExist.msg('get no customer info by id (' + cust_id + ')');
            }
        } else {
            return app.err.noExist.msg('get no template setting record by key (' + key + ')');
        }
    } catch (e) {
        log.error('sendTemplateNotify error, err=%s', e);
        return app.err.fail.msg(e);
    } finally {
        log.info('sendTemplateNotify finished...');
    }
};

/**
 * 优先级模式发送消息
 */
async function  prioritySend(channel, info, customer_search_condition, url, data, result_template_setting) {
    log.info('prioritySend starting...');
    log.info('input<->channel=%s, info=%s, customer_search_condition=%s, url=%s, data=%s, result_template_setting=%s', JSON.stringify(channel), JSON.stringify(info),
        JSON.stringify(customer_search_condition), url, JSON.stringify(data), JSON.stringify(result_template_setting));
    let res = false;
    for (var c = 0; c < channel.length; c++) {
        if (channel[c] == 1) {
            // 微信
            let res_wechat_p = await sendTemplateMessage(info.wechat.id, customer_search_condition, info.wechat.long_template_id, url, data);
            if (res_wechat_p instanceof app.err.SCError) {
                log.warn('priority model - send wechat message error');
                continue;
            } else {
                log.info('priority model - send wechat message success');
                res = true;
                break;
            }
        }
        if (channel[c] == 2) {
            // 短信
            let res_sms_p = await sendSMSMessage(info.sms.id, customer_search_condition, info.sms.format);
            if (res_sms_p instanceof app.err.SCError) {
                log.warn('priority model - send sms message error');
                continue;
            } else {
                log.info('priority model - send sms message success');
                res = true;
                break;
            }
        }
        if (channel[c] == 3) {
            // 邮件
            let res_email_p = await sendEmailMessage(info.email.id, customer_search_condition, result_template_setting[0].name, info.email.format);
            if (res_email_p instanceof app.err.SCError) {
                log.warn('priority model - send email message error');
                continue;
            } else {
                log.info('priority model - send email message success');
                res = true;
                break;
            }
        }
        if (channel[c] == 4) {
            // APP
            let res_app_p = await sendAppMessage(info.app.id, customer_search_condition, info.app.format, result_template_setting[0].name);
            if (res_app_p instanceof app.err.SCError) {
                log.warn('priority model - send app message error');
                continue;
            } else {
                log.info('priority model - send app message success');
                res = true;
                break;
            }
        }
    }
    log.info('prioritySend finished...');
    if (!res) {
        return app.err.fail.msg('all send error by priority model');
    } else {
        return true;
    }
}

/**
 * 并发模式发送消息
 */
async function concurrentSend (channel, info, customer_search_condition, url, data, result_template_setting) {
    log.info('concurrentSend starting...');
    log.info('input<->channel=%s, info=%s, customer_search_condition=%s, url=%s, data=%s, result_template_setting=%s', JSON.stringify(channel), JSON.stringify(info),
        JSON.stringify(customer_search_condition), url, JSON.stringify(data), JSON.stringify(result_template_setting));
    let function_list = [];
    for (var c = 0; c < channel.length; c++) {
        if (channel[c] == 1) {
            // 微信
            function_list.push(await sendTemplateMessage(info.wechat.id, customer_search_condition, info.wechat.long_template_id, url, data));
        }
        if (channel[c] == 2) {
            // 短信
            function_list.push(await sendSMSMessage(info.sms.id, customer_search_condition, info.sms.format));
        }
        if (channel[c] == 3) {
            // 邮件
            function_list.push(await sendEmailMessage(info.email.id, customer_search_condition, result_template_setting[0].name, info.email.format));
        }
        if (channel[c] == 4) {
            // APP
            function_list.push(await sendAppMessage(info.app.id, customer_search_condition, info.app.format, result_template_setting[0].name));
        }
    }
    if (function_list.length == 0) {
        return app.err.fail.msg('cannot find channel data from setting table');
    }
    Promise.all(function_list)
        .then(function (s) {
            log.info('concurrent model - send message status : {%s}', s);
            if (s.indexOf(true) > -1) {
                log.info('concurrent model - send message success');
                return true;
            } else {
                log.warn('concurrent model - send message error');
                return app.err.fail.msg('all send error by concurrent model');
            }
        })
        .catch(function (err) {
            log.error('concurrent model - send message error, err=%s', err);
            return app.err.fail.msg('send crash by concurrent model');
        })
        .finally(function () {
            log.info('concurrentSend finished...');
        })
}

/**
 * 组装客户检索条件
 * @param account_id 微信CF账号ID
 * @param openid 微信openid
 * @param mobile 手机号
 * @param email 邮件地址
 * @param device_id APP设备号
 * @returns JSON体 CustomerSearchCondition
 */
var makeCustomerSearchCondition = (account_id, openid, mobile, email, device_id) => {
    return {
        cf_account_id: account_id,
        wechat_open_id: openid,
        mobile: mobile,
        email: email,
        app_device_id: device_id
    }
};

/**
 * 获取读连接池
 * @returns {*}
 */
var getRPoolSync = () => {
    return _private_data.poolRead;
};

/**
 * 发送微信模板消息
 * @param accountId 账户ID
 * @param customerSearchCondition 被推送人
 * @param templateId 微信模板长号
 * @param url 详情自定义地址
 * @param content 内容key-value形式的JSON数组
 * @returns {*} true或者app.err.SCError
 */
async function sendTemplateMessage(accountId, customerSearchCondition, templateId, url, content) {
    log.info('sendTemplateMessage starting...');
    try {
        if (!!!customerSearchCondition.cf_account_id) {
            customerSearchCondition.cf_account_id = accountId;
        }
        let req_obj = {
            header: _private_data.header,
            req_template_message_send: {
                account_id: accountId,
                customer_search_condition: customerSearchCondition,
                template_id: templateId,
                url: url,
                content: content
            }
        };
        log.info('ready to request cf.wechat, req_obj=%s, time=%s', JSON.stringify(req_obj), Date.parse(new Date()));
        let res_data = await _private_data.rpcCfWechatClient.sendRequest(_private_data.pbCfWechatEncoder.encode(JSON.stringify(req_obj)));
        let res_obj = _private_data.pbCfWechatEncoder.decode(res_data.content);
        log.info('request cf.wechat success! res_obj=%s, time=%s', JSON.stringify(res_obj), Date.parse(new Date()));
        if (res_obj.res_template_message_send.errcode == 0) {
            return true;
        } else {
            return app.err.fail.msg(res_obj.res_template_message_send.errmsg);
        }
    } catch (e) {
        log.error('sendTemplateMessage error, err=%s, time=%s', e, Date.parse(new Date()));
        return app.err.systemError.msg(e);
    } finally {
        log.info('sendTemplateMessage finished...');
    }
}

/**
 * 发送短信消息
 * @param accountId 账户ID
 * @param customerSearchCondition 被推送人
 * @param text 内容
 * @returns {*} true或者app.err.SCError
 */
async function sendSMSMessage(accountId, customerSearchCondition, text) {
    log.info('sendSMSMessage starting...');
    try {
        let req_obj = {
            header: _private_data.header,
            req_send_text: {
                account_id: accountId,
                customer_search_condition: customerSearchCondition,
                content: text
            }
        };
        log.info('ready to request cf.sms, req_obj=%s, time=%s', JSON.stringify(req_obj), Date.parse(new Date()));
        let res_data = await _private_data.rpcCfServerClient.sendRequest(_private_data.pbCfServerEncoder.encode(JSON.stringify(req_obj)));
        let res_obj = _private_data.pbCfServerEncoder.decode(res_data.content);
        log.info('request cf.sms success! res_obj=%s, time=%s', JSON.stringify(res_obj), Date.parse(new Date()));
        if (res_obj.res_send_text.errcode == 0) {
            return true;
        } else {
            return app.err.fail.msg(res_obj.res_send_text.errmsg);
        }
    } catch (e) {
        log.error('sendSMSMessage error, err=%s, time=%s', e, Date.parse(new Date()));
        return app.err.systemError.msg(e);
    } finally {
        log.info('sendSMSMessage finished...');
    }
}

/**
 * 发送邮件消息
 * @param accountId 账户ID
 * @param customerSearchCondition 被推送人
 * @param subject 主旨
 * @param text 内容
 * @returns {*} true或者app.err.SCError
 */
async function sendEmailMessage(accountId, customerSearchCondition, subject, text) {
    log.info('sendEmailMessage starting...');
    try {
        let req_obj = {
            header: _private_data.header,
            req_send_text: {
                account_id: accountId,
                customer_search_condition: customerSearchCondition,
                content: subject + "@html@" + text
            }
        };
        log.info('ready to request cf.email, req_obj=%s, time=%s', JSON.stringify(req_obj), Date.parse(new Date()));
        let res_data = await _private_data.rpcCfServerClient.sendRequest(_private_data.pbCfServerEncoder.encode(JSON.stringify(req_obj)));
        let res_obj = _private_data.pbCfServerEncoder.decode(res_data.content);
        log.info('request cf.email success! res_obj=%s, time=%s', JSON.stringify(res_obj), Date.parse(new Date()));
        if (res_obj.res_send_text.errcode == 0) {
            return true;
        } else {
            return app.err.fail.msg(res_obj.res_send_text.errmsg);
        }
    } catch (e) {
        log.error('sendEmailMessage error, err=%s, time=%s', e, Date.parse(new Date()));
        return app.err.systemError.msg(e);
    } finally {
        log.info('sendEmailMessage finished...');
    }
}

/**
 * 发送APP消息
 * @param accountId 账户ID
 * @param customerSearchCondition 被推送人
 * @param content 内容
 * @param subject 主旨
 * @returns {*} true或者app.err.SCError
 */
async function sendAppMessage(accountId, customerSearchCondition, content, subject) {
    log.info('sendAppMessage starting...');
    try {
        if (!(customerSearchCondition instanceof Array)) {
            customerSearchCondition = [customerSearchCondition];
        }
        var req_obj = {
            header: _private_data.header,
            req_push_message: {
                account_id: accountId,
                device_type: [9],   // 全部设备 iOS/Andriod/Winphone
                customer_search_condition: customerSearchCondition,
                message_content: {
                    type: 9,  // 全部 通知和消息
                    content: content,
                    title: subject
                }
            }
        };
        log.info('ready to request cf.app, req_obj=%s, time=%s', JSON.stringify(req_obj), Date.parse(new Date()));
        let res_data = await _private_data.rpcCfAppClient.sendRequest(_private_data.pbCfAppEncoder.encode(JSON.stringify(req_obj)));
        let res_obj = _private_data.pbCfAppEncoder.decode(res_data.content);
        log.info('request cf.app success! res_obj=%s, time=%s', JSON.stringify(res_obj), Date.parse(new Date()));
        if (res_obj.res_push_message.errcode == 0) {
            return true;
        } else {
            return app.err.fail.msg(res_obj.res_push_message.errmsg);
        }
    } catch (e) {
        log.error('sendAppMessage error, err=%s, time=%s', e, Date.parse(new Date()));
        return app.err.systemError.msg(e);
    } finally {
        log.info('sendAppMessage finished...');
    }
}

