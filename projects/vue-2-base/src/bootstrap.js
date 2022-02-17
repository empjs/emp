import Vue from 'vue'
import App from './App'
// composition-api shareLib 可以不操作
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
//
// element-ui shareLib 可以不操作
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
//
import router from './router'
Vue.config.productionTip = false
//
// const vue = new Vue({
//   render: h => h(App),
// }).$mount('#emp-root')

new Vue({
  router,
  render: h => h(App),
}).$mount('#emp-root')
