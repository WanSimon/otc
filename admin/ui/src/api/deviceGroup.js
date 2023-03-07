import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/deviceGroup',
    method: 'get',
    params
  })
}

export function getInfo(innerid) {
  return request({
    url: '/deviceGroup/'+innerid,
    method: 'get'
  })
}

export function update(innerid,params) {
  return request({
    url: '/deviceGroup/'+innerid,
    method: 'put',
    data:params
  })
}

export function add(params) {
  return request({
    url: '/deviceGroup',
    method: 'post',
    data:params
  })
}

export function del(innerid) {
  return request({
    url: '/deviceGroup/'+innerid,
    method: 'delete'
  })
}
export function updateStatus(innerid,params) {
  return request({
    url: '/deviceGroup/status/'+innerid,
    method: 'put',
    data:params
  })
}

//设备组键值对
export function getDeviceGroupPairs() {
  return request({
    url: '/deviceGroup/pairs',
    method: 'get'
  })
}
