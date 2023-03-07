import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/event/logs',
    method: 'get',
    params
  })
}

export function getInfo(innerid) {
  return request({
    url: '/event/' + innerid,
    method: 'get'
  })
}

export function update(innerid, params) {
  return request({
    url: '/event/' + innerid,
    method: 'put',
    data: params
  })
}
