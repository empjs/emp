import Vue from 'vue'
import App from './App'
import VueCompositionAPI from '@vue/composition-api'

Vue.config.productionTip = false
console.log('VueCompositionAPI', VueCompositionAPI)
const vue = new Vue({
  render: h => h(App),
}).$mount('#emp-root')

Vue.use(VueCompositionAPI)
