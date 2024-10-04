<template>
  <v-row class="pa-0 ma-0">
    <v-col class="pa-1" cols="12">
      <v-card color="yellow lighten-5">
        <div class="card-content">
          <v-row class="pa-0 ma-0" align="center">
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
                <v-col cols="6" class="ma-0 pa-1">
                  <DatetimePickerVVue
                    v-model="localJob.period_start"
                    outlined
                    dense
                    :time-picker-props="timeProps"
                    :date-picker-props="{ 'first-day-of-week': 1 }"
                    time-format="HH:mm:ss"
                    label="Первый запуск с"
                  />
                </v-col>
                <v-col cols="6" class="ma-0 pa-1">
                  <DatetimePickerVVue
                    v-model="localJob.period_end"
                    outlined
                    dense
                    :time-picker-props="timeProps"
                    :date-picker-props="{ 'first-day-of-week': 1 }"
                    datetime="timestamp"
                    time-format="HH:mm:ss"
                    label="Выполнять до"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="2" class="d-flex justify-end pa-1">
              <span
                class="font-weight-bold mr-2 pt-1"
                :class="localJob.active ? '' : 'red--text'"
                >{{ localJob.active ? "Задание Вкл" : "Задание Выкл" }}</span
              >
              <SwitchV
                v-model="localJob.active"
                inset
                color="green accent-4"
                title="Статус активности задания"
              />
              <LoaderCircle v-if="jobRunning" />
              <BtnIconsVVue
                v-else
                :disabled="!editLevel()"
                color="red"
                class="mr-2"
                :action="runJob"
                icon="play_arrow"
                title="Немедленный запуск задания"
              />
              <BtnIconsVVue
                :disabled="!editLevel()"
                color="purple"
                class="mr-2"
                :action="cloneJob"
                icon="control_point_duplicate"
                title="Клонировать"
              />

              <BtnIconsVVue
                :disabled="!editLevel() || changeVal"
                color="blue"
                class="mr-2"
                :action="saveJob"
                icon="save"
                title="Сохранить изменения"
              />
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col class="pa-1" cols="12" md="2">
              <AutocompleteV
                v-model="localJob.period_run_month"
                clearable
                label="Месяц"
                :items="months"
                item-value="id"
                item-text="name"
              />
            </v-col>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-col class="pa-1" cols="12" md="2" v-bind="attrs" v-on="on">
                  <AutocompleteV
                    v-model="localJob.period_run_week_array"
                    multiple
                    clearable
                    label="День недели (множественный выбор)"
                    :items="weekdays"
                    item-value="id"
                    item-text="short"
                  /> </v-col
              ></template>
              <span>Пустое поле для ежедневного запуска</span>
            </v-tooltip>
            <v-col class="pa-1" cols="6" md="1">
              <AutocompleteV
                v-model="localJob.period_run_day"
                clearable
                label="Число"
                :items="days"
                item-value="id"
                item-text="name"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="2">
              <AutocompleteV
                v-model="localJob.period_run_hour_array"
                multiple
                clearable
                label="Час по МСК (множественный выбор)"
                :items="hours"
                item-value="id"
                item-text="name"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="1">
              <AutocompleteV
                v-model="localJob.period_run_minute"
                clearable
                :class="{
                  'red lighten-3': validateMinutes(localJob),
                }"
                label="Минута"
                :items="minutes"
                item-value="id"
                item-text="name"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="1">
              <TextFielsV
                v-model="localJob.interval_min"
                :class="{
                  'red lighten-3': Number(localJob.interval_min) <= 0,
                }"
                type="number"
                :clearable="false"
                label="Интервал в минутах"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="1">
              <TextFielsV
                v-model="localJob.timeout"
                type="number"
                :clearable="false"
                :class="{
                  'red lighten-3': Number(localJob.timeout) >= 60,
                }"
                label="Ожидание запуска (сек)"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="2">
              <TextFielsV
                v-model="localJob.cron_host_ip"
                :readonly="!adminLevel()"
                :clearable="false"
                label="Хост планировщика"
              />
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col class="pa-0 ma-0" cols="12">
              <CronJobParamsVue
                v-if="jobParams.length > 0"
                :job-params="jobParams"
                :param-value="localJob.parameters"
                @changeParam="changeParam"
                @changeStart="changeVal = true"
              />
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col class="pa-1" cols="12">
              <v-textarea
                v-model="localJob.parameters"
                outlined
                dense
                hide-details
                label="Параметры"
              />
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-col class="pa-1" cols="6" md="2">
              <TextFielsV
                :value="localJob.date_add"
                :disabled="true"
                label="Добавлен"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="2">
              <TextFielsV
                :value="convertTime(String(localJob.last_run))"
                :disabled="true"
                label="Последний запуск"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="2">
              <TextFielsV
                :value="convertTime(String(localJob.last_done))"
                :class="{
                  'red accent-2': localJob.last_done < localJob.last_run,
                }"
                :disabled="true"
                label="Успешное выполнение"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="2">
              <TextFielsV
                :value="convertTime(localJob.task.nextRun())"
                :disabled="true"
                label="Следующий запуск"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="2">
              <TextFielsV
                :value="localJob.date_modify"
                :disabled="true"
                label="Изменен"
              />
            </v-col>
            <v-col class="pa-1" cols="6" md="2">
              <div class="border rounded pa-1 pt-2 grey--text">
                <span class="">Изм. </span>
                <UserFioVue :user_id="localJob.kod_user" type-name="short" />
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card>
      <CronJobHistory
        v-if="!jobRunning"
        :kod-job="localJob.id"
        @getCronJobs="$emit('getCronJobs')"
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
import { dataApiComposition } from "@/compositionApi/dataApi";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import CronJobHistory from "./CronJobHistory.vue";
import { IKnowledgebaseCronJobs } from "@/types/database/schemas/knowledgebase";
import moment from "moment";

import LoaderCircle from "@/components/basic/LoaderCircle.vue";
import projectDebug from "@/functions/projectDebug";
import { toast } from "@/compositionApi/dataApi";
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
    if (validateMinutes(localJob.value))
      throw { message: "Не указаны минуты для запуска" };
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
