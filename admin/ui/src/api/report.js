import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/report/month/summary',
    method: 'get',
    params
  })
}


export function updateStatus(params) {
  return request({
    url: '/report/month/summary/status',
    method: 'post',
    data:params
  })
}

