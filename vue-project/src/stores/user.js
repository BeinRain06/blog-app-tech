import { defineStore } from 'pinia'

//using Options Object

export const useUserStore = defineStore('user', {
  state: () => ({
    usersLogin: [],
    currentUsername: null,
    loading: false,
    customIsVisible: false,
    miniCustomIsVisible: false,
    isLogAdminOpen: false,
    isCheckedSingle: false,
    isCheckedAll: true
  }),
  getters: {
    usersLoginList: (state) => {
      return (newUser) => state.usersLogin.push(newUser)
    },
    currentUser: (state) => state.currentUsername,
    loadingState: (state) => state.loading,
    minor: (state) => state.miniCustomIsVisible,
    shortNameUser: (state) => {
      const username = state.currentUsername
      let shortname

      if (username !== null) {
        for (let i = 0; i < username.length; i++) {
          if (
            username[i] === ' ' ||
            username[i] === '-' ||
            username[i] === '_' ||
            username[i] === '.' ||
            username[i] === '@'
          ) {
            shortname = username.slice(0, i)

            return shortname
          }
        }
      }
    }
  },
  actions: {
    usersListed(newUser) {
      const items = this.usersLogin
      const newArr = [...items, newUser]

      this.usersLogin = newArr
    },
    updateStateRadio(label1, label2) {
      const newlabel1 = label1 === 'true' ? true : false
      const newlabel2 = label2 === 'true' ? true : false
      this.isCheckedAll = newlabel1
      this.isCheckedSingle = newlabel2
    }
  }
})

/*<script>
import { RouterLink } from 'vue-router'
import { ref, defineComponent } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { usePostStore } from '@/stores/post.js'

export default defineComponent({
  setUp() {},
  ref: ['refradio1', 'refradio2'],
  computed: {
    currentUserIn: () => {
      const userStore = useUserStore()

      console.log('current user:', userStore.currentUser)
      return userStore.currentUser
    },
    shortyName: () => {
      const userStore = useUserStore()

      console.log('shorty name:', userStore.shortNameUser)
      return userStore.shortNameUser
    },
    lastDateAction: () => {
      const postStore = usePostStore()
      return postStore.lastDate
    },
    countArt: () => {
      const postStore = usePostStore()
      return postStore.countArticles
    },
    custom: () => {
      const userStore = useUserStore()
      return userStore.customIsVisible
    },
    minicustom: () => {
      const userStore = useUserStore()
      return userStore.miniCustomIsVisible
    },
    stateCheckedCustom: () => {
      const userStore = useUserStore()
      return userStore.isCheckedSingle
    }
  },
  methods: {
    handleRadioState(e) {
      console.log(e.target)
      const userStore = useUserStore()

      if (e.target.id === 'all_blogr') {
        userStore.$patch({ isLogAdminOpen: false, isCheckedSingle: false })
      } else if (e.target.id === 'single_blogr') {
        userStore.$patch({ isLogAdminOpen: true, isCheckedSingle: true })
      }

      console.log('ref radio 1 :', this.refradio1)
      console.log('ref radio 2 :', this.refradio2)

      console.log('isLogAdminOpen in Navbar:', userStore.isLogAdminOpen)
      console.log('isCheckedSingle in Navbar:', userStore.isCheckedSingle)
    },
    handleCustom(e) {
      console.log('e parent element', e.currentTarget.parentElementChild)
      const userStore = useUserStore()
      const newState = !userStore.customIsVisible

      userStore.$patch({ customIsVisible: newState })
    },
    handleMiniCustom(e) {
      console.log('e parent element mini:', e.target.parentElement.parentElement.lastElementChild)
      const userStore = useUserStore()
      const newState = !userStore.miniCustomIsVisible
      userStore.$patch({ miniCustomIsVisible: newState })
      console.log('new state:', newState)
    }
  }
})
</script> */
