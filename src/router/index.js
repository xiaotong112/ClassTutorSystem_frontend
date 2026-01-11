import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '首页', icon: 'HomeFilled' }
      },
      {
        path: 'class',
        name: 'Class',
        component: () => import('../views/Class.vue'),
        meta: { title: '班级管理', icon: 'School' }
      },
      {
        path: 'student',
        name: 'Student',
        component: () => import('../views/Student.vue'),
        meta: { title: '学生管理', icon: 'UserFilled' }
      },
      {
        path: 'course',
        name: 'Course',
        component: () => import('../views/Course.vue'),
        meta: { title: '课程管理', icon: 'Reading' }
      },
      {
        path: 'activity',
        name: 'Activity',
        component: () => import('../views/Activity.vue'),
        meta: { title: '活动管理', icon: 'Calendar' }
      },
      {
        path: 'plan',
        name: 'Plan',
        component: () => import('../views/Plan.vue'),
        meta: { title: '计划管理', icon: 'Document' }
      },
      {
        path: 'evaluation',
        name: 'Evaluation',
        component: () => import('../views/Evaluation.vue'),
        meta: { title: '学生评估', icon: 'EditPen' }
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('../views/Statistics.vue'),
        meta: { title: '数据统计', icon: 'DataAnalysis' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  // 如果访问需要认证的页面但没有token，跳转到登录页
  if (to.meta.requiresAuth && !userStore.token) {
    next('/login')
  } 
  // 如果已登录但访问登录页，跳转到首页
  else if (to.path === '/login' && userStore.token) {
    next('/')
  } 
  else {
    next()
  }
})

export default router

