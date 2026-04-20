import { createRouter, createWebHistory } from 'vue-router'
import { APP_ROUTES } from '@/constants'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: APP_ROUTES.LOGIN,
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/layout/DefaultLayout.vue'),
      meta: { requiresAuth: false },
      children: [
        {
          path: '',
          redirect: { name: 'home' },
        },
        {
          path: APP_ROUTES.HOME.slice(1),
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: { requiresAuth: false },
        },
        {
          path: APP_ROUTES.DASHBOARD.slice(1),
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: { requiresAuth: true },
        },
        // Agregar nuevas rutas según necesidad:
        // {
        //   path: '[entity]',
        //   name: '[entity]',
        //   component: () => import('@/views/[Entity]/[Entity]View.vue'),
        //   meta: { requiresAuth: true },
        // },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: APP_ROUTES.DASHBOARD,
    },
  ],
})

router.beforeEach((_to, _from, next) => {
  // Guard temporalmente desactivado para facilitar la inspección de vistas
  next()
})

export default router
