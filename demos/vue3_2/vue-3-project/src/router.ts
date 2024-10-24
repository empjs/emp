import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
  {path: '/', name: 'home', component: () => import('./Home.vue')},
  // {path: '/hostHome', name: 'hostHome', component: () => import('@v3/Home')},
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
