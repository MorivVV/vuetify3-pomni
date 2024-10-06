<template>
  <v-container fluid>
    <v-card>
      <SqlHeader
        color-class="red lighten-5"
        :need-check="need_check"
        :ssq="ssq"
        :use-query="useQuery"
        :view-change="viewChange"
        @clone-s-s-q="cloneSSQ"
        @del-s-s-q="delSSQ"
        @edit-sql="
          () => {
            $emit('edit-sql', true);
          }
        "
      />
      <v-divider />
      <v-row class="ma-1">
        <v-col cols="12">
          <BodySQL
            color="red lighten-5"
            :sql-query="String(ssq.sql_query)"
            :sql-query-mod="
              sqlAudit.length && sqlAudit[0].status === 'NEED_CHECK'
                ? String(sqlAudit[0].sql_query)
                : String(ssq.sql_query)
            "
          />
        </v-col>
      </v-row>
      <v-row class="ma-1">
        <v-col class="overflow-auto">
          <v-tooltip v-if="ssq.interface" top>
            <template #activator="{ on, attrs }">
              <label
                v-bind="attrs"
                class="text-caption"
                v-on="on"
                @click="copyCB"
              >Интерфейс возвращаемого результа</label>
            </template>
            <p class="pre">
              {{ ssq.interface }}
            </p>
          </v-tooltip>
        </v-col>
        <v-col class="text-caption pa-0 ma-0" cols="auto">
          <div>
            <UserFioVue :user_id="ssq.kod_user_add" />
            {{ moment(ssq.date_add).format(" доб. YYYY-MM-DD HH:mm") }}
          </div>
          <div v-if="ssq.date_modify">
            <UserFioVue
              v-if="ssq.kod_user_modify"
              :user_id="ssq.kod_user_modify"
            />
            {{ moment(ssq.date_modify).format(" изм. YYYY-MM-DD HH:mm") }}
          </div>
          <span>внесено правок: {{ ssq.cnt_all }} </span>
          <div v-if="ssq.status">
            <UserFioVue :user_id="ssq.kod_user_check" />
            {{ ssq.status }}
            <span v-if="ssq.date_check">{{
              moment(ssq.date_check).format(" согл. YYYY-MM-DD HH:mm")
            }}</span>
          </div>
        </v-col>
      </v-row>
      <v-divider />
      <v-row v-if="jobs.length" class="ma-0 pa-0">
        <v-col
          class="ma-0 pa-0 pl-1"
          cols="auto"
        >Используется {{ ssq.cnt_script }} в заданиях:</v-col>
        <v-col
          v-for="job in jobs"
          :key="'job_' + job.naimen"
          class="ma-0 pa-0 pl-1"
          cols="auto"
        >
          <a
            :class="job.active ? 'green--text' : 'red--text'"
            :href="
              '/admin/cronjobs?kod_script=' +
                job.kod_script +
                '&naimen=' +
                job.naimen +
                '&active=' +
                job.active
            "
            target="_blank"
          >{{ job.naimen }}</a>
        </v-col>
      </v-row>
      <v-divider />
      <v-row class="ma-0">
        <v-col class="pa-1" cols="auto">
          <LoaderCircle v-if="loading_result" />
          <BtnIconsVVue
            v-else
            :action="testSQL"
            color="blue"
            :disabled="!ssq.sql_query"
            icon="play"
            title="Выполнить скрипт и получить результат"
          />
        </v-col>
        <v-col v-if="useChart" class="pa-1" cols="auto">
          <LoaderCircle v-if="loading_diagramm" />
          <BtnIconsVVue
            v-else
            :action="() => getExcelChart(ssq.sql_name, params)"
            color="red"
            icon="chart-line"
            title="Скачать XLSX диаграму"
          />
        </v-col>
        <v-col v-if="useQuery" class="pa-1" cols="auto">
          <LoaderCircle v-if="loading_xlsx" />
          <BtnIconsVVue
            v-else
            :action="() => getExcel(ssq.sql_name, params)"
            color="green"
            icon="microsoft-excel"
            title="Скачать XLSX"
          />
        </v-col>

        <v-col>
          <v-row>
            <v-col
              v-for="p in qParam"
              :key="ssq.sql_name + p"
              class="pa-1"
              cols="1"
            >
              <TextFielsV v-model="params[p]" :label="p" />
            </v-col>
            <v-spacer />
            <v-col class="pa-0 ma-0" cols="auto">
              <div
                v-if="ssq.run_time"
                title="Продолжительность выполнения запроса"
              >
                {{ ssq.run_time }}ms
              </div>
              <div v-if="ssq.last_run" title="Время последнего запроса">
                {{ moment(ssq.last_run).format("YYYY-MM-DD HH:mm:ss,SSS") }}
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="pa-1" cols="auto">
          <BtnIconsVVue
            v-if="+ssq.cnt_all > 0"
            :action="getHistory"
            color="blue"
            icon="history"
            title="Просмотр истории изменения"
          />
        </v-col>
      </v-row>
      <v-row v-if="run">
        <v-col cols="12">
          <DataTableV
            v-if="!loading_result"
            calculate-widths
            :caption="ssq.sql_name"
            fixed-header
            :height="queryResult.length < 15 ? 'auto' : '60vh'"
            :items="queryResult"
            :items-per-page="15"
            :label="ssq.sql_name"
            multi-sort
            no-data-text="данные не найдены"
          />
        </v-col>
      </v-row>
    </v-card>
    <template v-for="ssqA in sqlAudit">
      <v-card v-if="ssqA.status === 'NEED_CHECK'" :key="'audit_' + ssqA.id">
        <SqlHeader
          color-class="green lighten-5"
          :need-check="need_check"
          :ssq="ssqA"
          :use-query="useQuery"
          :view-change="viewChange"
          @accept-s-s-q="acceptSSQ"
          @clone-s-s-q="cloneSSQ"
          @del-s-s-q="delSSQ"
          @edit-sql="
            () => {
              $emit('edit-sql', true);
            }
          "
          @reject-s-s-q="rejectSSQ"
        />
        <v-divider />
        <v-row class="ma-1">
          <v-col cols="12">
            <BodySQL
              color="green lighten-5"
              :sql-query="String(ssqA.sql_query)"
              :sql-query-mod="String(ssq.sql_query)"
            />
          </v-col>
        </v-row>
        <v-row class="ma-1" justify="center">
          <v-col class="pa-0 ma-0" cols="auto">
            <span
              v-if="ssqA.date_add"
              class="text-caption"
            ><UserFioVue
              v-if="ssqA.kod_user_change"
              :user_id="ssqA.kod_user_change"
            />{{
              moment(ssqA.date_add).format(" изм. YYYY-MM-DD HH:mm")
            }}</span>
            <span class="ml-2">
              - Ссылка для подтверждения:
              <a
                class="purple--text text-decoration-none"
                :href="'?sql_name=' + ssq.sql_name"
                target="_blank"
              >{{ ssqA.sql_name }}</a></span>
          </v-col>
        </v-row>
        <v-divider />
      </v-card>
    </template>
    <v-dialog v-model="dialogHistory" width="80%">
      <v-card>
        <v-card-title class="pa-0 ma-0 grey lighten-3">
          <v-row class="ma-1">
            <v-col class="pa-0">История изменений запроса {{ ssq.sql_name }}</v-col>
            <v-col class="pa-0" cols="auto">
              <BtnIconsVVue
                :action="() => (dialogHistory = false)"
                color="red"
                icon="close"
                title="Закрыть окно"
              />
            </v-col>
          </v-row>
        </v-card-title>
        <div v-for="(hist, ind) in historyList" :key="hist.id" class="white">
          <v-row class="ma-1">
            <v-col
              class="pa-0"
              cols="auto"
            >{{ historyList.length - ind }})

              {{ moment(hist.date_add).format(` добавил ${momentFormatFull} `)
              }}<UserFioVue :user_id="hist.kod_user_change" /></v-col>
            <v-col cols="1" />
            <v-col class="pa-0" cols="auto">
              <span>
                {{
                  moment(hist.date_check).format(
                    ` подтвердил ${momentFormatFull} `
                  )
                }}<UserFioVue :user_id="hist.kod_user_check" />
              </span>
            </v-col>
          </v-row>
          <v-divider />
          <SqlHeader
            color-class="green lighten-5"
            :need-check="need_check"
            no-btn
            :ssq="hist"
            :use-query="useQuery"
            :view-change="viewChange"
          />
          <v-divider />
          <BodySQL
            color="red lighten-5"
            :sql-query="String(hist.sql_query)"
            :sql-query-mod="
              ind
                ? String(historyList[ind - 1].sql_query)
                : String(ssq.sql_query)
            "
          />
          <v-divider />
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import LoaderCircle from "@/components/basic/LoaderCircle.vue";

import {
  computed,
  defineEmits,
  defineProps,
  PropType,
  ref,
  toRefs,
  watch,
} from "vue";
import BtnIconsVVue from "@/components/basic/BtnIconsV.vue";
import UserFioVue from "@/components/elements/UserFio.vue";
import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import {
  IKnowledgebaseCronJobs,
  IKnowledgebaseSysSqlQuery,
  IKnowledgebaseSysSqlQueryAudit,
} from "@/types/database/schemas/knowledgebase";
import moment from "moment";
import { useAutorizationStore } from "@/store/modules/autorization";
import projectDebug from "@/functions/projectDebug";
import { currentTimestamp } from "@/const/globalRestAPI";
import DataTableV from "@/components/basic/DataTableV.vue";
import BodySQL from "./BodySQL.vue";
import TextFielsV from "@/components/basic/TextFielsV.vue";
import SqlHeader from "./SqlHeader.vue";
import { ICreateTableFields } from "@/types/database/service";
import { IConfigDataBases } from "@/types/database/schemas/config";
import { momentFormatFull } from "@/const/timeFormats";
interface IKSSQAll extends IKnowledgebaseSysSqlQuery {
  cnt_all: string;
  cnt_script: string;
  status: string;
  date_check: string;
  kod_user_check: number;
  kod_sql: number;
}
const props = defineProps({
  ssq: {
    type: Object as PropType<IKSSQAll>,
    required: true,
  },
});
const copyCB = () => navigator.clipboard.writeText(String(props.ssq.interface));
const emit = defineEmits(["getSSQ", "edit-sql"]);
const loading_result = ref(false);
const loading_xlsx = ref(false);
const loading_diagramm = ref(false);
const run = ref(false);
const need_check = ref(props.ssq.status === "NEED_CHECK");
const queryResult = ref<Array<{ [x: string]: any }>>([]);
const params = ref<Record<string, string>>({});
const jobs = ref<Record<string, string>[]>([]);
const dialogHistory = ref(false);
const historyList = ref<IKnowledgebaseSysSqlQueryAudit[]>([]);
const { r_ajax, r_update, r_insert, r_get, r_getFile, checkDataModify } =
  dataApiComposition();
const { userId } = toRefs(useAutorizationStore());
const getHistory = () => {
  r_get<keyof IKnowledgebaseSysSqlQueryAudit>({
    from: "sys_sql_query_audit",
    filter: {
      kod_sql: props.ssq.id,
      status: "ACCEPT",
    },
    limit: 20,
    sort: ["-id"],
  }).then((r) => {
    historyList.value = r;
  });
  dialogHistory.value = true;
};
const qParam = computed(() => {
  let p: string[] = [];
  if (props.ssq.sql_params) {
    p = props.ssq.sql_params.split(",").map((e: string) => {
      const tarr = e.split(":");
      let t = "";
      if (tarr.length > 1) {
        t = tarr[1];
      } else {
        t = tarr[0];
      }
      return t.trim();
    });
  }
  return p;
});
const viewChange = computed(() => {
  const a = {
    sql_name: false,
    data_base: false,
    sql_query: false,
    sql_params: false,
    active: false,
    kod_database_tuz: false,
    need_token: false,
    result: false,
  };
  if (props.ssq.status !== "NEED_CHECK") return a;
  if (sqlAudit.value.length === 0) return a;
  for (const key in a) {
    if (Object.prototype.hasOwnProperty.call(a, key)) {
      a[key] = props.ssq[key] !== sqlAudit.value[0][key];
    }
  }
  return a;
});

const getJoinJobs = () =>
  r_get<keyof IKnowledgebaseCronJobs>({
    from: "cron_jobs",
    fields: ["kod_script", "naimen", "active"],
    filter: {
      parameters: `~:"${props.ssq.sql_name}"`,
    },
  }).then((r) => {
    jobs.value = r;
  });
const getExcel = (sql_name: string, params: Record<string, string>) => {
  loading_xlsx.value = true;
  r_getFile(
    {
      sqlname: sql_name,
      ...params,
    },
    sql_name,
    "XLSX"
  ).finally(() => {
    loading_xlsx.value = false;
  });
};
interface ISQLAudit extends IKnowledgebaseSysSqlQueryAudit {
  change_accept: boolean | null;
}
const sqlAudit = ref<ISQLAudit[]>([]);
const rejectSSQ = (id = 0) => {
  r_update<keyof IKnowledgebaseSysSqlQueryAudit>({
    to: "sys_sql_query_audit",
    set: {
      kod_user_check: +userId.value,
      date_check: currentTimestamp,
      status: "REJECT",
    },
    filter: {
      id,
    },
  })
    .then(checkDataModify)
    .then((r) => {
      if (r) {
        emit("getSSQ", false);
        // getSQLAudit();
      }
    });
};

const acceptSSQ = (accept: IKnowledgebaseSysSqlQueryAudit) => {
  r_update<keyof IKnowledgebaseSysSqlQuery>({
    to: "sys_sql_query",
    set: {
      active: accept.active,
      data_base: accept.data_base,
      date_modify: currentTimestamp,
      sql_name: accept.sql_name,
      sql_query: accept.sql_query,
      sql_params: accept.sql_params,
      kod_database_tuz: accept.kod_database_tuz,
      need_token: accept.need_token,
      kod_user_modify: accept.kod_user_change,
    },
    filter: {
      id: accept.kod_sql,
    },
  })
    .then(checkDataModify)
    .then((r) => {
      if (r) {
        r_update<keyof IKnowledgebaseSysSqlQueryAudit>({
          to: "sys_sql_query_audit",
          set: {
            kod_user_check: +userId.value,
            date_check: currentTimestamp,
            status: "ACCEPT",
          },
          filter: {
            id: accept.id,
          },
        }).then(() => {
          emit("getSSQ");
          // getSQLAudit();
        });
      }
    });
};
const getExcelChart = (sql_name: string, params: Record<string, string>) => {
  loading_diagramm.value = true;
  r_getFile(
    {
      sqlname: sql_name,
      ...params,
    },
    sql_name
  ).finally(() => {
    loading_diagramm.value = false;
  });
};
/** проверяем наличие полей для выгрузки в виде диаграммы */
const useMarker = (sqlText: string, marker: string[]) => {
  for (const m of marker) {
    if (!sqlText.includes(m)) return false;
  }
  return true;
};

const useChart = useMarker(props.ssq.sql_query, ["period", "label", "count"]);
const useQuery = useMarker(props.ssq.sql_query, ["SELECT", "FROM", "WHERE"]);
const cloneSSQ = () => {
  const clone_ssq: Partial<IKSSQAll> = { ...props.ssq };
  clone_ssq.id = undefined;
  clone_ssq.status = undefined;
  clone_ssq.cnt_all = undefined;
  clone_ssq.cnt_script = undefined;
  clone_ssq.kod_user_check = undefined;
  clone_ssq.date_check = undefined;
  clone_ssq.interface = undefined;
  clone_ssq.kod_sql = undefined;
  clone_ssq.sql_name += "_cloned_" + moment().format("YYYY-MM-DD");
  clone_ssq.date_add = undefined;
  clone_ssq.date_modify = undefined;
  clone_ssq.kod_user_add = +userId.value;
  clone_ssq.kod_user_modify = +userId.value;
  return r_insert<keyof IKnowledgebaseSysSqlQuery>({
    to: "sys_sql_query",
    fields: { ...clone_ssq },
  }).then((r) => {
    if (
      checkDataModify(
        r,
        "Аjax запрос клонирован с названием " + clone_ssq.sql_name
      )
    ) { emit("getSSQ"); }
  });
};
const delSSQ = () => {
  if (!confirm("Подтвердите удаление")) return;
  r_update<string>({
    to: "sys_sql_query",
    set: { active: false },
    filter: {
      id: props.ssq?.id,
    },
  }).then((r) => {
    if (r.count) {
      emit("getSSQ");
    } else {
      toast.error("Удалить не удалось");
      toast.error(r.err.detail);
    }
  });
};
const testSQL = () => {
  loading_result.value = true;
  run.value = true;
  r_ajax({
    sqlname: props.ssq?.sql_name,
    ...params.value,
  })
    .then((r) => {
      if ("count" in r) {
        queryResult.value = [r];
      } else if (!Array.isArray(r) && typeof r === "object") {
        queryResult.value = Object.keys(r).map((k) => r[k]);
      } else {
        queryResult.value = r;
      }

      loading_result.value = false;
    })
    .catch((err) => {
      toast.error("Ошибка при выполнени");
      projectDebug(err);
      loading_result.value = false;
      run.value = false;
    });
};
const getSQLAudit = () =>
  r_get<
    | ICreateTableFields<keyof IKnowledgebaseSysSqlQueryAudit, "a">
    | ICreateTableFields<keyof IConfigDataBases, "t">
  >({
    fields: ["a.*", "t.change_accept"],
    from: ["sys_sql_query_audit:a", "config.data_bases:t"],
    join: ["a.kod_database_tuz=(+)t.id"],
    filter: { "a.kod_sql": props.ssq.id },
    sort: ["-a.id"],
    limit: 1,
  }).then((r) => {
    sqlAudit.value = r as ISQLAudit[];
    need_check.value =
      sqlAudit.value.length !== 0 && sqlAudit.value[0].status === "NEED_CHECK";
  });
if (need_check.value) getSQLAudit();
if (Number(props.ssq.cnt_script) > 0) getJoinJobs();
watch(
  () => props.ssq.status,
  () => {
    getSQLAudit();
  }
);
</script>
