import { defineStore } from 'pinia'

//using Options Object

export const usePostStore = defineStore('post', {
  state: () => ({
    lastPost: {},
    countArticles: 0,
    title: '',
    summary: '',
    content: ''
  }),
  getters: {
    lastDate: (state) => state.lastPost.date
  },
  actions: {
    editPost(exPostData) {
      console.log(exPostData)
    }
  }
})
