<template>
  <header>
    <div class="nav_wrapper">
      <ul class="text-purple-600">
        <img
          alt="Vue logo"
          class="logo"
          src="@/assets/blog-writing-svgrepo-com.svg"
          width="40"
          height="40"
        />
        <RouterLink to="/">BlogPania</RouterLink>
      </ul>

      <nav class="nav_desktop">
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
        <ul id="custom_feature" class="custom_features">
          <li>Custom</li>
          <li>&#65088;</li>
        </ul>
      </nav>

      <nav class="nav_mobile hidden">
        <RouterLink to="/register">Register</RouterLink>
        <ul id="menu_wrap" class="menu_wrap">
          <li>
            <img
              alt="account logo"
              class="logo"
              src="@/assets/account-avatar-profile-user-9-svgrepo-com.svg"
              width="40"
              height="40"
            />
          </li>
          <li>&#65088;</li>
        </ul>
        <div class="others_features">
          <RouterLink to="/login">Login</RouterLink>
          <div class="custom_mob_wrap">
            <p><span>Custom</span> <span>&#8910;</span></p>
            <div class="select_style_blog">
              <div class="select_blog">
                <label for="all">all</label>
                <input type="radio" id="all_blogger" name="all" class="blog_radio all_blogger" />
              </div>
              <div class="select_blog">
                <label for="single">single</label>
                <input
                  type="radio"
                  id="single_blogger"
                  name="single"
                  class="blog_radio single_blogger"
                />
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

<style scoped></style>
