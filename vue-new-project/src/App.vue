<template>
  <div class="gen_container" data-mode="dark">
    <NavbarNewBlog v-if="isNavbar" v-model="closeProfile" />

    <div class="group_main relative z-10 w-full" @mousedown="handleResetVar">
      <RouterView />
    </div>
    >
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
import { ref, computed } from "vue";
import NavbarNewBlog from "./components/NavbarNewBlog.vue";
import { usePostStore } from "@/stores/post.js";

const router = useRouter();

const closeProfile = ref(false);

const isNavbar = computed(() => {
  const postStore = usePostStore();

  router.beforeEach(async (to, from) => {
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

const handleResetVar = () => {
  closeProfile.value = true;
};
</script>

<style scoped>
.gen_container[data-mode="light"] {
  /*new light mode design dieter rams */
  --bg-gen: #fff;
  --text-link: #737276;
  --title: #1a181e;
  --text-body: #5b5a5f;
  --text-body-1: #92989b;
  --accent-color-1: #7f7451; /*soothing*/
  --accent-color-11: #928b68; /*soothing*/
  --accent-color-111: #a08a59; /*soothing*/
  --accent-color-2: #905149; /* bg btn cta */
  --accent-color-3: #2e2c32; /* title aside bar */
  --brand-text: #4d4474;
}

.gen_container[data-mode="dark"] {
  /*new dark mode design dieter rams */
  --bg-gen: #0b0a10;
  --text-link: #a09ea4;
  --title: #fff;
  --text-body: #a2a0a6;
  --text-body-1: #92989b;
  --accent-color-1: hsl(92, 68%, 21%); /*soothing*/
  --accent-color-11: hsl(92, 71%, 38%); /*soothing*/
  --accent-color-2: #83423a; /* bg btn cta */
  --accent-color-3: #e2e0e6; /* title aside bar */
  --brand-text: hsl(250, 24%, 46%);
}
</style>
