import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const Question = () => import('@/views/question')
const Video = () => import('@/views/video')
const User = () => import('@/views/user')
const UserProfile = () => import('@/views/user/profile')
const UserChat = () => import('@/views/user/chat')
const Login = () => import('@/views/user/login')
const Search = () => import('@/views/search')
const SearchResult = () => import('@/views/search/result')
const Article = () => import('@/views/home/article')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { path: '/', name: 'home', component: Home },
        { path: '/question', name: 'question', component: Question },
        { path: '/video', name: 'video', component: Video },
        { path: '/user', name: 'user', component: User }
      ]
    },
    { path: '/user/profile', name: 'user-profile', component: UserProfile },
    { path: '/user/chat', name: 'user-chat', component: UserChat },
    { path: '/login', name: 'login', component: Login },
    { path: '/search', name: 'search', component: Search },
    { path: '/search/result', name: 'search-result', component: SearchResult },
    { path: '/article', name: 'article', component: Article }
  ]
})

// 登录拦截
// 条件一： /user /user/profile /user/chat 需要登录
// 条件二： 没有token信息
router.beforeEach((to, from, next) => {
  // 跳转的时候需要 带上当前的路由地址
  const login = { path: '/login', query: { redirect: to.path } }
  if (to.path.startsWith('/user') && !store.state.user.token) return next(login)
  next()
})

export default router
