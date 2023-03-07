import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/version',
    method: 'get',
    params
  })
}

export function getInfo(innerid) {
  return request({
    url: '/version/'+innerid,
    method: 'get'
  })
}

export function update(innerid,params) {
  return request({
    url: '/version/'+innerid,
    method: 'put',
    data:params
  })
}

export function add(params) {
  return request({
    url: '/version',
    method: 'post',
    data:params
  })
}


export function del(innerid) {
  return request({
    url: '/version/' + innerid,
    method: 'delete'
  })
}

export function versionKey(params) {
  return request({
    url: '/version/key',
    method: 'get',
    params
  })
}
