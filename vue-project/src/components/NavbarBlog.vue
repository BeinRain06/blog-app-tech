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

      <nav class="nav_desktop space-x-3 text-sm md:text-lg">
        {currentUserIn !== "" ? (
        <div class="user_login_desk">
          <p class="user_in text-white underline">welcome @{{ shortyName }}</p>
        </div>
        ):(<RouterLink class="btn btn-link" to="/login">Login</RouterLink>
        <RouterLink class="btn btn-link" to="/register">Register</RouterLink>) }

        <ul
          id="custom_feature"
          class="custom_features flex text-gray-300 justify-center items-center gap-1"
        >
          {currentUserIn !== "" ? (
          <li><button id="init_new_post" class="init_new_post">create a post</button></li>
          <li><span class="specs_blog_title">techreviews</span></li>
          ):(
          <li class="relative">Custom</li>
          <li class="relative md:top-1 font-bold cursor-pointer">&#65088;</li>
          )}
        </ul>

        <RouterLink class="btn_logout_desk" to="/">Logout</RouterLink>
      </nav>

      <nav class="nav_mobile flex">
        {currentUserIn!== "" ? (
        <div class="user_login_mob">
          <p class="user_in text-white underline">@{{ shortyName }}</p>
        </div>
        ): (<RouterLink class="btn_register_nav btn-mobile-link" to="/register">Register</RouterLink
        >)}
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
          <li class="angle_bracket font-bold text-lg text-center text-white cursor-pointer">
            &#65088;
          </li>
        </ul>
        <div class="others_features flex flex-col rounded-md">
          {currentUserIn!== "" ? (
          <p class="aside_login_label">login</p>
          <div class="user_login_mob">
            <p class="user_in text-white underline">welcome {{ shortyName }}</p>
            {lastDateAction!== undefined &&
            <p class="last_post">last Post:{{ lastDateAction }}</p>
            }
            <div class="written_wrapper w-full flex justify-between items-center py-2">
              <span class="articles_label">Articles</span>
              <span class="count_articles p-1 text-sm rounded bg-red-400">{{ countArt }}</span>
            </div>
            <RouterLink class="btn_logout_menu btn-mobile-link" to="/">Logout</RouterLink>
          </div>
          ): (<RouterLink class="btn_register_menu btn-mobile-link" to="/register"
            >Register</RouterLink
          >
          <RouterLink class="btn-mobile-link" to="/login">Login</RouterLink>)}

          <div class="custom_mob_wrap w-full">
            <p class="custom-p">
              <span>Custom</span> <span class="relative top-2 cursor-pointer">&#65088;</span>
            </p>
            <div class="w-full h-10 text-base flex">
              <div class="select_blog">
                <label for="all">all</label>
                <div class="box_circle w-10 grid place-items-start">
                  <input type="radio" id="all_blogger" name="blog" />
                </div>
              </div>
              <div class="select_blog">
                <label for="single">single</label>
                <div class="box_circle w-10 grid place-items-start">
                  <input type="radio" id="single_blogger" name="blog" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import { RouterLink } from 'vue-router'
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { usePostStore } from '@/stores/post.js'

export default defineComponent({
  setUp() {},
  computed: {
    currentUserIn: () => {
      const userStore = useUserStore()
      return userStore.currentUser
    },
    shortyName: () => {
      const userStore = useUserStore()
      return userStore.shortNameUser
    },
    lastDateAction: () => {
      const postStore = usePostStore()
      return postStore.lastDate
    },
    countArt: () => {
      const postStore = usePostStore()
      return postStore.countArticles
    }
  }
})
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
  .nav_header {
    --var-font-size-xxsm: 1.2em;
    --var-font-size-xsm: 1.8em;
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

  .btn {
    @apply px-4  font-normal;
  }

  .btn-logo {
    @apply text-white font-semibold pb-3 md:py-1;
    font-family: 'Poetsen One', sans-serif;
    font-style: normal;
    font-size: var(--var-font-size-xxsm);
  }

  .btn-link {
    @apply bg-black text-white text-center py-2 my-auto rounded-md font-semibold hover:bg-green-500;
  }

  .btn-mobile-link {
    @apply p-3 text-white;
    font-size: calc(14px + 0.3vw);
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
    visibility: hidden;
    position: absolute;
    top: 6.9rem;
    right: 0;
    width: 100%;
    padding: 0.5rem 0;
    @apply bg-gray-700;
    box-shadow: 0px 1px 10px 5px rgba(0, 0, 0, 0.65);
  }

  .custom_mob_wrap {
    padding: 0.5rem;
    color: #fff;
  }

  .custom-p {
    @apply font-bold;
    font-size: calc(14px + 0.3vw);
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
    font-size: var(--var-font-size-xsm);
  }

  .btn_register_nav {
    display: block;
  }

  .btn_register_menu,
  .btn_logout_menu {
    display: none;
  }

  .others_features {
    top: 6.8rem;
    right: 0.25rem;
    width: 16em;
  }
}

@media (min-width: 520px) {
  .nav_mobile {
    display: none;
  }
  .nav_desktop {
    display: flex;
  }
}
</style>
