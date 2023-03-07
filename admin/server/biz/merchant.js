/**
 * Created by obel on 2019/12/17.
 */
const dao = require('../dao/merchant');
const sc = require("smartacjs");
const app = sc.app();
const eqtTriggerDao = require('../dao/trigger_eqt');

exports.routers = {
    post: {
        '/merchant': addMerchant,
    },
    get: {
        '/merchant/get/tree': getTree,
        '/merchant/:innerid': getMerchantById,
    },
    put: {
        '/merchant': updateMerchant,

    },
    delete: {
        '/merchant/:innerid': delMerchant,
    }

};

/**
 * 获取商户树形结构
 * */
async function getTree(ctx) {
    let merchant_list = ctx.user.merchant_list;
    return dao.getTree(merchant_list);
}

/**
 * 获取单个商户详情
 * */
async function getMerchantById(ctx) {
    let innerid = ctx.params.innerid;
    let third_platform_id = app.common.ThirdPlatform.TP_Meituan;
    let merchant = await dao.getMerchantById(innerid, third_platform_id);
    return merchant;
}

/**
 * 新增商户
 * */
async function addMerchant(ctx) {
    let body = {};
    body.innerid = sc.guid();
    body.parent_id = ctx.request.body.parent_id;
    body.type = ctx.request.body.type || '0';
    body.status = ctx.request.body.status;
    body.fullname = ctx.request.body.fullname;
    body.shortname = ctx.request.body.shortname;
    body.contacts = ctx.request.body.contacts;
    body.mobile = ctx.request.body.mobile;
    body.email = ctx.request.body.email;
    body.province = ctx.request.body.province;
    body.city = ctx.request.body.city;
    body.area = ctx.request.body.area;
    body.addr = ctx.request.body.addr;
    body.logourl = ctx.request.body.logourl;
    body.business_licence_no = ctx.request.body.business_licence_no;
    body.business_licence_url = ctx.request.body.business_licence_url;
    body.business_licence_expired_date = ctx.request.body.business_licence_expired_date;
    body.drug_licence_url = ctx.request.body.drug_licence_url;
    body.drug_licence_no = ctx.request.body.drug_licence_no;
    body.drug_licence_expired_date = ctx.request.body.drug_licence_expired_date;
    body.idcard = ctx.request.body.idcard;
    body.front_idcard_url = ctx.request.body.front_idcard_url;
    body.back_idcard_url = ctx.request.body.back_idcard_url;
    body.qr_code_url = ctx.request.body.qr_code_url;
    body.qr_code_link = ctx.request.body.qr_code_link;
    body.sign_date = ctx.request.body.sign_date;
    body.contract_begin_date = ctx.request.body.contract_begin_date;
    body.contract_end_date = ctx.request.body.contract_end_date;
    body.contract_no = ctx.request.body.contract_no;
    body.contract_signer = ctx.request.body.contract_signer;
    body.service_phone = ctx.request.body.service_phone;
    body.invoice_desc = ctx.request.body.invoice_desc;
    body.receive_remind = ctx.request.body.receive_remind;
    body.is_deleted = 0;
    body.remark = ctx.request.body.remark;
    body.config = JSON.stringify(ctx.request.body.config);
    if (!body.parent_id || !body.fullname) throw app.err.missParameter;
    body.creater_id = ctx.user.innerid;
    body.created_time = new Date();
    //是否填写第三方配置(美团)
    let config_third = ctx.request.body.config_third;
    let merchant_third_code = ctx.request.body.merchant_third_code
    if (merchant_third_code || config_third.app_name || config_third.app_id || config_third.app_secret) {
        let innerid = sc.guid();
        let config = JSON.stringify(config_third);
        let third_platform_id = app.common.ThirdPlatform.TP_Meituan;
        await dao.addMerchantThird(innerid, config, merchant_third_code, third_platform_id, body.innerid, body.creater_id, body.created_time);
    }

    await dao.addMerchant(body);
    await app.session.reSetUser(ctx.user.session_id,ctx.user);
}

/**
 * 修改商户
 * */
async function updateMerchant(ctx) {
    let body = {};
    let innerid = ctx.request.body.innerid;
    body.parent_id = ctx.request.body.parent_id;
    body.type = ctx.request.body.type || '0';
    body.status = ctx.request.body.status;
    body.fullname = ctx.request.body.fullname;
    body.shortname = ctx.request.body.shortname;
    body.contacts = ctx.request.body.contacts;
    body.mobile = ctx.request.body.mobile;
    body.email = ctx.request.body.email;
    body.province = ctx.request.body.province;
    body.city = ctx.request.body.city;
    body.area = ctx.request.body.area;
    body.addr = ctx.request.body.addr;
    body.logourl = ctx.request.body.logourl;
    body.business_licence_no = ctx.request.body.business_licence_no;
    body.business_licence_url = ctx.request.body.business_licence_url;
    body.business_licence_expired_date = ctx.request.body.business_licence_expired_date;
    body.drug_licence_url = ctx.request.body.drug_licence_url;
    body.drug_licence_no = ctx.request.body.drug_licence_no;
    body.drug_licence_expired_date = ctx.request.body.drug_licence_expired_date;
    body.idcard = ctx.request.body.idcard;
    body.front_idcard_url = ctx.request.body.front_idcard_url;
    body.back_idcard_url = ctx.request.body.back_idcard_url;
    body.qr_code_url = ctx.request.body.qr_code_url;
    body.qr_code_link = ctx.request.body.qr_code_link;
    body.sign_date = ctx.request.body.sign_date;
    body.contract_begin_date = ctx.request.body.contract_begin_date;
    body.contract_end_date = ctx.request.body.contract_end_date;
    body.contract_no = ctx.request.body.contract_no;
    body.contract_signer = ctx.request.body.contract_signer;
    body.service_phone = ctx.request.body.service_phone;
    body.invoice_desc = ctx.request.body.invoice_desc;
    body.receive_remind = ctx.request.body.receive_remind;
    body.is_deleted = ctx.request.body.is_deleted;
    body.remark = ctx.request.body.remark;
    body.config = JSON.stringify(ctx.request.body.config);

    if (!body.parent_id || !body.fullname || !body.type || !innerid) throw app.err.missParameter;
    body.modified_id = ctx.user.innerid;
    body.modified_time = new Date();
    await dao.updateMerchant(innerid, body);
    //修改第三方配置(美团)
    let config_third = ctx.request.body.config_third;
    let merchant_third_code = ctx.request.body.merchant_third_code
    let third_platform_id = app.common.ThirdPlatform.TP_Meituan;
    await dao.editMerchantThird(config_third, merchant_third_code, third_platform_id, innerid, body.modified_id, body.modified_time);
    //设备变更触发器
    await eqtTriggerDao.eqt_merchant_change(innerid);
    return {};
}

/**
 * 删除商户
 * */
async function delMerchant(ctx) {
    let innerid = ctx.params.innerid;
    //是否绑定设备组
    let is_existed_device_group = await dao.isExistedDeviceGroup(innerid)
    if (is_existed_device_group.total > 0) throw app.err.relatedData.msg('该商户已绑定某设备组,无法删除');
    //商户下是否有账户
    let is_existed_account = await dao.isExistedAccount(innerid)
    if (is_existed_account.total > 0) throw app.err.relatedData.msg('该商户下已绑定账户,无法删除');
    await dao.delMerchant(innerid);
    await app.session.reSetUser(ctx.user.session_id,ctx.user);
}
