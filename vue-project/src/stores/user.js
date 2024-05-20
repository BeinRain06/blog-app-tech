import { defineStore } from 'pinia'

//using Options Object

export const useUserStore = defineStore('user', {
  state: () => ({ usersLogin: [], currentUsername: null, loading: false }),
  getters: {
    usersLoginList: (state) => {
      return (newUser) => state.usersLogin.push(newUser)
    },
    currentUser: (state) => state.currentUsername,
    loadingState: (state) => state.loading,
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
    }
  }
})
