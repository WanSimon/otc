/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app=sc.app();
const db = app.db;

/**
 * 获取药品分类列表
 * */
exports.getProductCategoryList = (pageSize,pageIndex,name,fullname)=>{
  let options = {
    pageSize,
    pageIndex
  };
  let sql = `SELECT xpc.innerid,xpc.parent_id,xpc.name,xpc.fullname,xpc.sort_no,xpc.is_show,xpc.image_url,xpc2.name AS parent_name FROM xy_product_category xpc
             LEFT JOIN xy_product_category xpc2 ON xpc.parent_id = xpc2.innerid
             WHERE xpc.is_deleted = 0 `;
  if(name){
    sql += ` AND xpc.name LIKE '%${name}%' `;
  }
  if(fullname){
    sql += ` AND xpc.fullname LIKE '%${fullname}%' `;
  }
  sql += ` ORDER BY xpc.sort_no ASC `;
  return db.getPage(sql,options);
};

/**
 * 获取药品分类详情
 * */
exports.getProductCategoryById = (innerid)=>{
  let sql = `SELECT innerid,parent_id,name,fullname,sort_no,is_show,image_url,remark FROM xy_product_category xpc
             WHERE xpc.innerid = @innerid@ `;
  return db.getOne(sql,{innerid});
};

/**
 * 删除药品分类
 * */
exports.delProductCategory = async (innerid)=>{
  return db.update('xy_product_category',{is_deleted:1},{innerid});
};


/**
 * 更改药品分类
 * */
exports.updateProductCategory = async (innerid,obj)=>{
  return db.update('xy_product_category',obj,{innerid});
};

/**
 * 新增药品分类
 * */
exports.addProductCategory = async (obj)=>{
  return db.insert('xy_product_category',obj);
};

/**
 * 获取药品分类的树形结构
 * */
exports.getTree = () =>{
  let sql = `SELECT innerid AS value,name AS label,IFNULL(parent_id,0) AS parentId 
             FROM xy_product_category WHERE is_deleted =0 ;`;
  return db.execute(sql);
};

/**
 * 获取药品分类的树形结构
 * */
exports.isExistedProduct = (innerid) =>{
  let sql = `SELECT COUNT(*) AS total FROM xy_product WHERE product_category_list_id LIKE '%${innerid}%' AND is_deleted=0`;
  return db.getOne(sql);
};
