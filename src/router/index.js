import storage from '@/store/storage';
import store from '@/store/store';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login',// 某些页面规定必须登录后才能查看 ，可以在router中配置meta，将需要登录的requireAuth设为true，
    meta: {
      requireAuth: true,
    } },
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
        {
          path: 'message-center',
          component: () => import('../pages/message-center.vue'),
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

// 设置路由守卫，在进页面之前，判断有token，才进入页面，否则返回登录页面
if (storage.get("token")) {
  store.commit("setToken", storage.get("token"));
}
router.beforeEach((to, from, next) => {
  // 判断要去的路由有没有requiresAuth
  // to.matched.some(r => r.meta.requireAuth) or to.meta.requiresAuth
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.token) {
      next(); //有token,进行request请求，后台还会验证token
    } else {
      next({
        path: "/login",
        // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由，这要进一步在登陆页面判断
        query: { redirect: to.fullPath }  
      });
    }
  } else {
    next(); //如果无需token,那么随它去吧
  }
});


export default router
