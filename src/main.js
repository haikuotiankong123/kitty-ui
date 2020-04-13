import Vue from 'vue'
import App from './App'
import router from './router'
import api from './http'
import i18n from './i18n'
import store from './store'
import global from '@/utils/global'
import ElementUI from 'element-ui'
import filter from '@/filter/index'
//import 'element-ui/lib/theme-chalk/index.css'
//import '@/assets/package/lib/index.css'
import '@/assets/package/src/index.scss'
import '@/style/style.scss'

//import 'font-awesome/css/font-awesome.min.css'
import '@/assets/iconfont/iconfont.css'


for(let key in filter){
  Vue.filter(key, filter[key])
}

Vue.use(ElementUI)

Vue.use(api)

Vue.prototype.global = global

window.vm = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
});

