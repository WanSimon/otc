const dao = require('../dao/merchantProduct');
const productDao = require('../dao/product');
const eqtTriggerDao = require('../dao/trigger_eqt');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
    post: {
        '/merchantProduct': addMerchantProduct,
        '/merchantProduct/batch': addMerchantProductBatch,
        '/merchantProduct/delete': delMerchantProduct
    },
    get: {
        '/merchantProduct/pairs': getPairs,
        '/merchantProduct': getList,
        '/merchantProduct/:innerid': getMerchantProductId
    },
    put: {
        '/merchantProduct/:innerid': updateMerchantProduct
    },
    delete: {}

};

/**
 * 获取商户药品列表
 * */
async function getList(ctx) {
    let body = ctx.request.query;
    let limit = body.limit;
    let page = body.page;
    let name = body.name;
    let bar_code = body.bar_code;
    let merchant_id = body.merchant_id
    let merchant_list = ctx.user.merchant_list;
    return dao.getList(limit, page, name, bar_code, merchant_id, merchant_list);
}

/**
 * 获取商户药品详情
 * */
async function getMerchantProductId(ctx) {
    let innerid = ctx.params.innerid;
    return dao.getMerchantProductId(innerid);
}

/**
 * 删除商户药品详情
 * */
async function delMerchantProduct(ctx) {
    let innerid = ctx.request.body.innerid;
    if (!innerid) throw app.err.missParameter;
    let isExisted = await dao.checkCanDelete(innerid);
    if (isExisted.total > 0) throw app.err.relatedData.msg('药品已绑定了某药道，请下架药品后再做删除');
    return dao.delMerchantProduct(innerid);
}

//商品名,国际条码模糊搜素商品详情
async function getPairs(ctx) {
    let body = ctx.request.query
    let obj = {}
    obj.merchant_id = body.merchant_id;
    if (!obj.merchant_id) throw app.err.missParameter;
    obj.keywords = body.keywords;
    return dao.getPairs(obj);
}

/**
 * 修改商户药品
 * */
async function updateMerchantProduct(ctx) {
    let innerid = ctx.params.innerid;
    let body = ctx.request.body;
    let obj = {};
    obj.product_id = body.product_id;
    obj.merchant_id = body.merchant_id;
    obj.product_type = body.product_type;
    obj.product_no = body.product_no || '';
    obj.batch = body.batch;
    obj.batch_number = body.batch_number;
    obj.electronic_monitoring_code = body.electronic_monitoring_code;
    obj.expire_date = body.expire_date;
    obj.customer_price = body.customer_price;
    obj.price = body.price;
    obj.remark = body.remark;
    if (!innerid || !obj.product_id || !obj.merchant_id || !obj.product_type) throw app.err.missParameter;
    obj.modified_id = ctx.user.innerid;
    obj.modified_time = new Date();
    let check = await dao.checkUnique(obj, innerid);
    if (Array.isArray(check) && check.length && check[0].total) throw app.err.isExisted.msg('该批次批号的药品已经存在, 请核实');
    await dao.updateMerchantProduct(obj, innerid);
    //修改商户商品第三方编号(美团)
    let mpt_code = body.merchant_product_third_code;
    let third_platform_id = app.common.ThirdPlatform.TP_Meituan;
    await dao.updateMerchantProductThird(innerid, mpt_code, third_platform_id, obj.merchant_id, obj.modified_id, obj.modified_time);
    await eqtTriggerDao.merchant_product_change(innerid);
    return {code: 0, msg: 'success'};
}

/**
 * 添加商户药品
 * */
async function addMerchantProduct(ctx) {
    let body = ctx.request.body;
    let obj = {};
    obj.innerid = sc.guid();
    obj.product_id = body.product_id;
    obj.merchant_id = body.merchant_id;
    obj.product_type = body.product_type;
    obj.product_no = body.product_no || '';
    obj.batch = body.batch;
    obj.batch_number = body.batch_number;
    obj.electronic_monitoring_code = body.electronic_monitoring_code;
    obj.expire_date = body.expire_date;
    obj.customer_price = body.customer_price;
    obj.price = body.price;
    obj.remark = body.remark;
    obj.is_deleted = body.is_deleted;
    obj.creater_id = ctx.user.innerid;
    obj.created_time = new Date();
    obj.is_deleted = 0;
    if (!obj.product_id || !obj.merchant_id || !obj.product_type) throw app.err.missParameter;
    obj.creater_id = ctx.user.innerid;
    let check = await dao.checkUnique(obj);
    if (Array.isArray(check) && check.length && check[0].total)  throw app.err.isExisted.msg('该批次批号的药品已经存在, 请核实');
    //商户商品第三方编号(美团)
    let innerid = sc.guid();
    let mpt_code = body.merchant_product_third_code;
    let third_platform_id = app.common.ThirdPlatform.TP_Meituan;
    if (mpt_code) {
        await dao.addMerchantProductThird(innerid, mpt_code, third_platform_id, obj.innerid, obj.merchant_id, obj.creater_id, obj.created_time);
    }
    await dao.addMerchantProduct(obj);
    return {code: 0, msg: 'success'};
}

/**
 * 批量添加商户药品
 * */
async function addMerchantProductBatch(ctx) {
    let body = ctx.request.body;
    let data = body.productData;
    let merchant_id = body.merchant_id;
    if (data.length <= 0) {
        throw new app.err.SCError(7, '导入失败，请检查导入文件');
    }
    let barCodeList = [];
    //检查国际条形码是否存在药品表
    for (let i = 0; i < data.length; i++) {
        barCodeList.push(data[i].bar_code.toString());
    }
    let xpRes = await productDao.checkUniqueBatch(barCodeList);
    //药品表国际条码存在
    if (xpRes.barCodeList) {
        let xpBarCode = xpRes.barCodeList.split(',');
        let xpInnerId = xpRes.idList.split(',');
        let bar_code_list = xpBarCode;
        //条码是否存在于商品表(同一商户)
        let xmpRes = await dao.checkUniqueBatch(merchant_id, xpRes.barCodeList);
        //商品表 同一商户下国际条码重复存在
        if (xmpRes.barCodeList) {
            let xmpBarCode = xmpRes.barCodeList.split(',');
            //筛选出同一商户下，在药品表中存在 但未录入商品表的条码
            bar_code_list = xpBarCode.filter(item => {
                return xmpBarCode.indexOf(item) == -1;
            });
        }
        let mpData = [];
        bar_code_list.forEach(item => {
            let index = xpBarCode.findIndex(n => n == item);
            let xmpObj = data.find(m => m.bar_code == item);
            xmpObj.product_id = xpInnerId[index];
            mpData.push(xmpObj);
        })
        //插入商品表
        dao.addMerchantProductBatch(merchant_id, mpData);
        //从数据里剔除已存在的药品数据
        let new_data = data.filter(item => {
            return xpRes.barCodeList.split(',').indexOf(item.bar_code.toString()) == -1;
        });
        data = new_data;
    }
    //国际条码不存在药品表
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            data[i].creater_id = ctx.user.innerid;
            data[i].innerid = data[i].product_id = sc.guid();
        }
        await productDao.addProductBatch(data);
        await dao.addMerchantProductBatch(merchant_id, data);
    }
}
