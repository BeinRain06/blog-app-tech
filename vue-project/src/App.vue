<template>
  <NavbarBlog />

  <div class="group_main relative w-full">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavbarBlog from './components/NavbarBlog.vue'
</script>

<style scoped></style>
