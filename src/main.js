// 数字锦带微信小程序入口文件
import App from './App.vue'
import Vue from 'vue'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
