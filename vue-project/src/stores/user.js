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

      if (username !== null && username !== undefined) {
        for (let i = 0; i < username?.length; i++) {
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
        if (username.split(' ').length === 1) {
          shortname = username

          return shortname
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

/* console.log('this-user', this.user)
const initInfoUser = await initiateadminapi(this.user)
const isAuthenticate = await loginadminapi(initInfoUser) */
