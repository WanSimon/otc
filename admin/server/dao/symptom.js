/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app=sc.app();
const db = app.db;

/**
 * 获取症状列表
 * */
exports.getSymptomList = (pageSize,pageIndex,name,part,people_classify)=>{
  let options = {
    pageSize,
    pageIndex
  };
  let sql = `SELECT innerid,name,part,people_classify,description,sort 
             FROM xy_symptom 
             WHERE isdeleted = 0 `;
  if(name){
    sql += ` AND name LIKE '%${name}%' `;
  }
  if(part){
    sql += ` AND part LIKE '%${part}%' `;
  }
  if(people_classify){
    sql += ` AND people_classify LIKE '%${people_classify}%' `;
  }
  sql += ` ORDER BY sort `;
  return db.getPage(sql,options);
};

/**
 * 获取症状详情
 * */
exports.getSymptomById = (innerid)=>{
  let sql = `SELECT innerid,name,part,people_classify,description,sort  FROM xy_symptom xs
             WHERE xs.innerid = @innerid@ `;
  return db.getOne(sql,{innerid});
};

/**
 * 删除症状
 * */
exports.delSymptom = async (innerid)=>{
  return db.update('xy_symptom',{isdeleted:1},{innerid});
};

/**
 * 更改症状
 * */
exports.updateSymptom = async (innerid,obj)=>{
  return db.update('xy_symptom',obj,{innerid});
};

/**
 * 新增症状
 * */
exports.addSymptom = async (obj)=>{
  return db.insert('xy_symptom',obj);
};

/**
 * 获取症状的树形结构
 * */
exports.getTree = () =>{
  let sql = `SELECT innerid AS value,name AS label
             FROM xy_symptom WHERE isdeleted =0 ;`;
  return db.execute(sql);
};
