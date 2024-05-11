<template>
  <main>
    <div id="home_page" class="home_page w-full p-4">
      <div
        v-for="(postItem, i) in dataPostsList"
        key="{{postItem.id}}"
        class="card_out_wrapper max-w-full p-2"
      >
        <div class="card_in_wrapper">
          <div class="card_img_wrap p-1">
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
              <div class="wrap_post_title w-full p-2">
                <h1 class="post_title font-bold">{{ postItem.Title }}</h1>
              </div>
              <div class="author_info_wrapper w-full">
                <div class="author_info_content max-w-6/12 flex gap-1 justify-center items-center">
                  <h4 class="author_name text-base">{{ postItem.Author }} |</h4>
                  <span class="posted_at font-light">{{ postItem.date }} |</span>
                  <img
                    class="svg_edit w-6 h-4"
                    src="../assets/edit-svgrepo-com.svg"
                    alt="edit post"
                  />
                </div>
              </div>
              <div class="summary_wrapper w-full p-2">
                <div class="summary_content">
                  <div class="w-full flex">
                    <h3 class="summary_title w-full font-medium">Summary</h3>
                  </div>
                  <div class="paragraph_container">
                    <p class="paragraph_inner_content text-xl">{{ postItem.summary }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import { arrayImg, dataPostsList } from '../assets/images-blog-post/index.js'

data: () => {
  return {
    foo: 'classified'
  }
}

getClassify: () => {
  const elt = this.data()
  console.log('elt:', elt)
}
</script>

<style scoped>
@media (min-width: 180px) {
  h1 {
    font-size: calc(26px + 1.6vw);
    line-height: 1.2;
  }

  h3 {
    font-size: calc(16px + 0.88vw);
    line-height: 1.2;
  }

  p {
    font-family: 'Reddit Sans', sans-serif;
    font-optical-sizing: auto;
    font-weight: 230;
    font-style: normal;
    font-size: calc(12px + 0.3vw);
    padding-top: 1rem;
    line-height: 1.6;
  }

  .card_in_wrapper {
    perspective: 500px;
    width: 100%;
    padding: 0.5rem;
    display: grid;
    grid-auto-columns: 100%;
    grid-auto-rows: min-content max-content;
    gap: 0.5rem;
  }

  .card_in_wrapper .card_img_wrap {
    width: 100%;
    height: 100%;
    transform: scale(0.9);
  }

  .card_in_wrapper .card_container {
    transform: scale(1);
  }

  .card_content_wrap:before {
    content: '';
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
  }
}

@media (min-width: 860px) {
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
    width: calc(100% -1em);
    height: 100%;
  }
  .summary_content .paragraph_container {
    transform: scale(0.96);
  }
}
</style>
