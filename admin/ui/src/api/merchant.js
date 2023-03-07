import request from '@/utils/request'

export function getMerchantTree() {
  return request({
    url: '/merchant/get/tree',
    method: 'get'
  })
}

export function getOneMerchant(innerid) {
  return request({
    url: '/merchant/'+innerid,
    method: 'get',
  })
}
export function add(params) {
  return request({
    url: '/merchant',
    method: 'post',
    data:params
  })
}

export function update(params) {
  return request({
    url: '/merchant',
    method: 'put',
    data:params
  })
}

export function del(innerid) {
  return request({
    url: '/merchant/'+innerid,
    method: 'delete',
  })
}
