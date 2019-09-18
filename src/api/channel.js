// 提供 频道 相关接口操作函数
import request from '@/utils/request'
import store from '@/store'
// 约定  本地存储  频道的数据KEY
// 约定  本地存储  频道的数据VALUE [{id:'频道ID',name:'频道名称'},...]
const CHANNEL_KEY = 'hm-toutiao-m-79-channels'
/**
 * 获取我的频道列表（未登录，默认频道列表，已登录，我的频道列表）
 * 在请求拦截器加上了token   头部是否有token
 */
// 修改API  让它支持本地存储
// 1. 登录了  返回用户频道
// 2. 没登录
// 2.1 如果频道已经存在本地  获取本地频道
// 2.2 没有把频道存在本地  获取默认频道 然后存储在本地
// 3. 返回值promise（不能改，返回数据格式也不能改）
export const getMyChannels = () => {
  // return request('app/v1_0/user/channels', 'get')
  return new Promise(async (resolve, reject) => {
    // 用户信息
    const user = store.state.user
    if (user.token) {
      // 登录  返回用户频道
      const data = await request('app/v1_0/user/channels', 'get')
      resolve(data)
    } else {
      const channelsStr = window.localStorage.getItem(CHANNEL_KEY)
      if (channelsStr) {
        // 有本地频道
        const channelsJson = JSON.parse(channelsStr)
        // 和后端数据格式保持一直  将来调用逻辑不用修改
        resolve({ channels: channelsJson })
      } else {
        // 没有本地频道
        // 获取默认频道
        const data = await request('app/v1_0/user/channels', 'get')
        // 存储起来
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(data.channels))
        // 数据返回出去
        resolve(data)
      }
    }
  })
}

/**
 * 支持  接口的删除  与  本地删除  频道
 * @param {Integer} channelId - 频道ID
 */
export const delChannel = (channelId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 用户信息
      const user = store.state.user
      if (user.token) {
        // 接口的删除
        await request(`/app/v1_0/user/channels/${channelId}`, 'DELETE')
        // 成功
        resolve()
      } else {
        // 本地删除
        // 1. 获取本地的数据  推荐不能删除
        const localChannels = JSON.parse(window.localStorage.getItem(CHANNEL_KEY))
        // 2. 根据ID获取索引
        const index = localChannels.findIndex(item => item.id === channelId)
        // 3. 删除对应的数据
        localChannels.splice(index, 1)
        // 4. 存储到本地
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(localChannels))
        // 5. 调用成功函数
        resolve()
      }
    } catch (e) {
      // 失败
      reject(e)
    }
  })
}

/**
 * 添加频道
 * @param {Array} orderChannels - 排序好的频道数据 [{id:'频道ID',seq:'序号',name:'频道名称'}]
 */
export const addChannel = (orderChannels) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 用户信息
      const user = store.state.user
      if (user.token) {
        // 调用后台接口
        await request(`/app/v1_0/user/channels`, 'PUT', {
          // 注意：orderChannels 多了一个name属性 ，没有关系。
          channels: orderChannels
        })
        // 处理成功
        resolve()
      } else {
        // 本地存储
        const { id, name } = orderChannels[orderChannels.length - 1]
        // 获取本地数据
        const channelsStr = window.localStorage.getItem(CHANNEL_KEY)
        const localChannels = JSON.parse(channelsStr)
        // 追加数据
        localChannels.push({ id, name })
        // 再存入本地即可
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(localChannels))
        // 处理成功
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 获取全部频道
 */
export const getAllChannels = () => {
  return request('/app/v1_0/channels', 'get')
}
