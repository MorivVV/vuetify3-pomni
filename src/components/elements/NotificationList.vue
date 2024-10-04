<template>
  <v-navigation-drawer v-model="view" width="400" app fixed right hide-overlay>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>Список всплывавших уведомлений</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-icon
          title="Закрыть панель"
          color="blue"
          @click="() => emit('open-notify', false)"
          >close</v-icon
        >
      </v-list-item-action>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item v-for="item in info" :key="item.timecreate">
        <v-list-item-icon>
          <v-badge bordered :content="item.count">
            <v-icon :color="item.color">notifications</v-icon>
          </v-badge>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title
            >{{ $moment(item.timecreate).format(momentFormatFull) }} ({{
              $moment(item.timecreate).fromNow()
            }}
            )</v-list-item-title
          >
          <v-list-item-title
            ><span v-html="item.text"></span
          ></v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon title="Очистить" color="red" @click="() => clearNotify(item)"
            >delete_forever</v-icon
          >
        </v-list-item-action>
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
const emit = defineEmits(["open-notify"]);
const { info } = toRefs(useNotificationStore());
const props = defineProps({
  notificationView: { type: Boolean, default: false },
});

const view = ref(props.notificationView);
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
