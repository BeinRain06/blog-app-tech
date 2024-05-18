<template>
  <div class="load_wrapper">
    <ul class="loading_content flex gap-4 justify-center items-center py-2">
      <li><span class="loading_msg text-sm"> Please Wait</span></li>
      <li><div class="load_circle"></div></li>
    </ul>
  </div>
</template>
<script setup></script>
<style scoped>
.load_wrapper {
  position: absolute;
  top: -2rem;
  widrh: 140px;
  height: 70px;
}

.loading_msg {
  animation: load-msg 2s ease-in-out infinite reverse;
}
.load_circle {
  position: relative;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  border: 1px solid #000;
  animation: load-circle-1 400ms ease-in-out infinite forwards;
}

.load_circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: calc(-0.5rem + 4px);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #000;
  animation: load-circle-2 400ms ease-in-out 320ms infinite forwards;
}

.load_circle::after {
  content: '';
  position: absolute;
  top: 0;
  left: calc(0.5rem - 4px);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #000;
  animation: load-circle-3 400ms ease-in-out 620ms infinite forwards;
}

@keyframes load-msg {
  0% {
    color: white;
    opacity: 1;
  }

  100% {
    color: gray;
    opacity: 0.5;
  }
}
@keyframes load-circle-1 {
  0% {
    visibility: visible;
  }

  100% {
    visibility: hidden;
  }
}

@keyframes load-circle-2 {
  0% {
    visibility: visible;
  }

  100% {
    visibility: hidden;
  }
}
@keyframes load-circle-3 {
  0% {
    visibility: visible;
  }

  100% {
    visibility: hidden;
  }
}
</style>
