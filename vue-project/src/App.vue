<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import NavbarBlog from './components/NavbarBlog.vue'
import LoginAdminView from './components/LoginAdminView.vue'
</script>

<template>
  <NavbarBlog />

  <div class="group_main relative w-full">
    <RouterView />
    <div class="log_admin_area">
      <LoginAdminView />
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 180px) {
  .log_admin_area {
    display: none;
    @apply fixed top-0 left-0 w-full h-screen;
    background-color: rgba(0, 0, 0, 0.66);
    z-index: 5;
  }
}
</style>
