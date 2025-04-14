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
import { shortNameUser } from "../reusable/collaborate-function.js";

const postRef = ref(null);

const allposts = ref();

const authorShortName = ref([]);

const router = useRouter();

onMounted(async () => {
  setTimeout(() => {
    console.log("updating...");
  }, 4000);

  const postStore = await usePostStore();

  const postsFetch = await postStore.updateHomePage();
  console.log("postsFetch :", postsFetch);

  if (postsFetch) {
    postsFetch.map((post) => {
      const authorName = post.author?.username;

      /* const authorArrName = authorName.split(" ");
       const shortname =
        authorArrName[0][0].toUpperCase() + authorArrName[0].slice(1); */

      console.log("authorname:", authorName);
      const shortname = shortNameUser(authorName);

      authorShortName.value.push(shortname);
    });
  }

  allposts.value = postsFetch;
});

/* const allposts = computed(async () => {
  const postStore = await usePostStore();
  if (postStore.fetchPosts === null) {
    setTimeout(() => {}, 5000);
  }

  const postFetch = postStore.fetchPosts;

  if (postFetch) {
    postFetch.map((post) => {
      const authorName = post.author?.username;
      const authorArrName = authorName.split(" ");
      const shortname =
        authorArrName[0][0].toUpperCase() + authorArrName[0].slice(1);

      authorShortName.value.push(shortname);
    });
  }

  return postStore.fetchPosts;
}); */

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

  const postId = postTargeted.id;

  const postSaved = JSON.stringify(postTargeted);

  sessionStorage.setItem("postPage", postSaved);

  if (e.target.id === "title_article") {
    await postStore.$patch({ postInPage: postTargeted });

    setTimeout(() => {
      // wait a moment
      router.push({ path: `/page/${postId}` });
    }, 600);
  }

  /*  if (e.target.id === "post_title" || e.target.id === "inner_summary") {
    await postStore.$patch({ postInPage: postTargeted });

    setTimeout(() => {
    
      router.push({ path: `/page/${postId}` });
    }, 600);
  } */
}

async function reloadHomeContent() {
  const postStore = usePostStore();
  const postsFetch = await postStore.updateHomePage();
  setTimeout(() => {
    console.log("update home page");
  }, 1500);
}
</script>

<template>
  <main id="home_broadcast" class="home_broadcast">
    <!--home card-->
    <div id="home_page" class="home_page relative w-full">
      <div
        v-for="(postItem, i) in allposts"
        key="{{postItem.id}}"
        id="{{postItem.id}}"
        data-author="{{postItem.author}}"
        class="card_out_wrapper max-w-full p-1 xsm:p-2 z-10"
        ref="postRef"
      >
        <div class="card_box" @click="(e) => reachPostPage(e, i)">
          <div class="card_box_up relative">
            <div class="card_username">
              <span class="username under_gray">
                {{ authorShortName[i] }}
              </span>

              <div class="initial_user">
                {{ postItem.author.username[0].toUpperCase() }}
              </div>
            </div>
            <div
              class="card_profile flex flex-col items-center justify-center space-y-4 h-full"
            >
              <div class="title_article_wrap text-center w-4/5 py-2 mx-auto">
                <h2
                  id="title_article"
                  class="title_article tone_text_title z-20"
                >
                  {{ postItem.title }}
                </h2>
              </div>
              <div
                class="article_frame w-full flex flex-col items-center justify-center gap-4"
              >
                <div class="image_article">
                  <img
                    :src="postItem.image"
                    class="object-cover w-full h-full"
                    alt="article profile"
                  />
                </div>
                <div
                  class="info_publish text_date flex items-center justify-center gap-x-3 w-full h-6"
                >
                  <ul class="mob_author_name">
                    <li>
                      <div class="nickname">
                        {{ authorShortName[i] }}
                      </div>
                    </li>
                    <li>
                      <div class="initial_user">
                        {{ postItem.author.username[0].toUpperCase() }}
                      </div>
                    </li>
                  </ul>
                  <div
                    style="
                      padding: 2px;
                      color: var(--text-body);
                      text-decoration: underline;
                    "
                  >
                    Published:
                  </div>
                  <span>Wed, 5th Mar 2025</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card_box_middle relative">
            <div class="title_article_wrap text-center w-11/12 py-2 mx-auto">
              <h2 id="title_article" class="title_article tone_text_title z-20">
                {{ postItem.title }}
              </h2>
            </div>
            <div class="box_tech_card">
              <div class="box_edition relative">
                <div class="update_infos text_date">
                  <span class="leading-snug">updated:</span>
                  <span class="leading-snug">17 March, 2025</span>
                </div>
                <div class="edit_wrap">
                  <div
                    class="edit_article flex items-center justify-center gap-x-2 mx-auto"
                  >
                    <span
                      class="edit_label text_edit grid place-items-start h-full"
                      style="padding-bottom: 1px; text-decoration: underline"
                      >Edit</span
                    >

                    <i
                      class="edit_frame tone_text_link grid place-items-start h-full cursor-pointer"
                      style="padding-top: 2px"
                      @click.prevent="(e) => redirectEditPage(e, i)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                      >
                        <!-- Icon from All by undefined - undefined -->
                        <path
                          fill="currentColor"
                          d="M4 14v-2h7v2zm0-4V8h11v2zm0-4V4h11v2zm9 14v-3.075l6.575-6.55l3.075 3.05L16.075 20zm7.5-6.575l-.925-.925zm-6 5.075h.95l3.025-3.05l-.45-.475l-.475-.45l-3.05 3.025zm3.525-3.525l-.475-.45l.925.925z"
                        />
                      </svg>
                    </i>
                  </div>
                </div>
              </div>
              <div class="summary_content">
                <div class="summary_title tone_text_title">Summary:</div>

                <p>
                  {{ postItem.summary }}
                </p>
              </div>
            </div>
            <div id="inside_flow" class="card_box_down">
              <div class="details_interactivity">
                <div class="like_wrapper">
                  <span>Likes</span>
                  <i
                    class="img_like grid place-items-center"
                    style="width: 15px; height: 12px"
                  >
                    <img
                      src="../assets/icons8-like-24.png"
                      class="w-full h-full object-cover"
                      alt="like missing"
                    />
                  </i>
                  <span>3</span>
                </div>
                <div class="comment_wrapper">
                  <span class="under_green">Comments:</span>
                  <span>14</span>
                </div>
                <div class="view_wrapper">
                  <span>Views:</span>
                  <span>41</span>
                </div>
              </div>
              <div class="time_reading italic">
                <span>8 min read</span>
              </div>
            </div>
          </div>
          <div id="down_flow" class="card_box_down">
            <div class="details_interactivity">
              <div class="like_wrapper">
                <span>Likes</span>
                <i
                  class="img_like grid place-items-center"
                  style="width: 15px; height: 12px"
                >
                  <img
                    src="../assets/icons8-like-24.png"
                    class="w-full h-full object-cover"
                    alt="like missing"
                  />
                </i>
                <span>3</span>
              </div>
              <div class="comment_wrapper">
                <span class="under_green">Comments:</span>
                <span>14</span>
              </div>
              <div class="view_wrapper">
                <span>Views:</span>
                <span>41</span>
              </div>
            </div>
            <div class="time_reading italic">
              <span>8 min read</span>
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
    <!--aside card-->
    <div class="aside_section">
      <div class="aside_container">
        <div class="latest_wrap aside_activity">
          <h3>Latest Articles</h3>
          <div class="latest_articles aside_group">
            <div id="last_1" class="in_board">
              <h4 class="title_last underline">
                The Motherhood Penalty and the Fatherhood Competence Gap
              </h4>
            </div>
            <div id="last_2" class="in_board">
              <h4 class="title_last underline">
                5 conversation habits that make people secretly lose respect for
                you
              </h4>
            </div>
            <div id="last_3" class="in_board">
              <h4 class="title_last underline">
                What I Wish I Knew: “Your writing is not about you”
              </h4>
            </div>
          </div>
        </div>
        <div class="last_update_wrap aside_activity">
          <h3>Last Update</h3>
          <div class="latest_articles aside_group">
            <div id="last_up_1" class="in_board">
              <h4 class="title_last underline">
                Craziest MCP Servers You Must Try
              </h4>
              <div class="topic_updated">AI</div>
            </div>
            <div id="last_up_2" class="in_board">
              <h4 class="title_last underline">
                CORS Finally Explained — Simply
              </h4>
              <div class="topic_updated">Javascript</div>
            </div>
            <div id="last_up_3" class="in_board">
              <h4 class="title_last underline">
                The Great Mental Health Privilege
              </h4>
              <div class="topic_updated">Psychology</div>
            </div>
          </div>
        </div>
        <div class="topics_trend_wrap w-full flex flex-col items-center gap-2">
          <h3>Trend Topics</h3>
          <div class="trend_container flex items-center justify-center w-full">
            <div id="trend_1" class="trending_topic">Psychology</div>
            <div id="trend_2" class="trending_topic">AI</div>
            <div id="trend_3" class="trending_topic">Data Structures</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import "tailwindcss";

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

@media (min-width: 160px) {
  /* utilities */

  .tone_text_link {
    color: var(--text-link);
  }

  .tone_text_title {
    color: var(--title);
  }

  .text_date {
    font-size: calc(12px + 0.2vw);
  }

  .text_edit {
    font-size: calc(11px + 0.15vw);
  }

  .under_gray {
    width: max-content;
    padding-bottom: 1px;
    border-bottom: 1px solid var(--text-link);
  }

  .under_green {
    width: max-content;
    padding-bottom: 1px;
    border-bottom: 1px solid var(--accent-color-1);
  }

  p {
    font-size: calc(12px + 0.08vw);
    line-height: 24px;
    color: var(--text-body);
    font-family: "Mulish", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }

  h2 {
    font-size: calc(20px + 0.12vw);
    padding-bottom: 2rem;
    font-weight: 500;
    line-height: 40px;
  }

  h3 {
    font-size: calc(15px + 0.1vw);
    padding: 0.5rem 0;
    font-weight: 500;
    color: var(--accent-color-3);
  }

  h4 {
    font-size: calc(11px + 0.1vw);
    font-weight: 500;
    color: var(--text-body-1);
    line-height: 24px;

    display: flex;
    justify-content: center;
    width: 94%;
    margin: 0 auto;
    padding: 0;
  }

  ul {
    list-style: none;
  }

  ul.mob_author_name {
    @apply flex items-center h-full mr-2;
  }

  ul.mob_author_name .nickname {
    color: var(--text-link);
    font-size: 1.25em;
  }

  ul.mob_author_name .initial_user {
    position: relative;
    top: -5px;
    left: 4px;
    width: 10px;
    height: 10px;
    color: var(--title);
    background-color: var(--accent-color-1);
    font-size: 8px;
    display: grid;
    place-items: center;
  }

  .home_broadcast {
    width: 100vw;
    padding: 1rem 0 2rem;
    background-color: var(--bg-gen);
  }

  .home_page {
    width: 100%;
    padding: 0.5rem 0;
  }

  /* new card box */

  .card_box {
    width: 100%;
    padding: 2rem 1.5rem;
    margin-top: 1.5rem;
    color: var(--text-body);
    background-color: var(--card-box);
    @apply flex flex-col items-center justify-center gap-4;
  }

  .card_box_up {
    @apply flex items-center justify-center w-full;
  }

  .card_box_up .card_username {
    @apply hidden;
  }

  .card_username .initial_user {
    display: none;
  }

  .card_box_up .card_profile {
    width: 100%;

    font-family: "Mulish", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }

  .article_frame .image_article {
    @apply grid place-items-center w-full h-auto;
    aspect-ratio: 16/9;
  }

  /*card box middle */

  .card_box_middle {
    height: auto;
    margin-top: 1rem;
    @apply w-full;
  }

  .card_box_middle .title_article_wrap {
    display: none;
  }

  .card_box_middle .box_tech_card {
    @apply w-full flex flex-col-reverse items-stretch justify-center gap-4;
  }

  .card_box_middle .box_tech_card {
    @apply w-full flex flex-col-reverse items-stretch justify-center gap-4;
  }

  .box_tech_card .box_edition {
    @apply flex flex-col items-center justify-between w-full h-16;
  }

  .box_edition .update_infos {
    @apply w-full flex-shrink-0 flex flex-row text-left;
  }

  .box_edition .edit_wrap {
    @apply w-full flex justify-end h-auto;
  }

  .card_box_middle .summary_content {
    @apply flex flex-col gap-2 w-full;
  }

  /* card box down */

  #inside_flow.card_box_down {
    @apply hidden;
  }

  #down_flow.card_box_down {
    @apply flex;
  }

  .card_box_down {
    @apply flex flex-col justify-between w-full;
  }

  .card_box_down .details_interactivity {
    @apply flex items-center gap-x-5;
  }

  .like_wrapper,
  .comment_wrapper,
  .view_wrapper {
    @apply flex items-center gap-x-3;
  }

  .like_wrapper {
    @apply hidden;
  }

  .card_box_down .time_reading {
    width: 100%;
    padding: 0.5rem 0;
    color: var(--title);
    display: flex;
    justify-content: flex-end;
  }

  .card_box_down span,
  .card_box_down .time_reading {
    font-size: calc(12px + 0.1vw);
  }

  /* aside section */

  .aside_section {
    width: 100%;
  }

  .aside_container {
    width: 100%;
    margin-top: 2rem;
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top: 4px solid var(--card-box);
  }

  .aside_activity {
    width: 100%;
    padding: 0.5rem 0 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .aside_group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .in_board {
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    gap: 0.25rem;
  }

  .topic_updated {
    font-size: calc(8px + 0.05vw);
    width: 4rem;
    padding: 0 4px;
    color: var(--title);
    justify-self: end;
    display: grid;
    place-items: center;
    border-radius: 8px;
  }

  #last_up_1 .topic_updated {
    border: 1px solid var(--brand-text);
  }

  #last_up_2 .topic_updated {
    border: 1px solid var(--accent-color-2);
  }

  #last_up_3 .topic_updated {
    border: 1px solid var(--accent-color-1);
  }

  .topics_trend_wrap {
    margin-top: 2rem;
  }

  .trending_topic {
    width: 7.2rem;
    height: 2rem;

    display: grid;
    place-items: center;
    font-size: calc(12px + 0.15vw);

    font-family: "Mulish", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }

  #trend_1 {
    color: var(--accent-color-2);
  }

  #trend_2 {
    color: var(--accent-color-1);
  }

  #trend_3 {
    color: var(--brand-text);
  }
}

@media (min-width: 460px) {
  h2 {
    font-size: calc(26px + 0.12vw);
  }

  h3 {
    font-size: calc(18px + 0.1vw);
  }

  h4 {
    font-size: calc(12px + 0.15vw);

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    width: 94%;
    margin: 0;
  }

  p {
    font-size: calc(13px + 0.08vw);
    line-height: 24px;
    color: var(--text-body);
  }

  .text_date {
    font-size: calc(13px + 0.05vw);
  }

  .text_edit {
    font-size: calc(12px + 0.15vw);
  }

  .home_broadcast {
    padding: 1rem 1rem 2rem;
  }

  .home_page {
    padding: 0.5rem;
  }

  /* new card box */

  .card_box {
    width: 100%;
    padding: 2rem 1.5rem;
    margin-top: 1.5rem;
    color: var(--text-body);
    background-color: var(--card-box);
  }

  .article_frame .image_article {
    @apply grid place-items-center w-96 h-52;
    aspect-ratio: unset;
  }

  /*card box middle */

  .card_box_middle .box_tech_card {
    @apply w-full flex flex-col-reverse items-stretch justify-center gap-4;
  }

  .box_tech_card .box_edition {
    @apply flex flex-row items-center justify-between w-full h-10;
  }

  .box_edition .update_infos {
    @apply w-max flex-shrink-0 flex flex-row text-center;
  }

  .box_edition .edit_wrap {
    @apply w-max flex justify-center h-auto;
  }

  /* card box down */

  .like_wrapper {
    @apply flex;
  }

  /* .card_box_down .time_reading {
    width: max-content;
    padding: 0;
    display: flex;
    justify-content: center;
  } */

  .card_box_down span,
  .card_box_down .time_reading {
    font-size: calc(12px + 0.15vw);
  }

  /* aside section */

  .aside_section {
    width: 100%;
  }

  .aside_container {
    width: 100%;
    margin-top: 2rem;
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top: 4px solid var(--card-box);
  }

  .aside_activity {
    width: 100%;
    padding: 0.5rem 0 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .aside_group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .in_board {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
  }

  .topic_updated {
    font-size: calc(11px + 0.05vw);
    width: 6rem;
    padding: 2px 8px;
  }

  #last_up_1 .topic_updated {
    border: 1px solid var(--brand-text);
  }

  #last_up_2 .topic_updated {
    border: 1px solid var(--accent-color-2);
  }

  #last_up_3 .topic_updated {
    border: 1px solid var(--accent-color-1);
  }

  .topics_trend_wrap {
    margin-top: 2rem;
  }

  .trending_topic {
    width: 7.2rem;
    height: 2rem;

    display: grid;
    place-items: center;
    font-size: calc(12px + 0.15vw);

    font-family: "Mulish", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }

  #trend_1 {
    color: var(--accent-color-2);
  }

  #trend_2 {
    color: var(--accent-color-1);
  }

  #trend_3 {
    color: var(--brand-text);
  }
}

@media (min-width: 680px) {
  h3 {
    font-size: calc(22px + 0.1vw);
  }

  h4 {
    font-size: calc(14px + 0.1vw);
  }

  p {
    font-size: 18px;
    line-height: 24px;
  }

  .text_date {
    font-size: 16px;
  }

  .text_edit {
    font-size: calc(12px + 0.15vw);
  }

  .home_page {
    width: 100%;
    padding: 0.5rem 0;
  }

  ul.mob_author_name {
    @apply hidden;
  }
  /* new card box */

  .card_box_up .card_username {
    width: 30%;
    @apply flex items-center justify-center h-full gap-4;
  }

  .card_username .username {
    font-size: 40px;
    line-height: 64px;
    color: var(--text-link);
    width: max-content;
    text-align: center;
  }

  .card_username .initial_user {
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: 36px;
    height: 36px;
    color: black;
    background-color: var(--accent-color-1);
    display: grid;
    place-items: center;
  }

  .card_box_up .card_profile {
    width: 70%;
  }

  .card_box_middle {
    margin-top: 1rem;
    height: 9rem;
  }

  .card_box_middle .box_tech_card {
    @apply w-full flex flex-row items-stretch justify-center gap-12;
  }

  .box_tech_card .box_edition {
    @apply flex items-start justify-end w-1/3 gap-0 h-auto;
  }

  .box_edition .update_infos {
    @apply w-1/2 flex-shrink-0 flex flex-col text-center mx-auto;
  }

  .box_edition .edit_wrap {
    @apply flex items-end h-5/6;
  }

  .card_box_middle .summary_content {
    @apply flex flex-col gap-2 w-2/3;
  }

  .summary_content .summary_title {
    width: 106px;
    height: 32px;
    font-size: 18px;
    background-color: var(--accent-color-1);
    text-align: center;
  }

  .card_box_middle .edit_wrap {
    margin-top: 0.35rem;
  }

  .edit_wrap .edit_article {
    width: 100%;
    height: 2rem;
    padding: 0 1rem;
  }

  .card_box_middle .summary_content p {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    width: 94%;
    padding: 0;
    overflow: hidden;
  }

  /* card box down */

  .card_box_down {
    @apply flex flex-row justify-between w-full;
  }

  .card_box_down .details_interactivity {
    @apply flex items-center gap-x-9;
  }

  .like_wrapper,
  .comment_wrapper,
  .view_wrapper {
    @apply flex items-center gap-x-3;
  }

  .card_box_down .time_reading {
    width: max-content;
    padding: 0;
    display: inline;
    justify-content: center;
  }

  .card_box_down span,
  .card_box_down .time_reading {
    font-size: calc(15px + 0.05vw);
  }

  /* aside section */
}

@media (min-width: 910px) {
  h2 {
    font-size: calc(36px + 0.12vw);
    padding-bottom: 2rem;
    font-weight: 500;
    line-height: 36px;
  }

  .home_broadcast {
    padding: 2rem 1rem 3rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
  }

  .home_page {
    width: 75%;
  }

  /* new card box */

  .card_box {
    width: 100%;
    max-width: 910px;
  }

  /* aside section */

  .aside_section {
    width: 25%;
    padding: 2rem 0 1rem;
  }

  .aside_container {
    width: 100%;
    margin: 0;
    padding: 0 0.5rem 0 1rem;
    border: 1px solid transparent;
    border-left: 2px solid var(--card-box);
  }
}

@media (min-width: 1240px) {
  h2 {
    font-size: calc(22px + 0.12vw);
  }

  h3 {
    font-size: calc(20px + 0.1vw);
  }

  h4 {
    font-size: calc(13px + 0.1vw);
  }

  .home_broadcast {
    padding: 1rem 2rem;
  }

  .home_page {
    width: 70%;
  }

  /* card box */

  .card_box {
    width: 100%;
    height: 20rem;
    padding: 16px 8px 16px 20px;
    @apply flex flex-row items-center justify-center gap-2;
  }

  .card_box_up {
    @apply flex flex-col-reverse items-center justify-center w-1/3 h-full;
  }

  .card_box_up .card_username {
    width: 100%;
    height: 30%;
  }

  .card_username .initial_user {
    flex-shrink: 0;
    position: relative;
    top: 6px;
    left: 0;
    width: 32px;
    height: 32px;
    color: black;
  }

  .card_box_up .card_profile {
    width: 100%;
  }

  .card_box_up .card_profile .title_article_wrap {
    display: none;
  }

  .article_frame .image_article {
    @apply grid place-items-center w-full h-auto;
    aspect-ratio: 16/9;
  }

  .article_frame .image_article img {
    border-radius: 4px;
  }

  /* card box middle */

  .card_box_middle {
    height: 100%;
    @apply w-2/3 gap-2;
  }

  .card_box_middle .title_article_wrap {
    display: inline-block;
    max-height: 4rem;
    overflow: hidden;
  }

  .card_box_middle .box_tech_card {
    @apply w-full flex flex-col-reverse items-start justify-center gap-4;
  }

  .box_tech_card .box_edition {
    @apply relative bottom-3 pb-2 flex items-center justify-between w-full gap-0 h-auto;
  }

  .box_edition .update_infos {
    @apply w-2/3 flex-shrink-0 flex flex-row justify-start text-left mx-auto;
  }

  .box_edition .edit_wrap {
    @apply w-1/3 flex items-center  h-auto;
  }

  .edit_wrap .edit_article {
    @apply justify-end;
  }

  .card_box_middle .summary_content {
    height: 60%;
    max-height: 10rem;
    padding: 1.5rem 0;
    @apply mx-auto flex flex-row gap-4 w-11/12;
  }

  /* card box down */

  #down_flow.card_box_down {
    @apply hidden;
  }

  #inside_flow.card_box_down {
    @apply flex;
  }

  .card_box_down {
    @apply pr-3 flex flex-row  justify-between w-full;
  }

  .card_box_down .time_reading {
    color: var(--text-body);
  }

  /* aside section */

  .aside_section {
    width: 30%;
    padding: 2rem 0 1rem 1rem;
  }

  .aside_container {
    padding: 0 0.5rem 0 1.5rem;
  }
}
</style>
