const resource = {
  merchantTypeArr: ['医疗机构', '新零售', '社会药房', '其他'], //商户类型
  productType: {1:'医保|其他', 2:'非医保|其他', 3:'医保|处方', 4:'非医保|处方', 5:'医保|甲类|非处方', 6:'医保|乙类|非处方', 7:'非医保|甲类|非处方', 8:'非医保|乙类|非处方'}, // 药品类型
  warningType: {1:'有效期',2:'网络',3:'打印',4: '库存',5:'温度',6:'湿度',7:'故障'}, // 告警类型
  eventType: {0:'设备错误事件',1:'设备补货事件',2:'设备下架事件',3:'其他'}, // 设备错误事件类型
  // 告警类型配置
  warningTypeConf: [
    {label: '有效期', conf: 'expiryConf', Expiry: 1},
    {label: '网络', conf: 'networkConf', Network: 2},
    {label: '打印', conf: 'printConf', Print: 3},
    {label: '库存', conf: 'stockConf', Stock: 4},
    {label: '温度', conf: 'temConf', Temperature: 5},
    {label: '湿度', conf: 'humConf', Humidity: 6},
    {label: '故障', conf: 'faultConf', Fault: 7},
  ],
  warningLevel: {1:'紧急告警', 2:'主要告警', 3:'次要告警', 4:'提示告警'}, // 告警等级
  faultType:{1:'电机报警',2:'取药门开关异常',3:'回收仓门开关异常',4:'回收仓满',5:'打印机故障'},//故障告警类型
  noticeType: {0:'系统公告', 1:'业务公告', 2:'其他公告'},//公告类型
  noticeStatus: {0:'待发布', 1:'已发布', 2:'已下线'},//公告状态
  noticePlace: {0:'商户管理端', 1:'药机端', 2:'公众号'},//公告渠道
  equipmentStatusArr: ['正常', '异常', '离线', '禁用'], //设备状态
  stockOpType: ['补货', '下架', '出货', '加锁', '解锁'], //库存历史记录操作类型
  equipmentOrderStatus:{0:'空闲', 2:'使用中', 3:'绑定错误',4:'过期'},//设备订单状态
  slotError: 10, //药道和药品尺寸误差, 单位mm, 若药品的尺寸小于药道尺寸在10mm范围内表示合格
  OrderSource:[{value:0,label:'平台'},{value:1,label:'第三方', children: [{value: 1, label: '美团'},{value: 2, label: '饿了么'},{value:4, label: '其他'}]},{value:2,label:'药机'}],//订单来源
  PayStatus:{0:"未支付",1:"已支付",2:"支付中",3:"支付失败",4:"已退款",5:"已过期",6:"已取消",41:"部分退款"},//支付状态
  OrderStatus:{0:'待支付', 1:'待取药', 2:'已取药', 3:'已过期',10:'已取消'},//订单状态
  payType:['微信','支付宝', '医保卡','现金'],//付款方式
  OrderMonthSummaryStatus:['未结算','已结算'],//结算状态
  refundApplyStatus:['未处理','已处理'],//退款申请状态
  logStatus:{1:'未处理',2:'已处理'},//错误事件处理状态
  loginType:{1:'身份证',2:'密码'},//错误事件处理状态
  productDisplays:[
    {x:{key:1,value:'长'},y:{key:2,value:'宽'},z:{key:3,value:'高'}},
    {x:{key:1,value:'长'},y:{key:3,value:'高'},z:{key:2,value:'宽'}},
    {x:{key:2,value:'宽'},y:{key:1,value:'长'},z:{key:3,value:'高'}},
    {x:{key:2,value:'宽'},y:{key:3,value:'高'},z:{key:1,value:'长'}},
    {x:{key:3,value:'高'},y:{key:1,value:'长'},z:{key:2,value:'宽'}},
    {x:{key:3,value:'高'},y:{key:2,value:'宽'},z:{key:1,value:'长'}}
    ],
  smsType:{"tencent":"腾讯"}//商户短信服务商类型
}

export default resource;
