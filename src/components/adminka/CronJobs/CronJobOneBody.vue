<template>
  <v-row class="pa-0 ma-0">
    <v-col class="pa-1" cols="12">
      <v-card color="yellow lighten-5">
        <div class="card-content">
          <v-row align="center" class="pa-0 ma-0">
            <v-col class="pa-1" cols="5" md="3">
              <TextFielsV v-model="localJob.naimen" label="Название задания" />
            </v-col>
            <v-col class="pa-1" cols="12" md="4">
              <TextFielsV
                v-model="localJob.description"
                class="white"
                :clearable="false"
                label="Описание задания"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="3">
              <v-row class="ma-0 pa-0">
                <v-col class="ma-0 pa-1" cols="6">
                  <DatetimePickerVVue
                    v-model="localJob.period_start"
                    :date-picker-props="{ 'first-day-of-week': 1 }"
                    dense
                    label="Первый запуск с"
                    outlined
                    time-format="HH:mm:ss"
                    :time-picker-props="timeProps"
                  />
                </v-col>
                <v-col class="ma-0 pa-1" cols="6">
                  <DatetimePickerVVue
                    v-model="localJob.period_end"
                    :date-picker-props="{ 'first-day-of-week': 1 }"
                    datetime="timestamp"
                    dense
                    label="Выполнять до"
                    outlined
                    time-format="HH:mm:ss"
                    :time-picker-props="timeProps"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col class="d-flex justify-end pa-1" cols="2">
              <span
                class="font-weight-bold mr-2 pt-1"
                :class="localJob.active ? '' : 'red--text'"
              >{{ localJob.active ? "Задание Вкл" : "Задание Выкл" }}</span>
              <SwitchV
                v-model="localJob.active"
                color="green accent-4"
                inset
                title="Статус активности задания"
              />
              <LoaderCircle v-if="jobRunning" />
              <BtnIconsVVue
                v-else
                :action="runJob"
                class="mr-2"
                color="red"
                :disabled="!editLevel()"
                icon="play"
                title="Немедленный запуск задания"
              />
              <BtnIconsVVue
                :action="cloneJob"
                class="mr-2"
                color="purple"
                :disabled="!editLevel()"
                icon="content-duplicate"
                title="Клонировать"
              />

              <BtnIconsVVue
                :action="saveJob"
                class="mr-2"
                color="blue"
                :disabled="!editLevel() || changeVal"
                icon="content-save"
                title="Сохранить изменения"
              />
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col class="pa-1" cols="12" md="2">
              <AutocompleteV
                v-model="localJob.period_run_month"
                clearable
                item-text="name"
                item-value="id"
                :items="months"
                label="Месяц"
              />
            </v-col>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-col
                  class="pa-1"
                  cols="12"
                  md="2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <AutocompleteV
                    v-model="localJob.period_run_week_array"
                    clearable
                    item-text="short"
                    item-value="id"
                    :items="weekdays"
                    label="День недели (множественный выбор)"
                    multiple
                  /> </v-col></template>
              <span>Пустое поле для ежедневного запуска</span>
            </v-tooltip>
            <v-col class="pa-1" cols="6" md="1">
              <AutocompleteV
                v-model="localJob.period_run_day"
                clearable
                item-text="name"
                item-value="id"
                :items="days"
                label="Число"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="2">
              <AutocompleteV
                v-model="localJob.period_run_hour_array"
                clearable
                item-text="name"
                item-value="id"
                :items="hours"
                label="Час по МСК (множественный выбор)"
                multiple
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="1">
              <AutocompleteV
                v-model="localJob.period_run_minute"
                :class="{
                  'red lighten-3': validateMinutes(localJob),
                }"
                clearable
                item-text="name"
                item-value="id"
                :items="minutes"
                label="Минута"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="1">
              <TextFielsV
                v-model="localJob.interval_min"
                :class="{
                  'red lighten-3': Number(localJob.interval_min) <= 0,
                }"
                :clearable="false"
                label="Интервал в минутах"
                type="number"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="1">
              <TextFielsV
                v-model="localJob.timeout"
                :class="{
                  'red lighten-3': Number(localJob.timeout) >= 60,
                }"
                :clearable="false"
                label="Ожидание запуска (сек)"
                type="number"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="2">
              <TextFielsV
                v-model="localJob.cron_host_ip"
                :clearable="false"
                label="Хост планировщика"
                :readonly="!adminLevel()"
              />
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col class="pa-0 ma-0" cols="12">
              <CronJobParamsVue
                v-if="jobParams.length > 0"
                :job-params="jobParams"
                :param-value="localJob.parameters"
                @change-param="changeParam"
                @change-start="changeVal = true"
              />
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col class="pa-1" cols="12">
              <v-textarea
                v-model="localJob.parameters"
                dense
                hide-details
                label="Параметры"
                outlined
              />
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col class="pa-1" cols="6" md="2">
              <TextFielsV
                :disabled="true"
                label="Добавлен"
                :value="localJob.date_add"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="2">
              <TextFielsV
                :disabled="true"
                label="Последний запуск"
                :value="convertTime(String(localJob.last_run))"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="2">
              <TextFielsV
                :class="{
                  'red accent-2': localJob.last_done < localJob.last_run,
                }"
                :disabled="true"
                label="Успешное выполнение"
                :value="convertTime(String(localJob.last_done))"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="2">
              <TextFielsV
                :disabled="true"
                label="Следующий запуск"
                :value="convertTime(localJob.task.nextRun())"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="2">
              <TextFielsV
                :disabled="true"
                label="Изменен"
                :value="localJob.date_modify"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="2">
              <div class="border rounded pa-1 pt-2 grey--text">
                <span class="">Изм. </span>
                <UserFioVue type-name="short" :user_id="localJob.kod_user" />
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card>
      <CronJobHistory
        v-if="!jobRunning"
        :kod-job="localJob.id"
        @get-cron-jobs="$emit('getCronJobs')"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import BtnIconsVVue from "@/components/basic/BtnIconsV.vue";
import UserFioVue from "@/components/elements/UserFio.vue";
import { currentAuthUser, currentTimestamp } from "@/const/globalRestAPI";
import { CronJobTask } from "@/types/cronjobs";
import { computed, PropType, ref, toRefs, watch } from "vue";
import CronJobParamsVue from "./CronJobParams.vue";
import { useDateConstStore } from "@/store/modules/dateConst";
import { useAdminStore } from "@/store/modules/admin";
import DatetimePickerVVue from "../../basic/DatetimePickerV.vue";
import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import CronJobHistory from "./CronJobHistory.vue";
import { IKnowledgebaseCronJobs } from "@/types/database/schemas/knowledgebase";
import moment from "moment";

import LoaderCircle from "@/components/basic/LoaderCircle.vue";
import projectDebug from "@/functions/projectDebug";
import TextFielsV from "@/components/basic/TextFielsV.vue";
import AutocompleteV from "@/components/basic/AutocompleteV.vue";
import { momentFormatFull } from "@/const/timeFormats";
import SwitchV from "@/components/basic/SwitchV.vue";
const props = defineProps({
  j: { type: Object as PropType<CronJobTask>, required: true },
});
const emit = defineEmits(["getCronJobs"]);
const { r_insert, r_update, r_fetch, checkDataModify } = dataApiComposition();
const { editLevel, adminLevel } = routeAccessLevelCalculate();
const {
  months,
  weekdays: weekdaysfull,
  days,
  hours: hoursfull,
  minutes,
} = useDateConstStore();
const weekdays = weekdaysfull.filter((e) => e.id !== "null");
const hours = hoursfull.filter((e) => e.id !== "null");
const { job_scripts_params } = toRefs(useAdminStore());
const timeProps = {
  format: "24hr",
  useSeconds: true,
  ampmInTitle: true,
};
const jobRunning = ref(false);
const runJob = () => {
  const jobId = props.j.id;
  jobRunning.value = true;
  r_fetch("api/v2/runJob", { id: jobId }).then((r) => {
    projectDebug(r);
    jobRunning.value = false;
    checkDataModify(r, "Завершено");
    emit("getCronJobs");
  });
};
const changeVal = ref(false);
const jobParams = computed(() =>
  job_scripts_params.value.filter((e) => e.kod_script === props.j.kod_script)
);
// const alterTime = (t: string) => {
//   let formatDate = "";
//   if (t) {
//     formatDate = moment(t).fromNow();
//     if (formatDate === "Invalid date") {
//       formatDate = t;
//     }
//   }
//   return formatDate;
// };
const convertTime = (t: string | Date | null) => {
  let formatDate = t;
  if (t) {
    formatDate = moment(t).format(momentFormatFull);
    if (formatDate === "Invalid date") {
      formatDate = moment().add(10, "years").format(momentFormatFull);
    }
  }
  return formatDate as string;
};
watch(
  () => String(props.j.last_run) + String(props.j.date_modify),
  () => {
    localJob.value = {
      ...props.j,
      date_add: convertTime(props.j.date_add),
      period_start: convertTime(props.j.period_start),
      period_end: convertTime(String(props.j.period_end)),
      date_modify: convertTime(String(props.j.date_modify)),
    };
  }
);
const localJob = ref<CronJobTask>({
  ...props.j,
  date_add: convertTime(props.j.date_add),
  period_start: convertTime(props.j.period_start),
  period_end: convertTime(String(props.j.period_end)),
  date_modify: convertTime(String(props.j.date_modify)),
});
const changeParam = (e: string) => {
  changeVal.value = false;
  localJob.value.parameters = e;
};
const validateMinutes = (j: CronJobTask) => {
  return (
    String(j.period_run_minute) === "null" &&
    j.period_run_hour_array.length >= 0 &&
    j.interval_min < 2
  );
};
const cloneJob = () => {
  const clone: any = {};
  clone.active = false;
  clone.script = props.j.script;
  clone.kod_script = props.j.kod_script;
  clone.parameters = props.j.parameters;
  clone.naimen = "CLONE_" + props.j.naimen;
  clone.kod_user = currentAuthUser;
  r_insert({
    to: "cron_jobs",
    fields: {
      ...clone,
    },
  }).then((r) => {
    if (r.count) {
      emit("getCronJobs");
      toast.info({ html: "Задание клонировано" });
    } else {
      toast.error("Не удалось клонировть");
    }
  });
};
const saveJob = () => {
  const edit: any = {};
  for (const key in localJob.value) {
    if (Object.hasOwnProperty.call(localJob.value, key)) {
      const k = key as keyof IKnowledgebaseCronJobs | "task";
      if (k === "period_start" || k === "period_end") {
        if (convertTime(String(props.j[k])) !== localJob.value[k]) {
          edit[key] = localJob.value[k];
        }
      } else if (k === "task") {
      } else {
        if (props.j[k] !== localJob.value[k]) {
          edit[key] = localJob.value[k];
        }
      }
    }
  }

  try {
    if (localJob.value.parameters) JSON.parse(localJob.value.parameters);
    if (validateMinutes(localJob.value)) { throw { message: "Не указаны минуты для запуска" }; }
    r_update({
      to: "cron_jobs",
      set: {
        ...edit,
        kod_user: currentAuthUser,
        date_modify: currentTimestamp,
      },
      filter: {
        id: localJob.value.id,
      },
    }).then((r) => {
      if (r.count) {
        emit("getCronJobs");
        toast.info({ html: "Задание сохранено успешно" });
      } else {
        toast.error("Сохранить изменения не удалось");
      }
    });
  } catch (error: any) {
    if ("message" in error) {
      toast.error(error.message);
    } else {
      toast.warning("Параметры не валидны, проверьте правильность параметров");
    }
  }
};
</script>

<style scoped>
.border {
  border: solid 1px silver;
}
</style>
