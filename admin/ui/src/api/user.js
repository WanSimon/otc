import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user',
    method: 'get',
    params: {}
  })
}

export function userLogin(params) {
  return request({
    url: '/user/login/record',
    method: 'get',
    params
  })
}
