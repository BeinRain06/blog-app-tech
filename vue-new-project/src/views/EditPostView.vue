<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
import { usePostStore } from "@/stores/post";
import { deleteimageapi, primarimageapi, editpostapi } from "@/api/post-api.js";

const router = useRouter();

const inputFileEdit = ref(null);

const editorRef = ref(null);

let newNameFileImg = ref(null);

let postItem = ref({
  id: "",
  title: "",
  image: "",
  summary: "",
  content: "",
  author: "",
});

const isLoading = ref(false);

const areaText = ref(null);

onMounted(() => {
  const postStore = usePostStore();
  const postToEdit = postStore.postInPage;

  postItem.value.id = postToEdit?._id;
  postItem.value.title = postToEdit?.title;
  postItem.value.image = postToEdit?.image;
  postItem.value.summary = postToEdit?.summary;
  /* postItem.value.content = postToEdit?.content; */
  postItem.value.author = postToEdit?.author.id;

  areaText.value.innerHTML = postToEdit?.content;
  const myHTML = areaText.value.innerHTML;
  postItem.value.content = myHTML.replace(/<[^>]+>/g, ""); //convert HTML into plain text;
});

watch(editorRef, (editor) => {
  if (!editor) return;
  // Hack needed for Quill v2: https://github.com/primefaces/primevue/issues/5606#issuecomment-2093536386
  editor.renderValue = function renderValue(value) {
    if (this.quill) {
      if (postItem.value.content) {
        const delta = this.quill.clipboard.convert({
          html: postItem.value.content,
        });
        this.quill.setContents(delta, "silent");
      } else {
        this.quill.setText("");
      }
    }
  }.bind(editor); // Bind needed for production build
});

function grabImage(e) {
  const filename = e.target.files[0];
  newNameFileImg.value = filename;
}

async function submitEditedPost() {
  isLoading.value = true;

  const postStore = usePostStore();

  const post = postItem.value;

  const userId = await sessionStorage.getItem("userid");

  let newImageUrl = null;

  const exUrlImgArr = postItem.value.image.split("/");

  let nameExImg = exUrlImgArr[exUrlImgArr.length - 1];

  if (nameExImg !== "undefined") {
    let arrExImg = nameExImg.split(" ");

    let newNameExImg = `${arrExImg[0]}`;

    const removeImage = await deleteimageapi(newNameExImg);

    // console.log("removeImage:", removeImage);
  }

  // const myInputFileEdit = inputFileEdit.value;

  newImageUrl = await primarimageapi(newNameFileImg.value, userId);

  postItem.value.image = newImageUrl !== null ? newImageUrl : "";

  const sendEdit = await editpostapi(post);

  if (sendEdit.success) {
    await postStore.updateHomePage();

    postStore.$patch({ postInPage: null });

    setTimeout(() => {
      isLoading.value = true;
    }, 5000);

    setTimeout(() => {
      router.push({ path: "/" });
    }, 1800);
  }
}

function backHome() {
  const postStore = usePostStore();
  postStore.$patch({ postInPage: null });
  router.push({ path: "/" });
}
</script>

<template>
  <div class="edit_post_wrap relative w-full h-full" v-if="!isLoading">
    <div class="edit_post_content h-full">
      <form class="edit_form relative h-full">
        <fieldset class="fieldset_edit_post">
          <legend class="post_generic_title">Edit Post</legend>
          <div class="form_content">
            <div class="form_control">
              <label for="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                class="input_field"
                placeholder="title"
                v-model="postItem.title"
              />
            </div>
            <div class="form_control">
              <label for="summary">Summary</label>
              <input
                type="text"
                id="summary"
                name="summary"
                class="input_field"
                placeholder="summary"
                v-model="postItem.summary"
              />
            </div>
            <div class="form_control">
              <label for="image">Image</label>
              <input
                type="file"
                id="image"
                name="cover"
                accept="image/png, image/jpeg, image/webp"
                ref="inputFileEdit"
                @change="grabImage"
              />
            </div>
            <!--  <Editor
              v-model="postItem.content"
              ref="editorRef"
              editorStyle="height: 160px; color:#fff; border:1px solid #555555d0; border-radius: 3px"
              placeholder="edit your post content"
            /> -->
            <textarea
              id="content"
              name="content"
              rows="5"
              cols="33"
              placeholder="write article ..."
              ref="areaText"
              v-model="postItem.content"
            >
            </textarea>
            <div class="form_submit flex items-center justify-end w-full h-36">
              <input
                type="submit"
                id="btn_edit"
                name="edit_post"
                class="btn_submit_post"
                value="Edit Post"
                @click.prevent="submitEditedPost"
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
        <span class="text-xs text-lg mx-1">&larr;</span> back
      </p>
    </div>
  </div>
  <!--LoadingPost-->
  <div
    class="loading_wrapper absolute top-0 left-0 flex flex-col items-center justify-start"
    v-if="isLoading"
  >
    <div
      class="loading_frame_edge active_loading grid place-items-center w-full h-full mx-auto"
      style="background-color: #222"
      ref="loading-frame-ref"
    >
      <div
        class="absolute top-50 loading_frame w-28 h-28 flex flex-row justify-center items-center"
      >
        <div class="spinning_circle w-full h-full"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";

/* loading style */
.loading_wrapper {
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  overflow-y: hidden;
}

.loading_frame_edge {
  opacity: 0;
  visibility: hidden;
  z-index: 0;
  transition: all 1.4s ease;
}

.loading_frame_edge.active_loading {
  opacity: 1;
  visibility: visible;
  z-index: 20;
}

.spinning_circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  outline: 12px solid var(--card-box);
  outline-offset: -3px;
  border: 8px solid transparent;
  animation: 1.1s linear infinite round-circle;
}

@keyframes round-circle {
  0% {
    border: 8px solid transparent;
    border-bottom: 8px solid var(--text-body);
  }
  35% {
    border-left: 8px solid var(--text-body);
  }
  70% {
    border-top: 8px solid var(--text-body);
  }
  100% {
    border-right: 8px solid var(--text-body);
  }
}

/* textarea style */

textarea {
  width: 100%;
  height: 220px;
  text-indent: 10px;
  padding: 20px 10px;
  margin-top: 16px;
  color: var(--text-body);
  border: 1px solid #555555d0;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
}

textarea:focus {
  outline: none;
  box-shadow: 0px 0px 3px var(--brand-text);
}

@media (min-width: 180px) {
  h1,
  h2,
  h3 {
    color: var(--title);
  }

  a {
    color: var(--text-body-1);
  }

  p {
    font-family: "Mulish", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-size: calc(14px + 0.1vw);
  }

  .edit_post_wrap {
    position: relative;
    top: 0;
    min-height: 100vh;
    padding: 5rem 0 1rem;
    background-color: var(--bg-gen);
  }

  .edit_post_content {
    width: 86%;
    height: max-content;
    margin: 0 auto;
    color: var(--text-body);
    @apply rounded border-solid border-gray-300;
  }

  .fieldset_edit_post {
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
    color: var(--accent-color-11);
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
    width: 100%;
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
    background-color: #432ea0;
    border-radius: 10px;
  }
}

@media (min-width: 300px) {
  .edit_post_wrap {
    padding: 5.6rem 0 1rem;
  }

  .edit_post_content {
    width: 80%;
  }

  .post_generic_title {
    top: -1rem;
    text-align: left;
  }
}

@media (min-width: 768px) {
  .edit_post_wrap {
    padding: 4rem 0 1rem;
  }

  .edit_post_content {
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
