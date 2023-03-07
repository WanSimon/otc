import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/customer',
    method: 'get',
    params
  })
}
