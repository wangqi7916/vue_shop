import axios from 'axios'
import { Message, Loading } from 'element-ui'
import { getStorage } from '../utils/localstorage'
const configBaseURL = 'http://127.0.0.1:3000/' // 默认路径，这里也可以使用env来判断环境
let loadingInstance = null // 这里是loading
// 使用create方法创建axios实例
const service = axios.create({
  timeout: 7000,
  baseURL: configBaseURL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 添加请求拦截器
service.interceptors.request.use(config => {
  loadingInstance = Loading.service({
    lock: true,
    text: 'loading...'
  })
  if (getStorage('token')) {
    config.headers['Authorization'] = 'Bearer ' + getStorage('token')
  }
  return config
})

// 添加响应拦截器
service.interceptors.response.use(response => {
  loadingInstance.close()
  // console.log(response)
  return response.data
}, error => {
  const msg = error.Message !== undefined ? error.Message : ''
  Message({
    message: '网络错误' + msg,
    type: 'error',
    duration: 3 * 1000
  })
  loadingInstance.close()
  return Promise.reject(error)
})

export default service
