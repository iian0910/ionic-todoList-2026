import { createRouter } from '@ionic/vue-router';
import { createWebHashHistory, RouteRecordRaw } from 'vue-router';
import TabsControl from '../views/TabsControl.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/tabs/',
    component: TabsControl,
    children: [
      {
        name: 'home',
        path: 'home',
        component: () => import('@/views/HomePage.vue')
      }
    ]
  },
  {
    name: 'addTodo',
    path: '/addTodo',
    component: () => import('@/views/AddTodoPage.vue')
  },
  {
    name: 'editTodo',
    path: '/editTodo/:id',
    component: () => import('@/views/EditTodoPage.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
