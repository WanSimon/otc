/**
 * Created by obel on 2019/12/17.
 */
const dao = require('../dao/productCategory');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
  post: {
    '/productCategory':addProductCategory
  },
  get: {
    '/productCategory':getProductCategoryList,
    '/productCategory/:innerid':getProductCategoryById,
    '/productCategory/get/tree':getTree,
  },
  put:{
    '/productCategory/:innerid':updateProductCategory
  },
  delete:{
    '/productCategory/:innerid':delProductCategory
  }

};

/**
 * 获取药品分类列表
 * */
async function getProductCategoryList(ctx) {
  let body = ctx.request.query;
  let limit = body.limit;
  let page = body.page;
  let name = body.name;
  let fullname = body.fullname;
  return dao.getProductCategoryList(limit,page,name,fullname);
}

/**
 * 获取药品分类详情
 * */
async function getProductCategoryById(ctx) {
  let innerid = ctx.params.innerid;
  return dao.getProductCategoryById(innerid);
}

/**
 * 删除药品分类
 * */
async function delProductCategory(ctx) {
  let innerid = ctx.params.innerid;
  let isExisted = await dao.isExistedProduct(innerid)
  if (isExisted.total > 0) throw app.err.relatedData.msg('该药品分类正在被使用,无法删除');
  return dao.delProductCategory(innerid);
}

/**
 * 更改药品分类
 * */
async function updateProductCategory(ctx) {
  let innerid = ctx.params.innerid;
  let body = ctx.request.body;
  let obj = {};
  obj.modified_id = ctx.user.innerid;
  obj.modified_time = new Date();
  obj.parent_id = body.parent_id;
  obj.fullname = body.fullname;
  obj.name = body.name;
  obj.remark = body.remark;
  obj.is_show = body.is_show;
  obj.sort_no = body.sort_no;
  obj.image_url = body.image_url;

  return dao.updateProductCategory(innerid,obj);
}

/**
 * 新增药品分类
 * */
async function addProductCategory(ctx) {
  let body = ctx.request.body;
  let obj = {};
  obj.innerid = sc.guid();
  obj.creater_id = ctx.user.innerid;
  obj.created_time = new Date();
  obj.parent_id = body.parent_id;
  obj.fullname = body.fullname;
  obj.name = body.name;
  obj.remark = body.remark;
  obj.is_show = body.is_show;
  obj.sort_no = body.sort_no;
  obj.image_url = body.image_url;
  obj.is_deleted = 0;
  return dao.addProductCategory(obj);
}

/**
 * 获取药品分类树形结构
 * */
async function getTree(ctx) {
  return dao.getTree( );
}
