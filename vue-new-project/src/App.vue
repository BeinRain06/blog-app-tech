<template>
  <div class="gen_container w-full" data-mode="dark">
    <div class="nav_holder" ref="navbar-holder-ref">
      <NavbarNewBlog v-model="closeProfile" />
    </div>
    <RouterView v-model="isLoading" @mousedown="handleResetVar" />
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
import {
  ref,
  useTemplateRef,
  onMounted,
  onUpdated,
  computed,
  nextTick,
} from "vue";
import { useUserStore } from "./stores/user";

import NavbarNewBlog from "./components/NavbarNewBlog.vue";

const router = useRouter();

const closeProfile = ref(false);
const isNavbar = useTemplateRef("navbar-holder-ref");
const isLoading = ref(true);

onMounted(async () => {
  router.beforeEach(async (to, from) => {
    console.log("to", to);
    const userStore = useUserStore();

    if (from.name === "home") {
      isLoading.value = false;
    }

    if (to.name === "home" || to.name === "login" || to.name === "register") {
      isNavbar.value?.classList.remove("hidden");

      const navState = sessionStorage.getItem("navbar-state");
      userStore.$patch({ navbarState: navState });
    } else {
      isNavbar.value?.classList.add("hidden");
    }
  });
});

onUpdated(async () => {
  const userStore = useUserStore();

  const grabCurrentNav = await sessionStorage.getItem("navbar-state");

  userStore.$patch({ navbarState: grabCurrentNav });

  await nextTick();
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
  --brand-text-1: #5f5397;
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
  --brand-text: #635991;
  --brand-text-1: #5f5397;
  --card-box: #201e27;
}

/* * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
} */
</style>
