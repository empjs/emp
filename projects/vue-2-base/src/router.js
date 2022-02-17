import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  mode: 'hash',
  base: '/',
  routes: [
    {
      path: '/',
      component: () => import('./views/Home'),
    },
  ],
})
