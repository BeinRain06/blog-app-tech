<template>
  <header class="nav_header bg-gray-800">
    <div class="w-full flex justify-between">
      <ul class="flex justify-center items-center space-x-0 xsm:space-x-1 text-sm md:text-lg">
        <img alt="generic logo" class="generic_logo" src="@/assets/content-svgrepo-com.svg" />
        <RouterLink class="btn btn-logo" to="/"
          >Bl<span class="text-blue-800">o</span>gPan<span class="text-green-500">i</span
          >a</RouterLink
        >
      </ul>

      <nav
        v-if="currentUserIn !== null"
        class="nav_desktop flex justify-center gap-1 md:gap-7 md:text-lg"
      >
        <div class="user_login_desk flex justify-end gap-1 md:justify-center items-center md:gap-4">
          <p class="user_in">welcome @{{ shortyName }}</p>

          <div
            class="init_post w-24 h-6 bg-black text-center rounded-2xl hover:bg-green-700 transition-all duration-1000 ease-in-out"
          >
            <p id="init_new_post" class="btn-new-post">create a post</p>
          </div>
        </div>

        <ul
          id="custom_feature"
          class="custom_features flex text-gray-300 justify-center items-center gap-1"
        >
          <li><span class="specs_blog_title">techreviews</span></li>
        </ul>

        <button class="btn-logout-desk">Logout</button>
      </nav>

      <nav v-if="currentUserIn === null" class="nav_desktop space-x-3 text-sm md:text-lg">
        <RouterLink class="btn btn-link" to="/login">Login</RouterLink>
        <RouterLink class="btn btn-link" to="/register">Register</RouterLink>

        <div
          id="custom_feature"
          class="custom_features flex flex-col justify-center items-center gap-2"
        >
          <ul class="panel_desk_custom flex text-gray-300 justify-center items-center gap-1">
            <li class="relative">Custom</li>
            <li class="relative md:top-1 font-bold cursor-pointer" @click="handleMiniCustom">
              &#65088;
            </li>
          </ul>
          <div class="desk_custom_wrapper flex text-white" v-if="minicustom">
            <div class="select_blog z-10">
              <label for="all">all</label>
              <div class="box_circle w-10 grid place-items-start">
                <input
                  type="radio"
                  id="all_blogr"
                  name="blogr"
                  @change="handleRadioState"
                  checked
                />
              </div>
            </div>
            <div class="select_blog z-10">
              <label for="single">single</label>
              <div class="box_circle w-10 grid place-items-start">
                <input type="radio" id="single_blogr" name="blogr" @change="handleRadioState" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <nav v-if="currentUserIn !== null" class="nav_mobile flex gap-3">
        <div class="grid place-items-center">
          <p class="user_in_mob text-xl xsm:text-base text-white underline">{{ shortyName }}</p>
        </div>
        <ul
          id="menu_wrap"
          class="menu_wrap flex xxsm:flex-col xsm:flex-row justify-center py-1 gap-2 bg-gray-700 rounded"
        >
          <li>
            <img
              alt="account logo"
              class="profile_logo"
              src="@/assets/account-avatar-profile-user-9-svgrepo-com.svg"
            />
          </li>
          <li
            class="angle_bracket font-bold text-lg text-center text-white cursor-pointer"
            @click="handleCustom"
          >
            &#65088;
          </li>
        </ul>

        <div class="others_features flex flex-col rounded-md" v-if="custom">
          <div class="aside_login_label w-full flex justify-end items-center">
            <p
              class="aside_login_label w-12 text-sm text-center text-gray-100 bg-purple-900 rounded-xl"
            >
              login
            </p>
          </div>

          <div class="p-2 text-lg xsm:text-base">
            <p class="user_in">welcome {{ shortyName }}</p>
            <p v-if="lastDateAction !== undefined" class="last_post">
              last Post:{{ lastDateAction }}
            </p>
            <div class="written_wrapper w-full flex justify-between items-center h-8">
              <span class="articles_label text-gray-500 font-bold">Articles</span>
              <span class="count_articles w-3 text-center rounded-2xl bg-green-800">{{
                countArt
              }}</span>
            </div>
            <div class="logout_mob_wrapper w-full">
              <button class="btn_logout_menu text-purple-500 f0nt-bold">Logout</button>
            </div>
          </div>

          <div class="custom_mob_wrap w-full text-white">
            <p class="custom-p xsm:text-base">
              <span>Custom</span>
              <span class="relative top-2 cursor-pointer" @click="handleMiniCustom">&#65088;</span>
            </p>
            <div class="w-full h-10 text-base flex" v-if="minicustom">
              <div class="select_blog">
                <label for="all">all</label>
                <div class="box_circle w-10 grid place-items-start">
                  <input
                    type="radio"
                    id="all_blogger"
                    name="blog"
                    @change="handleRadioState"
                    checked
                  />
                </div>
              </div>
              <div class="select_blog">
                <label for="single">single</label>
                <div class="box_circle w-10 grid place-items-start">
                  <input type="radio" id="single_blogger" name="blog" @change="handleRadioState" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <nav v-if="currentUserIn === null" class="nav_mobile flex">
        <RouterLink class="btn_register_nav btn-mobile-link" to="/register">Register</RouterLink>
        <ul
          id="menu_wrap"
          class="menu_wrap flex xxsm:flex-col xsm:flex-row justify-center py-1 gap-2 bg-gray-700 rounded"
        >
          <li>
            <img
              alt="account logo"
              class="profile_logo"
              src="@/assets/account-avatar-profile-user-9-svgrepo-com.svg"
            />
          </li>
          <li
            class="angle_bracket font-bold text-lg text-center text-white cursor-pointer"
            @click="handleCustom"
          >
            &#65088;
          </li>
        </ul>

        <div class="others_features flex flex-col rounded-md gap-3" v-if="custom">
          <RouterLink class="btn_register_menu text-white font-medium" to="/register"
            >Register</RouterLink
          >

          <button id="btn-mobile-login" class="btn-mobile-login">Login</button>

          <div class="custom_mob_wrap w-full text-white">
            <p class="custom-p">
              <span>Custom</span>
              <span class="relative top-2 left-1 cursor-pointer" @click="handleMiniCustom"
                >&#65088;</span
              >
            </p>
            <div
              class="w-full h-10 text-base flex transition-all duration-1000 ease-in-out"
              v-if="userStore.miniCustomIsVisible"
              @click="handleRadioState"
            >
              <div class="select_blog">
                <label for="all">all</label>
                <div class="box_circle w-10 grid place-items-start">
                  <input
                    type="radio"
                    id="all_blogger"
                    name="blog"
                    v-model="userStore.isCheckedAll"
                  />
                </div>
              </div>
              <div class="select_blog">
                <label for="single">single</label>
                <div class="box_circle w-10 grid place-items-start">
                  <input
                    type="radio"
                    id="single_blogger"
                    name="blog"
                    v-model="userStore.isCheckedSingle"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
  <div class="log_admin_area" v-if="isAdminOpen">
    <LoginAdminView />
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref, computed } from 'vue'
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { usePostStore } from '@/stores/post.js'
import LoginAdminView from './LoginAdminView.vue'

const userStore = ref(useUserStore())

const currentUserIn = computed(() => {
  const userStore = useUserStore()

  console.log('current user:', userStore.currentUser)
  return userStore.currentUser
})

const shortyName = computed(() => {
  const userStore = useUserStore()

  console.log('shorty name:', userStore.shortNameUser)
  return userStore.shortNameUser
})

const lastDateAction = computed(() => {
  const postStore = usePostStore()
  return postStore.lastDate
})

const countArt = computed(() => {
  const postStore = usePostStore()
  return postStore.countArticles
})

const custom = computed(() => {
  const userStore = useUserStore()
  return userStore.customIsVisible
})
const minicustom = computed(() => {
  const userStore = useUserStore()
  return userStore.minor
})

const stateCheckedAll = computed(() => {
  const userStore = useUserStore()
  return userStore.isCheckedAll
})

const stateCheckedSingle = computed(() => {
  const userStore = useUserStore()
  return userStore.isCheckedSingle
})

const isAdminOpen = computed(() => {
  const userStore = useUserStore()
  return userStore.isLogAdminOpen
})

function handleRadioState(e) {
  console.log(e.target)
  const userStore = useUserStore()

  if (e.target.id === 'all_blogr') {
    userStore.$patch({ isLogAdminOpen: false })
    userStore.updateStateRadio('true', 'false')
  } else if (e.target.id === 'single_blogr') {
    userStore.$patch({ isLogAdminOpen: true })
    userStore.updateStateRadio('false', 'true')
  }
}

function handleCustom(e) {
  console.log('e parent element', e.currentTarget.parentElementChild)
  const userStore = useUserStore()
  const newState = !userStore.customIsVisible

  userStore.$patch({ customIsVisible: newState })
}

function handleMiniCustom(e) {
  const userStore = useUserStore()
  const newState = !userStore.miniCustomIsVisible
  userStore.$patch({ miniCustomIsVisible: newState })
}
</script>

<style scoped>
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

@media (min-width: 180px) {
  .log_admin_area {
    @apply fixed top-0 left-0 w-full h-screen;
    background-color: rgba(0, 0, 0, 0.66);
    z-index: 5;
  }

  span.count_articles {
    font-size: 12px;
  }
  .nav_header {
    --var-font-size: 1.2em;
    padding: 1.5rem 0.15rem 2rem 0.15rem !important;
  }

  .generic_logo {
    position: relative;
    left: 0.5rem;
    width: 36px;
    heght: 36px;
    padding-left: 0.5rem;
  }

  .profile_logo {
    width: calc(40vw);
    height: 2rem;
  }

  p.user_in {
    @apply text-white transition-all duration-1000 ease-in-out hover:text-red-700 py-2;
    width: calc(10rem + 3vw);
    font-size: calc(0.86rem + 0.48vw);
  }

  p.user_in_mob {
    display: none;
  }

  .btn {
    @apply px-4  font-normal;
  }

  .btn-logo {
    @apply text-white font-semibold pb-3 md:py-1;
    font-family: 'Poetsen One', sans-serif;
    font-style: normal;
    font-size: var(--var-font-size);
  }

  .btn-link {
    @apply bg-black text-white text-center py-2 my-auto rounded-md font-semibold hover:bg-green-500;
  }

  .btn-mobile-link {
    @apply p-3 text-white;
    font-size: calc(14px + 0.3vw);
  }

  .btn-mobile-login {
    @apply w-full text-left text-white font-medium;
    font-size: calc(15px + 0.47vw);
  }

  .btn-logout-desk {
    @apply cursor-pointer text-gray-100 underline hover:text-gray-300;
    font-size: calc(14px + 0.3vw);
  }

  .btn-new-post {
    @apply w-full h-full text-white;
    cursor: pointer;
    font-size: calc(10px + 0.1vw);
    position: relative;
    top: -3px;
    z-index: 3;
  }

  .specs_blog_title {
    font-size: calc(8px + 0.1vw);
    display: none;
    @apply text-blue-400;
  }

  .nav_mobile {
    display: flex;
  }
  .nav_desktop {
    display: none;
  }

  .btn_register_nav {
    display: none;
    padding: 0.5rem;
    text-decoration: underline;
  }

  .btn_register_menu,
  .btn_logout_menu {
    display: block;
  }

  .others_features {
    visibility: visible;
    position: absolute;
    top: 6.9rem;
    right: 0;
    width: 100%;
    padding: 0.5rem;
    @apply bg-gray-700;
    box-shadow: 0px 1px 10px 5px rgba(0, 0, 0, 0.65);
    z-index: 3;
  }

  .desk_custom_wrapper {
    position: absolute;
    top: 6.4rem;
    right: 0rem;
    width: 10rem;
    height: 2.5rem;
    @apply bg-gray-500;
  }

  .custom_mob_wrap {
    position: relative;
    top: -0.5rem;
  }

  .logout_mob_wrapper {
    padding: 0.5rem 0;
  }

  .custom-p {
    @apply font-bold py-2;
    font-size: calc(14px + 0.24vw);
  }

  .select_blog {
    @apply w-6/12 py-4 px-2 flex justify-start items-center;
    font-size: calc(14px + 0.2vw);
  }

  input[type='radio'] {
    appearance: none;
    -moz-appearance: none;
    --webkit-appearance: none;
    width: calc(10px + 0.1vw);
    height: calc(10px + 0.1vw);
    background-color: #fff;
    border-radius: 50%;
    border: 2px solid #fff;
    outline: 2px solid #108510;
    transition: all 400ms ease-in-out;
  }

  input[type='radio']:checked {
    border: 2px solid #fff;
    background-color: #108510;
  }

  .box_circle {
    padding-left: 0.5rem;
  }
}

@media (min-width: 375px) {
  .nav_header {
    --var-font-size: 1.4em;
  }

  .generic_logo {
    position: relative;
    left: 0.5rem;
    width: 40px;
    heght: 340px;
    padding-left: 0rem;
  }

  .profile_logo {
    width: 3.6rem;
    height: 3rem;
  }

  .nav_header {
    padding: 2rem !important;
  }

  .btn-logo {
    font-size: var(--var-font-size);
  }

  .btn_register_nav {
    display: block;
  }

  p.user_in_mob {
    display: block;
  }

  .others_features {
    top: 6.8rem;
    right: 0.25rem;
    width: 16em;
  }

  .logout_mob_wrapper {
    padding: 0.75rem 0;
  }
}

@media (min-width: 520px) {
  .nav_header {
    --var-font-size: 1.6em;
  }

  .btn_register_menu,
  .btn_logout_menu {
    display: none;
  }

  .btn-logo {
    font-size: var(--var-font-size);
  }

  .btn-new-post {
    top: 3px;
  }

  .nav_mobile {
    display: none;
  }
  .nav_desktop {
    display: flex;
  }

  p.user_in {
    width: calc(8rem + 3vw);
    font-size: calc(0.72rem + 0.48vw);
  }
}

@media (min-width: 780px) {
  .nav_header {
    --var-font-size: calc(1.25rem + 1vw);
  }

  .btn-logo {
    font-size: var(--var-font-size);
  }

  .specs_blog_title {
    display: block;
  }

  .nav_mobile {
    display: none;
  }

  .nav_desktop {
    display: flex;
  }

  .btn-new-post {
    top: -3px;
  }

  .desk_custom_wrapper {
    top: 6.7rem;
  }
}
</style>
