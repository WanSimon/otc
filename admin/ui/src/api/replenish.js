import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/replenish/list',
    method: 'get',
    params
  })
}

export function getDetail(params) {
  return request({
    url: '/replenish/detail',
    method: 'get',
    params
  })
}
