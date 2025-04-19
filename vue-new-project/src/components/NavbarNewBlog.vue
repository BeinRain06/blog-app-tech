<script setup>
import {
  ref,
  reactive,
  onMounted,
  computed,
  useTemplateRef,
  watch,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia"; // really useful to get pinia reactive state almost instantly
import { format } from "date-fns";
import { useUserStore } from "../stores/user";
import { useWarningStore } from "../stores/warning";
import { loginadminapi } from "../api/login-api";
import { logoutapi } from "../api/logout-api";
import {
  shortNameUser,
  updateSessionStorage,
} from "../reusable/collaborate-function";

const userStore = useUserStore();
const { navbarState } = storeToRefs(userStore);

const closeBoxProfile = defineModel();

const router = useRouter();

const userSecret = reactive({
  mob: "",
  desk: "",
});

const navSelect = ref("logout");

const navLogoutRef = useTemplateRef("nav-logout");
const navLoginRef = useTemplateRef("nav-login");
const navLoginAdminRef = useTemplateRef("nav-login-admin");

const today = ref("");

onMounted(async () => {
  await mountNavBar();

  today.value = format(new Date(), "eee, dd MMM");

  function mountNavBar() {
    const userStore = useUserStore();
    const checkPrevNav = sessionStorage.getItem("navbar-state");
    if (checkPrevNav) {
      userStore.$patch({ navbarState: checkPrevNav });
    } else {
      userStore.$patch({ navbarState: "logout" });
    }
  }
});

watch(navbarState, async () => {
  // console.log("navbarState in watch", navbarState);

  switch (navbarState.value) {
    case "logout":
      navSelect.value = "logout";
      break;
    case "standard":
      navSelect.value = "standard";

      break;
    case "admin":
      navSelect.value = "admin";
      break;
    default:
      throw new Error("Error Commutating NavState");
  }
});
const navStatus = computed(() => {
  return navSelect.value;
});
const shortName = computed(() => {
  const userStore = useUserStore();

  const { currentUsername } = storeToRefs(userStore);
  const shortNameCase = currentUsername.value;

  let usernameFetch = sessionStorage.getItem("username");

  let shortCalled = !usernameFetch
    ? shortNameUser(shortNameCase)
    : shortNameUser(usernameFetch);

  return shortCalled;
});

const numberOfPosts = computed(() => {
  const userStore = useUserStore();
  return userStore.numbersofPosts;
});

const modeScene = computed(() => {
  const userStore = useUserStore();
  return userStore.lightMode;
});

const warningMsg = computed(() => {
  const warningStore = useWarningStore();
  return warningStore.warningNews;
});

const topicRefZero = useTemplateRef("topic-ref-0");
const topicRef = useTemplateRef("topic-ref");
const sourceRef = useTemplateRef("source-ref");
const profileRef = useTemplateRef("profile-ref");
const profileRefZero = useTemplateRef("profile-ref-0");

const sourceMobRef = useTemplateRef("source-mob-ref");
const topicMobRef = useTemplateRef("topic-mob-ref");

const adminShowDesk = useTemplateRef("admin-toggle-desk");
const adminShowMob = useTemplateRef("admin-toggle-mob");

watch(closeBoxProfile, async () => {
  if (closeBoxProfile.value === true) {
    function watchReset() {
      profileRef.value?.children[1].setAttribute("data-arrow", "down");
      if (topicRefZero)
        topicRefZero.value?.children[1].setAttribute("data-arrow", "down");
      if (topicRef)
        topicRef.value?.children[1].setAttribute("data-arrow", "down");
      if (sourceRef)
        sourceRef.value?.children[1].setAttribute("data-arrow", "down");
    }

    await watchReset();
  }

  setTimeout(() => {
    closeBoxProfile.value = false;
  }, 2000);
});

const handleModalContainer = (e) => {
  switchPosAngleArrow(e);

  if (topicRef && sourceRef) {
    const parentLi = e.currentTarget.closest(".nav_link");

    if (parentLi.getAttribute("id") === "topic") {
      sourceRef.value.children[1].setAttribute("data-arrow", "down");
    } else if (parentLi.getAttribute("id") === "source") {
      topicRef.value.children[1].setAttribute("data-arrow", "down");
    }
  }
};

const handleMobModalContainer = (e) => {
  switchPosAngleArrow(e);

  if (topicMobRef && sourceMobRef) {
    const parentLi = e.currentTarget.closest(".menu_link");

    if (parentLi.getAttribute("id") === "topic") {
      sourceMobRef.value.children[1].setAttribute("data-arrow", "down");
    } else if (parentLi.getAttribute("id") === "source") {
      topicMobRef.value.children[1].setAttribute("data-arrow", "down");
    }
  }
};

const handleModalProfile = (e) => {
  e.preventDefault();
  // console.log("--handle modal profile-- e.currentTarget :", e.currentTarget);

  switchPosAngleArrow(e);

  if (topicRefZero.value) {
    if (topicRefZero.value.children[1].getAttribute("data-arrow") === "up") {
      topicRefZero.value.children[1].setAttribute("data-arrow", "down");
    }
  }

  if (topicRef.value && sourceRef.value) {
    if (topicRef.value.children[1].getAttribute("data-arrow") === "up") {
      topicRef.value.children[1].setAttribute("data-arrow", "down");
    }

    if (sourceRef.value.children[1].getAttribute("data-arrow") === "up") {
      sourceRef.value.children[1].setAttribute("data-arrow", "down");
    }
  }
};

const switchPosAngleArrow = (e) => {
  const arrowPos =
    e.currentTarget.getAttribute("data-arrow") === "down" ? false : true;

  if (arrowPos) {
    e.currentTarget.setAttribute("data-arrow", "down");
  } else {
    closeBoxProfile.value = false;
    e.currentTarget.setAttribute("data-arrow", "up");
  }
};

const togglerBoxAdmin = (type) => {
  if (type === "toggle") {
    adminShowDesk.value?.classList.toggle("secret_entry");
    adminShowMob.value?.classList.toggle("secret_entry");
  } else if (type === "remove") {
    adminShowDesk.value?.classList.remove("secret_entry");
    adminShowMob.value?.classList.remove("secret_entry");
  }
};

const handleLoginAdmin = async (media) => {
  const userStore = useUserStore();
  const warningStore = useWarningStore();

  const saveMedia = media === "desktop" ? userSecret.desk : userSecret.mob;

  const user = {
    userId: userStore.currentUserId,
    userName: userStore.currentUsername,
    secret: saveMedia,
  };

  if (!user.userId) {
    user.userId = sessionStorage.getItem("userid");
    user.userName = sessionStorage.getItem("username");
  }

  const newUserInfo = await loginadminapi(user);

  // console.log("navblog --newUserInfo-- :", newUserInfo);

  await updateSessionStorage(newUserInfo);

  userStore.$patch({
    navbarState: sessionStorage.getItem("navbar-state"),
  });
  userStore.updateUserStore(newUserInfo);

  togglerBoxAdmin("remove");

  await nextTick();

  setTimeout(() => {
    if (profileRefZero)
      profileRefZero.value?.children[1].setAttribute("data-arrow", "down");
    if (profileRef)
      profileRef.value?.children[1].setAttribute("data-arrow", "down");
  }, 3000);
};

const handleLogout = async () => {
  const userStore = useUserStore();
  const userName = await logoutapi();

  if (userName) {
    userStore.resetUserData(userName);
  }
  router.push({ name: "home" });

  navLogoutRef.value?.classList.remove("hidden");

  await resetStorage();

  await nextTick();
};

const handleModalMenu = (e) => {
  e.currentTarget.classList.toggle("active_menu");

  if (!e.target.classlList.contains("active_menu")) {
    if (adminShowDesk) adminShowDesk.value.classList.remove("secret_entry");
    if (adminShowMob) adminShowMob.value.classList.remove("secret_entry");
  }
};

const redirectPost = (label) => {
  const userId = sessionStorage.getItem("userid");

  if (label === "create") {
    router.push(`/create/${userId}`);
  } else {
    router.push(`/edit/${userId}`);
  }
};

const redirectToCredentials = (e, label) => {
  e.stopPropagation();

  if (label === "login") {
    router.push({ name: "login" });
  } else if (label === "register") {
    router.push({ name: "register" });
  }
};

const resetStorage = () => {
  sessionStorage.setItem("username", "");
  sessionStorage.setItem("navbar-state", "logout");
};

const handleResetNav = (e) => {
  const thisTarget = e.target;

  // console.log("thisTarget :", e.target);

  if (topicRefZero) {
    profileRef.value?.children[1].setAttribute("data-arrow", "down");
  }

  const sideReview = {
    logo:
      thisTarget.closest("#logo_brand_standard.search_nav_container") ||
      thisTarget.closest("#logo_brand_admin.search_nav_container"),
    search:
      thisTarget.closest("#search_link_standard.search_nav_container") ||
      thisTarget.closest("#search_link_admin.search_nav_container"),
    link:
      thisTarget.closest("#profile_user_standard.nav_link") ||
      thisTarget.closest("#profile_user.nav_link"),
    light:
      thisTarget.closest("#mode_light_standard.mode_light_container") ||
      thisTarget.closest("#mode_light_admin.mode_light_container"),
  };

  if (sideReview.logo || sideReview.search || sideReview.light) {
    profileRefZero.value?.children[1].setAttribute("data-arrow", "down");
    profileRef.value?.children[1].setAttribute("data-arrow", "down");
    topicRefZero.value?.children[1].setAttribute("data-arrow", "down");
    topicRef.value?.children[1].setAttribute("data-arrow", "down");
    sourceRef.value?.children[1].setAttribute("data-arrow", "down");
  }

  if (!e.target.closest("li#profile_user_standard")) {
    profileRefZero.value?.children[1].setAttribute("data-arrow", "down");
    profileRef.value?.children[1].setAttribute("data-arrow", "down");
    togglerBoxAdmin("remove");
  }

  if (e.target.parentElement.getAttribute("id") === "user_admin") {
    togglerBoxAdmin("remove");
  }
};
</script>
<template>
  <header id="nav_header">
    <!--navbar no-login-->
    <nav
      class="nav_container flex items-center z-30 w-full h-16 relative my-0"
      v-if="navStatus === 'logout'"
    >
      <div
        class="nav_space_fit flex items-center justify-between md:justify-center flex-1 h-7 lg:px-12 mx-4 lg:mx-0 gap-x-4"
        ref="nav-logout"
      >
        <div
          class="nav_logo_container flex items-center flex-1 text-sm md:text-lg"
        >
          <img
            alt="logo brand"
            class="brand_image"
            src="@/assets/content-svgrepo-com.svg"
          />
          <RouterLink class="btn brand_text" to="/">
            <div class="text-base sm:text-xl md:text-2xl">
              Bl<span style="color: #905149">o</span>gPan<span
                style="color: var(--accent-color-1)"
                >i</span
              >a
            </div>
          </RouterLink>
        </div>

        <button
          type="button"
          class="search_nav_container flex-1 hidden md:flex items-center h-full px-4 py-4"
        >
          <div
            class="search_nav_entry w-full h-full flex items-center justify-between"
          >
            <div class="search_indicator text-sm">Search ...</div>
            <i class="icon_nav_search grid place-items-center"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <!-- Icon from All by undefined - undefined -->
                <path
                  fill="#737276"
                  d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"
                />
              </svg>
            </i>
          </div>
        </button>

        <div
          class="nav_control_wrap flex-1 flex items-center justify-end gap-x-4"
        >
          <div
            class="nav_control_mob w-16 h-full flex items-center justify-end md:hidden"
          >
            <button
              type="button"
              class="search_nav_container flex items-center flex-shrink-0"
            >
              <div
                class="search_nav_entry w-full h-full flex items-center justify-center"
              >
                <i class="icon_nav_search grid place-items-center"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <!-- Icon from All by undefined - undefined -->
                    <path
                      fill="#737276"
                      d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"
                    />
                  </svg>
                </i>
              </div>
            </button>

            <div class="menu_wrap z-10 ml-4">
              <div
                class="menu_tool grid place-items-center rounded h-7 relative"
                style="width: 1.75rem"
              >
                <div
                  id="menu_toggler"
                  class="absolute grid place-items-center w-full h-full cursor-pointer"
                ></div>

                <div
                  class="menu_play absolute grid place-items-center w-full h-full relative"
                >
                  <div
                    class="menu_symbol grid place-items-center w-full h-full relative"
                    @click="(e) => handleModalMenu(e)"
                  >
                    <div class="menu_bar"></div>
                  </div>
                  <!--modal container-->
                  <div class="modal_container absolute w-screen px-2 pb-1">
                    <ul
                      class="modal_content flex flex-col w-full space-y-4"
                      style="font-size: 1em; color: var(--text-link)"
                    >
                      <li
                        id="user_name"
                        class="menu_link flex items-center w-full h-10 py-1"
                      >
                        <a
                          href="#"
                          class="profile_link"
                          style="color: var(--accent-color-11)"
                          >MitNews</a
                        >
                        <div
                          id="mode_light_standard"
                          class="mode_light_container flex-1 flex items-center justify-end"
                        >
                          <div
                            class="mode_switch_box grid place-items-center w-8 h-8 p-1 relative"
                            :data-mode="modeScene"
                          >
                            <div
                              id="dark_box"
                              class="dark_box w-full h-full absolute grid place-items-center"
                              style="color: var(--title)"
                            >
                              <i class="icon_mode"
                                ><svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                >
                                  <!-- Icon from All by undefined - undefined -->
                                  <g fill="currentColor" fill-opacity="0">
                                    <path
                                      d="M15.22 6.03l2.53 -1.94l-3.19 -0.09l-1.06 -3l-1.06 3l-3.19 0.09l2.53 1.94l-0.91 3.06l2.63 -1.81l2.63 1.81l-0.91 -3.06Z"
                                    >
                                      <animate
                                        fill="freeze"
                                        attributeName="fill-opacity"
                                        begin="0.7s"
                                        dur="0.4s"
                                        values="0;1"
                                      />
                                    </path>
                                    <path
                                      d="M19.61 12.25l1.64 -1.25l-2.06 -0.05l-0.69 -1.95l-0.69 1.95l-2.06 0.05l1.64 1.25l-0.59 1.98l1.7 -1.17l1.7 1.17l-0.59 -1.98Z"
                                    >
                                      <animate
                                        fill="freeze"
                                        attributeName="fill-opacity"
                                        begin="1.1s"
                                        dur="0.4s"
                                        values="0;1"
                                      />
                                    </path>
                                  </g>
                                  <path
                                    fill="currentColor"
                                    fill-opacity="0"
                                    stroke="currentColor"
                                    stroke-dasharray="56"
                                    stroke-dashoffset="56"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M7 6c0 6.08 4.92 11 11 11c0.53 0 1.05 -0.04 1.56 -0.11c-1.61 2.47 -4.39 4.11 -7.56 4.11c-4.97 0 -9 -4.03 -9 -9c0 -3.17 1.64 -5.95 4.11 -7.56c-0.07 0.51 -0.11 1.03 -0.11 1.56Z"
                                  >
                                    <animate
                                      fill="freeze"
                                      attributeName="fill-opacity"
                                      begin="1.5s"
                                      dur="0.15s"
                                      values="0;0.3"
                                    />
                                    <animate
                                      fill="freeze"
                                      attributeName="stroke-dashoffset"
                                      dur="0.6s"
                                      values="56;0"
                                    />
                                  </path>
                                </svg>
                              </i>
                            </div>
                            <div
                              id="light_box"
                              class="light_box w-full h-full absolute grid place-items-center"
                              style="color: var(--title)"
                            >
                              <i class="icon_mode"
                                ><svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                >
                                  <!-- Icon from All by undefined - undefined -->
                                  <path
                                    fill="currentColor"
                                    d="M4 13.75H2q-.425 0-.712-.288T1 12.75t.288-.712T2 11.75h2q.425 0 .713.288T5 12.75t-.288.713T4 13.75M7.05 7.8q-.275.275-.7.275t-.7-.275L4.225 6.375q-.3-.3-.3-.7t.3-.7q.3-.275.7-.288t.7.288L7.05 6.4q.275.275.288.687T7.05 7.8M6 19q-.525 0-.887-.363t-.363-.887t.363-.888T6 16.5t.888.363t.362.887t-.363.888T6 19m6-9.25q-1.25 0-2.125.875T9 12.75q0 .425-.288.713T8 13.75t-.712-.288T7 12.75q0-2.075 1.463-3.537T12 7.75t3.538 1.463T17 12.75q0 .425-.288.713T16 13.75t-.712-.288T15 12.75q0-1.25-.875-2.125T12 9.75M9 23q-.525 0-.888-.363t-.362-.887t.363-.888T9 20.5t.888.363t.362.887t-.363.888T9 23m3-4q-.525 0-.888-.363t-.362-.887t.363-.888T12 16.5t.888.363t.362.887t-.363.888T12 19m0-13.25q-.425 0-.712-.288T11 4.75v-2q0-.425.288-.712T12 1.75t.713.288t.287.712v2q0 .425-.288.713T12 5.75M15 23q-.525 0-.888-.363t-.362-.887t.363-.888T15 20.5t.888.363t.362.887t-.363.888T15 23m1.95-15.2q-.3-.3-.3-.7t.3-.7l1.425-1.425q.275-.275.688-.288t.712.288q.275.275.275.7t-.275.7L18.35 7.8q-.275.275-.687.275T16.95 7.8M18 19q-.525 0-.888-.363t-.362-.887t.363-.888T18 16.5t.888.363t.362.887t-.363.888T18 19m2-5.25q-.425 0-.712-.288T19 12.75t.288-.712t.712-.288h2q.425 0 .713.288t.287.712t-.288.713t-.712.287zm-8 0"
                                  />
                                </svg>
                              </i>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li
                        id="login_mob"
                        class="menu_link flex items-center w-full h-10 py-1"
                      >
                        <a
                          class="profile_link"
                          @click="(e) => redirectToCredentials(e, 'login')"
                          >login</a
                        >
                      </li>
                      <li id="register_mob">
                        <a
                          class="profile_link"
                          style="text-decoration: underline"
                          @click="(e) => redirectToCredentials(e, 'register')"
                          >register</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="nav_control_desk relative hidden md:flex items-center"
            data-admin="false"
          >
            <ul
              class="nav-right_panel absolute w-5/6 flex items-center justify-end"
            >
              <li id="login" class="nav_link">
                <a @click="(e) => redirectToCredentials(e, 'login')">Login</a>
              </li>
              <li id="register" class="nav_link">
                <a @click="(e) => redirectToCredentials(e, 'register')"
                  >Register</a
                >
              </li>
            </ul>

            <div
              class="mode_light_container flex-1 flex items-center justify-end"
            >
              <div
                class="mode_switch_box grid place-items-center w-8 h-8 p-1 relative"
                :data-mode="modeScene"
              >
                <div
                  id="dark_box"
                  class="dark_box w-full h-full absolute grid place-items-center"
                  style="color: var(--title)"
                >
                  <i class="icon_mode"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                    >
                      <!-- Icon from All by undefined - undefined -->
                      <g fill="currentColor" fill-opacity="0">
                        <path
                          d="M15.22 6.03l2.53 -1.94l-3.19 -0.09l-1.06 -3l-1.06 3l-3.19 0.09l2.53 1.94l-0.91 3.06l2.63 -1.81l2.63 1.81l-0.91 -3.06Z"
                        >
                          <animate
                            fill="freeze"
                            attributeName="fill-opacity"
                            begin="0.7s"
                            dur="0.4s"
                            values="0;1"
                          />
                        </path>
                        <path
                          d="M19.61 12.25l1.64 -1.25l-2.06 -0.05l-0.69 -1.95l-0.69 1.95l-2.06 0.05l1.64 1.25l-0.59 1.98l1.7 -1.17l1.7 1.17l-0.59 -1.98Z"
                        >
                          <animate
                            fill="freeze"
                            attributeName="fill-opacity"
                            begin="1.1s"
                            dur="0.4s"
                            values="0;1"
                          />
                        </path>
                      </g>
                      <path
                        fill="currentColor"
                        fill-opacity="0"
                        stroke="currentColor"
                        stroke-dasharray="56"
                        stroke-dashoffset="56"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 6c0 6.08 4.92 11 11 11c0.53 0 1.05 -0.04 1.56 -0.11c-1.61 2.47 -4.39 4.11 -7.56 4.11c-4.97 0 -9 -4.03 -9 -9c0 -3.17 1.64 -5.95 4.11 -7.56c-0.07 0.51 -0.11 1.03 -0.11 1.56Z"
                      >
                        <animate
                          fill="freeze"
                          attributeName="fill-opacity"
                          begin="1.5s"
                          dur="0.15s"
                          values="0;0.3"
                        />
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          dur="0.6s"
                          values="56;0"
                        />
                      </path>
                    </svg>
                  </i>
                </div>
                <div
                  id="light_box"
                  class="light_box w-full h-full absolute grid place-items-center"
                  style="color: var(--title)"
                >
                  <i class="icon_mode"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                    >
                      <!-- Icon from All by undefined - undefined -->
                      <path
                        fill="currentColor"
                        d="M4 13.75H2q-.425 0-.712-.288T1 12.75t.288-.712T2 11.75h2q.425 0 .713.288T5 12.75t-.288.713T4 13.75M7.05 7.8q-.275.275-.7.275t-.7-.275L4.225 6.375q-.3-.3-.3-.7t.3-.7q.3-.275.7-.288t.7.288L7.05 6.4q.275.275.288.687T7.05 7.8M6 19q-.525 0-.887-.363t-.363-.887t.363-.888T6 16.5t.888.363t.362.887t-.363.888T6 19m6-9.25q-1.25 0-2.125.875T9 12.75q0 .425-.288.713T8 13.75t-.712-.288T7 12.75q0-2.075 1.463-3.537T12 7.75t3.538 1.463T17 12.75q0 .425-.288.713T16 13.75t-.712-.288T15 12.75q0-1.25-.875-2.125T12 9.75M9 23q-.525 0-.888-.363t-.362-.887t.363-.888T9 20.5t.888.363t.362.887t-.363.888T9 23m3-4q-.525 0-.888-.363t-.362-.887t.363-.888T12 16.5t.888.363t.362.887t-.363.888T12 19m0-13.25q-.425 0-.712-.288T11 4.75v-2q0-.425.288-.712T12 1.75t.713.288t.287.712v2q0 .425-.288.713T12 5.75M15 23q-.525 0-.888-.363t-.362-.887t.363-.888T15 20.5t.888.363t.362.887t-.363.888T15 23m1.95-15.2q-.3-.3-.3-.7t.3-.7l1.425-1.425q.275-.275.688-.288t.712.288q.275.275.275.7t-.275.7L18.35 7.8q-.275.275-.687.275T16.95 7.8M18 19q-.525 0-.888-.363t-.362-.887t.363-.888T18 16.5t.888.363t.362.887t-.363.888T18 19m2-5.25q-.425 0-.712-.288T19 12.75t.288-.712t.712-.288h2q.425 0 .713.288t.287.712t-.288.713t-.712.287zm-8 0"
                      />
                    </svg>
                  </i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!--navbar no-admin-->
    <nav
      class="nav_container flex items-center z-30 w-full h-16 relative"
      data-admin="false"
      v-else-if="navStatus === 'standard'"
      @mousedown="(e) => handleResetNav(e)"
    >
      <div
        class="nav_space_fit flex items-center justify-between md:justify-center flex-1 h-7 lg:pl-12 lg:pr-8 mx-4 lg:mx-0 gap-x-4"
        ref="nav-login"
      >
        <div
          id="logo_brand_standard"
          class="nav_logo_container flex items-center flex-1 text-sm md:text-lg"
        >
          <img
            alt="logo brand"
            class="brand_image"
            src="@/assets/content-svgrepo-com.svg"
          />
          <RouterLink class="btn brand_text" to="/">
            <div class="text-base sm:text-xl md:text-2xl">
              Bl<span style="color: #905149">o</span>gPan<span
                style="color: var(--accent-color-1)"
                >i</span
              >a
            </div>
          </RouterLink>
        </div>

        <button
          type="button"
          id="search_link_standard"
          class="search_nav_container hidden md:flex items-center flex-1 h-full px-4 py-4"
        >
          <div
            class="search_nav_entry w-full h-full flex items-center justify-between"
          >
            <div class="search_indicator text-sm">Search ...</div>
            <i class="icon_nav_search grid place-items-center"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <!-- Icon from All by undefined - undefined -->
                <path
                  fill="#737276"
                  d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"
                />
              </svg>
            </i>
          </div>
        </button>

        <div
          class="nav_control_wrap flex items-center justify-end gap-x-4"
          style="flex: 2"
        >
          <div
            class="nav_control_mob w-16 h-full flex items-center justify-end md:hidden"
          >
            <div class="btn_post_container flex items-center mr-4">
              <button
                type="button"
                class="w-max underline cursor-pointer"
                style="padding-bottom: 1px; background-color: var(--text-link)"
                @click="redirectPost('create')"
              >
                create a post
              </button>
            </div>
            <button
              type="button"
              class="search_nav_container flex items-center flex-shrink-0"
            >
              <div
                class="search_nav_entry w-full h-full flex items-center justify-center"
              >
                <i class="icon_nav_search grid place-items-center"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <!-- Icon from All by undefined - undefined -->
                    <path
                      fill="#737276"
                      d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"
                    />
                  </svg>
                </i>
              </div>
            </button>
            <!--menu wrap-->
            <div class="menu_wrap z-10 ml-4">
              <div
                class="menu_tool grid place-items-center h-7 relative"
                style="width: 1.75rem"
              >
                <div
                  id="menu_toggler"
                  class="absolute grid place-items-center w-full h-full cursor-pointer"
                ></div>

                <div
                  class="menu_play absolute grid place-items-center w-full h-full relative"
                >
                  <div
                    class="menu_symbol grid place-items-center w-full h-full relative"
                    @click="(e) => handleModalMenu(e)"
                  >
                    <div class="menu_bar"></div>
                  </div>
                  <!--modal container-->
                  <div class="modal_container absolute w-screen px-2 pb-4">
                    <ul
                      class="modal_content flex flex-col w-full space-y-4"
                      style="font-size: 1em; color: var(--text-link)"
                    >
                      <li
                        id="user_name"
                        class="menu_link flex items-center w-full h-10 py-1"
                      >
                        <a
                          href="#"
                          class="profile_link"
                          style="color: var(--accent-color-11)"
                          >{{ shortName }}</a
                        >
                        <div
                          id="mode_light_standard"
                          class="mode_light_container flex-1 flex items-center justify-end"
                        >
                          <div
                            class="mode_switch_box grid place-items-center w-8 h-8 p-1 relative"
                            :data-mode="modeScene"
                          >
                            <div
                              id="dark_box"
                              class="dark_box w-full h-full absolute grid place-items-center"
                              style="color: var(--title)"
                            >
                              <i class="icon_mode"
                                ><svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                >
                                  <!-- Icon from All by undefined - undefined -->
                                  <g fill="currentColor" fill-opacity="0">
                                    <path
                                      d="M15.22 6.03l2.53 -1.94l-3.19 -0.09l-1.06 -3l-1.06 3l-3.19 0.09l2.53 1.94l-0.91 3.06l2.63 -1.81l2.63 1.81l-0.91 -3.06Z"
                                    >
                                      <animate
                                        fill="freeze"
                                        attributeName="fill-opacity"
                                        begin="0.7s"
                                        dur="0.4s"
                                        values="0;1"
                                      />
                                    </path>
                                    <path
                                      d="M19.61 12.25l1.64 -1.25l-2.06 -0.05l-0.69 -1.95l-0.69 1.95l-2.06 0.05l1.64 1.25l-0.59 1.98l1.7 -1.17l1.7 1.17l-0.59 -1.98Z"
                                    >
                                      <animate
                                        fill="freeze"
                                        attributeName="fill-opacity"
                                        begin="1.1s"
                                        dur="0.4s"
                                        values="0;1"
                                      />
                                    </path>
                                  </g>
                                  <path
                                    fill="currentColor"
                                    fill-opacity="0"
                                    stroke="currentColor"
                                    stroke-dasharray="56"
                                    stroke-dashoffset="56"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M7 6c0 6.08 4.92 11 11 11c0.53 0 1.05 -0.04 1.56 -0.11c-1.61 2.47 -4.39 4.11 -7.56 4.11c-4.97 0 -9 -4.03 -9 -9c0 -3.17 1.64 -5.95 4.11 -7.56c-0.07 0.51 -0.11 1.03 -0.11 1.56Z"
                                  >
                                    <animate
                                      fill="freeze"
                                      attributeName="fill-opacity"
                                      begin="1.5s"
                                      dur="0.15s"
                                      values="0;0.3"
                                    />
                                    <animate
                                      fill="freeze"
                                      attributeName="stroke-dashoffset"
                                      dur="0.6s"
                                      values="56;0"
                                    />
                                  </path>
                                </svg>
                              </i>
                            </div>
                            <div
                              id="light_box"
                              class="light_box w-full h-full absolute grid place-items-center"
                              style="color: var(--title)"
                            >
                              <i class="icon_mode"
                                ><svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                >
                                  <!-- Icon from All by undefined - undefined -->
                                  <path
                                    fill="currentColor"
                                    d="M4 13.75H2q-.425 0-.712-.288T1 12.75t.288-.712T2 11.75h2q.425 0 .713.288T5 12.75t-.288.713T4 13.75M7.05 7.8q-.275.275-.7.275t-.7-.275L4.225 6.375q-.3-.3-.3-.7t.3-.7q.3-.275.7-.288t.7.288L7.05 6.4q.275.275.288.687T7.05 7.8M6 19q-.525 0-.887-.363t-.363-.887t.363-.888T6 16.5t.888.363t.362.887t-.363.888T6 19m6-9.25q-1.25 0-2.125.875T9 12.75q0 .425-.288.713T8 13.75t-.712-.288T7 12.75q0-2.075 1.463-3.537T12 7.75t3.538 1.463T17 12.75q0 .425-.288.713T16 13.75t-.712-.288T15 12.75q0-1.25-.875-2.125T12 9.75M9 23q-.525 0-.888-.363t-.362-.887t.363-.888T9 20.5t.888.363t.362.887t-.363.888T9 23m3-4q-.525 0-.888-.363t-.362-.887t.363-.888T12 16.5t.888.363t.362.887t-.363.888T12 19m0-13.25q-.425 0-.712-.288T11 4.75v-2q0-.425.288-.712T12 1.75t.713.288t.287.712v2q0 .425-.288.713T12 5.75M15 23q-.525 0-.888-.363t-.362-.887t.363-.888T15 20.5t.888.363t.362.887t-.363.888T15 23m1.95-15.2q-.3-.3-.3-.7t.3-.7l1.425-1.425q.275-.275.688-.288t.712.288q.275.275.275.7t-.275.7L18.35 7.8q-.275.275-.687.275T16.95 7.8M18 19q-.525 0-.888-.363t-.362-.887t.363-.888T18 16.5t.888.363t.362.887t-.363.888T18 19m2-5.25q-.425 0-.712-.288T19 12.75t.288-.712t.712-.288h2q.425 0 .713.288t.287.712t-.288.713t-.712.287zm-8 0"
                                  />
                                </svg>
                              </i>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li
                        id="user_last_read"
                        class="menu_link flex w-full h-10 py-1"
                      >
                        <a href="#" class="profile_link w-1/5">recent read :</a>
                        <div class="article_last_read w-4/5">
                          <div
                            class="article_title grid place-items-center w-full cursor-pointer"
                          >
                            <a href="#" class="profile_link text-left max-w-sm">
                              A guide to time management scheduling-revi</a
                            >
                          </div>
                        </div>
                      </li>
                      <li id="user_like" class="menu_link h-10 py-1">
                        <a href="#" class="profile_link">Favourites</a>
                        <i class="icon_like" style="color: hsl(0, 86%, 44%)">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              fill-rule="evenodd"
                              d="M4.536 5.778a5 5 0 0 1 7.07 0q.275.274.708.682q.432-.408.707-.682a5 5 0 0 1 7.125 7.016L13.02 19.92a1 1 0 0 1-1.414 0L4.48 12.795a5 5 0 0 1 .055-7.017z"
                            />
                          </svg>
                        </i>
                      </li>
                      <li
                        id="user_arcticle"
                        class="menu_link flex justify-between w-full h-10 py-1"
                      >
                        <a href="#" class="profile_link">publication</a>
                        <div
                          class="article_published h-6"
                          style="
                            padding: 1px;
                            color: var(--text-body);
                            background-color: var(--accent-color-1);
                            border-radius: 5px;
                          "
                        >
                          {{ numberOfPosts }}
                        </div>
                      </li>
                      <li
                        id="source"
                        class="menu_link flex items-center justify-start h-10 gap-x-1"
                      >
                        <a
                          href="#
                            "
                          class="profile_link"
                          >archive</a
                        >
                      </li>
                      <li
                        id="topic"
                        class="menu_link flex items-center justify-start h-10 gap-x-1 z-60"
                        ref="topic-mob-ref"
                      >
                        <div>Topics</div>
                        <div
                          class="arrow_icon relative grid place-items-center w-2 cursor-pointer"
                          style="top: 2px"
                          data-arrow="down"
                          @click="(e) => handleMobModalContainer(e)"
                        >
                          <i class="arrow_down absolute">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"
                              />
                            </svg>
                          </i>
                          <i class="arrow_up absolute">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="m12 10.8l-4.6 4.6L6 14l6-6l6 6l-1.4 1.4z"
                              />
                            </svg>
                          </i>
                        </div>
                        <!--modal container-->
                        <div class="modal_container left-0 w-56 z-60">
                          <ul
                            class="modal_content flex flex-col space-y-4 w-full"
                          >
                            <li id="topic_psych" class="modal_link py-1">
                              <a href="#">psychology</a>
                            </li>
                            <li id="topic_algorithm" class="modal_link">
                              <a href="#">algorithm</a>
                            </li>
                            <li id="topic_data" class="modal_link">
                              <a href="#">data structures</a>
                            </li>
                            <li id="topic_javascript" class="modal_link">
                              <a href="#">javascript</a>
                            </li>
                            <li id="topic_c" class="modal_link">
                              <a href="#">C</a>
                            </li>
                            <li id="topic_c_plus" class="modal_link">
                              <a href="#">C++</a>
                            </li>
                            <li id="topic_gaming" class="modal_link">
                              <a href="#">javascript for gaming</a>
                            </li>
                            <li id="topic_github" class="modal_link">
                              <a href="#">github</a>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li
                        id="user_flag"
                        class="menu_link flex justify-between w-full h-10 py-1"
                      >
                        <span>flag</span>
                        <div class="level_contribution">
                          <i class="icon_flag" data-flag="newbie">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 256 256"
                            >
                              <path
                                fill="currentColor"
                                d="M232 56v120a8 8 0 0 1-2.76 6c-15.28 13.23-29.89 18-43.82 18c-18.91 0-36.57-8.74-53-16.85C105.87 170 82.79 158.61 56 179.77V224a8 8 0 0 1-16 0V56a8 8 0 0 1 2.77-6c36-31.18 68.31-15.21 96.79-1.12C167 62.46 190.79 74.2 218.76 50A8 8 0 0 1 232 56"
                              />
                            </svg>
                          </i>
                        </div>
                      </li>
                      <li
                        id="user_joined"
                        class="menu_link flex justify-between w-full h-10 py-1"
                      >
                        <div>
                          <a href="#" class="profile_link underline"
                            >date joined :</a
                          >
                        </div>
                        <div class="underline">20th, July 2024</div>
                      </li>
                      <li
                        id="user_admin"
                        class="menu_link flex flex-col w-full py-1 space-y-3 mb-0"
                      >
                        <button
                          type="button"
                          class="btn_admin relative flex items-center justify-start w-full cursor-pointer z-40"
                          ref="admin-toggle-mob"
                          @click="() => togglerBoxAdmin('toggle')"
                          style="
                            width: min-content;
                            height: min-content;
                            padding-bottom: 1px;
                            border-bottom: 1px solid var(--brand-text);
                          "
                        >
                          <div class="z-10">admin</div>
                          <div
                            class="grid place-items-center"
                            style="
                              width: 5px;
                              height: 5px;
                              margin: 4px;
                              background-color: var(--brand-text);
                              border-radius: 50%;
                            "
                          ></div>

                          <div class="absolute w-max right-2">
                            {{ warningMsg }}
                          </div>
                        </button>
                        <!--admin box-->
                        <div class="admin_box relative z-50">
                          <form
                            class="flex flex-col items-center justify-start space-y-2 w-full"
                          >
                            <div
                              class="admin_secret_wrap flex flex-col justify-start py-2 w-full"
                            >
                              <input
                                type="password"
                                id="secret"
                                name=" secret"
                                placeholder="digit"
                                style="
                                  border-radius: 3px;
                                  padding: 4px 8px;
                                  color: var(--title);
                                "
                                v-model="userSecret.mob"
                              />
                            </div>
                            <div class="submit_secret w-full mt-3 mb-2">
                              <button
                                type="button"
                                class="grid place-items-center w-full h-8"
                                style="
                                  color: var(--accenr-color-3);
                                  background-color: var(--accent-color-1);
                                  border-radius: 5px;
                                "
                                @click="handleLoginAdmin('mobile')"
                              >
                                submit
                              </button>
                            </div>
                          </form>
                        </div>
                      </li>
                      <li id="user_logout" class="menu_link mt-4 py-1">
                        <a
                          href="#"
                          class="profile_link"
                          style="
                            height: max-content;
                            padding: 2px 0;
                            border-bottom: 1px solid var(--text-link);
                          "
                          @click.prevent="async () => handleLogout()"
                          >logout</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="nav_control_desk relative hidden md:flex items-center w-full"
          >
            <ul
              class="nav-right_panel absolute w-11/12 flex items-center justify-end"
            >
              <li id="profile_user_standard" class="nav_link text-xs">
                <div
                  class="logo_user_wrap w-6 flex items-start justify-center mr-4"
                  style="
                    padding: 4px;
                    background-color: var(--accent-color-1);
                    color: var(--accent-color-3);
                  "
                >
                  <div
                    class="symbol_user w-3 h-5 flex items-center justify-center"
                    style="white-space: wrap"
                  >
                    {{ shortName[0]?.toUpperCase() }}
                  </div>
                  <div
                    class="arrow_icon relative w-3 h-5 flex flex-col items-center justify-end"
                    data-arrow="down"
                    style="bottom: 1px; right: -1px"
                    @click="(e) => handleModalProfile(e)"
                  >
                    <i class="arrow_down absolute">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                      >
                        <!-- Icon from All by undefined - undefined -->
                        <path
                          fill="currentColor"
                          d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"
                        />
                      </svg>
                    </i>
                    <i class="arrow_up absolute">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <!-- Icon from All by undefined - undefined -->
                        <path
                          fill="currentColor"
                          d="m12 10.8l-4.6 4.6L6 14l6-6l6 6l-1.4 1.4z"
                        />
                      </svg>
                    </i>
                  </div>
                  <!--modal container-->
                  <div class="modal_container absolute w-56 left-28 px-2 pb-1">
                    <ul
                      class="modal_content flex flex-col space-y-4 w-full"
                      style="font-size: 1em; color: var(--text-link)"
                    >
                      <li id="user_name" class="modal_link py-1">
                        <a
                          href="#"
                          class="profile_link"
                          style="color: var(--accent-color-11)"
                          >{{ shortName }}</a
                        >
                      </li>
                      <li
                        id="user_arcticle"
                        class="modal_link flex justify-between w-full py-1"
                      >
                        <a href="#" class="profile_link">publication</a>
                        <div
                          class="article_published"
                          style="
                            padding: 2px;
                            color: var(--text-body);
                            background-color: var(--accent-color-1);
                            border-radius: 5px;
                          "
                        >
                          0
                        </div>
                      </li>
                      <li
                        id="user_last_read"
                        class="modal_link flex flex-col py-1"
                      >
                        <a href="#" class="profile_link">recent read</a>
                        <div class="article_last_read">
                          <div class="article_title cursor-pointer">
                            <a href="#" class="profile_link text-center">
                              A guide to time management scheduling-revi</a
                            >
                          </div>
                        </div>
                      </li>
                      <li id="user_like" class="modal_link py-1">
                        <a href="#" class="profile_link">Favourites</a>
                        <i class="icon_like" style="color: hsl(0, 86%, 44%)">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                          >
                            <!-- Icon from All by undefined - undefined -->
                            <path
                              fill="currentColor"
                              fill-rule="evenodd"
                              d="M4.536 5.778a5 5 0 0 1 7.07 0q.275.274.708.682q.432-.408.707-.682a5 5 0 0 1 7.125 7.016L13.02 19.92a1 1 0 0 1-1.414 0L4.48 12.795a5 5 0 0 1 .055-7.017z"
                            />
                          </svg>
                        </i>
                      </li>
                      <li
                        id="user_flag"
                        class="modal_link flex justify-between w-full py-1"
                      >
                        <span>flag</span>
                        <div class="level_contribution">
                          <i class="icon_flag" data-flag="newbie">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 256 256"
                            >
                              <!-- Icon from All by undefined - undefined -->
                              <path
                                fill="currentColor"
                                d="M232 56v120a8 8 0 0 1-2.76 6c-15.28 13.23-29.89 18-43.82 18c-18.91 0-36.57-8.74-53-16.85C105.87 170 82.79 158.61 56 179.77V224a8 8 0 0 1-16 0V56a8 8 0 0 1 2.77-6c36-31.18 68.31-15.21 96.79-1.12C167 62.46 190.79 74.2 218.76 50A8 8 0 0 1 232 56"
                              />
                            </svg>
                          </i>
                        </div>
                      </li>
                      <li
                        id="user_joined"
                        class="flex justify-between w-full py-1"
                      >
                        <div style="font-size: calc(12px + 0.1vw)">
                          <a href="#" class="profile_link underline"
                            >date joined :</a
                          >
                        </div>
                        <div class="underline">20th, July 2024</div>
                      </li>
                      <li
                        id="user_admin"
                        class="modal_link flex flex-col w-full py-1 space-y-3"
                      >
                        <button
                          type="button"
                          class="btn_admin relative flex items-center justify-start text-xs w-full cursor-pointer z-40"
                          ref="admin-toggle-desk"
                          @click="() => togglerBoxAdmin('toggle')"
                          style="
                            width: min-content;
                            height: min-content;
                            padding-bottom: 1px;
                            border-bottom: 1px solid var(--brand-text);
                          "
                        >
                          <div>admin</div>
                          <div
                            class="grid place-items-center"
                            style="
                              width: 5px;
                              height: 5px;
                              margin: 4px;
                              background-color: var(--brand-text);
                              border-radius: 50%;
                            "
                          ></div>

                          <div class="absolute w-max right-2">
                            {{ warningMsg }}
                          </div>
                        </button>
                        <!--admin box-->
                        <div class="admin_box">
                          <form
                            class="flex flex-col items-center justify-start space-y-2 w-full"
                          >
                            <div
                              class="admin_secret_wrap flex flex-col justify-start py-2 w-full"
                            >
                              <input
                                type="password"
                                id="secret"
                                name=" secret"
                                placeholder="digit"
                                style="
                                  border-radius: 3px;
                                  padding: 4px 8px;
                                  color: var(--title);
                                "
                                v-model="userSecret.desk"
                              />
                            </div>
                            <div class="submit_secret w-full mt-3 mb-2">
                              <button
                                type="button"
                                class="grid place-items-center w-full h-8"
                                style="
                                  color: var(--accenr-color-3);
                                  background-color: var(--accent-color-1);
                                  border-radius: 5px;
                                "
                                @click="handleLoginAdmin('desktop')"
                              >
                                submit
                              </button>
                            </div>
                          </form>
                        </div>
                      </li>
                      <li id="user_logout" class="modal_link py-1">
                        <a
                          href="#"
                          class="profile_link"
                          style="
                            height: max-content;
                            padding: 2px 0;
                            border-bottom: 1px solid var(--text-link);
                          "
                          @click.prevent="async () => handleLogout()"
                          >logout</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li class="nav_link grid place-items-center w-24 text-xs">
                <span class="this_day text-decoration">{{ today }}</span>
              </li>
              <li class="nav_link grid place-items-center w-24 ml-2 text-xs">
                <div class="archive_link">archive</div>
              </li>
              <li
                class="nav_link flex items-center justify-center w-24 text-xs gap-x-1"
                ref="topic-ref-0"
              >
                <div>Topics</div>
                <div
                  class="arrow_icon relative grid place-items-center w-2 cursor-pointer"
                  style="top: 2px"
                  data-arrow="down"
                  @click="(e) => handleModalContainer(e)"
                >
                  <i class="arrow_down absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <!-- Icon from All by undefined - undefined -->
                      <path
                        fill="currentColor"
                        d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"
                      />
                    </svg>
                  </i>
                  <i class="arrow_up absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <!-- Icon from All by undefined - undefined -->
                      <path
                        fill="currentColor"
                        d="m12 10.8l-4.6 4.6L6 14l6-6l6 6l-1.4 1.4z"
                      />
                    </svg>
                  </i>
                </div>
                <!--modal container-->
                <div class="modal_container absolute top-11 w-56">
                  <ul class="modal_content flex flex-col space-y-4 w-full">
                    <li id="topic_psych" class="modal_link py-1">
                      <a href="#">psychology</a>
                    </li>
                    <li id="topic_algorithm" class="modal_link">
                      <a href="#">algorithm</a>
                    </li>
                    <li id="topic_data" class="modal_link">
                      <a href="#">data structures</a>
                    </li>
                    <li id="topic_javascript" class="modal_link">
                      <a href="#">javascript</a>
                    </li>
                    <li id="topic_c" class="modal_link">
                      <a href="#">C</a>
                    </li>
                    <li id="topic_c_plus" class="modal_link">
                      <a href="#">C++</a>
                    </li>
                    <li id="topic_gaming" class="modal_link">
                      <a href="#">javascript for gaming</a>
                    </li>
                    <li id="topic_github" class="modal_link">
                      <a href="#">github</a>
                    </li>
                  </ul>
                </div>
              </li>
              <li class="nav_link flex items-center justify-center w-24 mx-4">
                <button
                  type="button"
                  class="grid place-items-center w-full h-6 text-xs cursor-pointer"
                  style="
                    background-color: var(--card-box);
                    color: var(--accent-color-3);
                    border-radius: 5px;
                  "
                  @click="redirectPost('create')"
                >
                  create a post
                </button>
              </li>
            </ul>

            <div
              id="mode_light_standard"
              class="mode_light_container flex-1 flex items-center justify-end"
            >
              <div
                class="mode_switch_box grid place-items-center w-8 h-8 p-1 relative"
                :data-mode="modeScene"
              >
                <div
                  id="dark_box"
                  class="dark_box w-full h-full absolute grid place-items-center"
                  style="color: var(--title)"
                >
                  <i class="icon_mode"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                    >
                      <!-- Icon from All by undefined - undefined -->
                      <g fill="currentColor" fill-opacity="0">
                        <path
                          d="M15.22 6.03l2.53 -1.94l-3.19 -0.09l-1.06 -3l-1.06 3l-3.19 0.09l2.53 1.94l-0.91 3.06l2.63 -1.81l2.63 1.81l-0.91 -3.06Z"
                        >
                          <animate
                            fill="freeze"
                            attributeName="fill-opacity"
                            begin="0.7s"
                            dur="0.4s"
                            values="0;1"
                          />
                        </path>
                        <path
                          d="M19.61 12.25l1.64 -1.25l-2.06 -0.05l-0.69 -1.95l-0.69 1.95l-2.06 0.05l1.64 1.25l-0.59 1.98l1.7 -1.17l1.7 1.17l-0.59 -1.98Z"
                        >
                          <animate
                            fill="freeze"
                            attributeName="fill-opacity"
                            begin="1.1s"
                            dur="0.4s"
                            values="0;1"
                          />
                        </path>
                      </g>
                      <path
                        fill="currentColor"
                        fill-opacity="0"
                        stroke="currentColor"
                        stroke-dasharray="56"
                        stroke-dashoffset="56"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 6c0 6.08 4.92 11 11 11c0.53 0 1.05 -0.04 1.56 -0.11c-1.61 2.47 -4.39 4.11 -7.56 4.11c-4.97 0 -9 -4.03 -9 -9c0 -3.17 1.64 -5.95 4.11 -7.56c-0.07 0.51 -0.11 1.03 -0.11 1.56Z"
                      >
                        <animate
                          fill="freeze"
                          attributeName="fill-opacity"
                          begin="1.5s"
                          dur="0.15s"
                          values="0;0.3"
                        />
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          dur="0.6s"
                          values="56;0"
                        />
                      </path>
                    </svg>
                  </i>
                </div>
                <div
                  id="light_box"
                  class="light_box w-full h-full absolute grid place-items-center"
                  style="color: var(--title)"
                >
                  <i class="icon_mode"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                    >
                      <!-- Icon from All by undefined - undefined -->
                      <path
                        fill="currentColor"
                        d="M4 13.75H2q-.425 0-.712-.288T1 12.75t.288-.712T2 11.75h2q.425 0 .713.288T5 12.75t-.288.713T4 13.75M7.05 7.8q-.275.275-.7.275t-.7-.275L4.225 6.375q-.3-.3-.3-.7t.3-.7q.3-.275.7-.288t.7.288L7.05 6.4q.275.275.288.687T7.05 7.8M6 19q-.525 0-.887-.363t-.363-.887t.363-.888T6 16.5t.888.363t.362.887t-.363.888T6 19m6-9.25q-1.25 0-2.125.875T9 12.75q0 .425-.288.713T8 13.75t-.712-.288T7 12.75q0-2.075 1.463-3.537T12 7.75t3.538 1.463T17 12.75q0 .425-.288.713T16 13.75t-.712-.288T15 12.75q0-1.25-.875-2.125T12 9.75M9 23q-.525 0-.888-.363t-.362-.887t.363-.888T9 20.5t.888.363t.362.887t-.363.888T9 23m3-4q-.525 0-.888-.363t-.362-.887t.363-.888T12 16.5t.888.363t.362.887t-.363.888T12 19m0-13.25q-.425 0-.712-.288T11 4.75v-2q0-.425.288-.712T12 1.75t.713.288t.287.712v2q0 .425-.288.713T12 5.75M15 23q-.525 0-.888-.363t-.362-.887t.363-.888T15 20.5t.888.363t.362.887t-.363.888T15 23m1.95-15.2q-.3-.3-.3-.7t.3-.7l1.425-1.425q.275-.275.688-.288t.712.288q.275.275.275.7t-.275.7L18.35 7.8q-.275.275-.687.275T16.95 7.8M18 19q-.525 0-.888-.363t-.362-.887t.363-.888T18 16.5t.888.363t.362.887t-.363.888T18 19m2-5.25q-.425 0-.712-.288T19 12.75t.288-.712t.712-.288h2q.425 0 .713.288t.287.712t-.288.713t-.712.287zm-8 0"
                      />
                    </svg>
                  </i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!--navbar admin-->
    <nav
      class="nav_container flex items-center z-30 w-full h-16 relative"
      data-admin="true"
      v-else-if="navStatus === 'admin'"
      @mousedown="(e) => handleResetNav(e)"
    >
      <div
        class="nav_space_fit flex items-center justify-between md:justify-center flex-1 h-7 lg:pl-12 lg:pr-8 mx-4 lg:mx-0 gap-x-4"
        ref="nav-login-admin"
      >
        <div
          id="logo_brand_admin"
          class="nav_logo_container flex items-center flex-1 text-sm md:text-lg"
        >
          <img
            alt="logo brand"
            class="brand_image"
            src="@/assets/content-svgrepo-com.svg"
          />
          <RouterLink class="btn brand_text" to="/">
            <div class="text-base sm:text-xl md:text-2xl">
              Bl<span style="color: #905149">o</span>gPan<span
                style="color: var(--accent-color-1)"
                >i</span
              >a
            </div>
          </RouterLink>

          <div class="mini_indicator_admin" data-admin="false">
            <div class="indicator-admin">admin</div>
          </div>
        </div>

        <button
          type="button"
          id="search_link_admin"
          class="search_nav_container hidden md:flex items-center flex-1 h-full px-4 py-4"
        >
          <div
            class="search_nav_entry w-full h-full flex items-center justify-between"
          >
            <div class="search_indicator text-sm">Search ...</div>
            <i class="icon_nav_search grid place-items-center"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#737276"
                  d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"
                />
              </svg>
            </i>
          </div>
        </button>

        <div
          class="nav_control_wrap flex items-center justify-end gap-x-4"
          style="flex: 2"
        >
          <div
            class="nav_control_mob w-16 h-full flex items-center justify-end md:hidden"
          >
            <div class="btn_post_container flex items-center mr-4">
              <button
                type="button"
                class="w-max underline cursor-pointer"
                style="padding-bottom: 1px; background-color: var(--text-link)"
                @click="redirectPost('create')"
              >
                create a post
              </button>
            </div>
            <button
              type="button"
              class="search_nav_container flex items-center flex-shrink-0"
            >
              <div
                class="search_nav_entry w-full h-full flex items-center justify-center"
              >
                <i class="icon_nav_search grid place-items-center"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#737276"
                      d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"
                    />
                  </svg>
                </i>
              </div>
            </button>
            <!--menu wrap-->
            <div class="menu_wrap z-10 ml-4">
              <div
                class="menu_tool grid place-items-center h-7 relative"
                style="width: 1.75rem"
              >
                <div
                  id="menu_toggler"
                  class="absolute grid place-items-center w-full h-full cursor-pointer"
                >
                  <div
                    class="menu_play absolute grid place-items-center w-full h-full relative"
                  >
                    <div
                      class="menu_symbol grid place-items-center w-full h-full relative"
                      @click="(e) => handleModalMenu(e)"
                    >
                      <div class="menu_bar"></div>
                    </div>

                    <div class="modal_container absolute w-screen px-2 pb-4">
                      <ul
                        class="modal_content flex flex-col w-full space-y-4"
                        style="font-size: 1em; color: var(--text-link)"
                      >
                        <li
                          id="user_name"
                          class="menu_link flex items-center w-full h-10 py-1"
                        >
                          <a
                            href="#"
                            class="profile_link"
                            style="color: var(--accent-color-11)"
                            >{{ shortName }}</a
                          >
                          <div
                            id="mode_light_standard"
                            class="mode_light_container flex-1 flex items-center justify-end"
                          >
                            <div
                              class="mode_switch_box grid place-items-center w-8 h-8 p-1 relative"
                              :data-mode="modeScene"
                            >
                              <div
                                id="dark_box"
                                class="dark_box w-full h-full absolute grid place-items-center"
                                style="color: var(--title)"
                              >
                                <i class="icon_mode"
                                  ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                  >
                                    <!-- Icon from All by undefined - undefined -->
                                    <g fill="currentColor" fill-opacity="0">
                                      <path
                                        d="M15.22 6.03l2.53 -1.94l-3.19 -0.09l-1.06 -3l-1.06 3l-3.19 0.09l2.53 1.94l-0.91 3.06l2.63 -1.81l2.63 1.81l-0.91 -3.06Z"
                                      >
                                        <animate
                                          fill="freeze"
                                          attributeName="fill-opacity"
                                          begin="0.7s"
                                          dur="0.4s"
                                          values="0;1"
                                        />
                                      </path>
                                      <path
                                        d="M19.61 12.25l1.64 -1.25l-2.06 -0.05l-0.69 -1.95l-0.69 1.95l-2.06 0.05l1.64 1.25l-0.59 1.98l1.7 -1.17l1.7 1.17l-0.59 -1.98Z"
                                      >
                                        <animate
                                          fill="freeze"
                                          attributeName="fill-opacity"
                                          begin="1.1s"
                                          dur="0.4s"
                                          values="0;1"
                                        />
                                      </path>
                                    </g>
                                    <path
                                      fill="currentColor"
                                      fill-opacity="0"
                                      stroke="currentColor"
                                      stroke-dasharray="56"
                                      stroke-dashoffset="56"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M7 6c0 6.08 4.92 11 11 11c0.53 0 1.05 -0.04 1.56 -0.11c-1.61 2.47 -4.39 4.11 -7.56 4.11c-4.97 0 -9 -4.03 -9 -9c0 -3.17 1.64 -5.95 4.11 -7.56c-0.07 0.51 -0.11 1.03 -0.11 1.56Z"
                                    >
                                      <animate
                                        fill="freeze"
                                        attributeName="fill-opacity"
                                        begin="1.5s"
                                        dur="0.15s"
                                        values="0;0.3"
                                      />
                                      <animate
                                        fill="freeze"
                                        attributeName="stroke-dashoffset"
                                        dur="0.6s"
                                        values="56;0"
                                      />
                                    </path>
                                  </svg>
                                </i>
                              </div>
                              <div
                                id="light_box"
                                class="light_box w-full h-full absolute grid place-items-center"
                                style="color: var(--title)"
                              >
                                <i class="icon_mode"
                                  ><svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                  >
                                    <!-- Icon from All by undefined - undefined -->
                                    <path
                                      fill="currentColor"
                                      d="M4 13.75H2q-.425 0-.712-.288T1 12.75t.288-.712T2 11.75h2q.425 0 .713.288T5 12.75t-.288.713T4 13.75M7.05 7.8q-.275.275-.7.275t-.7-.275L4.225 6.375q-.3-.3-.3-.7t.3-.7q.3-.275.7-.288t.7.288L7.05 6.4q.275.275.288.687T7.05 7.8M6 19q-.525 0-.887-.363t-.363-.887t.363-.888T6 16.5t.888.363t.362.887t-.363.888T6 19m6-9.25q-1.25 0-2.125.875T9 12.75q0 .425-.288.713T8 13.75t-.712-.288T7 12.75q0-2.075 1.463-3.537T12 7.75t3.538 1.463T17 12.75q0 .425-.288.713T16 13.75t-.712-.288T15 12.75q0-1.25-.875-2.125T12 9.75M9 23q-.525 0-.888-.363t-.362-.887t.363-.888T9 20.5t.888.363t.362.887t-.363.888T9 23m3-4q-.525 0-.888-.363t-.362-.887t.363-.888T12 16.5t.888.363t.362.887t-.363.888T12 19m0-13.25q-.425 0-.712-.288T11 4.75v-2q0-.425.288-.712T12 1.75t.713.288t.287.712v2q0 .425-.288.713T12 5.75M15 23q-.525 0-.888-.363t-.362-.887t.363-.888T15 20.5t.888.363t.362.887t-.363.888T15 23m1.95-15.2q-.3-.3-.3-.7t.3-.7l1.425-1.425q.275-.275.688-.288t.712.288q.275.275.275.7t-.275.7L18.35 7.8q-.275.275-.687.275T16.95 7.8M18 19q-.525 0-.888-.363t-.362-.887t.363-.888T18 16.5t.888.363t.362.887t-.363.888T18 19m2-5.25q-.425 0-.712-.288T19 12.75t.288-.712t.712-.288h2q.425 0 .713.288t.287.712t-.288.713t-.712.287zm-8 0"
                                    />
                                  </svg>
                                </i>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li
                          id="user_last_read"
                          class="menu_link flex w-full h-10 py-1"
                        >
                          <a href="#" class="profile_link w-1/5"
                            >recent read :</a
                          >
                          <div class="article_last_read w-4/5">
                            <div
                              class="article_title grid place-items-center w-full cursor-pointer"
                            >
                              <a
                                href="#"
                                class="profile_link text-left max-w-sm"
                              >
                                A guide to time management scheduling-revi</a
                              >
                            </div>
                          </div>
                        </li>
                        <li id="user_like" class="menu_link h-10 py-1">
                          <a href="#" class="profile_link">Favourites</a>
                          <i class="icon_like" style="color: hsl(0, 86%, 44%)">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                fill-rule="evenodd"
                                d="M4.536 5.778a5 5 0 0 1 7.07 0q.275.274.708.682q.432-.408.707-.682a5 5 0 0 1 7.125 7.016L13.02 19.92a1 1 0 0 1-1.414 0L4.48 12.795a5 5 0 0 1 .055-7.017z"
                              />
                            </svg>
                          </i>
                        </li>
                        <li
                          id="user_arcticle"
                          class="menu_link flex justify-between w-full h-10 py-1"
                        >
                          <a href="#" class="profile_link">publication</a>
                          <div
                            class="article_published h-6"
                            style="
                              padding: 1px;
                              color: var(--text-body);
                              background-color: var(--accent-color-1);
                              border-radius: 5px;
                            "
                          >
                            {{ numberOfPosts }}
                          </div>
                        </li>
                        <li
                          id="source"
                          class="menu_link flex items-center justify-start h-10 gap-x-1"
                          ref="source-mob-ref"
                        >
                          <div class="archive_link">source</div>
                          <div
                            class="arrow_icon relative grid place-items-center w-2 cursor-pointer"
                            style="top: 2px"
                            data-arrow="down"
                            @click="(e) => handleMobModalContainer(e)"
                          >
                            <i class="arrow_down absolute">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"
                                />
                              </svg>
                            </i>
                            <i class="arrow_up absolute">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="m12 10.8l-4.6 4.6L6 14l6-6l6 6l-1.4 1.4z"
                                />
                              </svg>
                            </i>
                          </div>
                          <!--modal container-->
                          <div class="modal_container left-0 w-56 z-60">
                            <ul
                              class="modal_content flex flex-col space-y-4 w-full"
                            >
                              <li id="src_note" class="modal_link py-1">
                                <a href="#">my articles</a>
                              </li>
                              <li id="src_archive" class="modal_link">
                                <a href="#">archive</a>
                              </li>
                              <li id="src_member" class="modal_link">
                                <a href="#">all members</a>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li
                          id="topic"
                          class="menu_link flex items-center justify-start h-10 gap-x-1 z-60"
                          ref="topic-mob-ref"
                        >
                          <div>Topics</div>
                          <div
                            class="arrow_icon relative grid place-items-center w-2 cursor-pointer"
                            style="top: 2px"
                            data-arrow="down"
                            @click="(e) => handleMobModalContainer(e)"
                          >
                            <i class="arrow_down absolute">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"
                                />
                              </svg>
                            </i>
                            <i class="arrow_up absolute">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="m12 10.8l-4.6 4.6L6 14l6-6l6 6l-1.4 1.4z"
                                />
                              </svg>
                            </i>
                          </div>
                          <!--modal container-->
                          <div class="modal_container left-0 w-56 z-60">
                            <ul
                              class="modal_content flex flex-col space-y-4 w-full"
                            >
                              <li id="topic_psych" class="modal_link py-1">
                                <a href="#">psychology</a>
                              </li>
                              <li id="topic_algorithm" class="modal_link">
                                <a href="#">algorithm</a>
                              </li>
                              <li id="topic_data" class="modal_link">
                                <a href="#">data structures</a>
                              </li>
                              <li id="topic_javascript" class="modal_link">
                                <a href="#">javascript</a>
                              </li>
                              <li id="topic_c" class="modal_link">
                                <a href="#">C</a>
                              </li>
                              <li id="topic_c_plus" class="modal_link">
                                <a href="#">C++</a>
                              </li>
                              <li id="topic_gaming" class="modal_link">
                                <a href="#">javascript for gaming</a>
                              </li>
                              <li id="topic_github" class="modal_link">
                                <a href="#">github</a>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li
                          id="user_flag"
                          class="menu_link flex justify-between w-full h-10 py-1"
                        >
                          <span>flag</span>
                          <div class="level_contribution">
                            <i class="icon_flag" data-flag="newbie">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 256 256"
                              >
                                <path
                                  fill="currentColor"
                                  d="M232 56v120a8 8 0 0 1-2.76 6c-15.28 13.23-29.89 18-43.82 18c-18.91 0-36.57-8.74-53-16.85C105.87 170 82.79 158.61 56 179.77V224a8 8 0 0 1-16 0V56a8 8 0 0 1 2.77-6c36-31.18 68.31-15.21 96.79-1.12C167 62.46 190.79 74.2 218.76 50A8 8 0 0 1 232 56"
                                />
                              </svg>
                            </i>
                          </div>
                        </li>
                        <li
                          id="user_joined"
                          class="menu_link flex justify-between w-full h-10 py-1"
                        >
                          <div>
                            <a href="#" class="profile_link underline"
                              >date joined :</a
                            >
                          </div>
                          <div class="underline">20th, July 2024</div>
                        </li>
                        <li id="user_logout" class="menu_link mt-4 py-1">
                          <a
                            href="#"
                            class="profile_link"
                            style="
                              height: max-content;
                              padding: 2px 0;
                              border-bottom: 1px solid var(--text-link);
                            "
                            @click.prevent="async () => handleLogout()"
                            >logout</a
                          >
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="nav_control_desk relative hidden md:flex items-center w-full"
          >
            <ul
              class="nav-right_panel absolute w-11/12 flex items-center justify-end"
            >
              <li id="profile_user" class="nav_link text-xs">
                <div
                  class="logo_user_wrap w-6 flex items-start justify-center mr-4"
                  style="
                    padding: 4px;
                    background-color: var(--accent-color-1);
                    color: var(--accent-color-3);
                  "
                >
                  <div
                    class="symbol_user w-3 h-5 flex items-center justify-center"
                    style="white-space: wrap"
                  >
                    {{ shortName[0]?.toUpperCase() }}
                  </div>
                  <div
                    class="arrow_icon relative w-3 h-5 flex flex-col items-center justify-end"
                    data-arrow="down"
                    style="bottom: 1px; right: -1px"
                    @click="(e) => handleModalProfile(e)"
                  >
                    <i class="arrow_down absolute">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"
                        />
                      </svg>
                    </i>
                    <i class="arrow_up absolute">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="m12 10.8l-4.6 4.6L6 14l6-6l6 6l-1.4 1.4z"
                        />
                      </svg>
                    </i>
                  </div>
                  <!--modal container-->
                  <div class="modal_container absolute w-56 left-28 px-2 pb-1">
                    <ul
                      class="modal_content flex flex-col w-full space-y-4"
                      style="font-size: 1em; color: var(--text-link)"
                    >
                      <li id="user_name" class="modal_link py-1">
                        <a
                          href="#"
                          class="profile_link"
                          style="color: var(--accent-color-11)"
                          >{{ shortName }}</a
                        >
                      </li>
                      <li
                        id="user_arcticle"
                        class="modal_link flex justify-between w-full py-1"
                      >
                        <a href="#" class="profile_link">publication</a>
                        <div
                          class="article_published"
                          style="
                            padding: 2px;
                            color: var(--text-body);
                            background-color: var(--accent-color-1);
                            border-radius: 5px;
                          "
                        >
                          0
                        </div>
                      </li>
                      <li
                        id="user_last_read"
                        class="modal_link flex flex-col py-1"
                      >
                        <a href="#" class="profile_link">recent read</a>
                        <div class="article_last_read">
                          <div class="article_title cursor-pointer">
                            <a href="#" class="profile_link text-center">
                              A guide to time management scheduling-revi</a
                            >
                          </div>
                        </div>
                      </li>
                      <li id="user_like" class="modal_link py-1">
                        <a href="#" class="profile_link">Favourites</a>
                        <i class="icon_like" style="color: hsl(0, 86%, 44%)">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              fill-rule="evenodd"
                              d="M4.536 5.778a5 5 0 0 1 7.07 0q.275.274.708.682q.432-.408.707-.682a5 5 0 0 1 7.125 7.016L13.02 19.92a1 1 0 0 1-1.414 0L4.48 12.795a5 5 0 0 1 .055-7.017z"
                            />
                          </svg>
                        </i>
                      </li>
                      <li
                        id="user_flag"
                        class="modal_link flex justify-between w-full py-1"
                      >
                        <span>flag</span>
                        <div class="level_contribution">
                          <i class="icon_flag" data-flag="newbie">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 256 256"
                            >
                              <path
                                fill="currentColor"
                                d="M232 56v120a8 8 0 0 1-2.76 6c-15.28 13.23-29.89 18-43.82 18c-18.91 0-36.57-8.74-53-16.85C105.87 170 82.79 158.61 56 179.77V224a8 8 0 0 1-16 0V56a8 8 0 0 1 2.77-6c36-31.18 68.31-15.21 96.79-1.12C167 62.46 190.79 74.2 218.76 50A8 8 0 0 1 232 56"
                              />
                            </svg>
                          </i>
                        </div>
                      </li>
                      <li
                        id="user_joined"
                        class="flex justify-between w-full py-1"
                      >
                        <div style="font-size: calc(12px + 0.1vw)">
                          <a href="#" class="profile_link underline"
                            >date joined :</a
                          >
                        </div>
                        <div class="underline">20th, July 2024</div>
                      </li>
                      <li id="user_logout" class="modal_link py-1">
                        <a
                          href="#"
                          class="profile_link"
                          style="
                            height: max-content;
                            padding: 2px 0;
                            border-bottom: 1px solid var(--text-link);
                          "
                          @click.prevent="async () => handleLogout()"
                          >logout</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li class="nav_link grid place-items-center w-24 text-xs">
                <span class="this_day text-decoration">{{ today }}</span>
              </li>
              <li
                id="source"
                class="nav_link flex items-center justify-center w-24 text-xs gap-x-1"
                ref="source-ref"
              >
                <div class="archive_link">source</div>
                <div
                  class="arrow_icon relative grid place-items-center w-2 cursor-pointer"
                  style="top: 2px"
                  data-arrow="down"
                  @click="(e) => handleModalContainer(e)"
                >
                  <i class="arrow_down absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <!-- Icon from All by undefined - undefined -->
                      <path
                        fill="currentColor"
                        d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"
                      />
                    </svg>
                  </i>
                  <i class="arrow_up absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <!-- Icon from All by undefined - undefined -->
                      <path
                        fill="currentColor"
                        d="m12 10.8l-4.6 4.6L6 14l6-6l6 6l-1.4 1.4z"
                      />
                    </svg>
                  </i>
                </div>
                <!--modal container-->
                <div class="modal_container absolute w-56">
                  <ul class="modal_content flex flex-col space-y-4 w-full">
                    <li id="src_note" class="modal_link py-1">
                      <a href="#">my articles</a>
                    </li>
                    <li id="src_archive" class="modal_link">
                      <a href="#">archive</a>
                    </li>
                    <li id="src_member" class="modal_link">
                      <a href="#">all members</a>
                    </li>
                  </ul>
                </div>
              </li>
              <li
                id="topic"
                class="nav_link flex items-center justify-center w-24 text-xs gap-x-1"
                ref="topic-ref"
              >
                <div>Topics</div>
                <div
                  class="arrow_icon relative grid place-items-center w-2 cursor-pointer"
                  style="top: 2px"
                  data-arrow="down"
                  @click="(e) => handleModalContainer(e)"
                >
                  <i class="arrow_down absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <!-- Icon from All by undefined - undefined -->
                      <path
                        fill="currentColor"
                        d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"
                      />
                    </svg>
                  </i>
                  <i class="arrow_up absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <!-- Icon from All by undefined - undefined -->
                      <path
                        fill="currentColor"
                        d="m12 10.8l-4.6 4.6L6 14l6-6l6 6l-1.4 1.4z"
                      />
                    </svg>
                  </i>
                </div>
                <!--modal container-->
                <div class="modal_container absolute top-11 w-56">
                  <ul class="modal_content flex flex-col space-y-4 w-full">
                    <li id="topic_psych" class="modal_link py-1">
                      <a href="#">psychology</a>
                    </li>
                    <li id="topic_algorithm" class="modal_link">
                      <a href="#">algorithm</a>
                    </li>
                    <li id="topic_data" class="modal_link">
                      <a href="#">data structures</a>
                    </li>
                    <li id="topic_javascript" class="modal_link">
                      <a href="#">javascript</a>
                    </li>
                    <li id="topic_c" class="modal_link">
                      <a href="#">C</a>
                    </li>
                    <li id="topic_c_plus" class="modal_link">
                      <a href="#">C++</a>
                    </li>
                    <li id="topic_gaming" class="modal_link">
                      <a href="#">javascript for gaming</a>
                    </li>
                    <li id="topic_github" class="modal_link">
                      <a href="#">github</a>
                    </li>
                  </ul>
                </div>
              </li>
              <li class="nav_link flex items-center justify-center w-24 mx-4">
                <button
                  type="button"
                  class="grid place-items-center w-full h-6 text-xs cursor-pointer"
                  style="
                    background-color: var(--card-box);
                    color: var(--accent-color-3);
                    border-radius: 5px;
                  "
                  @click="redirectPost('create')"
                >
                  create a post
                </button>
              </li>
            </ul>

            <div
              id="mode_light_admin"
              class="mode_light_container flex-1 flex items-center justify-end"
            >
              <div
                class="mode_switch_box grid place-items-center w-8 h-8 p-1 relative"
                :data-mode="modeScene"
              >
                <div
                  id="dark_box"
                  class="dark_box w-full h-full absolute grid place-items-center"
                  style="color: var(--title)"
                >
                  <i class="icon_mode"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                    >
                      <!-- Icon from All by undefined - undefined -->
                      <g fill="currentColor" fill-opacity="0">
                        <path
                          d="M15.22 6.03l2.53 -1.94l-3.19 -0.09l-1.06 -3l-1.06 3l-3.19 0.09l2.53 1.94l-0.91 3.06l2.63 -1.81l2.63 1.81l-0.91 -3.06Z"
                        >
                          <animate
                            fill="freeze"
                            attributeName="fill-opacity"
                            begin="0.7s"
                            dur="0.4s"
                            values="0;1"
                          />
                        </path>
                        <path
                          d="M19.61 12.25l1.64 -1.25l-2.06 -0.05l-0.69 -1.95l-0.69 1.95l-2.06 0.05l1.64 1.25l-0.59 1.98l1.7 -1.17l1.7 1.17l-0.59 -1.98Z"
                        >
                          <animate
                            fill="freeze"
                            attributeName="fill-opacity"
                            begin="1.1s"
                            dur="0.4s"
                            values="0;1"
                          />
                        </path>
                      </g>
                      <path
                        fill="currentColor"
                        fill-opacity="0"
                        stroke="currentColor"
                        stroke-dasharray="56"
                        stroke-dashoffset="56"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 6c0 6.08 4.92 11 11 11c0.53 0 1.05 -0.04 1.56 -0.11c-1.61 2.47 -4.39 4.11 -7.56 4.11c-4.97 0 -9 -4.03 -9 -9c0 -3.17 1.64 -5.95 4.11 -7.56c-0.07 0.51 -0.11 1.03 -0.11 1.56Z"
                      >
                        <animate
                          fill="freeze"
                          attributeName="fill-opacity"
                          begin="1.5s"
                          dur="0.15s"
                          values="0;0.3"
                        />
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          dur="0.6s"
                          values="56;0"
                        />
                      </path>
                    </svg>
                  </i>
                </div>
                <div
                  id="light_box"
                  class="light_box w-full h-full absolute grid place-items-center"
                  style="color: var(--title)"
                >
                  <i class="icon_mode"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                    >
                      <!-- Icon from All by undefined - undefined -->
                      <path
                        fill="currentColor"
                        d="M4 13.75H2q-.425 0-.712-.288T1 12.75t.288-.712T2 11.75h2q.425 0 .713.288T5 12.75t-.288.713T4 13.75M7.05 7.8q-.275.275-.7.275t-.7-.275L4.225 6.375q-.3-.3-.3-.7t.3-.7q.3-.275.7-.288t.7.288L7.05 6.4q.275.275.288.687T7.05 7.8M6 19q-.525 0-.887-.363t-.363-.887t.363-.888T6 16.5t.888.363t.362.887t-.363.888T6 19m6-9.25q-1.25 0-2.125.875T9 12.75q0 .425-.288.713T8 13.75t-.712-.288T7 12.75q0-2.075 1.463-3.537T12 7.75t3.538 1.463T17 12.75q0 .425-.288.713T16 13.75t-.712-.288T15 12.75q0-1.25-.875-2.125T12 9.75M9 23q-.525 0-.888-.363t-.362-.887t.363-.888T9 20.5t.888.363t.362.887t-.363.888T9 23m3-4q-.525 0-.888-.363t-.362-.887t.363-.888T12 16.5t.888.363t.362.887t-.363.888T12 19m0-13.25q-.425 0-.712-.288T11 4.75v-2q0-.425.288-.712T12 1.75t.713.288t.287.712v2q0 .425-.288.713T12 5.75M15 23q-.525 0-.888-.363t-.362-.887t.363-.888T15 20.5t.888.363t.362.887t-.363.888T15 23m1.95-15.2q-.3-.3-.3-.7t.3-.7l1.425-1.425q.275-.275.688-.288t.712.288q.275.275.275.7t-.275.7L18.35 7.8q-.275.275-.687.275T16.95 7.8M18 19q-.525 0-.888-.363t-.362-.887t.363-.888T18 16.5t.888.363t.362.887t-.363.888T18 19m2-5.25q-.425 0-.712-.288T19 12.75t.288-.712t.712-.288h2q.425 0 .713.288t.287.712t-.288.713t-.712.287zm-8 0"
                      />
                    </svg>
                  </i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
<style scoped>
a {
  cursor: pointer;
  font-size: 1em;
  padding: 0.25em 1em;
  margin-inline: 8px;
  color: var(--text-link);
  line-height: 16px;
  text-decoration: none;
  font-family: "Mulish", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
}

a.profile_link {
  padding: 0.25em 0;
  margin-inline: 0;
}

ul {
  list-style: none;
}

input:focus {
  outline: none;
  border: 1px solid transparent;
  box-shadow: 0px 0px 5px var(--accent-color-1);
}

#nav_header {
  width: 100vw;
  margin: 0 auto;
  background-color: var(--bg-gen);
}

img {
  width: 100%;
}

.mini_indicator_admin {
  display: inline-block;
  position: absolute;
  top: -2px;
  left: 7ch;
  color: var(--title);
  background-color: var(--accent-color-1);
  font-size: 11px;
  padding: 0em 0.5em;
  border-radius: 5px;
}

.mode_switch_box[data-mode="light"] div#dark_box,
.mode_switch_box[data-mode="dark"] div#light_box {
  visibility: hidden;
  opacity: 0;
  transition: all 1s ease;
}

.mode_switch_box[data-mode="light"] div#light_box,
.mode_switch_box[data-mode="dark"] div#dark_box {
  visibility: visible;
  opacity: 1;
  transition: all 1s ease;
}

.icon_flag[data-flag="newbie"] svg {
  color: rgb(214, 214, 14);
}

.icon_flag[data-flag="intermediary"] svg {
  color: rgb(228, 132, 22);
}

.icon_flag[data-flag="professionnal"] svg {
  color: rgb(82, 48, 92);
}

/* article title */
.article_title a.profile_link {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-decoration: underline;
  font-size: clamp(0.75em, 0.86em, 0.88em);
  line-height: 18px;
}

/* admin css style **/

.admin_secret_wrap input {
  width: 100%;
  height: 1.5rem;
  border: 1px solid transparent;
  border-radius: 5px;
}

.admin_secret_wrap input:focus {
  outline: none;
  border: 1px solid transparent;
  box-shadow: 0px 0px 6px var(--accent-color-1);
}

.btn_admin + .admin_box {
  height: 0;
  width: 100%;
  visibility: hidden;
  margin: 0;
  opacity: 0;
  display: grid;
  place-items: center;
  transition: all 350ms linear;
}

.btn_admin.secret_entry + .admin_box {
  height: 5rem;
  width: 100%;
  visibility: visible;
  opacity: 1;
  margin-bottom: 24px;
  display: grid;
  place-items: center;
  transition: all 450ms ease;
}

/* arrow manipulation */

.arrow_icon[data-arrow="down"] i.arrow_up,
.arrow_icon[data-arrow="up"] i.arrow_down {
  visibility: hidden;
  opacity: 0;
  transition: all 1s ease;
}

.arrow_icon[data-arrow="down"] i.arrow_down,
.arrow_icon[data-arrow="up"] i.arrow_up {
  visibility: visible;
  opacity: 1;
  transition: all 1s ease;
}

.arrow_icon[data-arrow="down"] + .modal_container {
  visibility: hidden;
  opacity: 0;
  top: -1.5rem;
  transition: all 500ms linear;
  z-index: 12;
}

.arrow_icon[data-arrow="up"] + .modal_container {
  visibility: visible;
  opacity: 1;
  top: 2.75rem;
  transition: all 850ms ease 100ms;
  z-index: 12;
}

@media (min-width: 160px) {
  /*  .nav-right_panel[data-admin="null"] {
    visibility: hidden;
    opacity: 0;
  }

  .nav-right_panel[data-admin="false"] {
    visibility: visible;
    opacity: 1;
  }

  .nav-right_panel[data-admin="true"] {
  } */

  .brand_image {
    position: relative;
    left: 0;
    width: 31px;
    height: 31px;
  }

  .brand_text {
    color: var(--brand-text);
    padding: 0.25em 0.5em;
    margin-inline: 4px;
    font-family: "Manrope", sans-serif;
    font-optical-sizing: auto;
    font-weight: 700;
    font-style: normal;
  }

  .search_nav_container {
    width: 22px;
    height: 22px;
    color: var(--text-body);
    /* border: 1px solid var(--text-body); */
    outline: none;
  }

  /* muenu item */

  .menu_bar {
    background-color: var(--text-body);
    position: relative;
    top: 0;
    width: 100%;
    height: 2px;
    transition: all 450ms ease;
  }

  .menu_bar::before,
  .menu_bar::after {
    content: "";
    position: absolute;
    top: -7px;
    background-color: var(--text-body);
    width: 100%;
    height: 100%;
    transition: all 450ms ease;
  }

  .menu_bar::after {
    position: absolute;
    top: 7px;
  }

  .menu_symbol + .modal_container {
    top: -0.25rem;
    right: -1.15rem;
    visibility: hidden;
    opacity: 0;
    transition: all 450ms ease;
  }

  .menu_symbol.active_menu + .modal_container {
    top: 2.5rem;
    right: -1.15rem;
    visibility: visible;
    opacity: 1;
    transition: all 650ms ease;
  }

  .menu_symbol.active_menu .menu_bar {
    width: 76%;
    transform: rotate(135deg);
    transition: all 450ms ease;
  }

  .menu_symbol.active_menu .menu_bar:before,
  .menu_symbol.active_menu .menu_bar:before {
    position: absolute;
    top: 0;
    transform: rotate(90deg);
    transition: all 450ms ease;
  }

  .menu_symbol.active_menu .menu_bar::after {
    position: absolute;
    top: 0;
  }

  /* modal container */
  .modal_container {
    background-color: var(--bg-gen);
    border-radius: 5px;
    border: 1px solid transparent;
    border-top-color: var(--accent-color-1);
    box-shadow: 0px 2px 3px 1px var(--accent-color-1);
  }
  .modal_content {
    height: max-content;
    padding: 1rem 0.25rem 1.5rem;
  }

  .modal_link {
    width: 100%;
    font-size: calc(12px + 0.15vw);
  }
}

@media (min-width: 768px) {
  /* .nav_container[data-admin="null"] .nav_space_fit > * {
    flex: 1;
  } */

  .brand_image {
    position: relative;
    left: 0;
    width: 36px;
    height: 36px;
  }

  .nav_control_desk[data-admin="null"] {
    flex: 1;
  }
  .nav_control_desk[data-admin="false"],
  .nav_control_desk[data-admin="true"] {
    flex: 2;
  }

  .mini_indicator_admin {
    top: -2px;
    left: 12ch;
  }

  .search_nav_container {
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 12px;
    color: var(--text-body-1);
  }

  .nav_link {
    color: var(--text-link);
  }
}
</style>
