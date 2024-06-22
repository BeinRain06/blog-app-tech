<template>
  <header class="nav_header bg-gray-800">
    <div class="w-full flex justify-between">
      <ul class="flex justify-center items-center space-x-0 xsm:space-x-1 text-sm md:text-lg">
        <img alt="generic logo" class="generic_logo" src="@/assets/content-svgrepo-com.svg" />
        <RouterLink class="btn btn-logo" to="/"
          >Bl<span class="text-blue-800">o</span>gPan<span class="text-green-500">i</span
          >a</RouterLink
        >
        <li class="mini_admin_logo absolute" style="top: 0.5rem; left: 4.2rem" v-if="admin">
          <span
            class="text-white text-sm bg-green-600"
            style="padding: 0 0.5rem; border-radius: 24px"
            >admin</span
          >
        </li>
      </ul>

      <nav
        v-if="currentUserIn !== null && currentUserIn !== undefined && admin === false"
        class="nav_desktop flex justify-center gap-1 text-base md:gap-7 md:text-lg"
      >
        <div
          class="user_login_desk flex justify-start gap-0 md:justify-center items-center md:gap-4"
        >
          <p class="user_in">welcome @{{ shortyName }}</p>

          <div class="init_post w-24">
            <RouterLink
              id="init_new_post"
              class="btn-new-post w-full h-full text-white rounded-2xl bg-black hover:bg-green-700"
              to="/create"
            >
              create a post
            </RouterLink>
          </div>
        </div>

        <ul
          id="custom_feature"
          class="custom_features flex text-gray-300 justify-center items-center gap-1"
        >
          <li><span class="specs_blog_title">techreviews</span></li>
        </ul>

        <button class="btn-logout-desk" @click.prevent="logoutSession">Logout</button>
      </nav>

      <nav
        v-if="currentUserIn !== null && currentUserIn !== undefined && admin === true"
        class="nav_desktop_admin"
      >
        <div
          class="user_login_desk flex justify-start gap-0 md:justify-center items-center md:gap-4"
        >
          <p class="user_in">welcome @{{ shortyName }}</p>

          <div class="init_post w-24 z-10 md:w-30">
            <p
              id="init_new_post"
              class="btn-new-post w-full h-full text-white rounded-2xl bg-black hover:bg-green-700"
            >
              <RouterLink to="/create">create a postA</RouterLink>
            </p>
          </div>
        </div>

        <ul
          id="custom_feature"
          class="custom_features flex text-gray-300 justify-center items-center gap-1"
        >
          <li>
            <div class="filter_wrapper z-10">
              <div class="filter_box">
                <span style="font-size: calc(12px + 0.25vw)">Filter</span>
                <div class="text-white flex items-center cursor-pointer z-20" @click="switchFilter">
                  <div class="thin_bar"></div>
                  <div class="arrow_filter_wrap mx-2">
                    <span class="arrow_filter relative" style="top: 0.1rem; left: 0rem"
                      >&#x25BE;</span
                    >
                  </div>
                </div>
              </div>
              <div class="filter_box_selection hide_selection" ref="filterBox">
                <div
                  class="filter_box_content w-full flex flex-col gap-1 px-2 py-1 justify-center items-center"
                  @click="handleFilterSelection"
                >
                  <div class="control_selection">
                    <label for="author">By Author</label>
                    <input
                      type="radio"
                      id="author_filter"
                      class="filter_select mx-2"
                      name="search"
                    />
                  </div>
                  <div class="control_selection">
                    <label for="theme">By theme</label>
                    <input
                      type="radio"
                      id="theme_filter"
                      class="filter_select mx-2"
                      name="search"
                    />
                  </div>
                  <div class="control_selection">
                    <label for="standard">Standard</label>
                    <input
                      type="radio"
                      id="standard_filter"
                      class="filter_select mx-2"
                      name="search"
                      checked
                    />
                  </div>
                </div>
              </div>
              <div class="section_search relative md:top-1">
                <ul class="search_content bg-yellow-600">
                  <li class="w-9/12 h-full bg-blue-300">
                    <input
                      type="text"
                      class="text_search w-full h-full flex justify-center items-center text-sm text-gray-600 outline-none"
                      style="text-indent: 5px"
                      name="search"
                      ref="inputSearch"
                      :placeholder="pickMsg"
                      @input="(e) => handleWordsSearch(e, 'desk')"
                    />
                  </li>
                  <li class="w-3/12 h-full flex p-1 cursor-pointer z-10" @click="submitSearch">
                    <span class="w-full flex justify-center items-center">&#128269;</span>
                  </li>
                </ul>
                <div v-if="isAList" class="list_proposal">
                  <ul id="content_proposal_normal" class="content_proposal">
                    <li
                      class="item_proposal relative cursor-pointer transition-all duration-1000 ease-in-out my-4"
                      v-for="(element, index) in listSample"
                      key="index"
                      @click="forwardsSearch"
                    >
                      {{ element }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div class="wrapper_logout_mode">
          <button class="btn-logout-desk" @click.prevent="logoutSession">Logout</button>

          <div id="dark_light" class="dark_light" v-if="admin" @click="switchDarkLight">
            <div
              id="dark_light"
              class="wrap_dark_img relative w-6 h-4 rounded cursor-pointer z-10"
              v-if="dark === false"
            >
              <img
                src="../assets/sun.jpeg"
                id="storm"
                class="img_mode absolute w-hull h-full object-cover"
                style="z-index: 1"
                alt="no light/dark mode"
              />
            </div>
            <div
              id="dark_light"
              class="wrap_dark_img relative w-6 h-4 rounded cursor-pointer z-10"
              v-if="dark"
            >
              <img
                src="../assets/moon.jpeg"
                id="storm"
                class="img_mode absolute w-hull h-full object-cover"
                style="z-index: 1"
                alt="no light/dark mode"
              />
            </div>
          </div>
        </div>
      </nav>

      <nav
        v-if="currentUserIn === null || currentUserIn === undefined"
        class="nav_desktop space-x-3 text-sm md:text-lg"
      >
        <button class="btn btn-link" to="/login" @click="(e) => redirectLink(e, 'login')">
          Login
        </button>
        <button class="btn btn-link" to="/register" @click="(e) => redirectLink(e, 'register')">
          Register
        </button>

        <div
          id="custom_feature"
          class="custom_features flex flex-col justify-center items-center gap-2"
        >
          <ul class="panel_desk_custom flex text-gray-300 justify-center items-center gap-1">
            <li class="relative">Custom</li>
            <li class="relative md:top-1 font-bold cursor-pointer" @click="handleCustom">
              &#65088;
            </li>
          </ul>
          <div class="desk_custom_wrap" style="padding: 0 0.5rem" v-if="custom">
            <button
              class="btn-new-account w-full relative top-1 text-md hover:underline hover:tracking-wide hover:font-bold"
              style="padding: 0.25rem 0; font-size: calc(14px + 0.35vw)"
              @click.prevent="redirectLoginPage"
            >
              log new account
            </button>
            <div class="desk_feature_wrapper flex-col text-white gap-2">
              <div
                class="w-full flex text-white transition-all duration-1000 ease-in-out hover:tracking-wide hover:text-gray-100 hover:gap-2 gap-1"
              >
                <span style="font-size: calc(14px + 0.35vw)">Feature</span>
                <span
                  class="relative top-2 cursor-pointer hover:text-yellow-300 font-bold"
                  style="font-size: calc(14px + 0.3vw)"
                  @click="handleMiniCustom"
                  >&#65088;</span
                >
              </div>
              <div class="w-full flex" v-if="minicustom">
                <div class="select_blog z-10">
                  <label for="all" style="font-size: calc(14px + 0.32vw)">all</label>
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
                  <label for="single" style="font-size: calc(14px + 0.32vw)">single</label>
                  <div class="box_circle w-10 grid place-items-start">
                    <input type="radio" id="single_blogr" name="blogr" @change="handleRadioState" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <nav
        v-if="currentUserIn !== null && currentUserIn !== undefined && admin === false"
        class="nav_mobile flex gap-3"
      >
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
          <div class="w-full flex">
            <div class="aside_login_label w-3/12 flex justify-end items-center">
              <p
                class="aside_login_label w-12 text-sm text-center text-gray-100 bg-purple-900 rounded-xl"
              >
                login
              </p>
            </div>
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
            <button class="btn-new-account" @click="redirectLoginPage">log another account</button>
            <div class="logout_mob_wrapper w-full">
              <button
                class="btn_logout_menu text-purple-500 f0nt-bold"
                @click.prevent="logoutSession"
              >
                Logout
              </button>
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

      <nav
        v-if="currentUserIn !== null && currentUserIn !== undefined && admin === true"
        class="nav_mobile_admin flex gap-3"
      >
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
          <div class="w-full flex justify-between px-1">
            <div class="aside_login_label w-3/12 flex justify-start items-center">
              <p
                class="aside_login_label w-12 text-sm text-center text-gray-100 bg-purple-900 rounded-xl"
              >
                login
              </p>
            </div>
            <div
              id="dark_light"
              class="w-9/12 dark_light pr-1"
              v-if="admin"
              @click="(e) => switchDarkLight(e)"
            >
              <div id="light_mode" class="wrap_light_img z-10" v-if="dark === false">
                <img
                  src="../assets/sun.jpeg"
                  class="img_mode object-cover w-full h-full"
                  alt="no light/dark mode"
                />
              </div>
              <div id="dark_mode" class="wrap_dark_img z-10" v-if="dark">
                <img
                  src="../assets/moon.jpeg"
                  class="img_mode object-cover w-full h-full"
                  alt="no light/dark mode"
                />
              </div>
            </div>
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
            <button class="btn-new-account" @click="redirectLoginPage">log another account</button>
            <div class="filter_mob_wrapper" v-if="admin">
              <div class="filter_box_mob relative top-4 w-16 h-auto flex gap-1">
                <span class="text-white" style="position: relative; bottom: 0.5rem">Filter</span>
                <div
                  class="w-5 flex justify-between text-white cursor-pointer"
                  @click="switchFilter"
                >
                  <div class="thin_bar"></div>
                  <div class="arrow_filter_wrap relative bottom-1">
                    <span class="arrow_filter">&#x25BE;</span>
                  </div>
                </div>
              </div>
              <div class="filter_box_mobi_selection hide_selection" ref="filterBox">
                <div
                  class="filter_box_mobi_content w-full flex flex-col gap-3 py-2 justify-center items-center font-bold text-gray-900 z-10"
                  style="font-size: calc(14px + 0.28vw)"
                  @click="handleFilterSelection"
                >
                  <div class="control_selection w-full flex justify-center items-center gap-2">
                    <label for="author">By Author</label>
                    <input
                      type="radio"
                      id="author_filter"
                      class="filter_select mx-2"
                      name="author"
                      ref="inputAuthor"
                    />
                  </div>
                  <div class="control_selection w-full flex justify-center items-center gap-2">
                    <label for="theme">By theme</label>
                    <input
                      type="radio"
                      id="theme_filter"
                      class="filter_select mx-2"
                      name="theme"
                      ref="inputTheme"
                    />
                  </div>
                  <div class="control_selection w-full flex justify-center items-center gap-2">
                    <label for="standard">standard</label>
                    <input
                      type="radio"
                      id="standard_filter"
                      class="filter_select mx-2"
                      name="standard"
                      checked="true"
                      ref="inputStandard"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="section_search" v-if="admin">
              <ul class="search_content_mob w-full h-7 flex justify-center items-center p-1">
                <li class="relative h-full">
                  <input
                    type="text"
                    class="text_search w-10/12 h-full text-sm outline-none z-10"
                    style="text-indent: 10px"
                    name="search"
                    ref="inputSearch"
                    :placeholder="pickMsg"
                    @input="(e) => handleWordsSearch(e, 'mob')"
                  />
                </li>
                <li
                  class="cursor-pointer w-2/12 h-full flex items-center justify-center z-10"
                  @click="submitSearch"
                >
                  <span>&#128269;</span>
                </li>
              </ul>
              <div class="list_proposal_mob" v-if="isAList">
                <ul id="content_proposal_mob" class="content_proposal_mob" ref="contentProposal">
                  <li
                    class="item_proposal_mob"
                    v-for="element in listSample"
                    @click="forwardsSearch"
                  >
                    {{ element }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="logout_mob_wrapper w-full">
              <button
                class="btn_logout_menu text-purple-500 f0nt-bold"
                @click.prevent="logoutSession"
              >
                Logout
              </button>
            </div>
          </div>

          <div class="custom_mob_wrap w-full text-white">
            <p class="custom-p xsm:text-base">
              <span>Custom</span>
              <span class="relative top-2 cursor-pointer" @click="handleMiniCustom">&#65088;</span>
            </p>
            <div class="gather_custom w-full text-sm gap-1" v-if="minicustom">
              <div class="w-full flex justify-end cursor-pointer">
                <button
                  class="bg-gray-600 rounded"
                  style="padding: 0 0.5rem; margin: 0.25rem 0"
                  @click="() => reachTo('edit')"
                >
                  edit a post
                </button>
              </div>
              <div class="inline-flex cursor-pointer">
                <button
                  class="bg-green-700 rounded-xl"
                  style="padding: 0.15rem 0.5rem; margin: 0.25rem 0"
                  @click="() => reachTo(create)"
                >
                  create a post
                </button>
              </div>
              <span class="block" style="margin: 1.5rem 0 0.25rem">Features</span>
              <div class="w-full h-10 text-base flex">
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
                    <input
                      type="radio"
                      id="single_blogger"
                      name="blog"
                      @change="handleRadioState"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <nav v-if="currentUserIn === null || currentUserIn === undefined" class="nav_mobile flex">
        <button
          class="btn_register_nav btn-mobile-link"
          @click="(e) => redirectLink(e, 'register')"
        >
          Register
        </button>
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
          <button
            class="btn_register_menu text-left text-white font-medium"
            @click="(e) => redirectLink(e, 'register')"
          >
            Register
          </button>

          <button
            id="btn-mobile-login"
            class="btn-mobile-login"
            @click="(e) => redirectLink(e, 'login')"
          >
            Login
          </button>

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
    </div>
  </header>
  <div class="log_admin_area" v-if="isAdminOpen">
    <LoginAdminView />
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { usePostStore } from '@/stores/post.js'
import LoginAdminView from './LoginAdminView.vue'
import { logoutapi } from '@/api/logout-api.js'
import { redirectloginapi } from '@/api/login-api.js'
import { fetchspecificarticlesapi } from '@/api/post-api.js'

const router = useRouter()

const userStore = ref(useUserStore())

let dark = ref(false)
let showFilter = ref(false)
let pickMsg = ref('enter a search')
let listSample = ref(null)
let isList = ref(false)

let inputSearch = ref(null)

const myInput = computed({
  get() {
    return inputSearch.value
  },
  set(newValue) {
    inputSearch.value = newValue
  }
})

const contentProposal = ref(null)
const filterBox = ref(null)
const filterBoxOne = ref(null)

const currentUserIn = computed(() => {
  const userStore = useUserStore()
  return userStore.currentUser
})

const shortyName = computed(() => {
  const userStore = useUserStore()
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

const admin = computed(() => {
  const userStore = useUserStore()
  return userStore.isAdmin
})

const notadmin = computed(() => {
  const userStore = useUserStore()
  if (userStore.isAdmin === true) {
    return false
  } else {
    return true
  }
})

const isAList = computed(() => isList.value)

function handleRadioState(e) {
  console.log(e.target)
  const userStore = useUserStore()

  if (e.target.id === 'all_blogr' || e.target.id === 'all_blogger') {
    userStore.$patch({ isLogAdminOpen: false })
    userStore.updateStateRadio('true', 'false')
  } else if (e.target.id === 'single_blogr' || e.target.id === 'single_blogger') {
    userStore.$patch({ isLogAdminOpen: true })
    userStore.updateStateRadio('false', 'true')
  }
}

function handleCustom() {
  const userStore = useUserStore()
  const newState = !userStore.customIsVisible

  userStore.$patch({ customIsVisible: newState })
}

function handleMiniCustom() {
  const userStore = useUserStore()
  const newState = !userStore.miniCustomIsVisible
  userStore.$patch({ miniCustomIsVisible: newState })
}

async function logoutSession() {
  const userStore = useUserStore()
  const exArr = userStore.usersLogin
  const userToLogout = await logoutapi()

  const newArr = exArr.filter((item) => item !== userToLogout)
  userStore.$patch({
    usersLogin: newArr,
    currentUsername: null,
    currentUserId: null
  })

  router.push({ path: '/' })
}

async function redirectLink(e, label) {
  console.log('label:', label)
  const userStore = useUserStore()
  const usersLogin = userStore.usersLogin
  if (label === 'login') {
    const access_token = userStore.access_token

    console.log('access_token:', access_token)

    const newUserInfo = await redirectloginapi(access_token)

    if (newUserInfo !== 'null') {
      userStore.$patch({
        currentUsername: newUserInfo.username,
        currentUserId: newUserInfo.id,
        access_token: newUserInfo.access,
        usersLogin: [...usersLogin, newUserInfo.username]
      })

      newUserInfo.admin ? userStore.$patch({ isAdmin: true }) : userStore.$patch({ isAdmin: false })
      router.push({ path: '/' })
    } else {
      router.push({ path: '/login' })
    }
  } else if (label === 'register') {
    router.push({ path: '/register' })
  }

  userStore.$patch({ miniCustomIsVisible: false, customIsVisible: false })
}

function redirectLoginPage() {
  const userStore = useUserStore()
  userStore.$patch({ miniCustomIsVisible: false, customIsVisible: false })
  router.push({ path: '/login' })
}

function handleFilterSelection(e) {
  if (e.target.id === 'standard_filter') {
    pickMsg.value = 'enter a search'
    switchFilter(e)
  } else if (e.target.id === 'theme_filter') {
    pickMsg.value = 'look for ...'
    switchFilter(e)
  } else if (e.target.id === 'author_filter') {
    pickMsg.value = 'search by author'
    switchFilter(e)
  }
}

function stickVisibleorNot(e, act) {
  if (act === 'add') {
    contentProposal.value.classList.add('play_visible_vanish')
  } else {
    contentProposal.value.classList.remove('play_visible_vanish')
  }
}

function switchDarkLight() {
  dark.value = !dark.value
}

function reachTo(label) {
  const userStore = useUserStore()

  setTimeout(() => {
    showFilter.value === false
    userStore.$patch({ miniCustomIsVisible: false, customIsVisible: false })
  }, 800)

  setTimeout(() => {
    if (label === 'edit') {
      router.push({ path: '/edit' })
    } else {
      router.push({ path: '/create' })
    }
  }, 1100)
}

function switchFilter(e) {
  showFilter.value = !showFilter.value
  if (showFilter.value === false) {
    filterBox.value.classList.add('hide_selection')
  } else {
    filterBox.value.classList.remove('hide_selection')
  }
}

function handleWordsSearch(e, screen) {
  const str = e.target.value

  let matchingResearch

  if (e.target.value.length <= 1) {
    isList.value = false
    listSample.value = null
  }

  if (pickMsg.value === 'search by author' && e.target.value !== '') {
    let listAuthors = JSON.parse(localStorage.getItem('list-authors'))

    listAuthors = Array.from(listAuthors)

    isList.value = true

    matchingResearch = listAuthors.reduce((acc, val) => {
      const user = val.username.toLowerCase()
      if (user.includes(str)) {
        const usernameAlready = acc.find((elt) => (elt = val.username))

        if (usernameAlready === undefined) acc.push(val.username)
      }
      return acc
    }, [])

    listSample.value = matchingResearch
  } else if (pickMsg.value === 'look for ...' && e.target.value !== '') {
    const listThemes = JSON.parse(localStorage.getItem('list-themes'))

    isList.value = true

    matchingResearch = listThemes.filter((elt) => elt.includes(str))

    listSample.value = matchingResearch
  } else if (pickMsg.value === 'enter a search') {
    isList.value = false

    listSample.value = null
  }
}

function forwardsSearch(e) {
  inputSearch.value.value = e.target.innerHTML

  e.target.style.color = 'green'
  setTimeout(() => {
    e.target.style.color = '#555'
    isList.value = false
    listSample.value = null
  }, 1600)
}

async function submitSearch() {
  const userStore = useUserStore()
  const postStore = usePostStore()
  let newPosts
  if (pickMsg.value === 'look for ...') {
    newPosts = await fetchspecificarticlesapi('theme', inputSearch.value.value, null)
  } else if (pickMsg.value === 'search by author') {
    let allAuthors = JSON.parse(localStorage.getItem('list-authors'))

    allAuthors = Array.from(allAuthors)

    const thisAuthor = allAuthors.find((author) => author.username === inputSearch.value.value)
    newPosts = await fetchspecificarticlesapi('author', inputSearch.value.value, thisAuthor.id)
  } else {
    newPosts = await fetchspecificarticlesapi('standard', inputSearch.value.value, null)
  }

  console.log('allposts :', newPosts)

  postStore.$patch({ allposts: newPosts })

  userStore.$patch({ customIsVisible: false })

  userStore.$patch({ miniCustomIsVisible: false })

  inputSearch.value.value = null
}
</script>

<style scoped>
*,
*::before,
*::after {
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
    height: 36px;
    padding-left: 0.5rem;
  }

  .profile_logo {
    width: calc(40vw);
    height: 2rem;
  }

  p.user_in {
    @apply text-white transition-all duration-1000 ease-in-out hover:text-red-700 py-2;
    position: relative;

    width: calc(10rem + 3vw);
    font-size: calc(0.8rem + 0.48vw);
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

  .btn-new-account {
    @apply text-white text-left transition-all duration-1000 ease-in-out py-1  hover:font-medium hover:text-gray-900;

    font-size: calc(14px + 0.35vw);
  }

  .btn-new-post {
    cursor: pointer;
    font-size: calc(10px + 0.1vw);
    padding: 0.25rem 0;
    display: grid;
    place-items: center;
    transition: all 1s ease-in-out;
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

  .nav_desktop_admin {
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

  .desk_custom_wrap {
    position: absolute;
    top: 6.4rem;
    right: 0rem;
    width: 14rem;
    padding: 0.5rem 0;
    height: auto;
    @apply bg-gray-500 z-10 flex flex-col gap-2;
  }

  .desk_feature_wrapper {
    width: 100%;
    padding: 0.5rem 0;
    height: auto;
  }

  .custom_mob_wrap {
    position: relative;
    top: -0.5rem;
    height: auto;
  }

  .logout_mob_wrapper {
    padding: 0.5rem 0;
  }

  .custom-p {
    @apply font-bold py-2;
    font-size: calc(14px + 0.24vw);
  }

  .select_blog {
    @apply w-6/12 py-2 px-2  flex justify-start items-center;
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

  .nav_desktop_admin {
    display: none;
    justify-content: space-between;
    width: 60%;
  }

  .nav_mobile_admin {
    display: flex;
  }

  .thin_bar {
    position: relative;
    top: 0;
    width: 0.65rem;
    height: 1px;
    background-color: #fff;
  }

  .thin_bar::before {
    content: '';
    position: absolute;
    top: -3px;
    width: 1.2rem;
    height: 100%;
    background-color: #fff;
  }

  .thin_bar:after {
    content: '';
    position: absolute;
    top: 4px;
    width: 0.45rem;
    height: 100%;
    background-color: #fff;
  }

  .filter_wrapper {
    position: absolute;
    top: 4.2rem;
    left: 3rem;
    width: 100%;
    padding: 0.5rem 0;
    display: flex;
    justify-content: flex-start;
    gap: 0.5rem;
  }

  .filter_box {
    width: 3.8rem;
    display: flex;
    gap: 0.25rem;
  }

  .filter_box_selection {
    position: absolute;
    top: 2.8rem;
    left: 0.4rem;
    width: 12.4rem;
    height: 140px;
    display: grid;
    z-index: 3;
    transition: all 1s ease-in-out;
    @apply bg-purple-800;
  }

  .filter_box_mobi_selection {
    position: relative;
    top: 0rem;
    width: 100%;
    height: 6rem;
    margin: 0.75rem 0 1rem;
    transition: all 600ms ease-in-out;
  }

  .filter_box_selection.hide_selection {
    display: grid;
    height: 0;
  }

  .filter_box_mobi_selection.hide_selection {
    height: 0;
  }

  .filter_box_selection .control_selection {
    width: 100%;
    visibility: visible;
    opacity: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 1rem;
    transition: all 1s ease-in-out;
  }

  .filter_box_selection.hide_selection .control_selection {
    visibility: hidden;
    opacity: 0.1;
  }

  .filter_box_mobi_selection .control_selection {
    opacity: 1;
    transition: all 450ms ease-in-out 400ms;
  }

  .filter_box_mobi_selection.hide_selection .control_selection {
    visibility: hidden;
    opacity: 0.1;
    transition: all 450ms ease-in-out;
  }

  .control_selection label {
    width: 60%;
    font-size: calc(12px + 0.3vw);
  }

  .search_content {
    width: 6rem;
    height: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .list_proposal_mob {
    display: flex;
    position: absolute;
    top: 1rem;
    right: calc(20rem - 10px);
    width: 20rem;
    height: auto;
  }

  .content_proposal_mob {
    position: absolute;
    top: 5rem;
    right: -19rem;
    width: 11.6rem;
    padding: 0.5rem 0;
    max-height: 198px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: left;
    background-color: #f4f4f4;
    overflow-y: scroll;
    z-index: 10;
  }

  .content_proposal_mob .item_proposal_mob,
  .content_proposal .item_proposal {
    max-width: 100%;
    font-size: calc(14px + 0.35vw);
    transition: all 1s ease-in-out;
    color: #555;
    @apply flex items-center px-1 hover:bg-purple-600 hover:text-gray-100;
  }

  .wrapper_logout_mode {
    display: none;
    flex-direction: row;
    justify-content: center;
    gap: 0.75rem;
  }

  .dark_light {
    width: 40px;
    height: 30px;
    border-radius: 50%;
  }

  .wrap_light_img,
  .wrap_dark_img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid black;
    outline-offset: -3px;
    outline: 2px solid white;
  }

  .wrap_dark_img {
    outline: 3px solid navy;
  }

  .img_mode {
    border-radius: 50%;
  }
}

@media (min-width: 375px) {
  .nav_header {
    --var-font-size: 1.4em;
    padding: 1rem !important;
  }

  .generic_logo {
    position: relative;
    left: 0.5rem;
    width: 40px;
    height: 40px;
    padding-left: 0rem;
  }

  .profile_logo {
    width: 3.6rem;
    height: 3rem;
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

  .list_proposal_mob {
    display: block;
  }

  .content_proposal_mob {
    position: absolute;
    top: 14rem;
    right: calc(-68%);
    width: 12rem;
    padding: 0.5rem 0;
    height: 200px;
    background-color: #b4b4b4;
    overflow-y: scroll;
  }
}

@media (min-width: 600px) {
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

  .nav_desktop_admin {
    display: flex;
  }

  .nav_mobile_admin {
    display: none;
  }

  p.user_in {
    width: calc(8rem + 3vw);
    font-size: calc(0.72rem + 0.48vw);
  }

  .search_content {
    width: 10rem;
  }

  .list_proposal {
    position: absolute;
    top: 2rem;
    left: 0;
  }

  .content_proposal {
    position: relative;
    top: 2rem;
    width: 10rem;
    padding: 0.5rem 0;
    max-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: left;
    background-color: #fff;
    overflow-y: scroll;
    visibility: visible;
    transition: all 3s ease-in-out;
  }

  .item_proposal {
    border-bottom: 1px solid #bbb;
    z-index: 100;
  }

  .wrapper_logout_mode {
    display: flex;
  }
}

@media (min-width: 840px) {
  .nav_header {
    --var-font-size: calc(1.25rem + 1vw);
  }

  .btn-logo {
    font-size: var(--var-font-size);
  }

  .btn-new-post {
    position: relative;
    top: -0.5rem;
    left: 1rem;
    font-size: calc(11px + 0.15vw);
    padding: 0.25rem 0;
  }

  .specs_blog_title {
    display: block;
  }

  .desk_custom_wrap {
    top: 6.7rem;
  }

  p.user_in {
    left: calc(2%);
  }

  .nav_desktop_admin {
    display: flex;
    justify-content: space-around;
    width: 100%;
    gap: 1.25rem;
  }

  .search_content {
    width: 11rem;
    height: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .filter_wrapper {
    position: relative;
    padding: 0;
    top: -0.25rem;
    left: 0;
  }

  .filter_box_selection {
    position: absolute;
    top: 2.75rem;
    left: 0;
    width: 12.2rem;
    height: auto;
    z-index: 3;
    @apply bg-purple-800;
  }

  .content_proposal {
    top: 2.5rem;
    height: 370px;
  }

  .wrapper_logout_mode {
    position: relative;

    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
  }
}

@keyframes proposal-visibility {
  0% {
    visibility: visibile;
  }
  100% {
    visibility: hidden;
  }
}
</style>
