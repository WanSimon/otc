/**
 * Created by Simon on 2016/9/2.
 */
var sc=require('smartacjs');
var dgram = require("dgram");
var process=require('process');
var server=null;

var processMap={
    pause:processPause,
    resume:processResume,
    stop:processStop,
}
var main=null;
// 端口
var managerPort=process.env.manager_port;
var runid=process.env.runid;
// 启动方法
exports.runMain = function(fn)
{
    main=fn;
    try
    {
        if (managerPort==undefined)
        {
            console.warn("evt:manager_port undefined! unsupport manager!");
            main();
        }
        else
        {
            server = dgram.createSocket("udp4");
            server.on("error", function (err) {
                console.log("UDP服务错误:\n" + err.stack);
                server.close();
            });
            server.on("message", processMessage);
            server.on("listening", function () {
                var address = server.address();
                console.log("UDP listing  " +address.address + ":" + address.port);
                sendMessage("start:"+runid);
                main();
            });
            server.bind();
        }
    }
    catch(e)
    {
        console.error('init task crash!err=%s',e);
        process.exit(-1);
    }
}

function processMessage(msg, rinfo)
{
    msg=msg.toString();
    console.log("[%s:%d] recv:%s",rinfo.address,rinfo.port,msg.toString());
    var cmd=msg.split(':');
    if (cmd.length>0)
    {
        if (typeof(processMap[cmd[0]])=='function')
        {
            try
            {
                processMap[cmd[0]](cmd);
            }
            catch(e)
            {
                console.error('process message "%s" crash!err=%s',cmd[0],e);
            }
        }
        else {
            console.error('unknow message:%s',cmd[0]);
        }
    }
    else {
        console.error("invalid message!drop!");
    }
}

// 进度通知
exports.progress=function(val)
{
    sendMessage("progress:%d",val.toFixed());
}
// 处理消息:暂停
function processPause()
{
    if (exports.onPause)
    {
        exports.onPause()
            .then(function(){
            console.info("pause");
            sendMessage('pause');
            })
            .catch(function (err) {
            sendMessage('reject');
            console.warn('pause command reject!');
                throw err;
            });
        }
    else
    {
        console.warn('no suport command:pause');
    }
}
// 处理消息:继续
function processResume()
{
    if (exports.onResume)
    {
        exports.onResume()
            .then(function(){
            console.info("resume");
            sendMessage('resume');
            })
            .catch(function (err) {
            sendMessage('reject');
            console.warn('resume command reject!');
                throw err;
            });
        }
    else
    {
        console.warn('no suport command:resume');
    }
}
// 处理消息:停止
function processStop()
{
    if (exports.onStop)
    {
        exports.onStop()
            .then(function(){
            console.info("stoping");
            sendMessage('stoping');
            })
            .catch(function (err) {
            sendMessage('reject');
            console.warn('stoping command reject!');
                throw err;
            });
        }
    else
    {
        console.warn('no suport command:stop');
    }
}
// 发送消息
function sendMessage(msg)
{
    server.send(msg, 0, msg.length, managerPort, "127.0.0.1");
}
exports.sendMessage=sendMessage;

// 各种通知定义
// 暂停通知
exports.onPause=null;
// 继续通知
exports.onResume=null;
// 停止通知
exports.onStop=null;