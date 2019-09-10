// auth 认证信息（token） 操作 本地存储 模块
const USER_KEY = 'hm-toutiao-m-79-user'
// 获取
export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY) || '{}')
}
// 设置 user 是对象
export const setUser = (user) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// 清除
export const delUser = () => {
  window.localStorage.removeItem(USER_KEY)
}
