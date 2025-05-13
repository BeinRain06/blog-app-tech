import { defineStore } from "pinia";

// with Options object
export const useWarningStore = defineStore("warning", {
  state: () => ({
    isWarning: false,
    warningMsg: null,
  }),
  getters: {
    warningStage: (state) => state.isWarning,
    warningNews: (state) => state.warningMsg,
  },
  actions: {
    warningUpdate(newMsg, thisUser) {
      const user = thisUser ? thisUser : null;
      this.warningMsg = newMsg;
      this.isWarning = true;
      setTimeout(() => {
        if (user) {
          const userKeys = Object.keys(user);
          userKeys.forEach((key) => (user[key] = ""));
        }
        this.warningMsg = null;
        this.isWarning = false;
      }, 5000);
    },
  },
});
