/**
 * Created by obel on 2019/12/17.
 */
const dao = require('../dao/symptom');
const sc = require("smartacjs");

exports.routers = {
  post: {
    '/symptom':addSymptom
  },
  get: {
    '/symptom':getSymptomList,
    '/symptom/:innerid':getSymptomById,
    '/symptom/get/tree':getTree
  },
  put:{
    '/symptom/:innerid':updateSymptom
  },
  delete:{
    '/symptom/:innerid':delSymptom
  }

};

/**
 * 获取症状列表
 * */
async function getSymptomList(ctx) {
  let body = ctx.request.query;
  let limit = body.limit;
  let page = body.page;
  let name = body.name;
  let part = body.part;
  let people_classify = body.people_classify;
  return dao.getSymptomList(limit,page,name,part,people_classify);
}

/**
 * 获取症状详情
 * */
async function getSymptomById(ctx) {
  let innerid = ctx.params.innerid;
  return dao.getSymptomById(innerid);
}

/**
 * 删除症状
 * */
async function delSymptom(ctx) {
  let innerid = ctx.params.innerid;
  return dao.delSymptom(innerid);
}

/**
 * 更改症状
 * */
async function updateSymptom(ctx) {
  let innerid = ctx.params.innerid;
  let body = ctx.request.body;
  let obj = {};
  obj.modified_id = ctx.user.innerid;
  obj.modified_time = new Date();
  obj.name = body.name;
  obj.part = body.part;
  obj.people_classify = body.people_classify;
  obj.sort = body.sort;
  obj.description = body.description;

  return dao.updateSymptom(innerid,obj);
}

/**
 * 新增症状
 * */
async function addSymptom(ctx) {
  let body = ctx.request.body;
  let obj = {};
  obj.innerid = sc.guid();
  obj.creater_id = ctx.user.innerid;
  obj.created_time = new Date();
  obj.name = body.name;
  obj.part = body.part;
  obj.people_classify = body.people_classify;
  obj.sort = body.sort;
  obj.description = body.description;
  obj.isdeleted = 0
  return dao.addSymptom(obj);
}

/**
 * 获取症状树形结构
 * */
async function getTree(ctx) {
  return dao.getTree( );
}
