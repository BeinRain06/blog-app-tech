<template>
  <NavbarBlog v-if="isNavbar" />

  <div class="group_main relative w-full">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
import { computed } from "vue";
import NavbarBlog from "./components/NavbarBlog.vue";
import { usePostStore } from "@/stores/post.js";

const router = useRouter();

const isNavbar = computed(() => {
  const postStore = usePostStore();

  router.beforeEach(async (to, from) => {
    console.log("navigation to :", to);
    if (to.name === "home") {
      setTimeout(() => {
        // console.log("wait a moment")
        postStore.$patch({ postInPage: null });
      }, 1000);
    }
  });

  const postPage = postStore.postInPage;

  if (postPage === null) {
    return true;
  } else {
    return false;
  }
});
</script>

<style scoped></style>
