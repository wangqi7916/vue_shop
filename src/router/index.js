import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import UserList from '../components/user/UserList'
import RoleList from '../components/role/RoleList'
import Route from '../components/route/Route'
import { getStorage } from '../utils/localstorage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/user-list',
        component: UserList
      },
      {
        path: '/role-list',
        component: RoleList
      },
      {
        path: '/route',
        component: Route
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 判断token是否存在
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from 代表从哪个路径跳转而来
  if (to.path === '/login') return next()
  // 获取token
  const token = getStorage('token')
  if (!token) return next('/login')
  next()
})

export default router
