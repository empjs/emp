import Vue from 'vue'
import App from 'src/App'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#emp-root')
