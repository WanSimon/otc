import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/device',
    method: 'get',
    params
  })
}

export function getInfo(innerid) {
  return request({
    url: '/device/' + innerid,
    method: 'get'
  })
}

export function update(innerid, params) {
  return request({
    url: '/device/' + innerid,
    method: 'put',
    data: params
  })
}

export function add(params) {
  return request({
    url: '/device',
    method: 'post',
    data: params
  })
}

export function del(innerid) {
  return request({
    url: '/device/' + innerid,
    method: 'delete'
  })
}

export function getDrugChannel(params) {
  return request({
    url: '/device/getDrugChannel',
    method: 'post',
    data:params
  })
}

export function getAdminList(params) {
  return request({
    url: '/device/admin/list',
    method: 'get',
    params,
  })
}

export function getAccountList(params) {
  return request({
    url: '/device/account/list',
    method: 'get',
    params,
  })
}

export function getAdminSave(params) {
  return request({
    url: '/device/admin/save',
    method: 'post',
    data:params,
  })
}

export function updateStatus(innerid,params) {
  return request({
    url: '/device/status/'+innerid,
    method: 'put',
    data:params
  })
}

export function getDevicePairs() {
  return request({
    url: '/device/pairs',
    method: 'get',
  })
}

export function updateChannel(innerid,params) {
  return request({
    url: '/device/channel/' + innerid,
    method: 'put',
    data:params
  })
}

export function getTempHumHistory(innerid,params) {
  return request({
    url: '/device/temp_hum_history/' + innerid,
    method: 'get',
    params
  })
}
