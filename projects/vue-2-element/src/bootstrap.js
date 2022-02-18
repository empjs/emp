import Vue from 'vue'
import App from '@/App'
//
// element-ui shareLib 可以不操作
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
//
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#emp-root')
