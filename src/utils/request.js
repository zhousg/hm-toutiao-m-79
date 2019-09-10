// 配置好的 axios , 基于axios提供一个请求函数
import axios from 'axios'
import JSONBIG from 'json-bigint'

import store from '@/store'

// 创建一个新的axios实例
const instance = axios.create({
  // 基准地址
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 响应内容格式转换
  transformResponse: [(data) => {
    try {
      return JSONBIG.parse(data)
    } catch (e) {
      return data
    }
  }]
})

// 请求拦截器
instance.interceptors.request.use(config => {
  // 修改配置
  // 如果有token信息  在头部加上token
  // 获取vuex存储的token
  const token = store.state.user.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use(res => {
  // 剥离一些无用的数据 res = {data:{message:'',data:'需要数据'}}
  // 遇到无响应情况
  try {
    return res.data.data
  } catch (e) {
    return res.data
  }
}, err => {
  // TODO 处理token实现
  return Promise.reject(err)
})
