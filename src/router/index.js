import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/auth/LoginView.vue'
import SignUpView from '@/views/auth/SignUpView.vue'
import HomeView from '@/views/HomeView.vue'
import VerifyTokenView from '@/views/auth/VerifyTokenView.vue'
import VerifyView from '@/views/auth/VerifyView.vue'
import DashBoardView from '@/views/DashBoardView.vue'
import ForgetView from '@/views/auth/ForgetView.vue'
import ChangePasswordView from '@/views/auth/ChangePasswordView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
    },
    
    {
      path:'/verify/:token',
      name: 'verify',
      component:VerifyTokenView
    },
    {
      path:'/verify',
      name: 'verifypage',
      component: VerifyView
    },
    {
      path:'/dashboard',
      name:'dashboard',
      component:DashBoardView,
      meta: { requiresAuth: true }
    },
    {
      path:'/forget-password',
      name:'forget-password',
      component:ForgetView
    },
    {
      path:"/change-password/:token",
      name:'change-password',
      component: ChangePasswordView
    },
    {
      path:'/change-password',
      redirect: { name: 'login' }
    }

    
  ],
})

router.beforeEach((to, from, next) => {

  const token = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }

})

export default router
