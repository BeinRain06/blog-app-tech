<template>
  <main id="post_page-wrap">
    <div class="back_page_box" @scroll="playBandBarHome">
      <ul class="fly_back list-none inline-flex justify-center relative m-4">
        <li class="transition-all cursor-pointer">
          <div
            class="relative top-1 w-6 flex items-center justify-center bg-white hover:bg-purple-600 hover:outline-black"
            style="border-radius: 50%"
          >
            <span
              class="w-full text-black hover:transition-all duration-1000 ease-in-out z-10 hover:text-gray-300"
              style="position: relative; top: -2px; left: 4px"
              @click="backHome"
            >
              &#x25C0;</span
            >
          </div>
        </li>
        <li class="text-xl mx-2">Home</li>
      </ul>
      <ul
        class="mob_fly_back w-screen flex justify-between items-center h-10 transition-all duration-1000 ease-in-out py-2 px-4"
        ref="mobFlyRef"
      >
        <li
          class="text-2xl cursor-pointer z-10 transition-all duration-1000 ease-in-out hover:font-bold hover:text-purple-500"
          @click="backHome"
        >
          &larr;
        </li>
        <li class="text-base">...Home</li>
      </ul>
    </div>
    <div class="lift_prepost_details">
      <div class="art_post_reference">
        <p class="datePosted">{{ datePost }}</p>
        <p class="timePosted">at {{ timePost }}</p>
        <p class="readingTime">
          <span>{{ numbMinRead }}min</span> read
        </p>
        <div class="author_customization">
          <div class="author_logo" ref="authorRef">
            {{ postPage?.username[0].toLowerCase() }}
          </div>
          <p class="author_current_name">{{ postPage?.username }}</p>
        </div>
      </div>
      <div class="art_post_title">
        <span class="page_title">{{ postPage.title }}</span>
      </div>
    </div>
    <div class="page_content_wrap grid place-items-center px-2">
      <div class="page_content_inside" ref="pageInside"></div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post.js'
import { useUserStore } from '@/stores/user.js'

const authorRef = ref(null)

const mobFlyRef = ref(null)

let lastKnownScrollPosition = ref(0)

const pageInside = ref(null)

let timePost = ref(null)
let datePost = ref(null)
let numbMinRead = ref(null)

const router = useRouter()

onMounted(() => {
  window.addEventListener('scroll', playBandBarHome)

  const postStore = usePostStore()

  const paragraphContent = postStore.postInPage._doc.content

  pageInside.value.innerHTML = paragraphContent
})

onUnmounted(() => {
  window.removeEventListener('scroll', playBandBarHome)
})

const authorBg = onMounted(() => {
  const pallettesColor = ['#5ec28b', '#005b94', '#467f8e', '#9db0a3', '#b8d56a', '#f4eb75']
  const index = Math.floor(Math.random() * (5 - 0) + 0)
  const pickedColor = pallettesColor[index]

  console.log(authorRef)

  authorRef.value.style.backgroundColor = pickedColor
})

const postPage = computed(() => {
  const postStore = usePostStore()

  const callPost = postStore.postInPage

  const dateTimeArr = callPost.date.split(',')

  const paragraphContent = callPost.content

  const lengthContent = paragraphContent.length

  const wordsPerMinutes = 220

  numbMinRead.value = Math.ceil(lengthContent / wordsPerMinutes)

  timePost.value = dateTimeArr[0]
  datePost.value = dateTimeArr[1]

  return callPost
})

const currentUsername = computed(() => {
  const userStore = useUserStore()
  return userStore.currentUsername
})

function playBandBarHome() {
  let newKnownScrollPosition = window.scrollY

  let deltaX = newKnownScrollPosition - lastKnownScrollPosition.value

  if (deltaX > 0) {
    mobFlyRef.value.style.visibility = 'hidden'
    mobFlyRef.value.style.transform = 'translateY(-50px)'
    lastKnownScrollPosition.value = window.scrollY
  } else if (deltaX < -10) {
    console.log('mobFlyRef:', mobFlyRef)
    mobFlyRef.value.style.visibility = 'visible'
    mobFlyRef.value.style.transform = 'translateY(0px)'
    lastKnownScrollPosition.value = window.scrollY
  }
}

function backHome() {
  const postStore = usePostStore()
  postStore.$patch({ postInPage: null })

  router.push({ path: '/' })
}
</script>
<style scoped>
@media (min-width: 180px) {
  .mob_fly_back {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 40px;
    padding: 0 1rem;
    background-color: #f4f4f4;
    visibility: visible;
    transform: translate(0);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 5;
    transition: all 1.4s ease;
  }
  .fly_back {
    display: none;
  }

  .author_logo {
    position: relative;
    top: 0;
    left: 0;
    width: 2.4rem;
    height: 2.4rem;
    color: #fff;
    text-align: center;
    font-size: calc(14px + 0.32vw);
    border-radius: 50%;
    outline: 2px solid white;
    outline-offset: -2px;
    border: 1px solid #ddd;
  }

  .author_customization {
    grid-area: postAuthor;
    position: relative;
    right: -0.35rem;
  }

  .datePosted {
    grid-area: postDate;
    font-family: 'Reddit Sans', sans-serif;
    font-optical-sizing: auto;
    font-size: calc(12px + 0.42vw);
    text-align: right;
    padding-right: 1rem;
  }

  .timePosted {
    grid-area: postTime;
    font-family: 'Ubuntu Sans', sans-serif;
    font-optical-sizing: auto;
    font-weight: 300;
    font-style: normal;
    font-variation-settings: 'wdth' 100;
    font-style: italic;
    font-size: calc(12px + 0.18vw);
    text-align: right;
    padding-right: 1rem;
  }

  .readingTime {
    grid-area: minutesStamp;
    position: relative;
    top: -2rem;
    font-family: 'Ubuntu Sans', sans-serif;
    font-optical-sizing: auto;
    font-weight: 300;
    font-style: normal;
    font-variation-settings: 'wdth' 100;
    padding-left: 1rem;
    font-size: calc(12px + 0.25vw);
    transform: skew(-5deg);
  }

  .art_post_title {
    grid-area: postTitle;
    font-family: 'Poetsen One', sans-serif;
    font-weight: bold;
    font-style: normal;
    margin-top: 2rem;
    display: grid;
    place-items: center;
  }

  .lift_prepost_details {
    width: 100%;
    position: relative;
    padding-top: 0.5rem;
    display: grid;
    grid-template-areas:
      'postTitle postTitle postTitle postTitle'
      'artRef artRef artRef artRef';
  }

  .art_post_reference {
    width: 100%;
    grid-area: artRef;
    display: grid;
    grid-template-areas:
      'postAuthor . . .'
      '. . . postDate'
      '. . . postTime'
      'minutesStamp . . .';
  }

  .art_post_title {
    grid-area: postTitle;
    width: 100vw;
    font-size: calc(22px + 0.3vw);
    padding: 0 0.5rem;
  }

  .page_content_inside {
    position: relative;
    top: -0.5rem;
    width: 100%;
    padding: 0.5rem;
    max-width: 1100px;
    font-family: 'Reddit Sans', sans-serif;
    font-optical-sizing: auto;
    font-weight: 300;
    font-style: normal;
    font-size: calc(13px + 0.25vw);
    display: grid;
    place-items: center;
  }
}

@media (min-width: 375px) {
  .art_post_title {
    grid-area: postTitle;
    font-size: calc(24px + 0.3vw);
  }
}

@media (min-width: 650px) {
  .mob_fly_back {
    display: none;
  }
  .fly_back {
    display: inline-flex;
  }

  .lift_prepost_details {
    width: 100%;
    padding: 0;
    display: grid;
    grid-template-areas:
      'artRef artRef artRef artRef'
      'postTitle postTitle postTitle postTitle';
  }

  .art_post_reference {
    width: 100%;
    padding: 0 1rem;
    grid-area: artRef;
    display: grid;
    grid-template-areas:
      'postDate . . postAuthor'
      'postTime . . .'
      'minutesStamp . . .';
  }

  .datePosted {
    grid-area: postDate;
    font-size: calc(13px + 0.42vw);
    text-align: unset;
    padding: 0;
  }

  .timePosted {
    grid-area: postTime;
    padding: 0 0 0 0.25rem;
    font-size: calc(12px + 0.18vw);
    text-align: unset;
  }

  .readingTime {
    grid-area: minutesStamp;
    position: relative;
    top: 0;
    font-size: calc(10px + 0.3vw);
    padding: 3px 0 0 0;
    transform: skew(0deg);
  }

  .author_customization {
    grid-area: postAuthor;
    position: absolute;
    top: 0;
    right: 1rem;
    display: grid;
    place-items: center;
  }

  .art_post_title {
    font-size: calc(28px + 0.3vw);
    padding: 0;
  }

  .page_content_inside {
    position: relative;
    top: 0;
    width: 100%;
    padding: 0.75rem;
    font-size: calc(14px + 0.1vw);
  }
}
</style>
