<template lang="pug">
v-row.ma-n3
  v-expansion-panels
    v-expansion-panel
      v-expansion-panel-header.purple.subtitle-1.white--text.pa-0.pr-1.pl-2
        v-row.ma-0.pa-0
          v-col(cols="3").text-h5 Задания {{ jobs.length }}
          v-col(cols="auto").pa-0.ma-0
            v-divider(vertical)
          v-col(cols="1") Время сек.
          v-col(cols="auto").pa-0.ma-0
            v-divider(vertical)
          v-col(cols="2").text-right Период запуска
          v-col(cols="auto").pa-0.ma-0
            v-divider(vertical)
          v-col(cols="1") Последний
          v-col(cols="auto").pa-0.ma-0
            v-divider(vertical)
          v-col(cols="2").text-right Статус
          v-col(cols="auto").pa-0.ma-0
            v-divider(vertical)
          v-col(cols="1").text-right Следующий
          v-col(cols="auto").pa-0.ma-0
            v-divider(vertical)
          v-col(cols="1").text-right Изменен
          v-col(cols="auto").pa-0.ma-0
            v-divider(vertical)
          v-col(cols="1").text-right Изменил
      v-expansion-panel-content
        v-row.ma-1(align="center")
          v-col.col-2
           v-autocomplete(
v-model="filter.kod_script"
                    clearable outlined hide-details dense
                    label="Скрипт"
                    :items="[{id: null, naimen_script: 'Все'}].concat(job_scripts)"
                    item-value="id"
                    item-text="naimen_script" @input="getCronJobs")
          v-col.col-2
           v-autocomplete(
v-model="filter.kod_user"
                    clearable outlined hide-details dense
                    label="Пользователь"
                    :items="[{id: null, short: 'Все'}].concat(usersFioArray)"
                    item-value="id"
                    item-text="short" @input="getCronJobs")
          v-col(cols="2")
            v-text-field(v-model="filter.naimen" outlined hide-details dense label="Название задания" @input="getCronJobs")
          v-col(cols="3")
            v-text-field(v-model="filter.parameters" outlined hide-details dense label="Параметры" @input="getCronJobs")
          v-col(cols="3")
            v-radio-group.ma-1.pa-0(v-model="filter.active" dense row label="Статус" @change="getCronJobs")
              v-radio(label="Все" :value="null")
              v-radio(label="Активные" :value="true")
              v-radio(label="Не Активные" :value="false")
            v-radio-group.ma-1.pa-0(v-model="filter.runing" dense row label="Выполняются" @change="getCronJobs")
              v-radio(label="Все" :value="null")
              v-radio(label="Да" :value="true")
              v-radio(label="Нет" :value="false")
    template(v-if="jobs.length > 0")
      CronJobOne(v-for="j in taskJobs" :key="'job_' + j.id" :j="j" @getCronJobs="getCronJobs")
</template>

<script setup lang="ts">
import { TaskJobSchedule } from "@/classes/cronjob/TaskJobSchedule";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useAdminStore } from "@/store/modules/admin";
import { useUserDataStore } from "@/store/modules/usersData";
import type { CronJobTask } from "@/types/cronjobs";
import type {
  IKnowledgebaseBzUsers,
  IKnowledgebaseCronJobs,
  IKnowledgebaseCronJobsAudit,
} from "@/types/database/schemas/knowledgebase";
import type { ICreateTableFields } from "@/types/database/service";
import type { restGet, restGetType } from "@/types/restApi";
import { computed, onMounted, onUnmounted, ref, toRefs, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import CronJobOne from "./CronJobs/CronJobOne.vue";

interface IFilter {
  naimen: string;
  parameters: string;
  kod_script: number | null;
  kod_user: number | null;
  active: boolean | null;
  runing: restGet<keyof IKnowledgebaseCronJobsAudit> | boolean | null;
}
// export default defineComponent({
//   components: { CronJobOne },
// setup() {
const { r_get } = dataApiComposition();
const router = useRouter();
const route = useRoute();
const filter = ref<IFilter>({
  naimen: "",
  parameters: "",
  kod_script: null,
  kod_user: null,
  active: null,
  runing: null,
});
const { jobs, job_scripts } = toRefs(useAdminStore());
const { usersFioArray } = toRefs(useUserDataStore());
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
      e.active
    ),
  }));
});
const getCronScripts = () =>
  r_get(
    {
      from: "cron_scripts",
      sort: ["naimen_script"],
    },
    "job_scripts",
    useAdminStore
  );
const getCronJobs = () => {
  const lFilter = {} as restGetType<
    ICreateTableFields<keyof IKnowledgebaseCronJobs, "j">
  >;
  const routerFilter = {} as {
    [x: string]: string;
  };
  if (filter.value.parameters) {
    lFilter["j.parameters"] = `~*:${filter.value.parameters}`;
    routerFilter["parameters"] = filter.value.parameters;
  }
  if (filter.value.naimen) {
    lFilter["j.naimen"] = `~*:${filter.value.naimen}`;
    routerFilter["naimen"] = filter.value.naimen;
  }
  if (filter.value.kod_script) {
    lFilter["j.kod_script"] = filter.value.kod_script;
    routerFilter["kod_script"] = String(filter.value.kod_script);
  }
  if (filter.value.kod_user) {
    lFilter["j.kod_user"] = filter.value.kod_user;
    routerFilter["kod_user"] = String(filter.value.kod_user);
  }
  if (filter.value.active !== null) {
    lFilter["j.active"] = filter.value.active;
    routerFilter["active"] = String(filter.value.active);
  }
  if (filter.value.runing !== null) {
    lFilter["EXISTS"] = filter.value.runing
      ? ({
          from: [
            {
              fields: ["a.result"],
              from: ["cron_jobs_audit:a"],
              filter: {
                "a.kod_job": "@@:j.id",
                "a.time_start": "@@>=:j.last_run-interval'1 hour'",
              },
              limit: 1,
              sort: ["-a.time_start"],
            },
          ],
          filter: {
            result: [{ result: "выполняется" }, { result: "в очереди" }],
          },
        } as any)
      : ({
          from: [
            {
              fields: ["a.result"],
              from: ["cron_jobs_audit:a"],
              filter: {
                "a.kod_job": "@@:j.id",
                "a.time_start": "@@>=:j.last_run-interval'1 hour'",
              },
              limit: 1,
              sort: ["-a.time_start"],
            },
          ],
          filter: {
            result: [{ result: "<>:выполняется" }, { result: "null" }],
            "result@1": [{ result: "<>:в очереди" }, { result: "null" }],
          },
        } as any);
    routerFilter["runing"] = String(filter.value.runing);
  }
  router.push({
    query: { ...routerFilter },
  });
  return r_get<
    | ICreateTableFields<keyof IKnowledgebaseCronJobs, "j">
    | ICreateTableFields<keyof IKnowledgebaseCronJobsAudit, "a">
  >(
    {
      fields: [
        "j.*",
        {
          fields: ["a.result"],
          from: ["cron_jobs_audit:a"],
          filter: {
            "a.kod_job": "@@:j.id",
            "a.time_start": "@@>=:now()-interval'7 day'",
            "a.time_start@1": "@@<=:now()",
          },
          limit: 1,
          sort: ["-a.time_start"],
        },
      ],
      from: ["cron_jobs:j"],
      filter: lFilter,
      sort: ["j.naimen"],
    },
    "jobs",
    useAdminStore
  );
};
const getScriptParams = () =>
  r_get(
    {
      from: "cron_script_params",
      sort: ["order_var"],
    },
    "job_scripts_params",
    useAdminStore
  );
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
        case "runing":
          filter.value[k] = element === "true";
          break;
        default:
          break;
      }
    }
  }
}
r_get<keyof IKnowledgebaseBzUsers>(
  {
    fields: [
      "id",
      "login",
      "tabnum",
      "family",
      "first_name",
      "second_name",
      "login_ip",
      "login_time",
      "create_time",
      "active",
    ],
    from: "bz_users",
    sort: ["family", "first_name"],
  },
  "users",
  useAdminStore
)
  .then(() => getCronScripts())
  .then(() => getScriptParams())
  .then(() => getCronJobs());
const interval = ref(0);
onMounted(() => {
  if (filter.value.runing) interval.value = setInterval(getCronJobs, 5000);
});
watch(
  filter,
  (nVal) => {
    if ("runing" in nVal && nVal.runing) {
      if (interval.value === 0) interval.value = setInterval(getCronJobs, 5000);
    } else {
      if (interval.value) {
        clearInterval(interval.value);
        interval.value = 0;
      }
    }
  },
  { deep: true }
);
onUnmounted(() => {
  if (interval.value) clearInterval(interval.value);
});
//     return { jobs, job_scripts, filter, taskJobs, getCronJobs, usersFioArray };
//   },
// });
</script>
