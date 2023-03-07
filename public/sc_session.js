/**
 * session基类
 */
"use strict";

let sc = require("smartacjs");
let app = sc.app();
let Promise = sc.Promise;
let _ = sc._;
//获取redis连接
let redis = app.redis;
let conf = app.conf;

//内存用来记录session
let _sessionList = {};

/**
 * 会话对象
 * 所有属性直接访问
 */

function Session(obj) {
    //缓存的数据obj
    this.data = obj;
    this.id = obj.id;
    this._isDeleted = false;
    // 复制属性
    for (let k in obj){
        this[k]=obj[k];
    }
    this.log=sc.createNamedLog("Session:"+obj.id);
}


// 移除会话
Session.prototype.remove = function () {
    this._isDeleted = true;
    this.updateToRedis();
    delete _sessionList[this.id];
    this.log.debug("remove!");
}
// 更新会话访问时间
Session.prototype.access = function () {
    //更新obj的最后访问时间
    this.data.lasttime = new Date().valueOf();
    return this.updateToRedis();
}
// 获取通知列表
Session.prototype.getNotifyList = function () {
    let self = this;
    return new Promise(function (resolve, reject) {
        let key = self.getRedisNotifyKey();
        let rc = app.redis.conn();
        let data = null;
        rc.lrange(key, 0, -1).then(function (da) {
            data = da;
            if (data && data.length > 0) {
                // 将字符串列表转换为对象
                for (let i = 0; i < data.length; i++) {
                    try {
                        data[i] = JSON.parse(data[i]);
                    }
                    catch (e) {
                        self.log.log("parse notify data fail!data=%s", data[i]);
                        data[i] = null;
                    }
                }

                return rc.del(key);
            }
            else {
                resolve([]);
            }
        }).then(function () {
            resolve(data);
        }).catch(function (e) {
            self.log.error("cann't get session notify list,error=%s", e);
            resolve([]);
        });
    });

};
// 添加通知
Session.prototype.addNotify = function (notifyObject) {
    let key = this.getRedisNotifyKey();
    let rc = app.redis.conn();
    return rc.rpush(key, JSON.stringify(notifyObject));
};
function convertToRedisUserID(userId) {
    return "session:user:" + userId.toLocaleLowerCase();
}
function convertToRedisSessionID(id) {
    id = id.toLocaleLowerCase();
        return "session:instance:"+id;
}

Session.prototype.getRedisID = function () {
    return convertToRedisSessionID(this.data.id);
};

Session.prototype.getRedisUserID = function () {
    return convertToRedisUserID(this.data.user_id);
};

Session.prototype.getRedisNotifyKey = function () {
    return this.getRedisID() + ":notify";
};

// 同步Redis
Session.prototype.updateFromRedis = function () {
    let self = this;
    return new Promise(function (resolve, reject) {
        // redis查找
        redis.conn.get(self.getRedisID())
            .then(function (sessionData) {
                if (sessionData) {
                    try {
                        let sessionObject = JSON.parse(sessionData);
                        self.data = sessionObject;
                    } catch (e) {
                        self.log.warn("session sync error!!error=%s!data=%s", e, sessionData);
                        reject(app.err.noExist);
                    } finally {
                        resolve();
                    }
                } else {
                    self.log.debug("session sync failed!!no  data!");
                    reject(app.err.noExist);
                }
            }).catch(function (err) {
            self.log.warn("session sync error!err=%s", err);
            reject(app.err.systemError);
        });
    });
};

// 同步Redis
Session.prototype.updateToRedis = function () {
    let self=this;
    if (!this._isDeleted) {
        let expireTime = conf.session.timeout;
        //key: sessionid   val:obj
        redis.conn.setex(self.getRedisID(), expireTime,JSON.stringify(self.data)).catch(function(err){
            self.log.error("save session data to redis fail!err=%s",err);
        });
        //key : staff_id  val: sessionid
        redis.conn.setex(self.getRedisUserID(), expireTime,self.id).catch(function(err){
            self.log.error("save user_id to redis fail!err=%s",err);
        });
    }
    else {
        redis.conn.del(self.getRedisID());
        redis.conn.del(self.getRedisUserID());
    }
    return true;
};

function SessionManager(name){
    this.name=name;
    this.log=sc.createNamedLog("name");
}

// 获取会话
SessionManager.prototype.findSession = function (id, access) {
    let self=this;
    return new Promise(function (resolve, reject) {
        if (sc.isDebug && id === "0") {
            let sessionData = {
                program_type: 2,
                staff_id: 'test_user',
                user_id: 'test',
                terminal_id: 'test',
                shop_id:'shop_test_hs_ghgc',
                id:'0'
            };
            return resolve(self._createSession(sessionData));
        }

        // redis查找
        let session = self._createSession({ id: id });
        session.updateFromRedis().then(function () {
            //更新会话访问时间
            if (access) session.access();
            if(new Date().getTime()-session.data.lasttime>600000){
                console.log("session access last time:%s;update time:%s,session id:%s", session.data.lasttime,new Date().getTime(),id);
                session.access();
            }
            resolve(session);
        }).catch(function (e) {
            // 报告不存在错误
            resolve(null);
            console.log("cann't find session,session id=%s", id);
        });
    })
}
// 获取会话(通过职员ID)
SessionManager.prototype.findSessionByUserID = function (userId) {
    let self = this;
    return new Promise(function (resolve, reject) {
        //根据staffId从redis中获取sessionid
        redis.conn.get(convertToRedisUserID(userId))
            .then(function (session_id) {
                //如果查不到sessionid,则返回空；
                if (!session_id) return resolve(null);
                return self.findSession(session_id, false);
            })
            .then(function (session) {
                resolve(session);
            })
            .catch(function (err) {
                reject(err);
            })
    })
};
// 内部创建接口
SessionManager.prototype._createSession = function (sessionObject) {
    return new Session(sessionObject);
}

// 创建会话
SessionManager.prototype.createSession = function (sessionObject) {
    if (!sessionObject.user_id) {
        console.error("create session fail!miss user id");
        return null;
    }
    // 创建session,ID自动赋值
    if (!sessionObject.id){
        sessionObject.id = sc.guid22();

    }
    let time = new Date().valueOf();
    sessionObject.createtime = time;
    sessionObject.lasttime = time;
    let session = this._createSession(sessionObject);
    //redis加入会话
    if (session.updateToRedis()) {
        return session;
    } else {
        return null;
    }
}
exports.Session = Session;
exports.SessionManager=SessionManager;
/**
 * 每分钟清空内存中的session
 */
function checkSessionList() {
    let length=0;
    for (k in _sessionList)length++;
    console.log("memory session info clean!count=%d",length);
    _sessionList = {};
}

setInterval(checkSessionList, 60000);