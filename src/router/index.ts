import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsControl.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/home'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: 'home',
        component: () => import('@/views/HomePage.vue')
      },
      {
        path: 'account',
        component: () => import('@/views/AccountPage.vue')
      },
      {
        path: 'bill',
        component: () => import('@/views/BillPage.vue')
      },
      {
        path: 'chart',
        component: () => import('@/views/ChartPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
