import request from '@/utils/request'

export function getCodeTree(params) {
  return request({
    url: '/code/tree',
    method: 'post',
    data:params
  })
}