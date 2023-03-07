import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/order/list',
    method: 'post',
    data:params
  })
}

export function getExcelList(params) {
  return request({
    url: '/order/excel/list',
    method: 'post',
    data:params
  })
}

export function orderRefund(params) {
  return request({
    url: '/order/refund',
    method: 'post',
    data:params
  })
}

export function getOrderDetail(params) {
  return request({
    url: '/order/detail',
    method: 'get',
    params
  })
}

export function partRefund(params) {
  return request({
    url: '/order/partRefund',
    method: 'post',
    data:params
  })
}

export function getPickupRecord(params) {
  return request({
    url: '/order/pickupRecord',
    method: 'get',
    params
  })
}
