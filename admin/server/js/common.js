// 公共定义
exports.EquipmentStatus = {
    //正常
    ES_IsOk:0,
    //异常
    ES_Fault:1,
    //离线
    ES_Offline:2,
    //停用
    ES_Stop:3
};
exports.Sex = {
    Sex_Unknow:0,
    Sex_Male:1,
    Sex_Female:2
};
exports.CustomerSource = {
    //平台
    RS_Platform:0,
    //设备
    RS_Equipment:1,
    //APP
    CS_APP:2,
    //Wechat
    RS_Wechat:3
};
exports.CustomerStatus = {
    //失效
    CS_Invalid:0,
    //激活
    CS_Valid:1
};
exports.ProductStatus = {
    //不可售
    PS_NoSale:0,
    //可售
    PS_Sale:1
};
exports.AccountRole = {
    //超级管理员
    AR_Super_Admin:1,
    //审核管理员
    AR_verification_Admin:2,
    //药品管理员
    AR_Drug_Admin:3,
    //设备管理员
    AR_Equipment_Admin:4
};
exports.TradeType = {
    //微信JSAPI
    WX_JSAPI:1,
    //微信原生
    WX_NATIVE:2,
    //微信APP
    WX_APP:3,
    // 付款码支付(暂不支持)
    WX_MICROPAY : 4,
    // H5支付(暂不支持)
    WX_MWEB : 5,

    // 阿里条码支付
    ALI_BARCODE : 10,
    // 阿里扫码支付
    ALI_NATIVE : 11,
    // 阿里移动支付
    ALI_APP : 12,
    // 阿里手机网站支付
    ALI_WAP : 13,
    // 阿里即时到账
    ALI_INSTANT : 14,
    // 阿里刷脸支付
    ALI_FACEPAY : 15,

    //现金支付
    CASH_PAY:20
};
exports.PayType = {
    //微信
    PT_Wechat:0,
    //支付宝
    PT_Ali:1,
    //医保卡
    PT_MedicalInsuranceCard:2,
    //现金支付
    PT_Cash:3
};
exports.PayStatus = {
    //未支付
    PS_NoPay:0,
    //已支付
    PS_SUCCESS:1,
    //支付中
    PS_WAITING:2,
    //支付失败
    PS_Failed:3,
    //已退款
    PS_Refunded:4,
    //已过期
    PS_EXPIRED:5,
    //已取消
    PS_CANCLED:6
};
exports.RefundStatus = {
    //等待退款(已提交)
    WAIT_REFUND : 0,
    //退款成功(已确认)
    REFUND_SUCCESS :1,
    //错误
    REFUND_ERROR : 2
};
exports.BuyWay = {
    //直接购买
    BW_Buy:0,
    //自助取药
    BW_Take:1
};
exports.OrderStatus = {
    //待支付
    OS_NoPay:0,
    //待取药
    OS_Paied:1,
    //已取药
    OS_Taked:2
};
exports.OrderSource = {
    //平台
    OSRC_Platform:0,
    //第三方
    OSRC_Third:1,
    //药机
    OSRC_Equipment: 2,
};
exports.PickUpType = {
    //取药码
    PUP_Input_Code:0,
    //扫码
    PUP_Scan_QRCode:1
};
exports.EquipmentOperationType = {
    //补货
    EOT_Supplement:0,
    //下架
    EOT_OFF:1,
    //出货
    EOT_Pick_UP:2
};
exports.EquipmentFaultType = {
    EF_Equipment_Fault:0,
    EF_replenish_Product_Fault:1,
    EF_Off_Product_Fault:2
};

exports.EquipmentOrderStatus = {
    // 空闲
    EOS_Free:0,
    // 使用中
    EOS_In_Use:2,
    // 绑定错误
    EOS_Bind_Error:3,
    // 过期
    EOS_Expired:4
};

exports.AdminMode = {
    // OTC
    AM_OTC:1,
    // 处方
    AM_Presc:2
};

//公告状态
exports.NoticeStatus = {
    //待上线
    NS_Wait_Online:0,
    //已上线
    NS_Online:1,
    //已下线
    NS_Offline:2
};
//公告渠道
exports.NoticePlace= {
    //商户管理端
    NP_Merchant:0,
    //药机端
    NP_Device:1,
    //公众号
    NP_Public:2
};

//第三方平台
exports.ThirdPlatform= {
    //美团
    TP_Meituan:1,
    //饿了吗
    TP_Element:2,
    //京东
    TP_JD:3
};


