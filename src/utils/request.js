// 配置好的 axios , 基于axios提供一个请求函数
import axios from 'axios'
import JSONBIG from 'json-bigint'

import store from '@/store'
import router from '@/router'

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
}, async err => {
  // TODO 处理token实现
  // 进入这个错误的拦截 情况：接口请求错误，token失效的，根本没有登录
  if (err.response && err.response.status === 401) {
    // token失效的，根本没有登录
    const user = store.state.user
    // 跳转登录的配置  目的：将来需要传参 query 形式  如果是vue组件  this.$route.path
    // 但是不是  导入router实例  ---> router.currentRoute.path 当前页面的地址
    const login = { path: '/login', query: { redirect: router.currentRoute.path } }
    // 防止未登录    必须有refresh_token
    if (!user.token || !user.refresh_token) {
      router.push(login)
      return Promise.reject(err)
    }
    try {
      // 已经登录 且 有refresh_token
      // 此时使用的axios应该使用哪个axios?  原始的axios对象 需要自己配置请求头
      const { data: { data } } = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 刷新token成功
      // 更新vuex  更新本地
      store.commit('setUser', {
        token: data.token,
        refresh_token: user.refresh_token
      })
      // 继续发送之前错误的请求
      // 发送请求的时候 需要请求配置（url,method, 基础配置（请求头 拦截器））
      // err.config  错误请求的配置
      return instance(err.config)
    } catch (e) {
      // 刷新token失败
      // 清理无效token
      store.commit('delUser')
      // 跳转登录页面
      router.push(login)
      return Promise.reject(err)
    }
  }
  // 抛出错误  阻碍程序运行
  return Promise.reject(err)
})

// 导出一个请求工具函数（不需要你处理get请求和非get请求的传参）
/**
 * url 接口地址
 * method 请求方式
 * data 传参格式 对象
 */
export default (url, method, data) => {
  // 调用instance实例 发请求
  return instance({
    url,
    method,
    // params 那么是get传参  data 那么是非get的传参
    // config = {params:data} 或者 config = {data:data}
    // ...config  合并参数
    // method = get GET Get method.toLowerCase() 小写
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
