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
    name: 'signUp',
    path: '/sign-up',
    component: () => import('@/views/SignUpPage.vue')
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
    path: '/add-todo',
    component: () => import('@/views/AddTodoPage.vue')
  },
  {
    name: 'editTodo',
    path: '/edit-todo/:id',
    component: () => import('@/views/EditTodoPage.vue')
  },
  {
    name: 'weeklyTodo',
    path: '/weekly-todo',
    component: () => import('@/views/WeeklyTodo.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
