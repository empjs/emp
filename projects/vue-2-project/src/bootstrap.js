import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
Vue.use(Vuex)
import store from '@v2b/store'
console.log('store', store)
Vue.config.productionTip = false
//
// import VueCompositionAPI from '@vue/composition-api'
// Vue.use(VueCompositionAPI)
//

new Vue({
  store,
  render: h => h(App),
}).$mount('#emp-root')
