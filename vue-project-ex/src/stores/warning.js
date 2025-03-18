import { defineStore } from 'pinia'

// with Options object
export const useWarningStore = defineStore('warning', {
  state: () => ({
    isWarning: false,
    warningMsg: null
  }),
  getters: {
    warningStage: (state) => state.isWarning,
    warningNews: (state) => state.warningMsg
  },
  actions: {
    warningUpdate(newMsg, user) {
      this.warningMsg = newMsg
      this.isWarning = true
      setTimeout(() => {
        this.warningMsg = null
        this.isWarning = false
        const userKeys = Object.keys(user)
        userKeys.forEach((key) => (user[key] = ''))
      }, 3000)
    }
  }
})
