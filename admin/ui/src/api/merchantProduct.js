import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/merchantProduct',
    method: 'get',
    params
  })
}

export function getPairs(params) {
  return request({
    url: '/merchantProduct/pairs',
    method: 'get',
    params
  })
}

export function getInfo(innerid) {
  return request({
    url: '/merchantProduct/'+innerid,
    method: 'get'
  })
}

export function update(innerid,params) {
  return request({
    url: '/merchantProduct/'+innerid,
    method: 'put',
    data:params
  })
}

export function add(params) {
  return request({
    url: '/merchantProduct',
    method: 'post',
    data:params
  })
}

export function addBatch(params) {
  return request({
    url: '/merchantProduct/batch',
    method: 'post',
    data:params
  })
}

export function del(params) {
  return request({
    url: '/merchantProduct/delete',
    method: 'post',
    data: params
  })
}

export function image(params) {
  return request({
    url: '/merchantProduct/image',
    method: 'post',
    data:params
  })
}
