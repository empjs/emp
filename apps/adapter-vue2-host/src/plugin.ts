import ElementUI from 'element-ui'
// import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import 'element-ui/lib/theme-chalk/index.css'
export default Vue => {
  Vue.use(Router)
  Vue.use(Vuex)
  Vue.config.productionTip = false
  Vue.use(ElementUI)
}
