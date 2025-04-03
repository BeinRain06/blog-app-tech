<script setup>
import { ref, reactive, useTemplateRef, onMounted, computed } from "vue";
import { usePostStore } from "../stores/post";

const postInfo = reactive({
  day: "",
  hour: "",
  username: "",
  title: "",
  image: "",
});

const contentRef = useTemplateRef("content-ref");

onMounted(async () => {
  const url = window.location.href;

  const arrayUrlElt = url.split("/");

  const id = arrayUrlElt[arrayUrlElt.length - 1];

  const postStore = usePostStore();
  let thisPost = await postStore.postInPage;

  if (!thisPost) {
    const catchPost = sessionStorage.getItem("postPage");

    thisPost = JSON.parse(catchPost);
  }

  const aboutTime = thisPost.date;

  const arrayTime = aboutTime.split(",");

  postInfo.day = arrayTime[0];
  postInfo.hour = arrayTime[1];
  postInfo.username = thisPost.author.username;
  postInfo.title = thisPost.title;
  postInfo.image = thisPost.image;
  contentRef.value.innerHTML = thisPost.content;

  return thisPost;
});
</script>
<template>
  <div id="post_page" class="post_page w-full">
    <div class="post_page_container flex justify-center w-full pt-16">
      <div class="post_page_content">
        <div id="post_profile" class="post_profile flex flex-col items-center">
          <h1 class="post_title">{{ postInfo.title }}</h1>
          <div class="cover_wrapper">
            <img :src="postInfo.image" alt="post cover" />
          </div>
          <div class="post_details flex justify-center w-full pt-4">
            <div class="post_username">
              {{ postInfo.username }}
            </div>
            <div class="detail_date">
              <div class="separator"></div>
              <div class="sub_post_info">
                <span class="underline">updated</span>
                <span class="px-1">-</span>
                <span>{{ postInfo.day }}</span>
              </div>
            </div>
            <div class="detail_date">
              <div class="separator"></div>
              <div class="sub_post_info">
                <span>{{ postInfo.hour }}</span>
              </div>
            </div>
          </div>
        </div>
        <!--post paragraphs-->
        <div id="post_paragraphs" class="post_paragraphs flex justify-start">
          <div
            class="post_content flex flex-col items-center justify-start"
            ref="content-ref"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@media (min-width: 160px) {
  h1.post_title {
    font-family: "Manrope", sans-serif;
    font-size: 28px;
    line-height: 42px;
    font-weight: 500;
    color: var(--title);
    text-align: center;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .post_page {
    background-color: var(--bg-gen);
  }

  .post_page_content {
    width: 90%;
    padding: 0 15px;
  }

  /* post profile */

  .post_page_content .post_profile {
    width: 100%;
    margin: 0 auto;
  }

  .post_profile .cover_wrapper {
    width: 100%;
    padding: 28px 15px 0;
    margin-top: 0.25rem;
    aspect-ratio: 16/9;
  }

  .post_profile .post_username {
    font-size: 24px;
    line-height: 32px;
    color: var(--accent-color-1);
  }

  .post_profile .detail_date {
    font-size: 20px;
    line-height: 32px;
    color: var(--text-link);
  }

  .detail_date {
    width: max-content;
    height: 100%;
    padding-left: 8px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 8px;
  }

  .detail_date .separator {
    position: relative;
    top: 2px;
    width: 8px;
    height: 8px;
    background-color: var(--accent-color-2);
  }

  /* post paragraphs */

  .post_page_content .post_paragraphs {
    width: 100%;
    margin: 0 auto 3rem;
  }

  .post_page_content .post_content {
    width: 100%;
    padding-top: 3rem;
    padding-right: 1rem;
    margin: 0;
    color: var(--text-body);
    text-align: left;
  }

  .post_content * {
    width: 100%;
    text-align: left;
  }

  .post_content p {
    width: 100%;
    font-family: "Mulish", sans-serif;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
    font-size: calc(18px + 0.15vw);
    line-height: 28px;
  }
}

@media (min-width: 600px) {
  h1.post_title {
    font-size: 32px;
    line-height: 42px;
  }

  .post_page_content {
    width: 80%;
    padding: 0 15px;
  }

  .post_page_content .post_profile {
    width: 90%;
  }

  .post_profile .post_username {
    font-size: calc(16px + 0.1vw);
  }

  .post_profile .detail_date {
    font-size: calc(15px + 0.025vw);
  }

  .post_page_content .post_paragraphs {
    width: 90%;
    margin: 2rem auto 3rem;
  }
}
@media (min-width: 1045px) {
  h1.post_title {
    font-size: 44px;
    line-height: 56px;
  }

  .post_page_content {
    max-width: 906px;
    padding: 0;
  }

  .post_page_content .post_profile {
    width: 84%;
  }
}
</style>
