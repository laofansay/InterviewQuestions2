import { createRouter, createWebHistory } from 'vue-router'
import { setupAuthGuard } from './auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/auth/login.vue'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../views/auth/register.vue'),
      }
    ],
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () => import('../views/courses/index.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/learning',
    name: 'Learning',
    component: () => import('../views/learning/index.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/user/profile.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/settings/index.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 设置路由守卫
setupAuthGuard(router)

export default router
