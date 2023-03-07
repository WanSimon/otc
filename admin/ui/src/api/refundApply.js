import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/refundApply/list',
    method: 'get',
    params
  })
}

export function getRefundDetail(innerid) {
  return request({
    url: '/refundApply/' + innerid,
    method: 'get',
  })
}

export function updateRefundApply(innerid,params) {
  return request({
    url: '/refundApply/update/'+innerid,
    method: 'put',
    data:params
  })
}


