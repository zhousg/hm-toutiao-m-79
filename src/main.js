import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 使用vant组件库  (完整导入，将来做优化改成按需导入)
import vant from 'vant'
import 'vant/lib/index.css'

import 'amfe-flexible'

Vue.use(vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
