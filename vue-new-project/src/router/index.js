import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterNewView from "../views/RegisterNewView.vue";
import CreatePostView from "../views/CreatePostView.vue";
import EditPostView from "../views/EditPostView.vue";
import PostNewView from "../views/PostNewView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterNewView,
    },
    {
      path: "/page/:id",
      name: "page",
      component: PostNewView,
    },
    {
      path: "/create",
      name: "create",
      component: CreatePostView,
    },
    {
      path: "/edit",
      name: "edit",
      component: EditPostView,
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    if (to.name === "page" || to.name === "create" || to.name === "edit") {
      // always scroll to top
      return { top: 50 };
    }

    if (from.name === "home") {
      if (savedPosition) return savedPosition;
    }
  },
});

export default router;
