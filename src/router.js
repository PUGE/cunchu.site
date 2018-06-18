import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Manage from './views/Manage.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login
    },
    {
      path: '/manage',
      name: 'manage',
      component: Manage
    }
  ]
})
