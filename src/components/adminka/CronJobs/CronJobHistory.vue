<template>
  <DataTableV
    caption="История запусков"
    class="elevation-1 min-line-height"
    :headers="jobHistoryHeader"
    :item-class="jobColor"
    :items="hisory"
    :items-per-page="5"
  >
    <template #expanded-top>
      <v-row align="center" class="ma-0 pa-0">
        <v-col class="ma-0 pa-0" cols="3">
          <SwitchV v-model="autoupdate" label="Автообновление" />
        </v-col>

        <v-col class="ma-0 pa-0" cols="3">
          <TextFielsV
            v-model="intervalTime"
            :disabled="autoupdate"
            label="Период обновления (сек)"
          />
        </v-col>
        <v-col class="ma-0 pa-0" cols="3">
          <TextFielsV v-model="historyLimit" label="Вывод записей(шт)" />
        </v-col>
      </v-row>
    </template>
    <template #[`item.success`]="{ item }">
      <v-simple-checkbox v-model="item.success" disabled />
    </template>
    <template #[`item.pid`]="{ item }">
      {{ item.pid }}
      <BtnIconsV
        v-if="!item.time_end"
        :action="() => killJob(item.id)"
        color="white"
        colorbtn="red"
        icon="close"
        :loading="killLoading"
        title="Принудительно завершить выполнение"
      />
    </template>
    <template #[`item.time_start`]="{ item }">
      <span v-if="item.time_start">{{
        moment(item.time_start).format(momentFormatFull)
      }}</span>
    </template>
    <template #[`item.time_end`]="{ item }">
      <span v-if="item.time_end">{{
        moment(item.time_end).format(momentFormatFull)
      }}</span>
    </template>
    <template #[`item.kod_user`]="{ item }">
      <span v-if="item.kod_user">
        <UserFio :user_id="item.kod_user" />
      </span>
    </template>
    <template #[`item.time_len`]="{ item }">
      <span v-if="item.time_len">
        <span v-if="'hours' in item.time_len">{{ item.time_len.hours }}ч.
        </span>
        <span v-if="'minutes' in item.time_len">{{ item.time_len.minutes }}мин.
        </span>
        <span v-if="'seconds' in item.time_len">{{ item.time_len.seconds }}сек.
        </span>
        <span v-if="'milliseconds' in item.time_len">{{ item.time_len.milliseconds }}мс</span>
      </span>
    </template>
  </DataTableV>
</template>

<script setup lang="ts">
import { jobHistoryHeader } from "./jobHistoryHeader";
import { defineProps, onBeforeUnmount, ref, watch } from "vue";
import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import { IKnowledgebaseCronJobsAudit } from "@/types/database/schemas/knowledgebase";
import TextFielsV from "@/components/basic/TextFielsV.vue";
import UserFio from "@/components/elements/UserFio.vue";
import DataTableV from "@/components/basic/DataTableV.vue";
import { momentFormatFull } from "@/const/timeFormats";
import SwitchV from "@/components/basic/SwitchV.vue";
import BtnIconsV from "@/components/basic/BtnIconsV.vue";
import moment from "moment";
const props = defineProps({
  kodJob: { type: Number, required: true },
});
const emit = defineEmits(["getCronJobs"]);
const autoupdate = ref(false);
const killLoading = ref(false);
const intervalTime = ref(10);
const historyLimit = ref(100);
const { r_get, r_fetch } = dataApiComposition();

const killJob = (audit_id: number) => {
  if (!confirm("Завершить выполнение задания?")) return;
  killLoading.value = true;
  r_fetch("api/v2/stopJob", { jobAuditID: audit_id }).then((r) => {
    killLoading.value = false;
    if ("result" in r) {
      toast.warning(r.result);
    }
    getHistory();
    emit("getCronJobs");
  });
};
const jobColor = (e: IKnowledgebaseCronJobsAudit) => {
  const color: string[] = [];
  if (e.success) {
    color.push("green");
  } else {
    if (e.result === "в очереди") {
      color.push("blue");
    } else if (e.result === "выполняется") {
      color.push("yellow");
    } else {
      color.push("red");
    }
  }
  color.push("lighten-3");
  return color.join(" ");
};

const hisory = ref<IKnowledgebaseCronJobsAudit[]>([]);
const getHistory = () =>
  r_get<"time_end-time_start" | keyof IKnowledgebaseCronJobsAudit>({
    fields: [
      "id",
      "parameters",
      "result",
      "pid",
      "parent_pid",
      "success",
      "time_start",
      "time_end",
      "kod_user",
      "time_end-time_start:time_len",
    ],
    from: "cron_jobs_audit",
    sort: ["-id"],
    limit: historyLimit.value,
    filter: { kod_job: props.kodJob },
  }).then((r) => (hisory.value = r));
getHistory();
let interval = 0;
watch(autoupdate, (val) => {
  if (val) {
    interval = setInterval(() => {
      getHistory();
      emit("getCronJobs");
    }, intervalTime.value * 1000);
  } else {
    clearInterval(interval);
  }
});
onBeforeUnmount(() => clearInterval(interval));
</script>
