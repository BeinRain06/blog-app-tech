<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { usePostStore } from "../stores/post.js";
import { useUserStore } from "../stores/user.js";
import { primarimageapi, createpostapi } from "@/api/post-api";

const inputFile = ref(null);

const userStore = useUserStore();
const postStore = usePostStore();

const router = useRouter();

const newTitle = computed({
  get() {
    return postStore.title;
  },
  set(newValue) {
    postStore.title = newValue;
  },
});

const newSummary = computed({
  get() {
    return postStore.summary;
  },
  set(newValue) {
    postStore.summary = newValue;
  },
});

const newContent = computed({
  get() {
    return postStore.content;
  },
  set(newValue) {
    postStore.content = newValue;
  },
});

const thisUserId = computed({
  get() {
    return userStore.currentUserId;
  },
});

async function createPost() {
  console.log("newTitle:", newTitle);

  const userStore = useUserStore();
  const postStore = usePostStore();

  //get info post

  const myInputFile = inputFile.value;

  //send info post
  const image_path = await primarimageapi(myInputFile, thisUserId.value); // img_url

  let postElt = {
    title: newTitle.value,
    summary: newSummary.value,
    image_path: image_path,
    content: newContent.value,
  };

  const postInfos = await createpostapi(postElt, thisUserId.value);

  //upadate lastPost {title, date} and countArticles --post Store
  const lastUpdate = {
    title: postInfos.title,
    author: postInfos.author,
    date: postInfos.date,
  };

  const countPost = postInfos.countPost;

  postStore.$patch({
    lastPost: lastUpdate,
    countArticles: countPost,
    title: "",
    summary: "",
    content: "",
  });

  userStore.$patch({ access_token: postInfos.access_token });

  router.push({ path: "/" });
}

function grabImage(e) {
  const filename = e.target.files[0];
}

function backHome() {
  const postStore = usePostStore();
  postStore.$patch({ postInPage: null });
  router.push({ path: "/" });
}
</script>

<template>
  <div class="creation_post_wrap w-full h-full">
    <div class="creation_post_content h-full">
      <form class="create_form relative h-full">
        <fieldset class="fieldset_write_post">
          <legend class="post_generic_title">Create Post</legend>
          <div class="form_content">
            <div class="form_control">
              <label for="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="title"
                v-model="newTitle"
              />
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
            <Editor
              v-model="newContent"
              editorStyle="height: 160px;color:#fff; border: 1px solid #555555d0; border-radius: 3px"
              placeholder="write your post"
            >
            </Editor>

            <div class="form_submit flex items-center justify-end w-full h-36">
              <input
                type="submit"
                id="btn_create"
                name="create_post"
                class="btn_submit_post"
                value="Create Post"
                @click.prevent="createPost"
              />
            </div>
          </div>
        </fieldset>
      </form>
    </div>
    <div to="/" class="back_home" @click="backHome">
      <p
        class="absolute top-2 left-2 text-gray-800 rounded"
        style="
          width: max-content;
          padding: 2px;
          color: var(--text-body-1);
          border-bottom: 1px solid var(--text-body-1);
        "
      >
        <span class="text-xs md:text-lg mx-1">&larr;</span> back
      </p>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";

@media (min-width: 180px) {
  h1,
  h2,
  h3 {
    color: var(--title);
  }

  a {
    color: var(--text-body-1);
  }

  input[type="file"] {
    background-color: var(--accent-color-2);
  }

  p {
    font-family: "Mulish", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-size: calc(14px + 0.1vw);
  }

  .creation_post_wrap {
    position: relative;
    top: 0;
    min-height: 100vh;
    padding: 5rem 0 1rem;
    background-color: var(--bg-gen);
  }

  .creation_post_content {
    width: 86%;
    height: max-content;
    margin: 0 auto;
    color: var(--text-body);
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
    top: -0.75rem;
    padding: 0.5rem 0;
    font-size: calc(32px + 0.15vw);
    color: var(--accent-color-3);
    font-family: "Ubuntu Sans", sans-serif;
    font-optical-sizing: auto;
    font-weight: 480;
    font-style: normal;
    font-variation-settings: "wdth" 100;
    width: 100%;
    display: inline-block;
    text-align: center;
  }

  .form_control {
    @apply flex flex-col gap-1 py-5;
    font-family: "Manrope", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
  }

  /* form submit */
  .btn_submit_post {
    cursor: pointer;
    font-size: calc(15px + 0.1vw);
    padding: 0.35em 1em;
    color: var(--title);
    background-color: var(--accent-color-1);
    border-radius: 10px;
  }
}

@media (min-width: 300px) {
  .creation_post_wrap {
    padding: 5.6rem 0 1rem;
  }

  .creation_post_content {
    width: 80%;
  }

  .post_generic_title {
    top: -1rem;
    text-align: left;
  }
}

@media (min-width: 768px) {
  .creation_post_wrap {
    padding: 4rem 0 1rem;
  }

  .creation_post_content {
    width: 60%;
    max-width: 46rem;
  }

  .form_control {
    @apply gap-2 py-4;
  }

  /* form submit */
  .btn_submit_post {
    font-size: calc(14px + 0.15vw);
  }
}
</style>
