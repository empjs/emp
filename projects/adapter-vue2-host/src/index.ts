import Vue from 'vue'
import { router } from './setup/router'
import App from './components/App.vue'
import store from './setup/store'

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')