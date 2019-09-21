// 提供用户相关接口调用函数
import request from '@/utils/request'

/**
 * 登录
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 */
export const login = ({ mobile, code }) => {
  return request('app/v1_0/authorizations', 'post', {
    mobile,
    code
  })
}

/**
 * 关注用户
 * @param {Integer} userId
 */
export const followings = (userId) => {
  return request('/app/v1_0/user/followings', 'post', {
    target: userId
  })
}

/**
 * 取消关注用户
 * @param {Integer} userId
 */
export const unfollowings = (userId) => {
  return request(`/app/v1_0/user/followings/${userId}`, 'delete')
}

/**
 * 获取个人中心首页用户信息
 */
export const getUserInfo = () => {
  return request(`/app/v1_0/user`, 'get')
}

/**
 * 获取个人中心编辑资料用户信息
 */
export const getUserProfile = () => {
  return request(`/app/v1_0/user/profile`, 'get')
}

/**
 * 修改头像
 * @param {Object} formData - 文件对象
 */
export const updatePhoto = (formData) => {
  return request(`/app/v1_0/user/photo`, 'patch', formData)
}

/**
 * 修改个人信息
 * name ,gender, birthday
 */
export const updateUserInfo = ({ name, gender, birthday }) => {
  return request(`/app/v1_0/user/profile`, 'patch', { name, gender, birthday })
}
