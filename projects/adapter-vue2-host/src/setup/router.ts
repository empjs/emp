import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from 'src/components/Home.vue'
import Info from 'src/components/Info.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/info', name: 'info', component: Info },
]

export const router = new VueRouter({
  mode: 'history',
  routes,
})