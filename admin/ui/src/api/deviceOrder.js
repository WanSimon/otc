import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/deviceOrder',
    method: 'get',
    params
  })
}

export function update(innerid, params) {
  return request({
    url: '/deviceOrder/' + innerid,
    method: 'put',
    data: params
  })
}

export function updateStatus(innerid,params) {
  return request({
    url: '/deviceOrder/status/' + innerid,
    method: 'put',
    data: params
  })
}



