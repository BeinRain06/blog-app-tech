<template>
  <main>
    <div id="home_page" class="home_page w-full p-4">
      <div
        v-for="(postItem, i) in dataPostsList"
        key="{{postItem.id}}"
        class="card_out_wrapper max-w-md p-2"
      >
        <div class="card_in_wrapper">
          <div class="card_img_wrap w-full h-full p-1">
            <img
              class="card_img object-cover w-full h-full p-1"
              :src="postItem[i].image"
              alt="post picture"
            />
          </div>
          <div class="card_container w-full p-1">
            <div
              class="card_content_wrap relative w-full flex flex-column md:flex-row justify-center items-center rounded-sm"
            >
              <div class="wrap_post_title w-full p-2">
                <h2 class="post_title">{{ postItem.Title }}</h2>
              </div>
              <div class="author_info_wrapper w-full">
                <div class="author_info_content max-w-6/12 flex gap-1 justify-center items-center">
                  <h4 class="author_name">{{ postItem.Author }}|</h4>
                  <span class="posted_at">{{ postItem.date }}|</span>
                  <img
                    class="svg_edit w-4 h-2"
                    src="../src/assets/edit-svgrepo-com.svg"
                    alt="edit post"
                  />
                </div>
              </div>
              <div class="summary_wrapper w-full py-2 px-1">
                <div class="summary_content">
                  <h3 class="summary_title">Summary</h3>
                  <div class="paragraph_container">
                    <p class="paragraph_inner_content">{{ postItem.summary }}</p>
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

@media (min-width: 768px) {
  .card_in_wrapper {
    perspective: 500px;
    width: 100%;
    padding: 0.5rem;
    display: grid;
    grid-template-columns: 20ch 1fr;
    grid-template-rows: min-content;
    gap: 1rem;
  }

  .card_in_wrapper .card_img_wrap {
    transform: scale(1);
  }

  .card_in_wrapper .card_container {
    transform: scale(0.9);
  }

  .summary_content {
    perspective: 500px;
    width: calc(100% -1em);
    height: 100%;
  }
  .summary_content .paragraph_container {
    transform: scale(0.9);
  }
}
</style>
