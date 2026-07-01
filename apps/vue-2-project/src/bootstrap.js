import store from '@v2b/store'
import Vue from 'vue'
import App from './App'

console.log('store', store)

const remoteStore = store.default ?? store
const VueCtor = Vue.default ?? Vue

if (globalThis.ELEMENT) {
  VueCtor.use(globalThis.ELEMENT)
}

new VueCtor({
  store: remoteStore,
  render: h => h(App),
}).$mount('#emp-root')
