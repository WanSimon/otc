import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/product',
    method: 'get',
    params
  })
}

export function getPairs(params) {
  return request({
    url: '/product/pairs',
    method: 'get',
    params
  })
}

export function getInfo(innerid) {
  return request({
    url: '/product/' + innerid,
    method: 'get'
  })
}

export function update(innerid, params) {
  return request({
    url: '/product/' + innerid,
    method: 'put',
    data: params
  })
}

export function add(params) {
  return request({
    url: '/product',
    method: 'post',
    data: params
  })
}

export function addBatch(params) {
  return request({
    url: '/product/batch',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/product/delete',
    method: 'post',
    data: params
  })
}

export function image(params) {
  return request({
    url: '/product/image',
    method: 'post',
    data: params
  })
}

export function autoGenBarcode() {
  return request({
    url: '/product/barcode',
    method: 'get'
  })
}

export function addDisplay(params) {
  return request({
    url: '/product/display',
    method: 'post',
    data: params
  })
}

export function getDisplay(innerid) {
  return request({
    url: '/product/display/' + innerid,
    method: 'get',
  })
}
export function getUsedDisplay(innerid) {
  return request({
    url: '/product/display/used/' + innerid,
    method: 'get',
  })
}

export function getDisplayImage(innerid,params) {
  return request({
    url: '/product/display/image/'+ innerid,
    method: 'get',
    params
  })
}
