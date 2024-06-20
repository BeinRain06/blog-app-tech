<template>
  <div class="register w-full">
    <div class="upper_wrapper w-full"></div>
    <div class="lower_wrapper w-full h-full bg-gray-300"></div>
    <div class="register_wrapper">
      <form action="" class="register_form h-full">
        <fieldset class="fieldset_area h-full">
          <legend class="register_title">Register</legend>
          <div class="form_content">
            <div class="field_msg w-full flex flex-col justify-start pl-2">
              <p class="text-blue-800">Board Featurings Tech Articles, Culture and New Discovery</p>
              <p class="text-green-500">Meets New Expectations on Daily Basis ¬!</p>
            </div>
            <div class="form_control">
              <label for="email"> Email</label>
              <input
                type="email"
                id="email"
                class="input_content"
                name="email"
                placeholder="address_Email"
                focus
                v-model="user.email"
              />
            </div>
            <div class="form_control">
              <label for="username"> Username</label>
              <input
                type="text"
                id="username"
                class="input_content"
                name="username"
                placeholder="username"
                focus
                v-model="user.username"
              />
            </div>
            <div class="form_control">
              <label for="password"> Password</label>
              <input
                type="password"
                id="password"
                class="input_content"
                name="password"
                min-length="8"
                placeholder="Password"
                v-model="user.password"
              />
            </div>
            <div class="form_control">
              <label for="confirm_password">Confirm Password</label>
              <input
                type="password"
                id="confirm_password"
                class="input_content"
                name="confirm_password"
                min-length="8"
                placeholder="Confirm Password"
                v-model="user.confirm_password"
              />
            </div>
            <div class="form_custom">
              <ul class="label_custom w-full flex justify-center items-center py-2 gap-2">
                <label for="checkbox" class="pr-2"> Custom (Optional-retriever password) </label>
                <input
                  type="checkbox"
                  class="z-10"
                  id="checkbox"
                  v-model="checked"
                  @click="changeMsg"
                />
              </ul>
              <input
                type="text"
                id="custom"
                class="input_content"
                name="custom"
                min-length="8"
                placeholder="Custom"
                v-model="user.custom"
                :disabled="!checked"
                @input="changeType"
              />
            </div>
            <div class="form_submit relative">
              <input
                type="button"
                id="btn_identity"
                class="btn_identity cursor-pointer"
                value="register"
                @click.prevent="handleRegistration"
              />
              <div
                id="warning_msg"
                class="warning_msg absolute top-2 w-full h-8 text-red-600 text-center bg-yellow-100"
                v-if="warningUpStage"
              >
                <p>{{ warningUpMsg }}</p>
              </div>

              <div v-if="loadingStage" class="load_wrapper">
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
import { registrationapi } from '../api/registration-api.js'
import { useWarningStore } from '@/stores/warning.js'
import { useUserStore } from '@/stores/user.js'
import {
  populateLocalStorage,
  checkInputError,
  resetUser
} from '@/reusable/collaborate-function.js'

export default defineComponent({
  setup() {
    const checked = ref(false)
    const user = ref({
      email: '',
      username: '',
      password: '',
      confirm_password: '',
      custom: ''
    })
    let msg = ref('toggle me')

    return {
      checked,
      user,
      msg
    }
  },

  computed: {
    warningUpStage: () => {
      const warningStore = useWarningStore()
      const stage = warningStore.warningStage
      return stage
    },
    warningUpMsg: () => {
      const warningStore = useWarningStore()
      const msgWarn = warningStore.warningNews
      return msgWarn
    },
    loadingStage: () => {
      const userStore = useUserStore()
      return userStore.loadingState
    }
  },

  methods: {
    changeMsg() {
      this.msg = 'you got i-t!'
    },
    changeType(e) {
      setTimeout(() => {
        e.target.setAttribute('type', 'password')
      }, 15000)
    },
    async handleRegistration() {
      const userStore = useUserStore()

      setTimeout(() => {
        userStore.$patch({
          loading: !userStore.loadingState
        })
      }, 5400)

      checkInputError(this.user, 'register')

      const collectedData = await registrationapi(this.user)

      if (collectedData === null) {
        const warningStore = useWarningStore()

        warningStore.warningUpdate('this user already exist!', this.user)
        return
      }

      userStore.$patch({
        loading: !userStore.loadingState
      })

      const newUser = collectedData.username

      userStore.usersLists(newUser)

      userStore.$patch({
        currentUsername: newUser,
        currentUserId: collectedData.userId,
        access_token: collectedData.access,
        isAdmin: collectedData.admin
      })

      if (collectedData.admin) {
        await populateLocalStorage()
      }

      resetUser(this.user, this.checked, null)

      this.$router.push({ path: '/' })
    }
  }
})
</script>

<style scoped>
@media (min-width: 180px) {
  .lower_wrapper {
    z-index: -2;
  }
  p {
    padding: 0.25rem 0;
    text-align: center;
    line-height: 1.3;
    font-size: calc(12px + 0.5vw);
  }

  .register {
    position: relative;
    height: calc(110vh);
    display: grid;
    grid-auto-columns: 100%;
    grid-template-rows: 56% 1fr;
  }

  .register_wrapper {
    @apply w-11/12 max-w-lg  border-2 border-solid border-blue-200 rounded-xl;
    position: absolute;
    top: 50%;
    left: 50%;
    height: 38rem;
    padding: 0 1rem;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 4px hsl(240, 2%, 62%);
  }

  .register_title {
    position: relative;
    top: -2rem;
    left: -0.25rem;
    width: 8rem;
    padding: 0.5rem;
    background-color: #fff;
    font-size: calc(27px + 0.3vw);

    font-family: 'Ubuntu Sans', sans-serif;
    font-optical-sizing: auto;
    font-weight: 440;
    font-style: normal;
    font-variation-settings: 'wdth' 100;
  }

  .field_msg {
    display: none;
  }

  .form_content {
    position: relative;
    top: -1.4rem;
    width: 100%;
    height: 100%;
    display: grid;
    grid-auto-columns: 100%;
    grid-auto-rows: 15% 15% 15% 15% 26% 14% auto;
  }

  .form_control,
  .form_custom {
    @apply w-full h-auto flex flex-col justify-center text-gray-600 gap-2;
  }

  .input_content {
    @apply border border-solid border-gray-300;
    width: 100%;
    height: 2.1rem;
    text-indent: 10px;
    transform: skewX(-2deg);
    transition: all 600ms ease-in-out;
  }

  .input_content:focus {
    transform: skewX(0deg);
  }

  input[type='checkbox'] {
    width: 14px;
    height: 14px;
    z-index: 5;
    opacity: 0.5;
  }

  input[type='checkbox']:checked {
    opacity: 1;
  }

  input[type='button'] {
    @apply w-full h-auto text-white bg-gray-800 p-2 rounded-lg text-center;
    position: relative;
    top: 1.35rem;
  }

  .load_wrapper {
    position: absolute;
    top: -0.5rem;
    width: 140px;
    height: 70px;
  }

  .loading_msg {
    padding: 0.25rem 1rem;
    animation: load-msg 2.4s ease-in-out infinite;
  }

  @keyframes load-msg {
    0% {
      color: white;
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.1);
    }

    100% {
      color: #f4f4f4;
      opacity: 0.5;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}

@media (min-width: 240px) {
  .register {
    height: calc(134vh);
  }

  .register_wrapper {
    height: 48rem;
  }

  .field_msg {
    display: block;
  }

  .form_content {
    grid-auto-rows: 14% 14% 14% 14% 14% 16% auto;
  }

  .input_content {
    height: 2.8rem;
  }

  input[type='button'] {
    top: 2.25rem;
  }
}

@media (min-width: 540px) {
  p {
    width: calc(100% - 5px);
    font-size: calc(15px + 0.3vw);
  }

  .register {
    height: calc(140vh);
  }

  .register_wrapper {
    @apply w-8/12 max-w-lg  border-2 border-solid border-blue-200 rounded-xl;
    height: 50rem;
    padding: 0 1rem;
  }

  .register_title {
    font-size: calc(30px + 0.3vw);
  }
}
</style>
