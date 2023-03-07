import request from '@/utils/request'


export function getList(params) {
  return request({
    url: '/symptom',
    method: 'get',
    params
  })
}

export function getInfo(innerid) {
  return request({
    url: '/symptom/'+innerid,
    method: 'get'
  })
}

export function update(innerid,params) {
  return request({
    url: '/symptom/'+innerid,
    method: 'put',
    data:params
  })
}

export function add(params) {
  return request({
    url: '/symptom',
    method: 'post',
    data:params
  })
}

export function del(innerid) {
  return request({
    url: '/symptom/'+innerid,
    method: 'delete'
  })
}

export function getSymptomTree() {
  return request({
    url: '/symptom/get/tree',
    method: 'get'
  })
}
