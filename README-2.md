## Huge Issues Encountered

### Issue 1 : commutate between all navbar when Registering or Login

> all NavBar :

- no login
- login standard
- login admin

**details**: my data in pinia store wasn't updated instantly after registration or login process

**solution** : use **storeToRefs** property from pinia in `child component`

**code** in project : `NavbarNewBlog.vue`

```js
import { watch } from "vue";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { navbarState } = storeToRefs(userStore);

watch(navbarState, async () => {
  console.log("navbarState in watch", navbarState);

  switch (navbarState.value) {
    case "logout":
      navLogoutRef.value?.classList.remove("hidden");
      navLoginRef.value?.classList.add("hidden");
      navLoginAdminRef.value?.classList.add("hidden");
      break;
    case "standard":
      navLoginRef.value?.classList.remove("hidden");
      navLogoutRef.value?.classList.add("hidden");
      navLoginAdminRef.value?.classList.add("hidden");
      break;
    case "admin":
      navLoginAdminRef.value?.classList.remove("hidden");
      navLogoutRef.value?.classList.add("hidden");
      navLoginRef.value?.classList.add("hidden");

      break;
    default:
      throw new Error("Error Commutating NavState");
  }

  console.log("navHold State :", props.navState);
});
```

<br/>

**code** in project : `App.vue`

To stick the right Navbar according to the data in `sessionStorage`

```js
onMounted(async () => {
  async function mountNavBar() {
    const checkPrevNav = await sessionStorage.getItem("navbar-state");
    if (checkPrevNav) {
      let newNavState;
      const cookies = JSON.parse(document.cookie);
      const userName = cookies.userInfo.userName;

      setTimeout(async () => {
        newNavState = checkPrevNav;
        const userStore = await useUserStore();
        userStore.$patch({
          navbarState: newNavState,
          currentUsername: userName,
        });
      }, 4000);
    }
  }

  await mountNavBar();
});
```

<br/>

**Link source help** : [https://stackoverflow.com/questions/71676111/vue-component-doesnt-update-after-state-changes-in-pinia-store](https://stackoverflow.com/questions/71676111/vue-component-doesnt-update-after-state-changes-in-pinia-store)
