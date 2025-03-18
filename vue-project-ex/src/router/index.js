import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import CreatePostView from '../views/CreatePostView.vue'
import EditPostView from '../views/EditPostView.vue'
import PostView from '../views/PostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/page',
      name: 'page',
      component: PostView
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePostView
    },
    {
      path: '/edit',
      name: 'edit',
      component: EditPostView
    }
  ]
})

export default router
