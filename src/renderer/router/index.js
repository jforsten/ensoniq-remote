import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'browser-view',
      component: require('@/components/BrowserView').default
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/components/SettingsView').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
