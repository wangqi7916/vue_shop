import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/reset.css' // 全局样式
import './assets/fonts/iconfont.css' // 字体样式
import './plugins/element.js'

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
