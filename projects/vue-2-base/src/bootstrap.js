import Vue from 'vue'
import store from '@/store'
import App from '@/App'
import router from './router'

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#emp-root')
