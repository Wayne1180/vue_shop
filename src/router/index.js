import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('../views/Welcome.vue')
      },
      {
        path: '/users',
        component: () => import('../views/Pages/User/User.vue')
      },
      {
        path: '/roles',
        component: () => import('../views/Pages/Power/Roles.vue')
      },
      {
        path: '/rights',
        component: () => import('../views/Pages/Power/Rights.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next()
  // 从sessionStorage中获取到保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
