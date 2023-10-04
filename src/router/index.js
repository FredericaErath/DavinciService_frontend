import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          path: 'dashboard',
          component: () => import('../pages/dashboard.vue'),
        },
        {
          path: 'account-settings',
          component: () => import('../pages/account-settings.vue'),
        },
        {
          path: 'user-management',
          component: () => import('../pages/user-management.vue'),
        },
        {
          path: 'instrument-management',
          component: () => import('../pages/instrument-management.vue'),
        },
        {
          path: 'surgery-data-board',
          component: () => import('../pages/surgery-management.vue'),
        },
        {
          path: 'supply-management',
          component: () => import('../pages/supply-management.vue'),
        },
        {
          path: 'data-dashboard',
          component: () => import('../pages/data-dashboard.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('../layouts/blank.vue'),
      children: [
        {
          path: 'login',
          component: () => import('../pages/login.vue'),
        },
        {
          path: 'register',
          component: () => import('../pages/register.vue'),
        },
        {
          path: '/:pathMatch(.*)*',
          component: () => import('../pages/[...all].vue'),
        },
      ],
    },
  ],
})

export default router
