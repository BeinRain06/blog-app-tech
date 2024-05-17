import { defineStore } from 'pinia'

//using Options Object

export const useUserStore = defineStore('user', {
  state: () => ({ usersLogin: [], currentUsername: '' }),
  getters: {
    countUsersLogin: (state) => state.usersLogin.length
  },
  actions: {
    findUsername(username) {
      const userSet = this.usersLogin.find((item) => item === username)
      if (userSet !== undefined) {
        return userSet
      } else {
        throw new Error('this usernane not found')
      }
    }
  }
})
