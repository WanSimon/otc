import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/warningRule',
    method: 'get',
    params
  })
}

export function getInfo(innerid) {
  return request({
    url: '/warningRule/'+innerid,
    method: 'get'
  })
}

export function update(params) {
  return request({
    url: '/warningRule',
    method: 'put',
    data:params
  })
}

export function add(params) {
  return request({
    url: '/warningRule',
    method: 'post',
    data:params
  })
}

export function del(innerid) {
  return request({
    url: '/warningRule/'+innerid,
    method: 'delete'
  })
}

export function getType(params) {
  return request({
    url: '/warningRule/type',
    method: 'get',
    params
  })
}

