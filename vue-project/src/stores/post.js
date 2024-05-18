import { defineStore } from 'pinia'

//using Options Object

export const usePostStore = defineStore('post', {
  state: () => ({ lastPost: {}, countArticles: 0 }),
  getters: {
    lastDate: (state) => state.lastPost.date
  },
  actions: {
    editANewPost(exPostData) {
      console.log(exPostData)
    }
  }
})
