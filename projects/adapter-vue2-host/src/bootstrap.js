import Vue from 'vue'
import App from '@/App'
import store from '@/store'
import plugin from './plugin'
import router from './router'

plugin(Vue)
const app = new Vue({
  router,
  store,
  render: h => h(App),
})

app.$mount('#emp-root')
