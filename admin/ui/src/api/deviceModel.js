import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/deviceModel',
    method: 'get',
    params
  })
}

export function getInfo(innerid) {
  return request({
    url: '/deviceModel/' + innerid,
    method: 'get'
  })
}

export function update(innerid, params) {
  return request({
    url: '/deviceModel/' + innerid,
    method: 'put',
    data: params
  })
}

export function add(params) {
  return request({
    url: '/deviceModel',
    method: 'post',
    data: params
  })
}

export function del(innerid) {
  return request({
    url: '/deviceModel/' + innerid,
    method: 'delete'
  })
}

export function getDevicePairs() {
  return request({
    url: '/deviceModel/pairs',
    method: 'get',
  })
}

export function updateChannel(innerid,params) {
  return request({
    url: '/deviceModel/channel/' + innerid,
    method: 'put',
    data:params
  })
}

