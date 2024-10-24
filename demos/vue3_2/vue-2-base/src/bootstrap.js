import App from '@/App'
import store from '@/store'
import Vue from 'vue'
import router from './router'

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#emp-root')
