<template>
  <header class="nav_header bg-gray-800">
    <div class="w-full flex justify-between">
      <ul class="flex justify-center items-center space-x-2 text-sm md:text-lg">
        <img
          alt="Vue logo"
          class="logo"
          src="@/assets/content-svgrepo-com.svg"
          width="40"
          height="40"
        />
        <RouterLink class="btn btn-logo" to="/"
          >Bl<span class="text-blue-800">o</span>gPan<span class="text-green-500">i</span
          >a</RouterLink
        >
      </ul>

      <nav class="nav_desktop space-x-3 text-sm md:text-lg">
        <RouterLink class="btn btn-link" to="/login">Login</RouterLink>
        <RouterLink class="btn btn-link" to="/register">Register</RouterLink>
        <ul
          id="custom_feature"
          class="custom_features flex text-gray-300 justify-center items-center gap-1"
        >
          <li class="relative">Custom</li>
          <li class="relative md:top-1 font-bold">&#65088;</li>
        </ul>
      </nav>

      <nav class="nav_mobile flex bg-gray-500">
        <RouterLink class="btn-mobile-link" to="/register">Register</RouterLink>
        <ul id="menu_wrap" class="menu_wrap flex gap-2 bg-white">
          <li>
            <img
              alt="account logo"
              class="logo"
              src="@/assets/account-avatar-profile-user-9-svgrepo-com.svg"
              width="40"
              height="40"
            />
          </li>
          <li class="font-bold text-lg text-center">&#65088;</li>
        </ul>
        <div class="others_features flex flex-col rounded-md">
          <RouterLink class="btn-mobile-link" to="/login">Login</RouterLink>
          <div class="custom_mob_wrap w-full">
            <p class="custom-p"><span>Custom</span> <span class="relative top-2">&#65088;</span></p>
            <div class="w-full h-10 text-base flex">
              <div class="select_blog">
                <label for="all">All</label>
                <div class="box_circle w-10 grid place-items-start">
                  <input type="radio" id="all_blogger" name="blog" />
                </div>
              </div>
              <div class="select_blog">
                <label for="single">Single</label>
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

export default {
  name: 'NavbarBlog'
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

.nav_header {
  padding: 2rem !important;
}

.btn {
  @apply px-4  font-normal;
}

.btn-logo {
  @apply text-white font-semibold  text-2xl md:text-3xl pb-3 md:py-1;
  font-family: 'Poetsen One', sans-serif;
  font-style: normal;
}

.btn-link {
  @apply bg-black text-white text-center py-2 my-auto rounded-md font-semibold hover:bg-green-500;
}

.btn-mobile-link {
  @apply p-3 bg-purple-300 text-lg;
}

@media (min-width: 180px) {
  .nav_mobile {
    display: flex;
  }
  .nav_desktop {
    display: none;
  }

  .others_features {
    position: absolute;
    top: 7.3rem;
    right: 0;
    width: 100%;
    padding: 0.5rem 0;
    background-color: gray;
  }

  .custom_mob_wrap {
    padding: 0.5rem;
  }

  .custom-p {
    @apply text-lg font-bold;
  }

  .select_blog {
    @apply w-6/12 py-4 px-2 flex justify-start items-center text-lg;
  }

  input[type='radio'] {
    appearance: none;
    -moz-appearance: none;
    --webkit-appearance: none;
    width: 16px;
    height: 16px;
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
    padding-left: 0.25rem;
  }
}

@media (min-width: 290px) {
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
