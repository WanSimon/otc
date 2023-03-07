import request from '@/utils/request'

//总成交额
export function totalTurnover(params) {
  return request({
    url: '/dashboard/total/turnover',
    method: 'get',
    params
  })
}//药品排行
export function productSales(params) {
  return request({
    url: '/dashboard/product/sales',
    method: 'get',
    params
  })
}

//订单成交额
export function orderCount(params) {
  return request({
    url: '/dashboard/order/count',
    method: 'get',
    params
  })
}

//会员数
export function customer() {
  return request({
    url: '/dashboard/customer',
    method: 'get',
  })
}

//成交额分布
export function distribution(params) {
  return request({
    url: '/dashboard/turnover/distribution',
    method: 'get',
    params
  })
}

//设备总览
export function deviceOverview() {
  return request({
    url: '/dashboard/device/overview',
    method: 'get',
  })
}

//设备总览
export function deviceAddress() {
  return request({
    url: '/dashboard/device/address',
    method: 'get',
  })
}
