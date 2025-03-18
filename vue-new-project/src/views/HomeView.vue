<template>
  <main>
    <div id="home_page" class="home_page relative w-full px-0 py-2 xsm:p-8">
      <div
        v-for="(postItem, i) in allposts"
        key="{{postItem.id}}"
        id="{{postItem.id}}"
        data-author="{{postItem.author}}"
        class="card_out_wrapper max-w-full p-1 xsm:p-2 z-10"
        ref="postRef"
      >
        <div class="card_in_wrapper" @click="(e) => reachPostPage(e, i)">
          <div class="card_img_wrap p-0 xsm:p-1">
            <img
              class="card_img object-cover w-full h-full p-1"
              :src="postItem.image"
              alt="post picture"
            />
          </div>
          <div class="card_container w-full">
            <div
              class="card_content_wrap relative w-full flex flex-col justify-center items-center rounded-sm gap-3"
            >
              <div class="wrap_post_title w-full px-2 py-1 sm:p-2">
                <h1
                  id="post_title"
                  class="post_title font-bold cursor-pointer z-20 transition-all duration-400 ease-in-out hover:text-gray-700"
                >
                  {{ postItem.title }}
                </h1>
              </div>
              <div class="author_info_wrapper w-full">
                <div
                  class="author_info_content max-w-6/12 flex flex-col xsm:flex-row gap-1 justify-center items-center text-center xsm:tex-left"
                >
                  <h4 class="author_name text-sm xsm:text-base">
                    {{ postItem.author.username }} |
                  </h4>
                  <span class="posted_at font-light text-sm md:text-base"
                    >{{ postItem.date }} |</span
                  >
                  <button
                    class="btn-edit-link"
                    @click.prevent="(e) => redirectEditPage(e, i)"
                  >
                    <img
                      class="svg_edit w-6 h-4 cursor-pointer"
                      src="../assets/edit-svgrepo-com.svg"
                      alt="edit post"
                    />
                  </button>
                </div>
              </div>
              <div class="summary_wrapper w-full px-2 py-4 sm:p-2">
                <div class="summary_content">
                  <div class="w-full flex">
                    <h3 class="summary_title w-full font-medium">Summary</h3>
                  </div>
                  <div class="paragraph_container cursor-pointer">
                    <p
                      id="inner_summary"
                      class="paragraph_inner_content text-xl z-20 hover:text-gray-700"
                    >
                      {{ postItem.summary }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="allposts === null" class="w-screen h-60 flex items-center">
        <div
          class="empty_content_posts w-full h-full flex flex-col justify-start"
        >
          <div
            class="relative top-0 left-2 w-screen h-12 flex items-start bg-gray-50"
          >
            <p
              class="btn_previous underline cursor-pointer z-10"
              @click="reloadHomeContent"
            >
              <span class="m-2">&larr;</span> back
            </p>
          </div>
          <p
            class="empty_home_posts w-full h-auto text-center"
            style="font-size: calc(28px + 1vw)"
          >
            not found
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import {
  ref,
  onBeforeMount,
  computed,
  onMounted,
  onUnmounted,
  onUpdated,
} from "vue";
import { useRouter } from "vue-router";
/* import TheWelcome from '../components/TheWelcome.vue' */
import { arrayImg, dataPostsList } from "../assets/images-blog-post/index.js";
import { useUserStore } from "@/stores/user.js";
import { usePostStore } from "@/stores/post.js";

const postRef = ref(null);

const router = useRouter();

const postStore = usePostStore();

const userStore = useUserStore();

const posts = onMounted(async () => {
  const postStore = usePostStore();
  const postsFetch = await postStore.updateHomePage();

  setTimeout(() => {
    console.log("update home page");
  }, 3400);

  return postsFetch;
});

const allposts = computed(() => {
  const postStore = usePostStore();
  if (postStore.fetchPosts === null) {
    setTimeout(() => {
      // wait a moment please
    }, 2000);
  }
  return postStore.fetchPosts;
});

async function redirectEditPage(e, i) {
  const postStore = usePostStore();
  const userStore = useUserStore();
  const userId = userStore.currentUserId;

  const postEdit = postStore.allposts[i];

  const postId = postEdit.id;

  const useridInPost = postEdit.author.id;

  if (userStore.currentUsername !== null && userId === useridInPost) {
    postStore.$patch({ postInPage: postEdit });

    setTimeout(() => {
      router.push({ path: "/edit" });
    }, 1500);
  } else {
    alert("can't edit this post, not login or not the author");
    return;
  }
}

async function reachPostPage(e, i) {
  const postStore = usePostStore();
  const postTargeted = postStore.allposts[i];
  console.log("e target:", e.target);
  console.log("post targeted:", postTargeted);

  const postId = postTargeted.id;

  if (e.target.id === "post_title" || e.target.id === "inner_summary") {
    await postStore.$patch({ postInPage: postTargeted });

    setTimeout(() => {
      // wait a moment
      router.push({ path: "/page" });
    }, 600);
  }
}

async function reloadHomeContent() {
  const postStore = usePostStore();
  const postsFetch = await postStore.updateHomePage();
  setTimeout(() => {
    console.log("update home page");
  }, 1500);
}
</script>

<style scoped>
@import "tailwindcss";

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

@media (min-width: 180px) {
  h1 {
    font-size: calc(18px + 1.6vw);
    line-height: 1.2;
  }

  h3 {
    font-size: calc(16px + 0.88vw);
    line-height: 1.2;
  }

  p {
    font-family: "Reddit Sans", sans-serif;
    font-optical-sizing: auto;
    font-weight: 390;
    font-style: normal;
    font-size: calc(15px + 0.3vw);
    padding-top: 1rem;
    line-height: 1.6;
  }

  .card_in_wrapper {
    perspective: 500px;
    width: 100%;
    padding: 0 0.25rem;
    display: grid;
    grid-auto-columns: 100%;
    grid-auto-rows: min-content max-content;
    gap: 0.5rem;
  }

  .card_in_wrapper .card_img_wrap {
    width: 100%;
    height: 10rem;
    transform: scale(1);
  }

  .card_in_wrapper .card_container {
    transform: scale(1);
  }

  .card_content_wrap:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0.45em;
    height: 0.45em;
    border-radius: 0.125rem;
    background-color: transparent;
  }

  .summary_content {
    perspective: 500px;
    width: calc(100%);
    height: 100%;
  }

  .summary_content .paragraph_container {
    transform: scale(1);
    line-height: 0.8;
    letter-spacing: 1px;
  }
}

@media (min-width: 240px) {
  h1 {
    font-size: calc(22px + 1.6vw);
  }

  p {
    font-weight: 230;
  }

  .home_page {
    padding: 2rem 1em;
  }

  .card_in_wrapper {
    padding: 0.5rem;
  }
  .card_in_wrapper .card_img_wrap {
    height: 14rem;
  }

  .summary_content .paragraph_container {
    line-height: 1.2;
    letter-spacing: 1px;
  }
}

@media (min-width: 560px) {
  h1 {
    font-size: calc(25px + 1.6vw);
  }

  .home_page {
    padding: 2rem;
  }

  .card_in_wrapper .card_img_wrap {
    height: 19.6rem;
  }
}

@media (min-width: 860px) {
  h1 {
    font-size: calc(26px + 1.6vw);
  }

  h3 {
    font-size: calc(16px + 0.88vw);
    position: relative;
    left: calc(7% + 5px);
  }

  p {
    font-size: calc(15px + 0.3vw);
    padding-top: 0.75rem;
    line-height: 1.6;
  }

  .home_page {
    padding: 1rem 0.5rem;
  }

  .card_in_wrapper {
    perspective: 500px;
    width: 100%;
    padding: 0.5rem;
    display: grid;
    grid-template-columns: 44% 1fr;
    grid-auto-rows: max-content;
    gap: 1rem;
  }

  .card_in_wrapper .card_img_wrap {
    width: 100%;
    height: calc(max-content);
    max-height: 26rem;
    transform: scale(1);
  }

  .card_in_wrapper .card_container {
    transform: scale(0.96);
  }

  .summary_content {
    perspective: 500px;
    width: calc(100% - 1em);
    height: 100%;
  }
  .summary_content .paragraph_container {
    transform: scale(0.96);
  }
}
</style>
