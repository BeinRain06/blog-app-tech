import { defineStore } from 'pinia'
import { getpostsapi } from '@/api/post-api'

//using Options Object

export const usePostStore = defineStore('post', {
  state: () => ({
    lastPost: {},
    countArticles: 0,
    title: '',
    summary: '',
    content: '',
    allposts: null,
    postInPage: null
  }),
  getters: {
    lastDate: (state) => state.lastPost.date,
    fetchPosts: (state) => state.allposts
  },
  actions: {
    async updateHomePage() {
      const posts = await getpostsapi()
      this.allposts = posts

      return posts
    }
  }
})
