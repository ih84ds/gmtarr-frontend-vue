import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Flight from '@/components/Flight'
import League from '@/components/League'
import Login from '@/components/Login'
import MatchEdit from '@/components/MatchEdit'

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
    },
    {
      path: '/matches/:id/edit',
      name: 'match-edit',
      component: MatchEdit,
      props: (route) => ({id: parseInt(route.params.id)}),
    },
  ]
})
