<template>
  <DataTableV
    :caption="`Список заданий  (${jobCount})`"
    class="purple lighten-5 min-line-height"
    :headers="cronJobsHeader"
    :item-class="colorLight"
    :items="taskJobs"
    :items-per-page="15"
    :loading="loadingJob"
    :server-items-length="+jobCount ? +jobCount : 10"
    :show-expand="true"
    @options-sync="optSync"
  >
    <template #expanded-top="">
      <v-row class="pa-0 ma-0">
        <v-col class="pa-1 ma-0" cols="4">
          <AutocompleteV
            v-model="filter.kod_script"
            class="mb-1"
            :items="jobScriptList"
            label="Скрипт"
          />
          <AutocompleteV
            v-model="filter.kod_user"
            :items="userList"
            label="Пользователь"
          />
        </v-col>
        <v-col class="pa-1 ma-0" cols="4">
          <TextFielsV
            v-model="filter.naimen"
            class="mb-1"
            label="Название задания"
          />
          <TextFielsV v-model.lazy="filter.parameters" label="Параметры" />
        </v-col>
        <v-col class="pa-1 ma-0" cols="4">
          <v-row class="pa-0 ma-0">
            <v-col class="pa-0 ma-0">
              <AutocompleteV
                v-model="filter.active"
                class="mb-1"
                :class="jobStatus.find((e) => e.id === filter.active)?.color"
                :clearable="false"
                item-text="short"
                item-value="id"
                :items="jobStatus"
                label="Статус"
              /></v-col>
            <v-col class="pa-0 ml-1">
              <TextFielsV v-model="filter.cron_host_ip" label="Хост (IP)" />
            </v-col>
          </v-row>

          <CronCalcParams />
        </v-col>
      </v-row>
    </template>
    <template #expanded-item="{ headers, item }">
      <td class="ma-0 pa-0" :colspan="headers.length">
        <div class="d-flex justify-center">
          <CronJobOneBody
            :j="item"
            style="width: 97vw"
            @get-cron-jobs="getCronJobs"
          />
        </div>
      </td>
    </template>
    <template #[`item.naimen`]="{ item }">
      <v-icon
        class="ml-n3 mr-1"
        :color="item.chain ? 'blue' : item.active ? 'green' : 'red'"
      >play_circle_filled</v-icon>
      <span class="text-h6 purple--text">{{ item.naimen }}</span>
      <span v-if="item.chain" class="blue--text"><br>{{ item.chain }}</span>
    </template>
    <template #[`item.period_hour`]="{ item }">
      {{ item.task.getWorkTime() }}
    </template>
    <template #[`item.kod_script`]="{ item }">
      {{ job_scripts.find((e) => e.id === item.kod_script)?.naimen_script }}
    </template>
    <template #[`item.last_run`]="{ item }">
      <span v-if="item.last_run">{{
        moment(item.last_run).format(momentFormatFullShort)
      }}</span>
      <span v-else>Никогда</span>
    </template>
    <template #[`item.period_run_minute`]="{ item }">
      {{ calcPeriodAbs(item) }}
    </template>
    <template #[`item.date_modify`]="{ item }">
      <span v-if="item.date_modify">{{
        moment(item.date_modify).format(momentFormatFullShort)
      }}</span>
    </template>
    <template #[`item.kod_user`]="{ item }">
      <UserFio :user_id="item.kod_user" />
    </template>
  </DataTableV>
</template>

<script setup lang="ts">
import { TaskJobSchedule } from "@/classes/cronjob/TaskJobSchedule";
import { useAdminStore } from "@/store/modules/admin";
import { useUserDataStore } from "@/store/modules/usersData";
import type { CronJobTask } from "@/types/cronjobs";
import { computed, onMounted, onUnmounted, ref, toRefs, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import DataTableV from "../basic/DataTableV.vue";
import CronJobOneBody from "./CronJobs/CronJobOneBody.vue";
import { cronJobsHeader } from "./CronJobs/cronJobsHeader";
import { calcColor, calcPeriodAbs } from "./CronJobs/jobCalculateFuncrion";
import UserFio from "../elements/UserFio.vue";
import moment from "moment";
import { momentFormatFullShort } from "@/const/timeFormats";
import TextFielsV from "../basic/TextFielsV.vue";
import AutocompleteV from "../basic/AutocompleteV.vue";
import CronCalcParams from "./CronJobs/CronCalcParams.vue";
import {
  getCronJobsCount,
  getCronJobsData,
  getCronScripts,
  getScriptParams,
  getUsers,
} from "./CronJobs/cronJobsData";

interface IFilter {
  naimen: string;
  parameters: string;
  cron_host_ip: string;
  kod_script: number | null;
  kod_user: number | null;
  active: boolean | null | string;
}
interface IItemList {
  value: number | null;
  text: string;
}
const jobStatus = [
  { id: null, short: "Все", color: "" },
  { id: true, short: "Включены", color: "green" },
  { id: false, short: "Выключены", color: "red lighten-3" },
  { id: "runing", short: "В процессе выполнения", color: "yellow" },
  { id: "error_all", short: "Завершились ошибкой", color: "red accent-2" },
  { id: "error_on", short: "Выполняются с ошибкой", color: "orange" },
  { id: "error_off", short: "Отключены с ошибкой", color: "red" },
];
const router = useRouter();
interface TOptionsTable {
  page: number;
  itemsPerPage: number;
  sortBy: string[];
  sortDesc: boolean[];
}
const route = useRoute();
const loadingJob = ref(true);
const jobCount = ref(0);
const tOptions = ref<TOptionsTable>({
  itemsPerPage: 15,
  page: 1,
  sortBy: [],
  sortDesc: [],
});
const optSync = (val: TOptionsTable, old: TOptionsTable) => {
  if (!old) return;
  let tableChangeCheck = false;
  tableChangeCheck ||= val.itemsPerPage !== old.itemsPerPage;
  tableChangeCheck ||= val.page !== old.page;
  tableChangeCheck ||=
    JSON.stringify(val.sortBy) !== JSON.stringify(old.sortBy);
  tableChangeCheck ||=
    JSON.stringify(val.sortDesc) !== JSON.stringify(old.sortDesc);
  if (tableChangeCheck) {
    tOptions.value.itemsPerPage = val.itemsPerPage;
    tOptions.value.page = val.page;
    tOptions.value.sortDesc = val.sortDesc;
    const sd = tOptions.value.sortDesc;
    tOptions.value.sortBy = val.sortBy.map((e, i) => `${sd[i] ? "-" : ""}${e}`);
    getCronJobs(
      tOptions.value.itemsPerPage,
      tOptions.value.page,
      tOptions.value.sortBy
    );
  }
};
const colorLight = (job) => calcColor(job, " lighten-4");
const filter = ref<IFilter>({
  naimen: "",
  parameters: "",
  cron_host_ip: "",
  kod_script: null,
  kod_user: null,
  active: true,
});
const { jobs, job_scripts } = toRefs(useAdminStore());
const { usersFioArray } = toRefs(useUserDataStore());
const jobScriptList = computed(() => {
  const scripts: IItemList[] = job_scripts.value.map((e) => ({
    value: e.id,
    text: e.naimen_script,
  }));
  return scripts.concat({ value: null, text: "Все" });
});
const userList = computed(() => {
  const users: IItemList[] = usersFioArray.value.map((e) => ({
    value: e.id,
    text: e.short,
  }));
  return users.concat({ value: null, text: "Все" });
});
const taskJobs = computed<CronJobTask[]>(() => {
  return jobs.value.map((e) => ({
    ...e,
    task: new TaskJobSchedule(
      e.naimen,
      e.period_start,
      e.period_end,
      e.last_run,
      e.last_done,
      e.period_run_month,
      e.period_run_week,
      e.period_run_day,
      e.period_run_hour,
      e.period_run_minute,
      e.interval_min,
      e.active,
      e.result
    ),
  }));
});

const getCronJobs = (limit = 15, page = 1, sort = ["j.naimen"]) => {
  loadingJob.value = true;
  const routerFilter: Record<string, string> = {};
  getCronJobsCount(filter, routerFilter).then((r) => {
    jobCount.value = r[0].count;
  });
  return getCronJobsData(filter, routerFilter, limit, page, sort).finally(
    () => {
      if (JSON.stringify(routerFilter) !== JSON.stringify(route.query)) {
        router.push({
          query: { ...routerFilter },
        });
      }
      loadingJob.value = false;
    }
  );
};

const object: IFilter = route.query as unknown as IFilter;
for (const key in object) {
  if (Object.prototype.hasOwnProperty.call(object, key)) {
    const k = key as keyof IFilter;
    const element = object[k];
    if (k in filter.value && element) {
      switch (k) {
        case "kod_script":
        case "kod_user":
          filter.value[k] = Number(element);
          break;
        case "naimen":
        case "parameters":
          filter.value[k] = String(element);
          break;
        case "active":
          switch (element) {
            case "true":
              filter.value[k] = true;
              break;

            case "false":
              filter.value[k] = false;
              break;

            default:
              filter.value[k] = String(element);
              break;
          }
          break;
        default:
          break;
      }
    }
  }
}
getUsers()
  .then(() => getCronScripts())
  .then(() => getScriptParams())
  .then(() => getCronJobs());
const interval = ref(0);
const inputTimeout = ref(0);
onMounted(() => {
  if (filter.value.active === "runing") {
 interval.value = setInterval(
      () =>
        getCronJobs(
          tOptions.value.itemsPerPage,
          tOptions.value.page,
          tOptions.value.sortBy
        ),
      5000
    );
}
});
watch(
  filter,
  (nVal) => {
    if ("runing" in nVal && nVal.runing) {
      if (interval.value === 0) interval.value = setInterval(getCronJobs, 5000);
    } else {
      if (interval.value) {
        clearInterval(interval.value);
        interval.value === 0;
      }
    }
    if (inputTimeout.value) {
      clearTimeout(inputTimeout.value);
    }
    inputTimeout.value = setTimeout(() => {
      getCronJobs();
    }, 300);
  },
  { deep: true }
);
onUnmounted(() => {
  if (interval.value) clearInterval(interval.value);
});
</script>
<style>
.border {
  border: solid 1px rgba(0, 0, 0, 0.42);
}
.min-line-height {
  line-height: 12px;
}
</style>
