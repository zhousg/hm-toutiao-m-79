// 提供 一些工具函数  或者  过滤器  或者  自定义指令 以插件形式存在
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)
/**
 * 做一秒的延时 工具函数
 */
const sleep = () => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, 1000)
  })
}

// dayjs,moment 作用快捷转换事件格式，dayjs更轻量
// dayjs 默认转换时间格式的功能，依赖插件获取更多功能
const relTime = (strDate) => {
  // 实现获取相对时间逻辑
  return dayjs().locale('zh-cn').from(strDate)
}

export default {
  install (Vue) {
    // 实现需要的东西
    Vue.prototype.$sleep = sleep
    Vue.filter('relTime', relTime)
  }
}
