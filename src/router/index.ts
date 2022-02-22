import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About me',
    component: () => import('../views/About.vue')
  },
  {
    path: '/snake',
    name: 'Snake',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Snake.vue')
  },
  {
    path: '/minesweeper',
    name: 'Minesweeper',
    component: () => import('../views/Minesweeper.vue')
  },
  {
    path: '/links',
    name: 'Links',
    component: () => import('../views/Links.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
