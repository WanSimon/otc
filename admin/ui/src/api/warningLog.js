import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/warningLog',
    method: 'get',
    params
  })
}

export function getListCount(params) {
  return request({
    url: '/warningLog/count',
    method: 'get',
    params
  })
}
