import Vue from 'vue'
import App from './App'

import store from '@v2b/store'
console.log('store', store)

new Vue({
  store: store.default,
  render: h => h(App),
}).$mount('#emp-root')
