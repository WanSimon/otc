import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/notice',
    method: 'get',
    params
  })
}

export function getInfo(innerid) {
  return request({
    url: '/notice/'+innerid,
    method: 'get'
  })
}

export function getNoticeInfo(params) {
  return request({
    url: '/notice/display',
    method: 'get',
    params
  })
}

export function update(innerid,params) {
  return request({
    url: '/notice/'+innerid,
    method: 'put',
    data:params
  })
}

export function add(params) {
  return request({
    url: '/notice',
    method: 'post',
    data:params
  })
}

export function del(innerid) {
  return request({
    url: '/notice/'+innerid,
    method: 'delete'
  })
}

export function release(innerid) {
  return request({
    url: '/notice/release/'+innerid,
    method: 'put'
  })
}

export function cancel(innerid) {
  return request({
    url: '/notice/cancel/'+innerid,
    method: 'put'
  })
}
