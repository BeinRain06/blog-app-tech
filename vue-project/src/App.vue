<template>
  <NavbarBlog v-if="isNavbar" />

  <div class="group_main relative w-full">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue'
import NavbarBlog from './components/NavbarBlog.vue'
import { usePostStore } from '@/stores/post.js'

const isNavbar = computed(() => {
  const postStore = usePostStore()
  const postPage = postStore.postInPage

  const result = postPage === null ? true : false

  return result
})
</script>

<style scoped></style>
