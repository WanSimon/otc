import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error)
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    if (res.errcode !== 0) {

      if (res.errcode === 13) {
        // to re-login
        Message({
          message: '超时，请重新登录',
          type: 'error',
          duration: 5 * 1000
        });
        setTimeout(()=>{
          store.dispatch('user/resetToken').then(() => {
            router.push('/login');
          })
        },500);
      }

      if (res.errcode === 9) {
        Message({
          message: '用户名或密码错误',
          type: 'error',
          duration: 5 * 1000
        });
        return Promise.reject(new Error('用户名或密码错误'))
      }

      if (res.errcode === 18) {
        Message({
          message: '该账号失效',
          type: 'error',
          duration: 5 * 1000
        });
        return Promise.reject(new Error('该账号失效'))
      }

      let error = new Error(res.errmsg || 'Error');
      error.code = res.errcode;
      return Promise.reject(error);
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error); // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // });
    return Promise.reject(error)
  }
);

export default service
