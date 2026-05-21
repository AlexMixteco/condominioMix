import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import HomePage from '@/modules/landing/pages/HomePage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/modules/landing/layouts/LandingLayout.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: HomePage,
        },
        {
          path: 'chat',
          name: 'chat',
          component: () => import('@/modules/landing/pages/Chat.vue'),
        },
      ],
    },
    {
      path: '/auth',
      redirect: { name: 'login' },
      component: () => import('@/auth/layouts/Authlayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/auth/pages/LoginPage.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'login' },
    },
  ],
})

router.beforeEach((to, from) => {
  const auth = useAuthStore()

  if (!auth.usuario && localStorage.getItem('token')) {
    auth.cargarUsuario()
  }

  const rutasPublicas = ['login']

  if (!rutasPublicas.includes(to.name) && !auth.estaAutenticado) {
    return { name: 'login' }
  }

  if (to.name === 'login' && auth.estaAutenticado) {
    return { name: 'home' }
  }

  return true
})

export default router