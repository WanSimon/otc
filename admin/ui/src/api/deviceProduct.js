import request from '@/utils/request'


export function getInfo(innerid) {
  return request({
    url: '/device/product/' + innerid,
    method: 'get'
  })
}

export function update(innerid,params) {
  return request({
    url: '/device/product/' + innerid,
    method: 'put',
    data: params
  })
}

export function add(params) {
  return request({
    url: '/device/product',
    method: 'post',
    data: params
  })
}

export function del(innerid,equipment_id) {
  return request({
    url: '/device/product/' + innerid +'/'+ equipment_id,
    method: 'delete',
  })
}

