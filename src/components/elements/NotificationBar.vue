<template>
  <span class="ml-5">
    <v-badge
      bordered
      left
      bottom
      :dot="reLoadNotify"
      offset-x="12"
      offset-y="4"
      :color="maxColor"
      :content="contetnt"
    >
      <BtnIconsV
        :color="maxColor"
        icon="notifications_none"
        title="Просмотр уведомлений"
        :action="openBar"
      />
    </v-badge>
  </span>
</template>

<script setup lang="ts">
import { useNotificationStore } from "@/store/modules/notification";
import { computed, ref, toRefs, watch } from "vue";
import BtnIconsV from "../basic/BtnIconsV.vue";
const emit = defineEmits(["open-notify"]);
const { info } = toRefs(useNotificationStore());
const reLoadNotify = ref(true);
const contetnt = ref();
const maxColor = computed(() => {
  let color = "blue";
  if (info.value.find((e) => e.color === "green")) color = "green";
  if (info.value.find((e) => e.color === "orange")) color = "orange";
  if (info.value.find((e) => e.color === "red")) color = "red";
  return color;
});
const openBar = () => {
  emit("open-notify", true);
};
watch(
  () => info.value.length,
  (val) => {
    reLoadNotify.value = true;
    contetnt.value = undefined;
    if (val > 0) {
      contetnt.value = info.value.length;
      setTimeout(() => {
        reLoadNotify.value = false;
      }, 100);
    }
  }
);
</script>
