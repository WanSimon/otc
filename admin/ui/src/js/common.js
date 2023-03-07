// 公共定义
export const EquipmentStatus = {
  //正常
  ES_IsOk: 0,
  //异常
  ES_Fault: 1,
  //离线
  ES_Offline: 2,
  //停用
  ES_Stop: 3
};
export const Sex = {
  Sex_Unknow: 0,
  Sex_Male: 1,
  Sex_Female: 2
};
export const CustomerSource = {
  //平台
  RS_Platform: 0,
  //设备
  RS_Equipment: 1,
  //APP
  CS_APP: 2,
  //Wechat
  RS_Wechat: 3
};
export const CustomerStatus = {
  //失效
  CS_Invalid: 0,
  //激活
  CS_Valid: 1
};
export const ProductStatus = {
  //不可售
  PS_NoSale: 0,
  //可售
  PS_Sale: 1
};
export const AccountRole = {
  //超级管理员
  AR_Super_Admin: 1,
  //审核管理员
  AR_verification_Admin: 2,
  //药品管理员
  AR_Drug_Admin: 3,
  //设备管理员
  AR_Equipment_Admin: 4
};
export const TradeType = {
  //微信JSAPI
  WX_JSAPI: 1,
  //微信原生
  WX_NATIVE: 2,
  //微信APP
  WX_APP: 3,
  // 付款码支付(暂不支持)
  WX_MICROPAY: 4,
  // H5支付(暂不支持)
  WX_MWEB: 5,

  // 阿里条码支付
  ALI_BARCODE: 10,
  // 阿里扫码支付
  ALI_NATIVE: 11,
  // 阿里移动支付
  ALI_APP: 12,
  // 阿里手机网站支付
  ALI_WAP: 13,
  // 阿里即时到账
  ALI_INSTANT: 14,
  // 阿里刷脸支付
  ALI_FACEPAY: 15,

  //现金支付
  CASH_PAY: 20
};
export const PayType = {
  //微信
  PT_Wechat: 0,
  //支付宝
  PT_Ali: 1,
  //医保卡
  PT_MedicalInsuranceCard: 2,
  //现金支付
  PT_Cash: 3
};
//支付状态
export const PayStatus = {
  //未支付
  PS_NoPay: 0,
  //已支付
  PS_SUCCESS: 1,
  //支付中
  PS_WAITING: 2,
  //支付失败
  PS_Failed: 3,
  //已退款
  PS_Refunded: 4,
  //已过期
  PS_EXPIRED: 5,
  //已取消
  PS_CANCLED: 6,
  //部分退款
  PS_PartRefund: 41
};

//退款分类
export const RefundMark = {
  //未退款
  RM_UnRefund: 0,
  //部分退款
  RM_PartRefund: 1,
  //全部退款
  RM_AllRefund: 2,
}

//退款状态
export const RefundStatus = {
  //等待退款(已提交)
  WAIT_REFUND: 0,
  //退款成功(已确认)
  REFUND_SUCCESS: 1,
  //错误
  REFUND_ERROR: 2
};
export const BuyWay = {
  //直接购买
  BW_Buy: 0,
  //自助取药
  BW_Take: 1
};
//订单状态
export const OrderStatus = {
  //待支付
  OS_NoPay: 0,
  //待取药
  OS_Paied: 1,
  //已取药
  OS_Taked: 2,
  //已过期
  OS_Overdue: 3,
  //已取消
  OS_Cancel: 10,
};
export const OrderSource = {
  //平台
  OSRC_Platform: 0,
  //第三方
  OSRC_Third: 1,
  //药机
  OSRC_Equipment: 2,
};
//第三方平台
export const ThirdPlatform = {
  //美团
  TP_Meituan: 1,
  //饿了吗
  TP_Element: 2,
  //京东
  TP_JD: 3,
  //其他
  TP_Other: 4,
};

export const PickUpType = {
  //取药码
  PUP_Input_Code: 0,
  //扫码
  PUP_Scan_QRCode: 1
};
export const EquipmentOperationType = {
  //补货
  EOT_Supplement: 0,
  //下架
  EOT_OFF: 1,
  //出货
  EOT_Pick_UP: 2
};
export const EquipmentFaultType = {
  EF_Equipment_Fault: 0,
  EF_replenish_Product_Fault: 1,
  EF_Off_Product_Fault: 2
};

export const EquipmentOrderStatus = {
  // 空闲
  EOS_Free: 0,
  // 使用中
  EOS_In_Use: 2,
  // 绑定错误
  EOS_Bind_Error: 3,
  // 过期
  EOS_Expired: 4
};

export const OrderMonthSummaryStatus = {
  //未结算
  OM_Unsettled: 0,
  //已结算
  OM_Settled: 1
};

//公告状态
export const NoticeStatus = {
  //待上线
  NS_Wait_Online: 0,
  //已上线
  NS_Online: 1,
  //已下线
  NS_Offline: 2

};

//预警状态
export const WarnStatus = {
  //紧急告警
  WS_Danger: 1,
  //主要告警
  WS_Warning: 2,
  //次要告警
  WS_Minor: 3,
  //提示告警
  WS_Info: 4,
};

//退款申请状态
export const RefundApplyStatus = {
  //未处理
  RAS_Unsettled: 0,
  //已处理
  RAS_Settled: 1,
}

//处理错误事件状态
export const LogStatus = {
  //未处理
  LS_Unsettled: 1,
  //已处理
  LS_Settled: 2,
}

//药品图片类型 1:缩略图;2:正面图;3:反面图;4.复核图片;10:其他
export const PicType = {
  //缩略图
  PT_Front: 1,
  //正面图
  PT_Home: 2,
  //反面图
  PT_Back: 3,
  //复核图片
  PT_Comparisonl: 4,
  //其他
  PT_Other: 10,
};
