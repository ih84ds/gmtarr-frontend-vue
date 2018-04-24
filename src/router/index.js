import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import League from '@/components/League'
import Flight from '@/components/Flight'

Vue.use(Router)

const basePath = process.env.ROUTER_BASE || '/'

export default new Router({
  mode: 'history',
  base: basePath,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/logout',
      name: 'logout',
      component: Login,
    },
    {
      path: '/leagues/:id',
      name: 'league',
      component: League,
      props: (route) => ({id: parseInt(route.params.id)}),
    },
    {
      path: '/flights/:id',
      name: 'flight',
      component: Flight,
      props: (route) => ({id: parseInt(route.params.id)}),
    }
  ]
})
