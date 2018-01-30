import Vue from 'vue'
import Router from 'vue-router'
import OracleManager from '@/components/OracleManager'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'OracleManager',
      component: OracleManager
    }
  ]
})
