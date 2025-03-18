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
            <input
              type="email"
              id="email"
              class="input_content"
              name="email"
              placeholder="Email"
              v-model="user.email"
            />
          </div>
          <div class="form_control">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              class="input_content"
              name="password"
              placeholder="password"
              v-model="user.password"
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
              v-model="user.secret"
              @input="changeType"
            />
          </div>
          <div
            class="form_submit flex justify-center xsm:justify-around items-center"
            @click.prevent="handleLoginAdmin"
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

            <div
              id="warning_msg"
              class="warning_msg absolute bottom-1 w-full h-8 text-red-600 text-center bg-yellow-100"
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
</template>

<script>
import { ref, defineComponent } from 'vue'
import { useUserStore } from '../stores/user'
import { useWarningStore } from '@/stores/warning'
import { loginadminapi } from '@/api/login-api.js'
import {
  populateLocalStorage,
  checkInputError,
  resetUser
} from '@/reusable/collaborate-function.js'

export default defineComponent({
  setup() {
    const user = ref({
      email: '',
      password: '',
      secret: ''
    })

    return { user }
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
    hideShowLogAdmin(label) {
      const userStore = useUserStore()

      userStore.$patch({
        isLogAdminOpen: false,
        miniCustomIsVisible: false,
        customIsVisible: false
      })

      label === 'submit_log'
        ? userStore.updateStateRadio('false', 'true')
        : userStore.updateStateRadio('true', 'false')

      resetUser(this.user, null, null)
    },
    handleLoginAdmin(e) {
      let label
      if (e.target.id === 'cancel_log') {
        label = 'cancel'
      } else if (e.target.id === 'submit_log') {
        label = 'submit'
        this.submithandler(label)
      }

      this.hideShowLogAdmin(label)
    },
    async submithandler(label) {
      const userStore = useUserStore()

      setTimeout(() => {
        userStore.$patch({
          loading: !userStore.loadingState
        })
      }, 5400)

      userStore.$patch({
        loading: !userStore.loadingState
      })

      const isStateWarning = checkInputError(this.user, 'loginadmin')

      if (isStateWarning) {
        return
      }

      const newUserInfo = await loginadminapi(this.user)

      if (newUserInfo === 'null') {
        alert('Bad Authentication ! or Access Disallowed')
      }

      await populateLocalStorage()

      const exUsersArr = userStore.usersLogin

      userStore.$patch({
        currentUsername: newUserInfo.username,
        currentUserId: newUserInfo.id,
        usersLogin: [...exUsersArr, newUserInfo.username],
        access_token: newUserInfo.access,
        isAdmin: true
      })

      this.$router.push({ path: '/' })
    },
    changeType(e) {
      setTimeout(() => {
        e.target.setAttribute('type', 'password')
      }, 8000)
    }
  }
})
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
    text-indent: 10px;
    @apply bg-gray-800;
  }

  .load_wrapper {
    position: absolute;
    bottom: -2rem;
    width: 140px;
    height: 70px;
  }

  .loading_msg {
    padding: 0.25rem 1rem;
    animation: load-msg 2.4s ease-in-out infinite;
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
