<script>
import { ref, defineComponent, nextTick } from "vue";
import { useUserStore } from "@/stores/user.js";
import { useWarningStore } from "@/stores/warning.js";
import { loginapi, loginUpdateTokensFirst } from "../api/login-api.js";
import {
  populateLocalStorage,
  checkInputError,
  resetUserInput,
  updateSessionStorage,
} from "@/reusable/collaborate-function.js";

export default defineComponent({
  setup() {
    const inputPwd = ref(null);
    const user = ref({
      email: "",
      password: "",
    });

    return {
      user,
      inputPwd,
    };
  },

  computed: {
    warningError: function () {
      const warningStore = useWarningStore();
      return warningStore.warningNews;
    },
    warningState: function () {
      const warningStore = useWarningStore();
      return warningStore.warningStage;
    },
    loading: function () {
      const userStore = useUserStore();
      return userStore.loading;
    },
  },

  methods: {
    showPassword(e) {
      if (e.target.id === "toggle_password") {
        const typeEl = this.inputPwd.getAttribute("type");
        if (typeEl === "password") {
          this.inputPwd.setAttribute("type", "text");
        } else if (typeEl === "text") {
          this.inputPwd.setAttribute("type", "password");
        }
      }
    },

    async handleLogin() {
      const userStore = useUserStore();

      userStore.$patch({
        loading: true,
      });

      const isStateWarning = checkInputError(this.user, "login");

      if (isStateWarning) {
        return;
      }
      const userInfoProceed = await loginapi(this.user);

      // console.log("login-view userInfoProceed :", userInfoProceed);

      if (!userInfoProceed.success) {
        // do warning show

        this.toggleWarning(userInfoProceed.error);
        return;
      }

      //loginapi call surely done
      let newUserInfo;
      if (userInfoProceed.message === "update all tokens before sending data") {
        newUserInfo = await loginUpdateTokensFirst(userInfoProceed);
      } else if (userInfoProceed.message === "send data to client side") {
        newUserInfo = userInfoProceed;
      }

      if (newUserInfo.admin) {
        populateLocalStorage();
      }

      let numbersOfPosts = newUserInfo.numberOfPosts;

      if (!numbersOfPosts) {
        numbersOfPosts = 0;
      }

      sessionStorage.setItem("numbers-of-post", numbersOfPosts.toString());

      userStore.$patch({
        numbersofPosts: sessionStorage.getItem("numbers-of-post"),
      });

      updateSessionStorage(newUserInfo);

      setTimeout(() => {
        userStore.$patch({
          loading: false,
        });
      }, 3000);

      await nextTick();

      userStore.$patch({
        navbarState: sessionStorage.getItem("navbar-state"),
      });

      userStore.updateUserStore(newUserInfo);

      resetUserInput(this.user, this.inputPwd);

      await nextTick();

      this.$router.push({ path: "/" });
    },

    toggleWarning(errMsg) {
      const userWarningStore = useWarningStore();

      userWarningStore.warningUpdate(errMsg, this.user);
    },
  },
});
</script>

<template>
  <div
    id="login_page"
    class="login_page grid place-items-center relative w-full h-full px-4 md:px-0"
  >
    <div
      class="login_container grid place-items-center max-w-full h-max md:max-w-xl lg:h-11/12"
    >
      <form
        action=""
        class="login_form w-full h-full flex items-center justify-center"
      >
        <fieldset
          class="fieldset_area flex flex-col w-full gap-4 pt-4 pb-3 px-8"
        >
          <legend
            class="legend_area"
            style="
              width: min-content;

              color: var(--text-body-1);
            "
          >
            Login
          </legend>
          <div class="fieldset_content">
            <div class="field_msg w-full flex flex-col justify-start">
              <p class="expectation_1">
                Read Tech Articles, Discovery and Culture Trends
              </p>
              <p class="expectation_2">
                Enhance Journey to skills the Best of Yourself ¬
              </p>
            </div>
            <div class="input_area">
              <label for="email"> Email</label>
              <input
                type="email"
                id="email"
                class="input_field"
                name="email"
                ref="inputEml"
                placeholder="address_Email"
                focus="true"
                v-model="user.email"
              />
            </div>
            <div class="input_area" @click="showPassword">
              <label for="password"> Password</label>
              <input
                type="password"
                id="password"
                class="input_field password_input"
                name="password"
                min-length="8"
                ref="inputPwd"
                placeholder="Password"
                v-model="user.password"
              />
              <div
                class="pwd_wrap_toggle w-full flex justify-end text-base text-gray-700 font-bold"
              >
                <span
                  id="toggle_password"
                  class="toggle_password cursor-pointer p-1 z-10"
                  >show</span
                >
              </div>
            </div>
            <div class="submit_form my-4">
              <button
                type="submit"
                class="submit_button"
                @click.prevent="handleLogin"
              >
                Login
              </button>

              <div
                class="warning_container absolute left-0 top-5 flex items-center justify-center w-full h-8 mx-auto"
              >
                <div
                  id="warning_msg"
                  class="warning_msg absolute flex items-center justify-end w-2/5"
                  v-if="warningState"
                >
                  <p
                    class="absolute right-16 w-max h-8 py-1 px-4 text-red-600 text-center bg-yellow-400"
                  >
                    {{ warningError }}
                  </p>
                </div>
              </div>

              <div v-if="loading" class="load_wrapper">
                <ul
                  class="loading_content flex justify-center gap-2 justify-center items-center py-2"
                >
                  <li>
                    <span class="loading_msg text-sm"> Please Wait . . .</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";

p {
  font-size: calc(13px + 0.25vw);
  line-height: 26px;
}

p.expectation_1 {
  color: #5f5397;
}

p.expectation_2 {
  font-size: calc(13px + 0.15vw);
  color: var(--text-body-1);
  text-align: right;
}

label {
  color: var(--accent-color-3);
}

.input_area {
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input[type="email"]:focus,
input[type="text"]:focus,
input[type="password"]:focus {
  transform: skewX(0deg);
  box-shadow: 1px 1px 3px var(--brand-text);
  outline: none;
}

button.submit_button[type="submit"] {
  @apply w-full rounded-lg text-center cursor-pointer;
  position: relative;
  top: 0;
  font-size: calc(15px + 0.35vw);
  padding: 0.5em 0;
  margin-top: 0.5rem;
  color: var(--title);
  background-color: var(--card-box);
  transition: all 650ms ease;
}

button.submit_button[type="submit"]:hover {
  background-color: var(--accent-color-1);
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
  .login_page {
    min-height: calc(100vh - 64px);
    background-color: var(--bg-gen);
  }

  .login_container {
    border-radius: 3px;
    /*  border: 1px solid var(--accent-color-1); */
    box-shadow: 0px 0px 2px var(--text-body-1);
  }

  .input_field {
    width: 100%;
    height: 1.9rem;
    margin: 1rem 0;
    color: var(--text-body);
    text-indent: 10px;
    transform: skewX(-2deg);
    border: 1px solid transparent;
    box-shadow: 1px 1px 1px var(--accent-color-3);
    transition: all 600ms ease-in-out;
  }
}
</style>
