/**
 * Created by Kaku on 2016/11/23.
 */
var sc = require('smartacjs');
var app = sc.app();
var Promise = sc.Promise;
var _ = sc._;
var path = require('path');
var rpcClient, pbEncoder

/**
 * 消息头
 * @type {{header: {sender: string, sender_type: (string|string|string|string|string|string)}}}
 */
var header = {
    sender: "unknow",
    sender_type: "unknow"
};

var protocolPath = path.normalize(__dirname + "/../protocol/");
exports.init = function(mq, instanceName, programType){
    header.sender = instanceName;
    header.sender_type = programType;
    if (typeof (mq) == 'string') {
        mq = sc.RabbitMQ().createConnect(mq);
        mq.start();
    }
    if(mq){
        rpcClient = sc.RabbitMQ().createRPCClient(mq, 'sc.task.rpc');
        if (rpcClient) {
            pbEncoder = sc.createPBEncoder(protocolPath + "sc_task.proto.js", "sc.task", "Message");
            if (!!!pbEncoder) {
                console.error("create pb task encoder failed!")
            }
        } else {
            console.error("create rpc client failed!");
        }
    } else {
        console.error("get mq connection failed!");
    }
}

exports.sendRequestToStartTask = function(taskId, param){
    return new Promise(function(resolve, reject){
        var parameter = [];
        if(param instanceof Array){
            parameter = param;
        }else if(typeof param == "object"){
            for(var key in param){
                parameter.push({key: key, value: param[key]});
            }
        }else{
            console.error("invalid argument param!");
            return false;
        }

        var obj = {
            header: header,
            req_start_task: {
                task_id: taskId,
                parameter: parameter
            }
        };
        var pbMsg = pbEncoder.encode(obj);
        if(pbMsg){
            rpcClient.sendRequest(pbMsg, 'req_start_task').then(function(result){
                var content  = pbEncoder.decode(result.content);
                if(content){
                    if(content.res_start_task && content.res_start_task.run_id){
                        console.log("send request to start task " + taskId + " success, run id: " + content.res_start_task.run_id);
                        resolve(true);
                    }else{
                        console.error("send request to start task " + taskId + "failed: " + content.res_error);
                        reject(false);
                    }
                }else{
                    console.error("send request to start task " + taskId + " error: decode pb response failed");
                    reject(false);
                }
            }).catch(function(e){
                console.error("send request to start task " + taskId + " error: " + e.message);
                reject(false);
            });
        }else{
            console.error("send request to start task " + taskId + " error: encode pb message failed");
            reject(false);
        }

    });
}
