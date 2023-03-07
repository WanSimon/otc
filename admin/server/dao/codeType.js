/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app=sc.app();
const db = app.db;

exports.getList = (pageSize,pageIndex,dept_id,name,mobile) => {
    let options = {
        pageSize,
        pageIndex
    };
    let sql = `SELECT xd.innerid,xd.person_photo_url,xd.name,xd.sex,xd.mobile,xdt.dept_name,xd.technical_title,xd.status,xd.isenableconsult FROM xy_codetype xd
               LEFT JOIN  xy_department xdt ON xd.dept_id = xdt.innerid  WHERE 1=1 AND xd.is_deleted = 0 `;
    if(dept_id!=="" && dept_id!==undefined){
        sql += ` AND xd.dept_id = '${dept_id}' `;
    }
    if(name!=="" && name!==undefined){
        sql += ` AND xd.name LIKE '%${name}%' `;
    }
    if(mobile!=="" && mobile!==undefined){
        sql += ` AND xd.mobile LIKE '%${mobile}%' `;
    }
    return db.getPage(sql,options);
};

exports.getInfo = (innerid)=>{
    let sql = `SELECT  innerid,name,mobile,sex,expertise,profile,dept_id,isenableconsult,status,
               person_photo_url,id_card,credentials_no,technical_title,license_no,license_main,
               license_personal,front_card_url,back_card_url,credentials_main,credentials_personal FROM xy_codetype WHERE innerid = @innerid@ AND is_deleted = 0;`;
    return db.getOne(sql,{innerid});
};

exports.update = (options,innerid)=>{
    return db.update('xy_codetype',options,{innerid});
};

exports.add = (options)=>{
    return db.insert('xy_codetype',options);
};

exports.del = (innerid)=>{
    return db.update('xy_codetype',{is_deleted:1},{innerid});
};

exports.getListByKey = (key)=>{
    let sql = `SELECT caption,codevalue FROM xy_code_v2 xc
               LEFT JOIN xy_codetype xct ON xc.codetype_id = xct.innerid
               WHERE xct.codetype = '${key}' AND xct.is_deleted = 0 AND xc.is_deleted = 0
               ORDER BY xc.sort;`;
    return db.execute(sql);
};
