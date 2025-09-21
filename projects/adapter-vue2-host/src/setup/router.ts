import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Info from '../components/Info.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/info', component: Info }
]

export default new VueRouter({
  mode: 'history',
  routes
})