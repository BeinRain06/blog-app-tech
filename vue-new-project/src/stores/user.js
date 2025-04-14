import { defineStore } from "pinia";

//using Options Object

export const useUserStore = defineStore("user", {
  state: () => ({
    usersLogin: [],
    currentUsername: null,
    currentUserId: null,
    loading: false,
    isAdmin: false,
    navbarState: "logout",
  }),
  getters: {
    usersLoginList: (state) => {
      return (newUser) => state.usersLogin.push(newUser);
    },
    navState: (state) => state.navbarState,
    currentUser: (state) => state.currentUsername,
    loadingState: (state) => state.loading,
    minor: (state) => state.miniCustomIsVisible,
  },

  actions: {
    async updateUserStore(newUser) {
      const exUsersArr = this.usersLogin;

      this.currentUsername = newUser.userName;
      this.currentUserId = newUser.userId;
      this.usersLogin = [...exUsersArr, newUser.userName];
      this.isAdmin = newUser.admin;
    },

    resetUserData(userNamePick) {
      const newUsersLogin = this.usersLogin.filter(
        (user) => user !== userNamePick
      );
      this.usersLogin = newUsersLogin;
      this.currentUsername = null;
      this.currentUserId = null;
      this.isAdmin = false;

      this.navbarState = "logout";
    },
  },
});
