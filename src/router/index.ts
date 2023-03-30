import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'DesignerFrom',
      component: () => import('../views/DesignerFrom'),
    },
    {
      path: '/PreviewFrom',
      name: 'PreviewFrom',
      component: () => import('../views/PreviewFrom'),
    },
  ],
})

export default router
