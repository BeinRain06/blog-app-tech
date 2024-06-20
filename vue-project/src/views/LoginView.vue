<template>
  <div class="about w-full">
    <div class="upper_wrapper w-full"></div>
    <div class="lower_wrapper w-full h-full bg-blue-100"></div>
    <div class="login_wrapper">
      <form class="login_form h-full">
        <fieldset class="fieldset_area h-full">
          <legend class="login_title">Login</legend>
          <div class="form_content">
            <div class="field_msg w-full flex flex-col justify-start pl-2">
              <p class="text-gray-600">Read Tech Articles, Discovery and Culture Trends</p>
              <p class="text-gray-400">Enhance Journey to skills the Best of Yourself ¬</p>
            </div>
            <div class="form_control">
              <label for="email"> Email</label>
              <input
                type="email"
                id="email"
                class="input_content"
                name="email"
                ref="inputEml"
                placeholder="address_Email"
                focus="true"
                v-model="email"
              />
            </div>
            <div class="form_control" @click="showPassword">
              <label for="password"> Password</label>
              <input
                type="password"
                id="password"
                class="input_content password_input"
                name="password"
                min-length="8"
                ref="inputPwd"
                placeholder="Password"
                v-model="password"
              />
              <div
                class="pwd_wrap_toggle w-full flex justify-end text-base text-blue-900 font-bold"
              >
                <span id="toggle_password" class="toggle_password cursor-pointer p-1 z-10"
                  >show</span
                >
              </div>
            </div>
            <div class="form_submit w-full mt-3">
              <input
                type="button"
                id="btn_identity"
                class="btn_identity cursor-pointer w-full text-center text-gray-200 py-2 bg-blue-800 rounded-xl z-10 transition-all duration-1000 ease-in-out hover:bg-gray-800 hover: text-gray-50"
                value="login"
                @click.prevent="handleLogin"
              />
              <div
                id="warning_msg"
                class="warning_msg absolute bottom-12 w-full h-8 text-red-600 text-center bg-yellow-100"
                v-if="warningStore.warningNews"
              >
                <p>{{ warningStore.warningNews }}</p>
              </div>

              <div v-if="userStore.loadingState" class="load_wrapper">
                <ul
                  class="loading_content flex justify-center gap-2 justify-center items-center py-2"
                >
                  <li><span class="loading_msg text-sm"> Please Wait . . .</span></li>
                </ul>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { useWarningStore } from '@/stores/warning.js'
import { loginapi } from '../api/login-api.js'
import { checkInputError, resetUser } from '@/reusable/collaborate-function.js'

export default defineComponent({
  setup() {
    const userStore = ref(useUserStore())
    const warningStore = ref(useWarningStore())
    const inputEml = ref(null)
    const inputPwd = ref(null)
    const email = ref('')
    const password = ref('')

    async function handleLogin(e) {
      const userStore = useUserStore()

      setTimeout(() => {
        userStore.$patch({
          loading: !userStore.loadingState
        })
      }, 4000)

      userStore.$patch({
        loading: !userStore.loadingState
      })

      const user = { email: inputEml.value.value, password: inputPwd.value.value }

      const isStateWarning = checkInputError(user, 'login')

      if (isStateWarning) {
        return
      }

      //loginapi call
      const newUserInfo = await loginapi(user)

      const exUsersArr = userStore.usersLogin
      userStore.$patch({
        currentUsername: newUserInfo.username,
        currentUserId: newUserInfo.id,
        usersLogin: [...exUsersArr, newUserInfo.username],
        isAdmin: false,
        access_token: newUserInfo.access
      })

      resetUser(user, null, inputPwd)

      this.$router.push({ path: '/' })
    }

    function showPassword(e) {
      if (e.target.id === 'toggle_password') {
        const typeEl = inputPwd.value.getAttribute('type')
        if (typeEl === 'password') {
          inputPwd.value.setAttribute('type', 'text')
        } else if (typeEl === 'text') {
          inputPwd.value.setAttribute('type', 'password')
        }
      }
    }

    return {
      email,
      password,
      userStore,
      warningStore,
      inputPwd,
      inputEml,
      handleLogin,
      showPassword
    }
  }
})
</script>

<style scoped>
@media (min-width: 180px) {
  p {
    font-size: calc(12px + 0.5vw);
    padding: 0.25rem 0;
    text-align: center;
    line-height: 1.3;
  }

  .about {
    position: relative;
    height: calc(100vh - 108px);
    display: grid;
    grid-auto-columns: 100%;
    grid-template-rows: 56% 1fr;
  }

  .login_wrapper {
    @apply w-11/12 max-w-lg  border-2 border-solid border-blue-200 rounded-xl;
    position: absolute;
    top: 50%;
    left: 50%;
    height: 30rem;
    padding: 0 1rem;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 4px hsl(240, 2%, 62%);
  }

  .login_title {
    position: relative;
    top: -2rem;
    left: -0.25rem;
    width: 8rem;
    padding: 0.5rem;
    background-color: #fff;
    font-size: calc(30px + 0.3vw);

    font-family: 'Ubuntu Sans', sans-serif;
    font-optical-sizing: auto;
    font-weight: 440;
    font-style: normal;
    font-variation-settings: 'wdth' 100;
  }

  .form_content {
    position: relative;
    top: -1.4rem;
    width: 100%;
    height: 100%;
    display: grid;
    grid-auto-columns: 100%;
    grid-auto-rows: 20% 32% 32% auto;
  }

  .form_control {
    @apply w-full h-auto flex flex-col justify-center text-gray-600 gap-2;
  }

  .input_content {
    @apply border border-solid border-gray-300;
    width: 100%;
    height: 3.2rem;
    text-indent: 10px;
    transform: skewX(-2deg);
    transition: all 600ms ease-in-out;
  }

  .input_content:focus {
    transform: skewX(0deg);
  }

  input[type='submit'] {
    @apply w-full h-auto text-white bg-gray-800 p-2 rounded-lg text-center;
    position: relative;
    top: 0.5rem;
  }

  .load_wrapper {
    position: absolute;
    bottom: 2rem;
    width: 140px;
    height: 70px;
  }

  .loading_msg {
    padding: 0.25rem 1rem;
    animation: load-msg 2.4s ease-in-out infinite;
    @apply text-gray-50 bg-gray-400;
  }
}

@media (min-width: 540px) {
  p {
    font-size: calc(15px + 0.3vw);
  }

  .login_wrapper {
    @apply w-8/12 max-w-lg  border-2 border-solid border-blue-200 rounded-xl;
    height: 28rem;
    padding: 0 1rem;
  }
}
</style>
