<template>
  <div class="log_admin_container">
    <form class="log_admin_content">
      <fieldset class="field_admin_set">
        <legend class="admin_gen_title">
          A<span class="text-blue-800">d</span>m<span class="text-gray-700">i</span>n
        </legend>
        <div class="formal_content">
          <div class="form_control">
            <label for="email">Email</label>
            <input type="email" id="email" class="input_content" name="email" placeholder="Email" />
          </div>
          <div class="form_control">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              class="input_content"
              name="password"
              placeholder="password"
            />
          </div>
          <div class="form_control">
            <label for="custom">Custom</label>
            <input
              type="text"
              id="custom"
              class="input_content"
              name="custom"
              placeholder="custom"
            />
          </div>
          <div
            class="form_submit flex justify-center xsm:justify-around items-center"
            @click.prevent="hideShowLogAdmin"
          >
            <input
              type="button"
              id="cancel_log"
              name="cancel"
              class="btn btn_cancel"
              value="cancel"
            />
            <input
              type="submit"
              id="submit_log"
              name="submit"
              class="btn btn_submit"
              value="submit"
            />
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user.js'

function hideShowLogAdmin(e) {
  const userStore = useUserStore()

  console.log(e.target.id)
  if ((e.target.id = 'submit_log')) {
    userStore.$patch({
      isLogAdminOpen: false,
      miniCustomIsVisible: false,
      customIsVisible: false
    })

    userStore.updateStateRadio('false', 'true')
  } else if (e.target.id === 'cancel_log') {
    userStore.$patch({
      isLogAdminOpen: false,
      miniCustomIsVisible: false,
      customIsVisible: false
    })
    userStore.updateStateRadio('true', 'false')
  }
}
</script>
<style scoped>
@media (min-width: 180px) {
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .btn {
    @apply text-lg text-white w-20 h-10 bg-black rounded;
    tranition: all 1s ease-in-out;
  }

  .btn_submit {
    @apply bg-purple-900 hover:bg-green-600;
  }

  .btn_cancel {
    @apply bg-gray-800 hover:bg-black;
  }

  .log_admin_area {
    @apply fixed top-0 left-0 w-full h-screen;
    background-color: rgba(0, 0, 0, 0.66);
    z-index: 5;
  }

  .log_admin_container {
    @apply absolute text-white;
    top: 50%;
    left: 50%;
    width: 94%;
    height: 29rem;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.68);
  }

  .log_admin_content {
    position: relative;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .admin_gen_title {
    @apply w-full p-2 justify-center font-bold text-gray-400;

    font-size: calc(28px + 0.3vw);
    font-family: 'Ubuntu Sans', sans-serif;
    font-optical-sizing: auto;
    font-weight: 480;
    font-style: normal;
    font-variation-settings: 'wdth' 100;
  }

  .formal_content {
    width: 100%;
    height: 100%;
    display: grid;
    grid-auto-columns: 100%;
    grid-template-rows: 22% 22% 22% auto;
  }

  .form_control {
    @apply flex flex-col gap-1 px-1 py-4 my-2 justify-center text-gray-300;
    font-size: calc(12px + 0.3vw);
  }

  .input_content {
    height: 2.2rem;
    font-size: calc(10px + 0.3vw);
  }
}

@media (min-width: 380px) {
  .log_admin_container {
    top: 50%;
    left: 50%;
    width: 70%;
    height: 29rem;
    transform: translate(-50%, -50%);
  }

  .form_control {
    font-size: calc(14px + 0.35vw);
  }

  .form_control {
    @apply w-full  flex flex-col gap-1 p-4 my-2 justify-center text-gray-300;
    font-size: calc(12px + 0.36vw);
  }

  .admin_gen_title {
    font-size: calc(32px + 0.3vw);
  }
}

@media (min-width: 620px) {
  .log_admin_container {
    width: 46%;
    height: 29rem;
  }
}
</style>
