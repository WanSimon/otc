const dao = require('../dao/product');
const sc = require("smartacjs");
const app = sc.app();
const eqtTriggerDao = require('../dao/trigger_eqt');

exports.routers = {
  post: {
    '/product': addProduct,
    '/product/batch': addProductBatch,
    '/product/image': getProductImage,
    '/product/delete': delProduct,
    '/product/display': addProductDisplay
  },
  get: {
    '/product/barcode': autoGenBarcode,
    '/product/pairs': getPairs,
    '/product': getList,
    '/product/:innerid': getProductID,
    '/product/display/:innerid': getProductDisplay,
    '/product/display/used/:innerid': getBeUsedDisplay,
    '/product/display/image/:innerid': getDisplayImage,
  },
  put: {
    '/product/:innerid': updateProduct,
  },
  delete: {}
};

/**
 * 获取药品列表
 * */
async function getList(ctx) {
  let body = ctx.request.query;
  let limit = body.limit;
  let page = body.page;
  let name = body.name;
  let bar_code = body.bar_code;
  let manufacturer = body.manufacturer;
  return dao.getList(limit, page, name, bar_code, manufacturer);

}

/**
 * 获取药品详情
 * */
async function getProductID(ctx) {
  let innerid = ctx.params.innerid;
  return dao.getProductID(innerid);

}

/**
 * 删除药品
 * */
async function delProduct(ctx) {
  let innerid = ctx.request.body.innerid;
  if (!innerid) throw app.err.missParameter;
  let isExisted = await dao.checkCanDelete(innerid);
  if (isExisted.total > 0) throw app.err.relatedData.msg('某药品已绑定为商品,无法删除');
  return dao.delProduct(innerid);

}

/**
 * 添加药品
 * */
async function addProduct(ctx) {
  let innerid = sc.guid();
  let body = ctx.request.body;
  let obj = {};
  obj.name = body.name;
  obj.alias = body.alias;
  obj.approval_number = body.approval_number;
  obj.bar_code = body.bar_code;
  obj.product_category_list_id = body.product_category_list_id;
  obj.product_length = body.product_length;
  obj.product_height = body.product_height;
  obj.product_width = body.product_width;
  obj.brand = body.brand;
  obj.unit = body.unit;
  obj.manufacturer = body.manufacturer;
  obj.origin_place = body.origin_place;
  obj.operator_category_id = body.operator_category_id;
  obj.min_day = body.min_day;
  obj.max_day = body.max_day;
  obj.usage_dosage = body.usage_dosage;
  obj.treatment_course = body.treatment_course;
  obj.eat_time = body.eat_time;
  obj.product_function = body.product_function;
  obj.adverse_reaction = body.adverse_reaction;
  obj.taboo = body.taboo;
  obj.attention = body.attention;
  obj.interactions = body.interactions;
  obj.specification = body.specification;
  obj.expiration_date = body.expiration_date;
  obj.product_status = body.product_status;
  obj.add_source = body.add_source;
  obj.analeptic_flag = body.analeptic_flag;
  obj.ephedrine_flag = body.ephedrine_flag;
  obj.sale_status = body.sale_status;
  obj.product_detail = body.product_detail;
  obj.is_deleted = body.is_deleted;
  obj.remark = body.remark;
  obj.creater_id = ctx.user.innerid;
  obj.created_time = new Date();
  obj.is_deleted = 0;
  obj.home_thumb_url = (Array.isArray(body.homeImage) && body.homeImage.length) ? body.homeImage[0] : '';

  let imageObj = {};
  imageObj.frontImage = Array.isArray(body.frontImage) ? body.frontImage : [];
  imageObj.backImage = Array.isArray(body.backImage) ? body.backImage : [];
  imageObj.homeImage = Array.isArray(body.homeImage) ? body.homeImage : [];
  imageObj.otherImage = Array.isArray(body.otherImage) ? body.otherImage : [];
  imageObj.comparisonImage = Array.isArray(body.comparisonImage) ? body.comparisonImage : [];

  let symptomIds = Array.isArray(ctx.request.body.symptom_id) ? ctx.request.body.symptom_id : [];

  if (!innerid || !obj.name || !obj.approval_number || !obj.bar_code) throw app.err.missParameter;

  //检查国际条形码唯一性
  let dbRes = await dao.checkUnique(obj.bar_code);
  if (dbRes.num > 0) throw app.err.isExisted.msg('该国际条形码已存在');
  await dao.addProduct(innerid, obj, imageObj, symptomIds);
}

/**
 * 批量添加药品
 * */
async function addProductBatch(ctx) {
  let body = ctx.request.body;
  if (body.length <= 0) {
    throw new app.err.SCError(7, '导入失败，请检查导入文件');
  }
  let barCodeList = []
  //检查国际条形码唯一性
  for (let i = 0; i < body.length; i++) {
    barCodeList.push(body[i].bar_code.toString())
    body[i].creater_id = ctx.user.innerid
    body[i].innerid = sc.guid()
  }
  let dbRes = await dao.checkUniqueBatch(barCodeList);
  if (dbRes.barCodeList) {
    throw new app.err.SCError(15, '国际条码' + dbRes.barCodeList + '已存在');
  }
  await dao.addProductBatch(body);
}

/**
 * 修改药品
 * */
async function updateProduct(ctx) {
  let innerid = ctx.params.innerid;
  let body = ctx.request.body;
  let obj = {};
  obj.name = body.name;
  obj.alias = body.alias;
  obj.approval_number = body.approval_number;
  obj.bar_code = body.bar_code;
  obj.product_category_list_id = body.product_category_list_id;
  obj.product_length = body.product_length;
  obj.product_height = body.product_height;
  obj.product_width = body.product_width;
  obj.brand = body.brand;
  obj.unit = body.unit;
  obj.manufacturer = body.manufacturer;
  obj.origin_place = body.origin_place;
  obj.operator_category_id = body.operator_category_id;
  obj.min_day = body.min_day;
  obj.max_day = body.max_day;
  obj.usage_dosage = body.usage_dosage;
  obj.treatment_course = body.treatment_course;
  obj.eat_time = body.eat_time;
  obj.product_function = body.product_function;
  obj.adverse_reaction = body.adverse_reaction;
  obj.taboo = body.taboo;
  obj.attention = body.attention;
  obj.interactions = body.interactions;
  obj.specification = body.specification;
  obj.expiration_date = body.expiration_date;
  obj.product_status = body.product_status;
  obj.add_source = body.add_source;
  obj.analeptic_flag = body.analeptic_flag;
  obj.ephedrine_flag = body.ephedrine_flag;
  obj.sale_status = body.sale_status;
  obj.product_detail = body.product_detail;
  obj.is_deleted = body.is_deleted;
  obj.remark = body.remark;
  obj.modified_id = ctx.user.innerid;
  obj.modified_time = new Date();
  obj.home_thumb_url = (Array.isArray(body.homeImage) && body.homeImage.length) ? body.homeImage[0] : '';

  let imageObj = {};
  imageObj.frontImage = Array.isArray(body.frontImage) ? body.frontImage : [];
  imageObj.backImage = Array.isArray(body.backImage) ? body.backImage : [];
  imageObj.homeImage = Array.isArray(body.homeImage) ? body.homeImage : [];
  imageObj.otherImage = Array.isArray(body.otherImage) ? body.otherImage : [];
  imageObj.comparisonImage = Array.isArray(body.comparisonImage) ? body.comparisonImage : [];

  let symptomIds = Array.isArray(ctx.request.body.symptom_id) ? ctx.request.body.symptom_id : [];

  if (!innerid || !obj.name || !obj.approval_number || !obj.bar_code) throw app.err.missParameter;

  //检查国际条形码唯一性
  let dbRes = await dao.checkUnique(obj.bar_code, innerid);
  if (dbRes.num > 0) throw app.err.isExisted.msg('该国际条形码已存在');
  await dao.updateProduct(innerid, obj, imageObj, symptomIds);
  //设备缓存变更触发器
  await eqtTriggerDao.product_change(innerid);
}


/**
 * 获取药品图片数据
 * */
async function getProductImage(ctx) {
  let body = ctx.request.body;
  let product_id = body.innerid;
  return dao.getProductImage(product_id);
}

/**
 * 药品键值对用于下拉框搜索
 * */
async function getPairs(ctx) {
  let keywords = ctx.request.query.keywords;
  return dao.getPairs(keywords);
}

/**
 * 自动生成国际条形码
 * */
async function autoGenBarcode(ctx) {
  let prefix = '7' + new Date().format('yyyyMMdd');
  let dbRes = await dao.getLastAutoBarcode(prefix);
  let num;
  if (dbRes && dbRes.length > 0) {
    let lastAutoBarcode = dbRes[0].bar_code;
    let lastNum = lastAutoBarcode.slice(9);
    num = parseInt(lastNum) + 1;
    num = num.toString().padStart(3, "0");
  } else {
    num = "1".padStart(3, "0");
  }
  return {bar_code: prefix + num}
}

/**
 * 添加商品摆放
 * */
async function addProductDisplay(ctx) {
  let body = ctx.request.body;
  let product_id = body.product_id;
  let displays = body.displays;
  let creater_id = ctx.user.innerid;
  let modified_id = ctx.user.innerid;
  //更新
  let updateData = displays.filter(item => item.innerid);
  if (updateData.length > 0) await dao.updateProductDisplay(updateData, modified_id);
  //删除
  let productDisplay = await dao.getProductDisplay(product_id);
  let delData = productDisplay.filter(item => !updateData.some(ele => ele.innerid == item.innerid));
  if (delData.length > 0) {
    let inneridList = [];
    delData.forEach(item => {
      inneridList.push(item.innerid);
    })
    await dao.delProductDisplay(inneridList);
  }
  //新增
  let addData = displays.filter(item => !item.innerid);
  if (addData.length > 0) await dao.addProductDisplay(product_id, addData, creater_id);

}

/**
 * 获取商品摆放
 * */
async function getProductDisplay(ctx) {
  let innerid = ctx.params.innerid;
  return dao.getProductDisplay(innerid);
}

/**
 * 该商品摆放方式是否被使用
 * */
async function getBeUsedDisplay(ctx) {
  let innerid = ctx.params.innerid;
  return dao.getBeUsedDisplay(innerid);
}

/**
 * 获取商品摆放图片用于下拉选择
 * */
async function getDisplayImage(ctx) {
  let innerid = ctx.params.innerid;
  let type = ctx.request.query.type;
  console.info(type)
  return dao.getDisplayImage(innerid,type);
}