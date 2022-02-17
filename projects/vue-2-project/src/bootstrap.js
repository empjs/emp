import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
//
// import VueCompositionAPI from '@vue/composition-api'
// Vue.use(VueCompositionAPI)
//

new Vue({
  render: h => h(App),
}).$mount('#emp-root')
