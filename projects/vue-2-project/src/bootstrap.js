import store from '@v2b/store'
import Vue from 'vue'
import App from './App'

console.log('store', store)

new Vue({
  store: store.default,
  render: h => h(App),
}).$mount('#emp-root')
