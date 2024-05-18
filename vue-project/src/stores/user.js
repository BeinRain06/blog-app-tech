import { defineStore } from 'pinia'

//using Options Object

export const useUserStore = defineStore('user', {
  state: () => ({ usersLogin: [], currentUsername: '', loading: false }),
  getters: {
    usersLoginList: (state) => {
      return (newUser) => state.usersLogin.push(newUser)
    },
    currentUser: (state) => state.currentUsername,
    shortNameUser: (state) => {
      const username = this.currentUser
      let shortname
      for (let i = 0; i < username.length; i++) {
        if (
          charAt[i] === ' ' ||
          charAt[i] === '-' ||
          charAt[i] === '_' ||
          charAt[i] === '.' ||
          charAt[i] === '@'
        ) {
          shortname = username.slice(0, i)
          return
        }
      }

      return shortname
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
