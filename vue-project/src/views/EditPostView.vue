<template>
  <main>
    <div class="edit_post_wrap relative w-full h-screen">
      <div class="edit_post_content">
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
              <div class="form_editor py-3">
                <Editor
                  v-model="postItem.content"
                  ref="editorRef"
                  placeholder="edit area"
                  editorStyle="height: 280px"
                />
              </div>
              <div class="form_submit w-full z-10" @click.prevent="submitEditedPost">
                <input
                  type="submit"
                  id="btn_edit"
                  name="edit_post"
                  class="py-2 px-4 text-white text-base bg-black cursor-pointer rounded-3xl"
                  value="Edit Post"
                />
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      <RouterLink to="/" v-scroll-to="`#${postItem.id}`"
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { deleteimageapi, primarimageapi, editpostapi } from '@/api/post-api.js'

const router = useRouter()

const inputFileEdit = ref(null)

const editorRef = ref(null)

let originalNameImg = ref(null)

let postItem = ref({
  id: '',
  title: '',
  image: '',
  summary: '',
  content: '',
  author: ''
})

onMounted(() => {
  const postStore = usePostStore()
  const postToEdit = postStore.postInPage

  postItem.value.id = postToEdit?._id
  postItem.value.title = postToEdit?.title
  postItem.value.image = postToEdit?.image
  postItem.value.summary = postToEdit?.summary
  postItem.value.content = postToEdit?.content
  postItem.value.author = postToEdit?.author.id
})

watch(editorRef, (editor) => {
  if (!editor) return
  // Hack needed for Quill v2: https://github.com/primefaces/primevue/issues/5606#issuecomment-2093536386
  editor.renderValue = function renderValue(value) {
    if (this.quill) {
      if (postItem.value.content) {
        const delta = this.quill.clipboard.convert({ html: postItem.value.content })
        this.quill.setContents(delta, 'silent')
      } else {
        this.quill.setText('')
      }
    }
  }.bind(editor) // Bind needed for production build
})

function grabImage(e) {
  const filename = e.target.files[0]
  originalNameImg.value = filename
}

async function submitEditedPost() {
  const postStore = usePostStore()

  const post = postItem.value
  const userId = postItem.value.author.id
  let newImageUrl

  if (inputFileEdit.value.files[0] !== undefined) {
    const exUrlImgArr = postItem.value.image.split('/')

    const postToEdit = postStore.postInPage

    let nameExImg = exUrlImgArr[exUrlImgArr.length - 1]

    if (nameExImg !== 'undefined') {
      let arrExImg = nameExImg.split(' ')

      let newNameExImg = `${arrExImg[0]}`

      const removeImage = await deleteimageapi(newNameExImg)
      console.log('removeImage:', removeImage)
    }

    const myInputFileEdit = inputFileEdit.value

    newImageUrl = await primarimageapi(myInputFileEdit, userId)
  } else {
    newImageUrl = null
  }

  postItem.value.image = newImageUrl !== null ? newImageUrl : ''

  const sendEdit = await editpostapi(post)

  if (sendEdit.success) {
    await postStore.updateHomePage()

    postStore.$patch({ postInPage: null })

    setTimeout(() => {
      router.push({ path: '/' })
    }, 1800)
  }
}
</script>

<style scoped>
@media (min-width: 180px) {
  .edit_post_wrap {
    position: relative;
    top: 0;
    min-height: 100vh;
  }

  .edit_post_content {
    position: absolute;
    top: 70%;
    left: 50%;
    width: 100%;
    height: 54rem;
    max-width: 100%;
    transform: translate(-50%, -50%);
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
    width: 100%;
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
  .edit_post_content {
    width: 80%;
    height: 52rem;
    max-width: 48rem;
  }
}

@media (min-width: 620px) {
  .edit_post_content {
    width: 60%;
    max-width: 46rem;
  }
}
</style>
