import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/account',
    method: 'get',
    params
  })
}

export function getInfo(innerid) {
  return request({
    url: '/account/'+innerid,
    method: 'get'
  })
}

export function update(innerid,params) {
  return request({
    url: '/account/'+innerid,
    method: 'put',
    data:params
  })
}

export function add(params) {
  return request({
    url: '/account',
    method: 'post',
    data:params
  })
}


export function del(innerid) {
  return request({
    url: '/account/' + innerid,
    method: 'delete'
  })
}

export function updateStatus(innerid,params) {
  return request({
    url: '/account/status/'+innerid,
    method: 'put',
    data:params
  })
}
