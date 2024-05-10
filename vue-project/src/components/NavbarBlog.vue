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
        <RouterLink class="btn btn-link" to="/login">Login</RouterLink>
        <RouterLink class="btn btn-link" to="/register">Register</RouterLink>
        <ul
          id="custom_feature"
          class="custom_features flex text-gray-300 justify-center items-center gap-1"
        >
          <li class="relative">Custom</li>
          <li class="relative md:top-1 font-bold cursor-pointer">&#65088;</li>
        </ul>
      </nav>

      <nav class="nav_mobile flex">
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
          <li class="angle_bracket font-bold text-lg text-center text-white cursor-pointer">
            &#65088;
          </li>
        </ul>
        <div class="others_features flex flex-col rounded-md">
          <RouterLink class="btn_register_menu btn-mobile-link" to="/register">Register</RouterLink>
          <RouterLink class="btn-mobile-link" to="/login">Login</RouterLink>
          <div class="custom_mob_wrap w-full">
            <p class="custom-p">
              <span>Custom</span> <span class="relative top-2 cursor-pointer">&#65088;</span>
            </p>
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

@media (min-width: 180px) {
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
    @apply text-white xxsm:text-xxsm xsm:text-xsm font-semibold pb-3 md:py-1;
    font-family: 'Poetsen One', sans-serif;
    font-style: normal;
  }

  .btn-link {
    @apply bg-black text-white text-center py-2 my-auto rounded-md font-semibold hover:bg-green-500;
  }

  .btn-mobile-link {
    @apply p-3 text-white;
    font-size: calc(14px + 0.3vw);
  }

  .nav_header {
    padding: 1.5rem 0.15rem 2rem 0.15rem !important;
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

  .btn_register_menu {
    display: block;
  }

  .others_features {
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

  .btn_register_nav {
    display: block;
  }

  .btn_register_menu {
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
