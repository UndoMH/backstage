import Vue from 'vue'
import App from './App.vue'
import router from './router'
import element from 'element-ui'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'
import editor from 'vue-quill-editor'


import 'element-ui/lib/theme-chalk/index.css'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'  //导入全局样式表
//edit样式表
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.prototype.$message = element.Message
Vue.prototype.$confirm = element.MessageBox.confirm

Vue.config.productionTip = false

Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.use(element)
Vue.use(editor)
Vue.component('tree-table', treeTable)



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
