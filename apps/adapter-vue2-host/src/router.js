import Router from 'vue-router'

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
