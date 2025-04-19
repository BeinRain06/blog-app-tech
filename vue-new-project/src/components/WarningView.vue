<script setup>
import { ref, useTemplateRef, computed, watch } from "vue";
import { useWarningStore } from "../stores/warning";

const props = defineProps(["new-msg", "this-user"]);

const thisUser = defineModel();

const boxWarningRef = useTemplateRef("box-warning-ref");

const warningState = computed(() => {
  const warningStore = useWarningStore();
  return warningStore.warningStage;
});

const warningError = computed(() => {
  const warningStore = useWarningStore();
  return warningStore.warningNews;
});

watch(warningState, () => {
  if (warningState.value) {
    showMsgErr(props.newMsg, thisUser.value);

    boxWarningRef.value.classList.add("active_warning");

    setTimeout(() => {
      boxWarningRef.value.classList.remove("active_warning");
    }, 3000);
  }
});

function showMsgErr(newMsg, user) {
  const warningStore = useWarningStore();
  warningStore.warningUpdate(newMsg, user);
}
</script>

<template>
  <div class="box_warning_edit z-10" ref="box-warning-ref">
    <div class="box_warning_content grid place-items-center w-max">
      <span class="leading-snug text-xs">{{ warningError }}</span>
    </div>
  </div>
</template>

<style scoped>
/* box warning */

.box_warning_edit {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  opacity: 0;
  visibility: hidden;
  transform: translate(30%, 0);
  transition: all 1s ease-in;
}

.box_warning_edit.active_warning {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 1;
  visibility: visible;
  transform: translate(5%, 0);
}

.box_warning_edit .box_warning_content {
  padding: 0 8px;
  color: var(--accent-color-3);
  background-color: var(--bg-gen);
  border-radius: 3px;
  border: 1px solid transparent;
}

.box_warning_edit.active_warning .box_warning_content {
  border: 1px solid var(--accent-color-3);
}
</style>
