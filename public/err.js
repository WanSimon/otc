/**
 * Created by Simon on 2016/3/16.
 */

var util = require('util')
/**
 * 通用错误定义0-99
 */
function SCError(code,msg)
{
//	Error.captureStackTrace(this)
	this.errcode=code;
	this.errmsg=msg;
}
util.inherits(SCError, Error);
SCError.prototype.toString=function()
{
	return "errcode="+this.errcode+",message='"+this.errmsg+"'";
}
SCError.prototype.setObject=function(obj)
{
	obj.errcode=this.errcode;
	obj.errmsg=this.errmsg;
}
SCError.prototype.msg=function()
{
	var msg=require('smartacjs').formatArgs(Array.prototype.slice.call(arguments));
	return new SCError(this.errcode,msg);
}

var err={};
// 导出错误对象
err.SCError=SCError;
// 成功
err.success=new SCError(0,null);
// 通用失败
err.fail=new SCError(1,"fail");
// 参数无效
err.invalidParameter=new SCError(2,"invalid parameter");
// 不支持
err.noSupport=new SCError(3,"no support");
// 不存在
err.noExist=new SCError(4,"no exist");
// 超时
err.timeout=new SCError(5,"timeout");
// 繁忙
err.busy=new SCError(6,"busy");
// 缺少参数
err.missParameter=new SCError(7,"miss parameter");
// 系统错误(通用错误)
err.systemError=new SCError(8,"system error");
// 密码错误
err.invalidPassword=new SCError(9,"invalid password");
// 编码失败
err.encodeFailed=new SCError(10,"encode failed");
// 数据库操作失败
err.dbOpertationFailed=new SCError(11,"db error");
// 已占用
err.occupied=new SCError(12,"occupied");
// session不存在
err.noSession = new SCError(13,'cannot find session');
//没有找到
err.noFound = new SCError(14, "no found");
//已经存在
err.isExisted = new SCError(15, "is existed")
//已经锁定
err.isLocked = new SCError(16, "staff is locked");
//已经过期
err.isExpired = new SCError(17, "is expired");
//无效的账户
err.invalidUser = new SCError(18, "invalid user");
// 已有关联数据
err.relatedData = new SCError(19, "related data");

/**
 * http错误定义
 */
err.http={};
err.http.success=new SCError(200,"");
err.http.invalidParameter=new SCError(400,"invalid parameter");
err.http.formatError=new SCError(400,"format error");
err.http.noFound=new SCError(404,"cann't found");
err.http.invalidAppIdOrSecret=new SCError(400,"invalid appid or secret");
err.http.systemError=new SCError(500,"system error");
err.http.missingArgument=new SCError(400,"missing argument");
err.http.accessReject=new SCError(401,"access reject");
err.http.tooBig=new SCError(400,"data too big");
err.http.convertFail=new SCError(400,"convert fail");
err.http.timeout=new SCError(504,"rpc timeout");
err.http.invalidToken=new SCError(400,"invalid token");

/**
 * 通用方法定义
 */

// 导出错误
module.exports=err;

/**
 * 程序错误100-499
 */
