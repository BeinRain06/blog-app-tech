import { defineStore } from "pinia";
import { getpostsapi } from "@/api/post-api";

//using Options Object

export const usePostStore = defineStore("post", {
  state: () => ({
    lastPost: {},
    countArticles: 0,
    title: "",
    summary: "",
    content: "",
    allposts: null,
    postInPage: null,
  }),
  getters: {
    lastDate: (state) => state.lastPost.date,
    fetchPosts: (state) => state.allposts,
    postDisplaying: (state) => state.postInPage,
  },
  actions: {
    async updateHomePage() {
      const posts = await getpostsapi();
      console.log("memory posts:", posts);
      this.allposts = posts;

      return posts;
    },

    getPostToDisplay(id) {
      const postSaved = this.postInPage;

      if (postsaved.id === id) {
        return postSaved;
      }
    },
  },
});
