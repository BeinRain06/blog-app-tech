<script setup>
import { useTemplateRef, watch } from "vue";
</script>
<template>
  <div
    class="loading_wrapper absolute top-0 left-0 flex flex-col items-center justify-start w-full h-full max-h-screen mx-auto"
  >
    <div
      class="loading_frame_edge grid place-items-center w-full h-full mx-auto"
      style="background-color: #222"
      ref="loading-frame-ref"
    >
      <div
        class="absolute top-50 loading_frame w-28 h-24 flex flex-row justify-center items-center gap-2"
      >
        <!--  <div class="loading_text w-max h-full text-lg"><p>Please Wait</p></div> -->
        <div class="loading_bounce w-full h-full flex flex-row justify-between">
          <div id="dot_one" class="loading_dot"></div>
          <div id="dot_two" class="loading_dot"></div>
          <div id="dot_three" class="loading_dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.loading_frame_edge {
  animation: 10s linear forwards loading-frame;
}

.loading_dot {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid var(--text-body);
}

#dot_one,
#dot_three {
  animation: 950ms ease-in infinite double-dot;
}

#dot_two {
  animation: 950ms ease-out infinite single-dot;
}

@keyframes double-dot {
  0% {
    top: 12px;
    background-color: var(--accent-color-11);
  }
  100% {
    top: -6px;
    background-color: #83183c;
  }
}

@keyframes single-dot {
  0% {
    top: -6px;
    background-color: #83183c;
  }
  100% {
    top: 12px;
    background-color: var(--accent-color-11);
  }
}

@keyframes loading-frame {
  0% {
    opacity: 1;
    visibility: visible;
    z-index: 20;
  }
  100% {
    opacity: 0.7;
    visibility: hidden;
    z-index: 0;
  }
}
</style>
