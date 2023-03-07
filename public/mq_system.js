/**
 * sc.system交换器处理
 * Created by Simon on 2016/3/15.
 */
var sc          = require("smartacjs");
var app         = sc.app();
var Promise     = sc.Promise;
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var path=require('path');
var os=require('os');
var process=require('process');
var rabbit=sc.RabbitMQ();
//inherits(exports, EventEmitter);
var exports=new EventEmitter();
var protoFilePath=path.normalize(__dirname+"/../protocol/");
var privateData={};
var inited=false;
var log;
exports.isInited=function()
{
    return inited;
}
exports.init=function(mq,instanceName,programType)
{
    if (inited) return;
    inited=true;
    if (typeof(mq)=='string')
    {
        privateData.mq=rabbit.createConnect(app.conf.mqUrl);
        privateData.mq.start();
    }
    else
    {
        privateData.mq=mq;
    }
    if (!instanceName && app.conf.instanceName) instanceName=app.conf.instanceName;
    if (!programType && app.programType) programType=app.programType;
    privateData.instanceName=instanceName;
    privateData.programType=programType;
    log=sc.createNamedLog(programType,instanceName+"."+sc.workIndex);
    if (!!!privateData.mq)
    {
        sc.exit(100,"init sc.system exchange fail!cann't get mq connection!");
    }
    privateData.mq.declareExchange("sc.system","fanout",true,false);
    var queue=privateData.mq.declareQueue(app.conf.instanceName+".system.?",onMessage,false,true);
    queue.declareBinding("sc.system","");
    privateData.encoder=sc.createPBEncoder(protoFilePath+"sc_system.proto.js","system","Message");
    if (!!!privateData.encoder)
    {
        sc.exit(101,"init sc.system exchange fail!cann't create encoder!!");
    }
    if (sc.isMaster)
    {
        exports.running();
    }
    setInterval(updateProcessInfo,180000);
    // 自动探测外部链接
    autoConfig();
}
// 数据库连接池
exports.db=null;
// redis连接
exports.redis=null;
// 状态枚举
exports.EStatus={
    init:1,
    running:2,
    closed:3
}
// 设定当前状态
exports.setStatus=function(status)
{
    if (privateData._status!=status)
    {
        privateData._status=status;
        // 只有主进程发送程序启动通知
        if (!sc.isMaster) return;
        exports.publish('ntf_status',{status:status});
    }
}
// 设定当前状态为运行中
exports.running=function()
{
    this.setStatus(exports.EStatus.running);
}
function onMessage(msg)
{
    try
    {
        var json=privateData.encoder.decode(msg.content);
        if (json)
        {
            if (json.ntf_basedata_changed)
            {
                exports.emit('basedata',json.ntf_basedata_changed.abstract,json.ntf_basedata_changed.detail);
            }
            else if (json.ntf_config_changed)
            {
                log.debug("drop unsupport message 'ntf_config_changed'");
            }
            else if (json.ping)
            {
                if (json.ping.instance_name.length===0 || json.ping.instance_name.indexOf(privateData.instanceName)!==-1)
                {
                    log.log('recv:ping ')
                    var recv_msg={
                        header:{
                            sender:privateData.instanceName,
                            sender_type:privateData.programType
                        },
                        pong:{
                            tick:json.ping.tick
                        }
                    }
                   // if (sc.isMaster)
                    {
                        recv_msg.pong.host_info=getHostInfo();
                    }
                    recv_msg.pong.process_info=getProcessInfo();
                    privateData.mq.publishMessage("amq.direct",json.ping.replay,privateData.encoder.encode(recv_msg));
                }
            }
            else
            {
                log.debug("drop unknown message '%s'",JSON.stringify(json));
            }
        }
        else
        {
            log.warn("sc.system cann't decode message,buff=%s",msg.content);
        }
    }
    catch(e)
    {
        log.error("sc.system process msg crash!err=%s",e);
    }

}

/**
 * 发送通知
 */
exports.publish = function (name,content) {
    var msg={
        header:{
            sender:privateData.instanceName,
            sender_type:privateData.programType
        }
    }
    msg[name]=content;
    var buff=privateData.encoder.encode(msg);
    if (buff)
    {
        privateData.mq.publishMessage("sc.system","",buff);
    }
    else
    {
        log.error("sc.system publish status fail!encode fail!")
    }
}
// 发送基础数据改变通知
exports.publishBaseDataChangedNotify=function(table,detail)
{
    //目前只接受表明,改变明细被丢弃
    if (typeof(table)=='string'){
        table=[table];
    }

	var content={};
	
	if(detail){
		if (typeof(detail)=='string'){
			detail=[detail];
		}
		content={
			abstract:table,
			detail:detail
		};
	}else{
		content={
			abstract:table
		};
	}

    return exports.publish('ntf_basedata_changed',content);
}

module.exports=exports;
// 获取进程信息
function getHostInfo()
{
    var info={}
    info.os_name=os.type()+" "+os.release();
    info.host_name=os.hostname();
    info.ip_address=getIPAddressV4().join();
    info.mem_total=parseInt(os.totalmem()/1024/1024);
    info.mem_free=parseInt(os.freemem()/1024/1024);
    return info;
}
var _processInfo=null;
// 获取进程信息
function getProcessInfo()
{
    if (!!!_processInfo)
    {
        updateProcessInfo();
    }
    return _processInfo;
}
// 更新进程信息
function updateProcessInfo()
{
    _processInfo={};
    var db=sc.db();
    var mem=process.memoryUsage();
    _processInfo.pid=process.pid;
    //_processInfo.ppid=process.ppid;
    _processInfo.pindex=sc.workIndex;
    _processInfo.mem_used=parseInt(mem.heapTotal/1024/1024);
    _processInfo.mem_total=1024;//1G
    _processInfo.is_db_connected=undefined;
    if (exports.db)
    {
        // 测试数据库
        exports.db.query("select 1;").then(function(){
            _processInfo.is_db_connected=true;
        }).catch(function(e){
            _processInfo.is_db_connected=false;
            log.error('test db connect fail!err=%s',e);
        })
    }
    _processInfo.db_query_count=db.queryCount;
    _processInfo.db_query_times=db.queryTimes;
    _processInfo.db_link_occupy=db.linkOccupy;
    if (rabbit.messageInCount) _processInfo.message_in_count=rabbit.messageInCount;
    if (rabbit.messageInCount) _processInfo.message_out_count=rabbit.messageOutCount;
    if (exports.redis)
    {
        _processInfo.is_redis_connected=exports.redis.isConnected();
    }
    db.resetTotal();
    if (rabbit.resetTotal) rabbit.resetTotal();
    log.log("success update process info:%s",_processInfo);
}
function getIPAddressV4()
{
    var IPv4=[];
    var net=os.networkInterfaces();
    for (var k in net)
    {
        var card=net[k];
        for (var i=0;i<card.length;i++)
        {
            if (card[i].family==="IPv4" && card[i].address!="127.0.0.1")
            {
                IPv4.push(card[i].address);
            }
        }
    }
    return IPv4;
}

function autoConfig()
{
    var tmp=sc.findSubObjectInstance(app,'MySQLConnectionPool');
    if (tmp.length>0) exports.db=tmp[0];
    tmp=sc.findSubObjectInstance(app,'RedisConnection');
    if (tmp.length>0) exports.redis=tmp[0];

}