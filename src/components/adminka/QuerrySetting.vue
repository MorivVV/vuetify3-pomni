<template>
  <div>
    <v-row class="ma-1">
      <v-col cols="2">
        <AutocompleteV
          v-model="data_base"
          item-text="bd"
          item-value="id"
          :items="[{ id: null, bd: 'Все' }].concat(bd_list)"
          label="База данных"
          prepend-icon="mdi-video-input-hdmi"
        />
        <AutocompleteV
          v-model="kod_driver"
          item-text="naimen"
          item-value="id"
          :items="[{ id: 0, naimen: 'Все' }].concat(bd_list_tuz)"
          label="ТУЗ"
          prepend-icon="mdi-account-box"
        />
      </v-col>
      <v-col cols="2">
        <AutocompleteV
          v-model="kod_user"
          item-text="fio"
          item-value="id"
          :items="
            [{ id: 0, fio: 'Все' }].concat(
              usersFioArray
                .filter((e) => Number(e.tabnum) > 100000)
                .map((e) => ({ id: e.id, fio: e.fio }))
            )
          "
          label="Автор/редактор"
        />
      </v-col>

      <v-col cols="2">
        <TextFielsV
          v-model="sql_text"
          label="В запросе"
          @keypress.enter="getSSQ"
        />
      </v-col>
      <v-col class="pa-2 pl-0 ma-0" cols="6">
        <SearchInput :use-state="useAdminStore" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title> Работа с запросами </v-card-title>
          <v-card-text>
            <div class="mb-1">
              Запросы разделяются по типу от используемой БД: Oracle или
              PostgreSQL. Запросы, для которых выбран ТУЗ будут выполняться на
              внешних БД на которые настроен ТУЗ.
              <br>
              Если выбрать PostgresSQL и не указывать ТУЗ, то запросы будут
              выполняться на БД АС ПоМни.
              <br>
              При добавлении нового запроса, он будет создаваться в виде
              пустышки с названием 1a_newAjax_{количество_всех_запросов+1}.
              Такой запрос всегда будет иметь БД = PostgresSQL и ТУЗ - пусто
            </div>

            <div class="mb-1">
              Запросы могут иметь входные параметры, которые работают как
              параметры, передаваемые в функции.
              <span class="purple--text">
                При использовании параметров обязательно указывайте на какой БД
                будет выполняться запрос (ORACLE/PostgreSQL)
              </span>
              <br>
              Параметры в запросе указываются как ключевые слова, которые
              начинаются с двоеточия
              <div class="ml-4">
                kod_user = <span class="green--text"> :test_parameter </span>
              </div>
              Список этих параметров необходимо указывать в поле входные
              параметры. Если параметров несколько, то они разделяются через
              запятую. По умолчанию все параметры считаются строковыми, но мы
              можем указать тип значения и оно будет приводтися к нему
              принудительно. Для этого перед описанием параметра указывается
              тип, а затем двоеточие
              <div class="ml-4 blue--text">
                i:number_parameter, s:test_parameter, b:active
              </div>
              где типы, i - число, s - строка, b - логическое значение
              (true/false)

              <div class="red--text">
                Если параметры используются в запросе, то все параметры должны
                быть обязательно перечислены во входных параметрах
              </div>
            </div>
            <div class="mb-1">
              Отображение кнопки для получения XLSX настроено по условию, в
              запросе должны быть указаны в верхнем регитсре слова SELECT, FROM
              и WHERE
            </div>
            <div class="mb-1">
              Для получения графика, запрос должен возвращать 3 поля: label,
              period и count
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="pa-0 ma-1 mb-n4 ml-4 mr-4 pl-4 pr-4">
      <v-col class="pa-1 ma-0" cols="auto" offset-md="1">
        <BtnIconsVVue
          :action="addOpen"
          class="small-btn"
          color="white"
          colorbtn="blue darken-2"
          :disabled="!addLevel"
          icon="plus"
          title="Добавить новый запрос"
        />
      </v-col>
      <v-col class="pa-1 ma-0">
        <v-pagination v-model="page" color="pink" :length="calcPages" />
      </v-col>
    </v-row>
    <v-row v-if="loading" align="center" justify="center">
      <v-col cols="auto">
        <LoaderCircle />
      </v-col>
    </v-row>
    <OneSQLVue
      v-for="ssq in sqlQuery"
      :key="ssq.id"
      :ssq="ssq"
      @get-s-s-q="getSSQ"
    />

    <v-col cols="12">
      <v-pagination v-model="page" color="pink" :length="calcPages" />
    </v-col>
    <v-dialog v-model="addDialog" width="80%">
      <div v-if="addDialog">
        <OneSQLedit :ssq="newAjax" @edit-sql="addSSQ" />
      </div>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import SearchInput from "@/components/basic/SearchInput.vue";
import BtnIconsVVue from "@/components/basic/BtnIconsV.vue";
import { computed, onMounted, ref, toRefs, watch } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import OneSQLVue from "./QuerrySetting/OneSQL.vue";
import { useAdminStore } from "@/store/modules/admin";
import {
  IKnowledgebaseCronJobs,
  IKnowledgebaseSysSqlQuery,
  IKnowledgebaseSysSqlQueryAudit,
} from "@/types/database/schemas/knowledgebase";
import { ICreateTableFields } from "@/types/database/service";
import { ECONFIG, EKNOWLEGEBASE } from "@/const/schemaEnums";
import { IConfigDataBases } from "@/types/database/schemas/config";
import { restGet, restGetType } from "@/types/restApi";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import { useUserDataStore } from "@/store/modules/usersData";
import AutocompleteV from "../basic/AutocompleteV.vue";
import { useRoute, useRouter } from "vue-router";
import TextFielsV from "../basic/TextFielsV.vue";
import LoaderCircle from "../basic/LoaderCircle.vue";
import OneSQLedit from "./QuerrySetting/OneSQLedit.vue";
import { useAutorizationStore } from "@/store/modules/autorization";
import { currentTimestamp } from "@/const/globalRestAPI";

const route = useRoute();
const router = useRouter();
const { userId } = toRefs(useAutorizationStore());
const { r_get, r_insert, r_state, checkDataModify } = dataApiComposition();
const { usersFioArray } = useUserDataStore();
const { addLevel } = routeAccessLevelCalculate();
const page = ref(1);
const data_base = ref("pg");
const kod_user = ref(0);
const inputTimeout = ref(0);
const kod_driver = ref(0);
const sql_text = ref("");
const loading = ref(false);
const addDialog = ref(false);
const newAjax = ref<Partial<IKnowledgebaseSysSqlQuery>>({});
const {
  search,
  sqlQuery,
  searchCount,
  bd_list,
  dateBeg,
  dateEnd,
  resultMin,
  perPage,
  bd_list_tuz,
} = toRefs(useAdminStore());
const getRouteParams = () => {
  const object = { ...route.query };
  for (const key in object) {
    const element = object[key];
    switch (key) {
      case "data_base":
        data_base.value = String(element);
        break;
      case "sql_name":
        search.value = String(element);
        break;
      case "kod_database_tuz":
        kod_driver.value = Number(element);
        break;
      case "sql_text":
        sql_text.value = String(element);
        break;
      case "kod_user":
        kod_user.value = Number(element);
        break;
      case "limit":
        perPage.value = Number(element);
        break;
      case "page":
        page.value = Number(element);
        break;

      default:
        break;
    }
  }
};

const calcPages = computed(() => {
  return Math.ceil(searchCount.value / perPage.value);
});
const getSQLName = (sql_name: string) =>
  r_get<keyof IKnowledgebaseSysSqlQuery>({
    from: "sys_sql_query",
    filter: { sql_name },
  });
const addOpen = () => {
  newAjax.value = {};
  if (data_base.value == "oracle") newAjax.value.data_base = data_base.value;
  else newAjax.value.data_base = "pg";
  if (kod_driver.value) newAjax.value.kod_database_tuz = kod_driver.value;
  newAjax.value.kod_user_add = +userId.value;
  newAjax.value.need_token = true;
  newAjax.value.result = "json";
  newAjax.value.sql_name = "Введи уникальное имя запроса";
  newAjax.value.sql_query = `SELECT 1 as "Имя колонки"
--FROM DUAL
WHERE 1=1
  AND 1<>2
ORDER BY 1`;
  addDialog.value = true;
};
const addSSQ = (editDialog: boolean, modSsq: IKnowledgebaseSysSqlQuery) => {
  if (!modSsq) {
    addDialog.value = editDialog;
    return;
  }

  return r_insert<keyof IKnowledgebaseSysSqlQuery>({
    to: "sys_sql_query",
    fields: {
      ...modSsq,
    },
  })
    .then((r) => {
      return checkDataModify(r);
    })
    .then((r) => {
      if (r) {
        getSQLName(modSsq.sql_name).then((ssq) => {
          sqlQuery.value = ssq.concat(...sqlQuery.value);
          if (ssq.length) {
            const mssq = ssq[0];
            r_insert<keyof IKnowledgebaseSysSqlQueryAudit>({
              to: "sys_sql_query_audit",
              fields: {
                kod_sql: mssq.id,
                sql_name: mssq.sql_name,
                sql_query: mssq.sql_query,
                sql_params: mssq.sql_params,
                kod_user_change: +userId.value,
                kod_database_tuz: mssq.kod_database_tuz,
                data_base: mssq.data_base,
                active: mssq.active,
                need_token: mssq.need_token,
                result: mssq.result,
                status: "ACCEPT",
                date_check: currentTimestamp,
                kod_user_check: +userId.value,
              },
            });
          }
        });
        addDialog.value = editDialog;
      }
    });
};
const getConfigDataBases = () => {
  r_get<ICreateTableFields<keyof IConfigDataBases, "db">>(
    {
      fields: [
        "db.base_name",
        "db.id",
        "db.naimen",
        "db.kod_driver",
        "db.change_accept",
      ],
      from: [`${ECONFIG.data_bases}:db`],
      filter: {
        "db.active": true,
      },
      sort: ["db.naimen"],
    },
    "bd_list_tuz",
    useAdminStore
  );
};
const replaceURL = () => {
  const query:
    | Record<string, string | (string | null)[] | null | undefined>
    | undefined = {};
  if (kod_user.value) {
    query.kod_user = String(kod_user.value);
  }
  if (search.value) {
    query.sql_name = String(search.value);
  }
  if (sql_text.value) {
    query.sql_text = String(sql_text.value);
  }
  if (kod_driver.value) {
    query.kod_database_tuz = String(kod_driver.value);
  }
  if (perPage.value) {
    query.limit = String(perPage.value);
  }
  if (resultMin.value) {
    query.page = String(page.value);
  }
  if (JSON.stringify(route.query) !== JSON.stringify(query)) {
    router.replace({ query });
  }
};
const getSSQ = (calcCount = true) => {
  loading.value = true;
  const filter: restGetType<
    | "coalesce(ssq.date_modify, ssq.date_add)"
    | ICreateTableFields<keyof IKnowledgebaseSysSqlQuery, "ssq">
  > = {
    "ssq.sql_query": `~~*:%${sql_text.value}%`,
    "ssq.active": true,
  };
  if (search.value) {
    filter["ssq.sql_name"] = `~~*:%${search.value}%`;
  } else {
    if (dateBeg.value) {
      filter["coalesce(ssq.date_modify, ssq.date_add)"] = `>=:${dateBeg.value}`;
    }
    if (dateEnd.value) {
      filter[
        "coalesce(ssq.date_modify, ssq.date_add)@1"
      ] = `<=:${dateEnd.value}`;
    }
    if (kod_user.value) {
      filter["ssq.kod_user_add"] = [
        { "ssq.kod_user_add": kod_user.value },
        { "ssq.kod_user_modify": kod_user.value },
      ];
    }
    if (kod_driver.value) {
      filter["ssq.kod_database_tuz"] = kod_driver.value;
    } else if (data_base.value) {
      filter["ssq.data_base"] = `=:${data_base.value}`;
    }
  }
  const ssqAudit: restGet<
    ICreateTableFields<keyof IKnowledgebaseSysSqlQueryAudit, "a">
  > = {
    fields: ["a.status", "a.kod_sql", "a.date_check", "a.kod_user_check"],
    from: ["sys_sql_query_audit:a", "config.data_bases:t"],
    join: ["a.kod_database_tuz=(+)t.id"],
    alias: "a",
    sort: ["-a.id"],
    limit: 1,
  };
  const countChange: restGet<keyof IKnowledgebaseSysSqlQueryAudit> = {
    fields: ["count(1):cnt_all"],
    from: "sys_sql_query_audit",
    filter: {
      kod_sql: "@@:ssq.id",
      status: "ACCEPT",
    },
  };
  const countScript: restGet<keyof IKnowledgebaseCronJobs> = {
    from: "cron_jobs",
    fields: ["count(1):cnt_script"],
    filter: {
      parameters: "@@~:ssq.sql_name",
    },
  };
  r_get<string | ICreateTableFields<keyof IKnowledgebaseSysSqlQuery, "ssq">>(
    {
      fields: ["ssq.*", "a.*", countChange, countScript],
      from: [`${EKNOWLEGEBASE.sys_sql_query}:ssq`, ssqAudit],
      join: ["ssq.id=(+)a.kod_sql"],
      sort: ["ssq.sql_name"],
      filter,
      limit: perPage.value,
      page: 1 + resultMin.value / perPage.value,
    },
    "sqlQuery",
    useAdminStore
  ).then(() => {
    loading.value = false;
  });
  if (calcCount) {
 r_get<string | ICreateTableFields<keyof IKnowledgebaseSysSqlQuery, "ssq">>({
      fields: ["count(1):cnt"],
      from: ["sys_sql_query:ssq"],
      filter,
    }).then((r) => {
      let count = 0;
      if (r.length) {
        count = r[0].cnt;
      }
      r_state(useAdminStore, "searchCount", count);
      replaceURL();
    });
}
};

watch(search, () => getSSQ());
watch(data_base, () => getSSQ());
watch(kod_user, () => getSSQ());
watch(kod_driver, (val) => {
  const kod_drive = bd_list_tuz.value.find((e) => e.id === val)?.kod_driver;
  if (kod_drive) {
    const d_base = bd_list.value.find((e) => e.kod_driver === kod_drive)?.id;
    if (d_base) data_base.value = d_base;
  } else {
    data_base.value = "pg";
  }
  getSSQ();
});
watch(dateBeg, () => getSSQ());
watch(sql_text, () => {
  if (inputTimeout.value) {
    clearTimeout(inputTimeout.value);
  }
  inputTimeout.value = setTimeout(() => {
    getSSQ();
  }, 300);
});
watch(dateEnd, () => getSSQ());
watch(resultMin, () => getSSQ());
watch(page, (newVal) => {
  r_state(useAdminStore, "resultMin", (newVal - 1) * perPage.value);
  if (!loading.value) getSSQ();
});
getConfigDataBases();
onMounted(() => getSSQ());
getRouteParams();
</script>

<style scoped>
.b {
  font-weight: 500;
}
</style>
