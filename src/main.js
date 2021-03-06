import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 使用vant组件库  (完整导入，将来做优化改成按需导入)
import vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'

import 'amfe-flexible'
import '@/styles/index.less'

// 注册 自定义 基于VUE的功能
import plugin from '@/utils/plugin'

Vue.use(plugin)
Vue.use(Lazyload)
Vue.use(vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
