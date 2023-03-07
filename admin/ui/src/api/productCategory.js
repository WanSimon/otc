import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/productCategory',
    method: 'get',
    params
  })
}

export function getInfo(innerid) {
  return request({
    url: '/productCategory/'+innerid,
    method: 'get'
  })
}

export function update(innerid,params) {
  return request({
    url: '/productCategory/'+innerid,
    method: 'put',
    data:params
  })
}

export function add(params) {
  return request({
    url: '/productCategory',
    method: 'post',
    data:params
  })
}

export function del(innerid) {
  return request({
    url: '/productCategory/'+innerid,
    method: 'delete'
  })
}

export function getCategoryTree() {
  return request({
    url: '/productCategory/get/tree',
    method: 'get'
  })
}
