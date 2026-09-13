import {
  createRouter,
  createWebHistory
} from '@ionic/vue-router'

import MemberListPage from '../views/MemberListPage.vue'
import MemberFormPage from '../views/MemberFormPage.vue'


const routes = [

  {
    path: '/',
    redirect: '/members'
  },

  {
    path: '/members',
    component: MemberListPage
  },

  {
    path: '/members/add',
    component: MemberFormPage
  },

  {
    path: '/members/edit/:id',
    component: MemberFormPage
  }

]


const router = createRouter({

  history: createWebHistory(
    import.meta.env.BASE_URL
  ),

  routes

})


export default router