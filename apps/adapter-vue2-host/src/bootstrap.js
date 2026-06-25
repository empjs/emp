import Vue from 'vue'
import App from '@/App'
import store from '@/store'

import router from './router'

const app = new Vue({
  router,
  store,
  render: h => h(App),
})

app.$mount('#emp-root')
