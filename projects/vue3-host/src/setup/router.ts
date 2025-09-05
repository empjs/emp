import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'

const routes = [
  {path: '/', name: 'home', component: () => import('src/components/Home.vue')},
  {path: '/info', name: 'info', component: () => import('src/components/Info.vue')},
]

export const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes,
})
