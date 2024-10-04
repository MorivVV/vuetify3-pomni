<template>
  <v-row class="ma-0">
    <v-col cols="3" class="purple--text pa-1">
      <v-icon :color="job.active ? 'green' : 'red'">play_circle_filled</v-icon>
      {{ job.naimen }}
    </v-col>
    <v-col cols="auto" class="pa-0 ma-0">
      <v-divider vertical />
    </v-col>
    <v-col class="pa-1" cols="1" title="Время выполнения в секундах">
      {{ job.task.getWorkTime() }}
    </v-col>
    <v-col cols="auto" class="pa-0 ma-0">
      <v-divider vertical />
    </v-col>
    <v-col cols="2" class="text-right pa-1" title="Период: ">
      {{ periodAbs }}
    </v-col>
    <v-col cols="auto" class="pa-0 ma-0">
      <v-divider vertical />
    </v-col>
    <v-col cols="1" class="right pa-1" title="Последний запуск: ">
      <span v-if="job.last_run">{{ alterTime(job.last_run) }}</span>
      <span v-else>Никогда</span>
    </v-col>
    <v-col cols="auto" class="pa-0 ma-0">
      <v-divider vertical />
    </v-col>
    <v-col cols="2" class="right pa-1" title="Последний запуск: ">
      <span>{{ job.result }}</span>
    </v-col>
    <v-col cols="auto" class="pa-0 ma-0">
      <v-divider vertical />
    </v-col>
    <v-col cols="1" class="text-right pa-1" title="Следующий запуск">
      {{ alterTime(job.task.nextRun()) }}
    </v-col>
    <v-col cols="auto" class="pa-0 ma-0">
      <v-divider vertical />
    </v-col>
    <v-col cols="1" class="text-right pa-1" title="Изменен:">
      <span v-if="job.date_modify">{{ alterTime(job.date_modify) }}</span>
    </v-col>
    <v-col cols="auto" class="pa-0 ma-0">
      <v-divider vertical />
    </v-col>
    <v-col cols="1" class="text-right pa-1" title="Изменил: ">
      <UserFioVue :user_id="job.kod_user" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import UserFioVue from "@/components/elements/UserFio.vue";
import { CronJobTask } from "@/types/cronjobs";
import { computed, PropType } from "vue";
import moment from "moment";
import { calcPeriodAbs } from "./jobCalculateFuncrion";
const props = defineProps({
  job: { type: Object as PropType<CronJobTask>, required: true },
});
const alterTime = (t: string | Date) => {
  let formatDate = "";
  if (t) {
    formatDate = moment(t).fromNow();
    if (typeof t === "string" && formatDate === "Invalid date") {
      formatDate = t;
    }
  }
  return formatDate;
};
const periodAbs = computed(() => {
  const periodAbs = calcPeriodAbs(props.job);
  return periodAbs;
});
</script>
