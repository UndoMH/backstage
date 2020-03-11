import Vue from 'vue'
import App from './App.vue'
import router from './router'
import element from 'element-ui'
import axios from 'axios'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'  //导入全局样式表

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.prototype.$message = element.Message
Vue.prototype.$confirm = element.MessageBox.confirm

Vue.config.productionTip = false

Vue.use(element)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
