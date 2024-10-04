<template>
  <v-footer padless tile>
    <v-col class="text-center pa-0 ma-1" cols="12">
      По всем вопросам и пожеланиям обращайтесь:
      <a :href="'mailto:MorivVV@yandex.ru?Subject=' + siteNaimen">© Моривец Владимир</a>
    </v-col>
    <v-snackbar
      v-for="(e, i) in info.filter((e) => e.view)"
      :key="'info_' + e.timecreate"
      v-model="e.view"
      bottom
      :color="e.color"
      right
      :style="{ top: `-${i * height}px` }"
      :timeout="e.timeout"
      transition="scale-transition"
    >
      <v-badge
        :color="`white ${e.color}--text font-weight-bold`"
        :content="e.count"
        left
        offset-x="-2"
        offset-y="-2"
      >
        <span v-html="e.text" />
      </v-badge>
      <template #action="{ attrs }">
        <BtnIconsV
          v-bind="attrs"
          :action="
            () => {
              e.view = false;
            }
          "
          icon="close"
          title=""
        />
      </template>
    </v-snackbar>
  </v-footer>
</template>

<script setup lang="ts">
import { useNotificationStore } from "@/store/modules/notification";
import { ref, toRefs } from "vue";
import BtnIconsV from "./BtnIconsV.vue";
const { info } = toRefs(useNotificationStore());
const height = 55;
const siteNaimen = ref(NAIMEN_POMNI);
</script>
