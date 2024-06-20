<template>
  <main>
    <div class="creation_post_wrap w-full h-screen">
      <div class="creation_post_content">
        <form class="create_form relative h-full">
          <fieldset class="fieldset_write_post">
            <legend class="post_generic_title">Create Post</legend>
            <div class="form_content">
              <div class="form_control">
                <label for="title">Title</label>
                <input type="text" id="title" name="title" placeholder="title" v-model="newTitle" />
              </div>
              <div class="form_control">
                <label for="summary">Summary</label>
                <input
                  type="text"
                  id="summary"
                  name="summary"
                  placeholder="summary"
                  v-model="newSummary"
                />
              </div>
              <div class="form_control">
                <label for="image">Image</label>
                <input
                  type="file"
                  id="image"
                  name="cover"
                  accept="image/png, image/jpeg, image/webp"
                  ref="inputFile"
                  @change="grabImage"
                />
              </div>
              <div class="form_editor py-3">
                <Editor v-model="newContent" editorStyle="height: 280px" />
              </div>
              <div class="form_submit w-full">
                <input
                  type="submit"
                  id="btn_create"
                  name="create_post"
                  class="py-2 px-4 text-white text-base bg-black cursor-pointer rounded-3xl"
                  value="Create Post"
                  @click.prevent="createPost"
                />
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      <RouterLink to="/"
        ><p
          class="absolute top-0 left-2 text-gray-800 rounded"
          style="padding: 2px 10px; border-bottom: 1px solid #333"
        >
          <span class="text-lg mx-1">&larr;</span> back
        </p></RouterLink
      >
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '../stores/post.js'
import { useUserStore } from '../stores/user.js'
import { primarimageapi, createpostapi } from '@/api/post-api'

const inputFile = ref(null)

const userStore = useUserStore()
const postStore = usePostStore()

const router = useRouter()

const newTitle = computed({
  get() {
    return postStore.title
  },
  set(newValue) {
    postStore.title = newValue
  }
})

const newSummary = computed({
  get() {
    return postStore.summary
  },
  set(newValue) {
    postStore.summary = newValue
  }
})

const newContent = computed({
  get() {
    return postStore.content
  },
  set(newValue) {
    postStore.content = newValue
  }
})

const thisUserId = computed({
  get() {
    return userStore.currentUserId
  }
})

async function createPost() {
  console.log('newTitle:', newTitle)

  const userStore = useUserStore()
  const postStore = usePostStore()

  //get info post

  const myInputFile = inputFile.value

  //send info post
  const image_path = await primarimageapi(myInputFile, thisUserId.value) // img_url

  let postElt = {
    title: newTitle.value,
    summary: newSummary.value,
    image_path: image_path,
    content: newContent.value
  }

  const postInfos = await createpostapi(postElt, thisUserId.value)

  //upadate lastPost {title, date} and countArticles --post Store
  const lastUpdate = {
    title: postInfos.title,
    author: postInfos.author,
    date: postInfos.date
  }

  const countPost = postInfos.countPost

  postStore.$patch({
    lastPost: lastUpdate,
    countArticles: countPost,
    title: '',
    summary: '',
    content: ''
  })

  userStore.$patch({ access_token: postInfos.access_token })

  router.push({ path: '/' })
}

function grabImage(e) {
  const filename = e.target.files[0]
}
</script>

<style scoped>
@media (min-width: 180px) {
  .creation_post_wrap {
    position: relative;
    top: 0;
    min-height: 100vh;
  }

  .creation_post_content {
    position: absolute;
    top: 70%;
    left: 50%;
    width: 100%;
    height: 54rem;
    max-width: 100%;
    transform: translate(-50%, -50%);
    @apply rounded border-solid border-gray-300;
  }

  .fieldset_write_post {
    width: 100%;
    display: grid;
    grid-auto-columns: 100%;
    grid-template-rows: 100%;
    margin: 0 auto;
  }

  .post_generic_title {
    position: relative;
    top: -1rem;
    padding: 0.5rem 0;
    font-size: calc(36px + 0.3vw);

    font-family: 'Ubuntu Sans', sans-serif;
    font-optical-sizing: auto;
    font-weight: 480;
    font-style: normal;
    font-variation-settings: 'wdth' 100;
  }

  .form_control {
    @apply flex flex-col py-3 gap-1;
    font-size: calc(14px + 0.3vw);
    font-family: 'Ubuntu Sans', sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
  }

  input[type='text'] {
    width: 100%;
    height: 3rem;
    text-indent: 10px;
    @apply rounded border-2 border-solid border-gray-300;
  }

  .form_submit {
    height: 5.8rem;
    @apply flex justify-end items-center;
  }
}

@media (min-width: 300px) {
  .creation_post_content {
    width: 80%;
    height: 52rem;
    max-width: 48rem;
  }
}

@media (min-width: 620px) {
  .creation_post_content {
    width: 60%;
    max-width: 46rem;
  }
}
</style>
