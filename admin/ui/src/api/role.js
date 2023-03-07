import request from '@/utils/request';


export function getList(params) {
  return request({
    url: '/role',
    method: 'get',
    params
  })
}

export function getInfo(innerid) {
  return request({
    url: '/role/'+innerid,
    method: 'get',
  })
}

export function add(params) {
  return request({
    url: '/role',
    method: 'post',
    data:params
  })
}

export function update(params) {
  return request({
    url: '/role',
    method: 'put',
    data:params
  })
}

export function del(innerid) {
  return request({
    url: '/role/'+innerid,
    method: 'delete'
  })
}


export function getRolePairs() {
  return request({
    url: '/role/pairs',
    method: 'get',
  })
}
