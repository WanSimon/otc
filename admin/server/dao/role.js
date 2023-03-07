const sc = require('smartacjs');
const app = sc.app();
const db = app.db;

/**
 * 获取角色列表
 * */
exports.getRoleList = (pageSize, pageIndex, name) => {
    let options = {
        pageSize,
        pageIndex
    };
    let sql = 'SELECT innerid,name,type,created_time,creater_id FROM xy_role WHERE 1=1 ';
    if (name) {
        sql += ` AND name LIKE '%${name}%'`;
    }
    return db.getPage(sql, options);
};

/**
 * 新增角色
 * */
exports.addRole = async (innerid,menuKeyArr,name,creater_id,created_time)=>{
    let conn = await db.getConnection('role');
    let sqlArr = [];
    sqlArr.push(sc.db().makeSQLInsert('xy_role', {innerid,name,creater_id,created_time}));
    for(let i=0;i<menuKeyArr.length;i++){
        let sql = sc.db().makeSQLInsert('xy_role_define', {
            innerid:sc.guid(),
            role_id:innerid,
            menu_key:menuKeyArr[i],
            creater_id,
            created_time
        });
        sqlArr.push(sql);
    }
    let isBeginTransaction = false;
    try{
        await conn.beginTransaction();
        isBeginTransaction = true;
        for(let i=0;i<sqlArr.length;i++){
            await conn.query(sqlArr[i]);
        }
        await conn.commit();
    }
    catch(err){
        if (conn && isBeginTransaction) {
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

/**
 * 编辑角色
 * */
exports.updateRole = async (innerid,menuKeyArr,name,modified_id,modified_time)=>{
    let conn = await db.getConnection('role');
    let sqlArr = [];
    sqlArr.push(sc.db().makeSQLUpdate('xy_role', {name,modified_id,modified_time},{innerid}));
    sqlArr.push(sc.db().makeSQLDelete('xy_role_define',{role_id: innerid}));
    for(let i=0;i<menuKeyArr.length;i++){
        let sql = sc.db().makeSQLInsert('xy_role_define', {
            innerid:sc.guid(),
            role_id:innerid,
            menu_key:menuKeyArr[i],
            creater_id:modified_id,
            created_time:modified_time
        });
        sqlArr.push(sql);
    }
    let isBeginTransaction = false;
    try{
        await conn.beginTransaction();
        isBeginTransaction = true;
        for(let i=0;i<sqlArr.length;i++){
            await conn.query(sqlArr[i]);
        }
        await conn.commit();
    }
    catch(err){
        if (conn && isBeginTransaction) {
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

/**
 * 角色关联账户个数
 * @param {String} innerid 角色id
 * */
exports.hasRelatedAccount = (innerid) => {
    let sql = `SELECT COUNT(*) AS total FROM xy_account WHERE account_role LIKE '%${innerid}%' AND isdeleted=0`;
    return db.getOne(sql);
};

/**
 * 删除角色
 * @param {String} innerid 角色id
 * */
exports.delRole = async (innerid) => {
    let sqlArr = [];
    sqlArr.push(sc.db().makeSQLDelete('xy_role',{innerid}));
    sqlArr.push(sc.db().makeSQLDelete('xy_role_define',{role_id: innerid}));
    let conn = await db.getConnection('role');
    let isBeginTransaction = false;
    try{
        await conn.beginTransaction();
        isBeginTransaction = true;
        for(let i=0;i<sqlArr.length;i++){
            await conn.query(sqlArr[i]);
        }
        await conn.commit();
    }
    catch(err){
        if (conn && isBeginTransaction) {
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

/**
* 获取单个角色
* @param {String} innerid 角色id
* */
exports.getRoleById = (innerid)=>{
    let sql = `SELECT r.innerid,r.name, GROUP_CONCAT(rd.menu_key) AS menuKeyStr  FROM xy_role r
             LEFT JOIN xy_role_define rd ON r.innerid = rd.role_id
             WHERE r.innerid =  @innerid@
             GROUP BY r.innerid;`;
    return db.getOne(sql,{innerid});
};

/**
 * 根据角色获取菜单
 * */
exports.getMenuByRoles =(roles)=> {
    let sql = ` SELECT menu_key FROM xy_role_define WHERE role_id in (${roles}) GROUP BY menu_key;`;
    return db.execute(sql);
};

/**
 * 获取键值对
 * */
exports.getRolePairs = () => {
    let sql = `SELECT innerid,name,type FROM xy_role;  `;
    return db.execute(sql);
};
