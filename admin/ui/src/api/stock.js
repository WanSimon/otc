import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/stock/list',
    method: 'get',
    params
  })
}

export function getStockEventList(params) {
  return request({
    url: '/stock/event',
    method: 'get',
    params
  })
}
