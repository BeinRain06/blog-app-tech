<script>
import { ref, defineComponent, nextTick } from "vue";
import { registrationapi } from "../api/registration-api.js";
import { useWarningStore } from "@/stores/warning.js";
import { useUserStore } from "@/stores/user.js";

import {
  populateLocalStorage,
  checkInputError,
  resetUserInput,
  updateSessionStorage,
} from "@/reusable/collaborate-function.js";

export default defineComponent({
  setup() {
    const user = ref({
      email: "",
      username: "",
      password: "",
      confirm_password: "",
      custom: "",
    });

    return {
      user,
    };
  },

  computed: {
    warningState: () => {
      const warningStore = useWarningStore();
      const stage = warningStore.warningStage;
      return stage;
    },
    warningError: () => {
      const warningStore = useWarningStore();
      const msgWarn = warningStore.warningNews;
      return msgWarn;
    },
    loading: () => {
      const userStore = useUserStore();
      return userStore.loading;
    },
  },

  methods: {
    changeType(e) {
      setTimeout(() => {
        e.target.setAttribute("type", "password");
      }, 15000);
    },
    async handleRegistration() {
      const userStore = useUserStore();

      console.log("userStore :", userStore);
      setTimeout(() => {
        userStore.$patch({
          loading: true,
        });
      }, 4000);

      checkInputError(this.user, "register");

      const newUserInfo = await registrationapi(this.user);

      if (newUserInfo === null) {
        const warningStore = useWarningStore();

        warningStore.warningUpdate("this user already exist!", this.user);
        return;
      }

      userStore.$patch({
        loading: false,
      });

      await updateSessionStorage(newUserInfo);

      userStore.$patch({
        navbarState: sessionStorage.getItem("navbar-state"),
      });

      userStore.updateUserStore(newUserInfo);

      resetUserInput(this.user, null);

      await nextTick();

      this.$router.push({ path: "/" });
    },
  },
});
</script>

<template>
  <div
    id="register_page"
    class="register_page grid place-items-center relative w-full h-full px-4 md:px-0"
  >
    <div
      class="register_container grid place-items-center max-w-full h-max md:max-w-xl lg:h-11/12"
    >
      <form
        action=""
        class="register_form w-full h-full flex items-center justify-center"
        autocomplete="off"
      >
        <fieldset
          class="fieldset_area flex flex-col w-full gap-4 pt-4 pb-8 px-8"
        >
          <legend
            class="legend_area pt-2"
            style="
              width: min-content;

              color: var(--text-body-1);
            "
          >
            Register
          </legend>
          <div class="fieldset_content">
            <div class="field_msg w-full flex flex-col justify-start">
              <p class="expectation_1">
                Board Featurings Tech Articles, Culture and New Discovery
              </p>
              <p class="expectation_2">
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
              placeholder="username"
              autocomplete="off"
              v-model="user.username"
            />
          </div>
          <div class="input_area">
            <label for="email" class="label_area">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              class="input_field"
              placeholder="address_Email"
              v-model="user.email"
            />
          </div>
          <div class="input_area">
            <label for="password" class="label_area">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              class="input_field"
              placeholder="Password"
              v-model="user.password"
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
              placeholder="Confirm Password"
              v-model="user.confirm_password"
            />
          </div>
          <div class="submit_form my-4">
            <button
              type="submit"
              class="submit_button"
              @click.prevent="handleRegistration"
            >
              Register
            </button>

            <div
              id="warning_msg"
              class="warning_msg absolute top-2 w-full h-8 text-red-600 text-center bg-yellow-100"
              v-if="warningState"
            >
              <p>{{ warningError }}</p>
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input[type="email"]:focus,
input[type="text"]:focus,
input[type="password"]:focus {
  height: auto;
  transform: skewX(0deg);
  box-shadow: 0px 1px 3px var(--accent-color-2);
  outline: none;
}

button.submit_button[type="submit"] {
  @apply w-full bg-gray-800 rounded-lg text-center cursor-pointer;
  position: relative;
  top: 0;
  font-size: calc(15px + 0.35vw);
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
  .register_page {
    min-height: calc(100vh - 64px);
    background-color: var(--bg-gen);
  }

  .register_container {
    border-radius: 3px;
    border: 1px solid var(--accent-color-1);
  }

  .input_field {
    width: 100%;
    height: 1.8rem;
    color: var(--text-body);
    text-indent: 10px;
    transform: skewX(-2deg);
    border: 1px solid transparent;
    box-shadow: 1px 1px 2px var(--accent-color-1);
    transition: all 600ms ease-in-out;
  }
}
</style>
