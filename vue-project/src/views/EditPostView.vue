<template>
  <main>
    <div class="edit_post_wrap w-full h-screen">
      <div class="edit_post_content">
        <form class="edit_form relative h-full">
          <fieldset class="fieldset_edit_post">
            <legend class="post_generic_title">Edit Post</legend>
            <div class="form_content">
              <div class="form_control">
                <label for="title">Title</label>
                <input type="text" id="title" name="title" placeholder="title" />
              </div>
              <div class="form_control">
                <label for="summary">Summary</label>
                <input type="text" id="summary" name="summary" placeholder="summary" />
              </div>
              <div class="form_control">
                <label for="image">Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/png, image/jpeg, image/webp"
                />
              </div>
              <div class="form_editor py-3">
                <Editor vue-model="value" editorStyle="height: 280px" />
              </div>
              <div class="form_submit w-full">
                <input
                  type="submit"
                  id="btn_edit"
                  name="edit_post"
                  class="py-2 px-4 text-white text-base bg-black rounded-3xl"
                  value="Edit Post"
                />
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup></script>

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
