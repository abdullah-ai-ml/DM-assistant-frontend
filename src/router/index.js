import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/auth/LoginView.vue'
import SignUpView from '@/views/auth/SignUpView.vue'
import HomeView from '@/views/HomeView.vue'
import VerifyTokenView from '@/views/auth/VerifyTokenView.vue'
import VerifyView from '@/views/auth/VerifyView.vue'
import DashBoardView from '@/views/DashBoardView.vue'
import ForgetView from '@/views/auth/ForgetView.vue'
import ChangePasswordView from '@/views/auth/ChangePasswordView.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import CampaingView from '@/views/CampaingView.vue'



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
      path:'/dashboard/campaign',
      name:'campaign',
      component:CampaingView,
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

  const authStore = useAuthStore()
  let { isLogin } = storeToRefs(authStore)

  const token = localStorage.getItem('token');

  if(token && !isLogin.value){
    isLogin.value = true
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: 'login' });
    } 
    else if(to.name === "login" && isLogin.value){
      next({name:'dashboard'})
    }
    else{
      next()  
    }
  } else {
    next();
  }

})

export default router
