<template>
  <v-navigation-drawer
    v-model="view"
    app
    fixed
    location="right"
    temporary
    width="400"
  >
    <v-list-item>

      <v-list-item-title>Список всплывавших уведомлений</v-list-item-title>

      <template #append>
        <BtnIconsV
          :action="() => emit('open-notify', !view)"
          color="blue"
          icon="close"
          title="Закрыть панель"
        />
      </template>
    </v-list-item>

    <v-divider />

    <v-list dense>
      <v-list-item v-for="item in info" :key="item.timecreate">
        <template #prepend>
          <v-badge bordered :content="item.count">
            <v-icon :color="item.color" size="24">mdi-bell</v-icon>
          </v-badge>
        </template>

        <v-list-item-title>{{ moment(item.timecreate).format(momentFormatFull) }} ({{
          moment(item.timecreate).fromNow()
        }}
          )</v-list-item-title>
        <v-list-item-title><span v-html="item.text" /></v-list-item-title>

        <template #append>
          <BtnIconsV
            :action="() => clearNotify(item)"
            color="red"
            icon="delete-forever"
            title="Очистить"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import {
  ISnackNotify,
  useNotificationStore,
} from "@/store/modules/notification";
import { ref, toRefs, watch } from "vue";

import { momentFormatFull } from "@/const/timeFormats";
import BtnIconsV from "../basic/BtnIconsV.vue";
import moment from "moment";
const emit = defineEmits(["open-notify"]);
const { info } = toRefs(useNotificationStore());
const props = defineProps({
  notificationView: { type: Boolean, default: false },
});

const view = ref(false);
const clearNotify = (item: ISnackNotify) => {
  info.value = info.value.filter(
    (e) => JSON.stringify(e) !== JSON.stringify(item)
  );
};

watch(
  () => props.notificationView,
  (val) => {
    view.value = val;
  }
);
</script>
