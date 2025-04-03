<script>
import { ref, defineComponent } from "vue";
import { registrationapi } from "../api/registration-api.js";
import { useWarningStore } from "@/stores/warning.js";
import { useUserStore } from "@/stores/user.js";
import {
  populateLocalStorage,
  checkInputError,
  resetUser,
} from "@/reusable/collaborate-function.js";

export default defineComponent({
  setup() {
    const checked = ref(false);
    const user = ref({
      email: "",
      username: "",
      password: "",
      confirm_password: "",
      custom: "",
    });
    let msg = ref("toggle me");

    return {
      checked,
      user,
      msg,
    };
  },

  computed: {
    warningUpStage: () => {
      const warningStore = useWarningStore();
      const stage = warningStore.warningStage;
      return stage;
    },
    warningUpMsg: () => {
      const warningStore = useWarningStore();
      const msgWarn = warningStore.warningNews;
      return msgWarn;
    },
    loadingStage: () => {
      const userStore = useUserStore();
      return userStore.loadingState;
    },
  },

  methods: {
    changeMsg() {
      this.msg = "you got i-t!";
    },
    changeType(e) {
      setTimeout(() => {
        e.target.setAttribute("type", "password");
      }, 15000);
    },
    async handleRegistration() {
      const userStore = useUserStore();

      setTimeout(() => {
        userStore.$patch({
          loading: !userStore.loadingState,
        });
      }, 5400);

      checkInputError(this.user, "register");

      const collectedData = await registrationapi(this.user);

      if (collectedData === null) {
        const warningStore = useWarningStore();

        warningStore.warningUpdate("this user already exist!", this.user);
        return;
      }

      userStore.$patch({
        loading: !userStore.loadingState,
      });

      const newUser = collectedData.username;

      userStore.usersLists(newUser);

      userStore.$patch({
        currentUsername: newUser,
        currentUserId: collectedData.userId,
        access_token: collectedData.access,
        isAdmin: collectedData.admin,
      });

      if (collectedData.admin) {
        await populateLocalStorage();
      }

      resetUser(this.user, this.checked, null);

      this.$router.push({ path: "/" });
    },
  },
});
</script>

<template>
  <div
    id="register_page"
    class="register_page grid place-items-center relative w-full h-full"
  >
    <div
      class="register_container grid place-items-center max-w-full h-full md:max-w-xl lg:h-11/12"
    >
      <form
        action=""
        class="register_form w-full h-full flex items-center justify-center"
      >
        <fieldset class="fieldset_area flex flex-col w-full gap-4 p-4">
          <legend
            class="legend_area"
            style="
              width: min-content;

              color: var(--text-body-1);
            "
          >
            Register
          </legend>
          <div class="fieldset_content">
            <div class="field_msg w-full flex flex-col justify-start">
              <p style="color: #5f5397">
                Board Featurings Tech Articles, Culture and New Discovery
              </p>
              <p style="color: var(--text-body-1)">
                Meets New Expectations on Daily Basis ¬!
              </p>
            </div>
          </div>
          <div class="input_area">
            <label for="username" class="label_area">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              class="input_field"
            />
          </div>
          <div class="input_area">
            <label for="email" class="label_area">Email</label>
            <input type="email" id="email" name="email" class="input_field" />
          </div>
          <div class="input_area">
            <label for="password" class="label_area">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              class="input_field"
            />
          </div>
          <div class="input_area">
            <label for="confirm_password" class="label_area"
              >Confirm Password</label
            >
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              class="input_field"
            />
          </div>
          <div class="submit_form my-4">
            <button type="submit" class="submit_button">Register</button>

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
                <li>
                  <span class="loading_msg text-sm"> Please Wait . . .</span>
                </li>
              </ul>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>
<style scoped>
@import "tailwindcss";

.register_page {
  height: calc(100vh - 64px);
  background-color: var(--bg-gen);
}

label {
  color: var(--accent-color-3);
}

.input_area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input[type="email"]:focus,
input[type="text"]:focus,
input[type="password"]:focus {
  transform: skewX(0deg);
  box-shadow: 0px 1px 3px var(--accent-color-2);
  outline: none;
}

button[type="submit"] {
  @apply w-full bg-gray-800 rounded-lg text-center;
  position: relative;
  top: 0;
  font-size: calc(16px + 0.3vw);
  padding: 0.5em 0;
  color: var(--title);
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

@media (min-width: 180px) {
  .input_field {
    width: 100%;
    height: 1.9rem;
    color: var(--text-body);
    text-indent: 10px;
    transform: skewX(-2deg);
    border: 1px solid transparent;
    box-shadow: 0px 1px 5px var(--title);
    transition: all 600ms ease-in-out;
  }

  .register_container {
    border-radius: 3px;
    border: 1px solid var(--text-body-1);
    background-color: var(--);
  }
}

@media (min-width: 1045px) {
}
</style>
