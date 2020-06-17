import Vue from 'vue'
import Router from 'vue-router'
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {})
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/Violin',
      name: 'Violin',
      component: () => import('./views/visualizationGraphics/Violin.vue')
    },
    {
      path: '/OncoPrint',
      name: 'OncoPrint',
      component: () => import('./views/visualizationGraphics/OncoPrint.vue')
    },
  ]
})
