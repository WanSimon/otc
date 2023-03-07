/**
 * Created by obel on 2019/12/25.
 */
const sc = require("smartacjs");
const app = sc.app();
const common = require("../js/common");

function init(){
  app.common = common;
  app.db = sc.db().createMySQLConnectionPool(app.conf.dbString);
  app.redis = sc.Redis2().createRedisConnection(app.conf.redisUrl, 'redis');
  app.session =require('./redis_manager');

  app.db.getPage = async (sql,options)=>{
    options.pageSize = parseInt(options.pageSize) || 10;
    options.pageIndex = parseInt(options.pageIndex) || 1;
    options.pageIndex = (options.pageIndex - 1) * options.pageSize;
    //首尾去空格
    sql = sql.replace(/^\s+|\s+$/g, '');
    //尾去分号
    if(sql[sql.length - 1]==";") sql =sql.slice(0,sql.length-1);
    let sql_count = sc.db().makeSQL(`SELECT COUNT(*) AS count FROM (${sql}) AS tmp `,options);
    let data = await app.db.query(sql_count);
    let count = data[0].count;
    sql = `${sql} LIMIT @pageIndex@,@pageSize@`;
    sql = sc.db().makeSQL(sql,options);
    let list = await app.db.query(sql);
    return {list,count};
  };

  app.db.execute = (sql,options)=>{
    sql = sc.db().makeSQL(sql,options);
    return app.db.query(sql);
  };

  app.db.insert = (table,data)=>{
    let sql = sc.db().makeSQLInsert(table, data);
    return app.db.query(sql);
  };

  app.db.delete = (table,conditions)=>{
    let sql = sc.db().makeSQLDelete(table, conditions);
    return app.db.query(sql);
  };

  app.db.getOne = async (sql,options)=>{
    sql = sc.db().makeSQL(sql,options);
    let data = await app.db.query(sql);
    if(data.length === 0)
      throw app.err.noFound;
    else return data[0];
  };

  app.db.update = (table,options,conditions)=>{
    let sql = sc.db().makeSQLUpdate(table, options, conditions);
    return app.db.query(sql);
  };

  app.db.transaction = async (sqls)=>{
    let conn = await app.db.getConnection('admin');
    let isBegin = false;
    try{
      await conn.beginTransaction();
      isBegin = true;
      for(let i=0;i<sqls.length;i++){
        await conn.query(sqls[i]);
      }
      await conn.commit();
    }
    catch(err){
      if (conn && isBegin) {
        conn.rollback();
      }
      throw app.err.dbOpertationFailed;
    }
    finally {
      if (conn) {
        conn.release();
      }
    }
  };

}
init();
