import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/pages/SetupPage.vue')
    },
    {
      path: '/runner',
      component: () => import('@/pages/SimulationPage.vue')
    }
  ]
})
