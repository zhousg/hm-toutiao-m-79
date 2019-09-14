// 提供 频道 相关接口操作函数
import request from '@/utils/request'

/**
 * 获取我的频道列表（未登录，默认频道列表，已登录，我的频道列表）
 * 在请求拦截器加上了token   头部是否有token
 */
export const getMyChannels = () => {
  return request('app/v1_0/user/channels', 'get')
}
