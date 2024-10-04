<template>
  <div>
    <ChangeSchema
      :kod-database-tuz="kod_database_tuz"
      :space="space"
      @set-tuz="setTuz"
      @set-schema="setSchema"
    />
    <v-row class="ma-1" align="center">
      <v-col cols="12" class="ma-0 pa-1">
        <v-divider />
      </v-col>
      <v-col v-if="tableList.length" cols="12" class="ma-0 pa-1">
        <SchemaTables :space="space" @view-fields="(t) => viewFields(t)" />
      </v-col>
    </v-row>

    <v-row v-if="fieldList.length > 0" class="ma-1" justify="end" align="end">
      <v-col cols="12" class="ma-0 pa-1">
        <TableFields
          :space="space"
          :table="table"
          @select-fields="
            (v) => (v ? (selectedFields = v) : (selectedFields.length = 0))
          "
        />
      </v-col>
    </v-row>
    <v-row class="ma-1" justify="center">
      <v-card>
        <v-card-text>
          Добавлена возможность накладывать множественные фильтры. Для сравнения
          с пустым значением null, нужно выбирать оператор Равно (=) и в
          поисковую фразу писать null => Значение является null или !null =>
          значение не является null
        </v-card-text>
      </v-card>
    </v-row>
    <v-row class="ma-0 mt-4" align="center">
      <v-col cols="12" md="auto" class="text-h5 pa-1"> Выборка из БД </v-col>
      <v-col cols="4" md="1" class="ma-0 pa-1">
        <TextFielsV
          v-model="limit"
          type="number"
          min="1"
          label="Лимит записей"
          :clearable="false"
        />
      </v-col>
      <v-col cols="4" md="1" class="ma-0 pa-1">
        <TextFielsV
          v-model="page"
          :clearable="false"
          type="number"
          min="1"
          label="Сдвиг страницы"
        />
      </v-col>
      <v-col cols="8" class="ma-0 pa-0">
        <v-row class="ma-0 pa-1" align="end">
          <v-col class="ma-0 pa-0">
            <v-row
              v-for="fltr in baseFilters"
              :key="'filter_' + fltr.name"
              class="ma-0 pa-0 pb-1"
            >
              <v-col cols="12" md="4" class="ma-0 pa-0">
                <AutocompleteV
                  v-model="fltr.name"
                  label="Поле поиска"
                  :items="fieldList"
                  item-text="column_name"
                  item-value="column_name"
                />
              </v-col>
              <v-col class="ma-0 pa-0">
                <AutocompleteV
                  v-model="fltr.op"
                  class="pa-0"
                  single-line
                  label="Оператор сравнения"
                  :items="operators"
                  item-text="name"
                  item-value="id"
                />
              </v-col>
              <v-col cols="12" md="4" class="ma-0 pa-0">
                <TextFielsV
                  v-model="fltr.value"
                  label="Введите поисковую фразу"
                />
              </v-col>
              <v-col cols="12" md="auto" class="ma-0 pa-0">
                <BtnIconsV
                  icon="remove"
                  color="red"
                  title="Удалить фильтр"
                  :action="() => removeFilter(fltr)"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="auto" class="ma-0 pa-0 pb-1 pl-1">
            <BtnIconsV icon="add" title="Добавить фильтр" :action="addFilter" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="auto">
        <BtnIconsV
          color="green"
          :action="() => getDataTableLocal(table)"
          icon="autorenew"
          title="Применить фильтры"
        />
      </v-col>
    </v-row>
    <v-row v-if="fieldList.length > 0" class="ma-1">
      <v-col cols="12">
        <v-divider />
      </v-col>

      <v-col cols="12" class="ma-1">
        <ViewDataFromTable
          :space="space"
          :table="table"
          :work-data="workData"
          @getDataTableLocal="getDataTableLocal"
        />
      </v-col>
    </v-row>
    <XlsxParserVue :table="table" :fields="fieldList" :space="space" />

    <v-divider />

    <template v-if="adminSuperLevel()">
      <v-container>
        <v-row class="ma-0" align="center">
          <v-col cols="4">
            <div class="text-h4 mt-2 mb-1">Создать новую таблицу</div>
          </v-col>
          <v-col cols="4">
            <TextFielsV v-model="tableName" label="Название таблицы" />
          </v-col>
        </v-row>
        <v-row class="ma-0" align="center">
          <v-col cols="3">
            <TextFielsV v-model="nfield.fname" label="Имя поля" />
          </v-col>
          <v-col cols="3">
            <AutocompleteV
              v-if="dataTypes.length > 0"
              v-model="nfield.ftype"
              label="Тип данных"
              :items="dataTypes"
              item-text="type_name"
              item-value="type_name"
            />
          </v-col>
          <v-col cols="2">
            <TextFielsV v-model="nfield.scale" label="Размер" />
          </v-col>
          <v-col cols="1">
            <SwitchV
              v-model="nfield.fnull"
              class="pa-0 ma-0"
              label="Not Null"
            />
          </v-col>
          <v-col cols="2">
            <TextFielsV v-model="nfield.default" label="По умолчанию" />
          </v-col>
          <v-col cols="auto">
            <BtnIconsV
              :disabled="!addLevel()"
              color="blue"
              :action="addField"
              icon="add"
              title="Добавить поле"
            />
          </v-col>
        </v-row>
        <DataTableV
          v-if="fields.length > 0"
          class="green lighten-4"
          :items="fields"
          :caption="'Структура таблицы ' + tableName"
        />
        <v-row v-if="fields.length > 0" class="ma-1">
          <v-col class="center">
            <BtnIconsV
              :disabled="!adminLevel()"
              icon="flash_auto"
              color="blue darken-1"
              :action="addTable"
              title="Создать таблицу"
            />
          </v-col>
        </v-row>
        <div class="divider" />
      </v-container>
    </template>
    <v-row v-if="fieldList.length > 0" class="ma-1">
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col cols="12">
        <DataTableV
          caption="Список всех типов БД PostgreSQL"
          :items="dataTypes"
          :items-per-page="5"
          class="yellow lighten-5"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watch } from "vue";
import XlsxParserVue from "../basic/XlsxParser.vue";
import { usePostgreStore } from "@/store/modules/postgre";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import { dataApiComposition } from "@/compositionApi/dataApi";
import AutocompleteV from "../basic/AutocompleteV.vue";
import DataTableV from "../basic/DataTableV.vue";
import TextFielsV from "../basic/TextFielsV.vue";
import ChangeSchema from "./BaseDataTables/ChangeSchema.vue";
import SchemaTables from "./BaseDataTables/SchemaTables.vue";
import TableFields from "./BaseDataTables/TableFields.vue";
import {
  getDatabaseTUZ,
  reloadSchema,
  getData,
  getColumnInfo,
  getDataTable,
  getPrimaryKeys,
  IFilterFields,
} from "./BaseDataTables/tableFunctions";
import { useRoute, useRouter } from "vue-router";
import ViewDataFromTable from "./BaseDataTables/ViewDataFromTable.vue";
import BtnIconsV from "../basic/BtnIconsV.vue";
import SwitchV from "../basic/SwitchV.vue";

const router = useRouter();
const route = useRoute();
const { addLevel, adminSuperLevel, adminLevel } = routeAccessLevelCalculate();
const { r_create } = dataApiComposition();

const kod_database_tuz = ref(0);
const limit = ref(20);
const page = ref(1);
const selectedFields = ref<FieldList[]>([]);
const fields = ref<Nfield[]>([]);
const nfield = ref<Nfield>({
  fname: "",
  ftype: 0,
  fnull: false,
  scale: "",
  default: "",
});

const space = ref("knowledgebase");

const table = ref("");
const tableName = ref("");
const sort = ref(["-1"]);
const baseFilters = ref<IFilterFields[]>([{ name: "", op: "=:", value: "" }]);

const loaded = ref(false);
const { dataTypes, tableList, fieldList, dataTable, operators } = toRefs(
  usePostgreStore()
);
const workData = computed((): Record<string, string>[] => {
  const d = dataTable.value.map((e) => ({ ...e })).slice();
  return d;
});

//функции
const addFilter = () => {
  const filter: IFilterFields = { name: "", op: "=:", value: "" };
  baseFilters.value.push(filter);
};
const removeFilter = (filter: IFilterFields) => {
  baseFilters.value = baseFilters.value.filter(
    (e) => JSON.stringify(e) !== JSON.stringify(filter)
  );
};
const getDataTableLocal = (t) =>
  getDataTable(
    space.value,
    t,
    baseFilters.value,
    kod_database_tuz.value,
    selectedFields.value,
    sort.value,
    page.value,
    limit.value
  );

const addField = () => {
  fields.value.push({ ...nfield.value });
};
const viewFields = (t: string) => {
  if (tableList.value.filter((e) => e.tablename === t).length) {
    selectedFields.value.length = 0;
    table.value = t;
  } else {
    return;
  }
  /** очистка фильтра */
  baseFilters.value = [{ name: "", op: "=:", value: "" }];
  loaded.value = false;
  sort.value = ["-1"];
  getColumnInfo(space.value, t, kod_database_tuz.value).then(
    () => (loaded.value = true)
  );
  getDataTableLocal(t);
  getPrimaryKeys(space.value, t, kod_database_tuz.value);
};
const setTuz = (val: number) => (kod_database_tuz.value = val);
const setSchema = (val: string) => (space.value = val);

const addTable = () => {
  r_create({
    scheme: space.value,
    fields: fields.value,
    table: tableName.value,
  }).then(() => getData(space.value, kod_database_tuz.value));
};

//отслеживание изменений
watch(kod_database_tuz, () => reloadSchema(kod_database_tuz.value));
watch(space, (newVal) => {
  if (newVal !== String(route.query["scheme"])) {
    router.push({
      query: {
        scheme: newVal,
      },
    });
    getData(space.value, kod_database_tuz.value);
  }
});
watch(table, (newVal) => {
  if (newVal !== String(route.query["table"])) {
    router.push({
      query: {
        ...route.query,
        table: newVal,
      },
    });
  }
});

//предзагрузка
getDatabaseTUZ();
onMounted(() => {
  if ("scheme" in route.query && route.query["scheme"]) {
    space.value = String(route.query["scheme"]);
  }
  if ("table" in route.query && route.query["table"]) {
    table.value = String(route.query["table"]);
    viewFields(table.value);
  }
  getData(space.value, kod_database_tuz.value);
});
</script>
