<template>
  <v-container v-if="fields.length">
    <v-row class="ma-1">
      <v-col>
        <v-card>
          <v-card-title>
            <div class="text-h5 mt-2 mb-1">Импорт данных в БД из файла</div>
          </v-card-title>
          <v-card-title>
            <v-file-input
              v-model="file"
              label="Выбрать Эксель файл для загрузки"
              @change="readFile"
            />
          </v-card-title>
          <v-card-text v-if="xlsxData.length">
            <DataTableV
              :caption="'Поля в таблице ' + space + '.' + table"
              class="elevation-1 striped purple-lighten-5"
              :headers="
                Object.keys(fields[0]).map((r) => ({ text: r, value: r }))
              "
              item-key="column_name"
              :items="fields"
              :items-per-page="10"
              show-select
              :single-select="false"
            />
            <v-row class="ma-0">
              Связь полей в таблице с столбцами Экселя (имя заголовка)
            </v-row>
            <v-row
              v-for="(join, index) in xlsxTableJoins"
              :key="'f_join_' + join.col_table"
              align="center"
              class="ma-0"
              justify="center"
            >
              <v-col class="pa-1" cols="4">
                <AutocompleteV
                  v-if="fields.length"
                  v-model="join.col_table"
                  item-text="column_name"
                  item-value="column_name"
                  :items="fields"
                  label="Поле в таблице"
                />
              </v-col>
              =
              <v-col class="pa-1" cols="4">
                <AutocompleteV
                  v-if="fields.length"
                  v-model="join.col_xlsx"
                  item-text="text"
                  item-value="text"
                  :items="xlsxFields"
                  label="Поле в Экселе"
                />
              </v-col>
              <v-col class="pa-1" cols="auto">
                <CheckBoxTitleV
                  v-model="join.unique"
                  label="уникальный"
                  title="По уникальным полям будет производиться связка с данными при обновлении"
                />
              </v-col>
              <v-col class="pa-1" cols="auto">
                <BtnIconsV
                  :action="() => delJoin(index)"
                  color="white"
                  colorbtn="red"
                  icon="delete"
                  title="Удалить связь"
                />
              </v-col>
            </v-row>

            <v-row align="center" class="ma-1" justify="center">
              <v-col class="pa-1" cols="5">
                <AutocompleteV
                  v-if="fields.length"
                  v-model="newJoin.col_table"
                  item-text="column_name"
                  item-value="column_name"
                  :items="fields"
                  label="Поле в таблице"
                />
              </v-col>
              =
              <v-col class="pa-1" cols="5">
                <AutocompleteV
                  v-if="fields.length"
                  v-model="newJoin.col_xlsx"
                  item-text="text"
                  item-value="text"
                  :items="xlsxFields"
                  label="Поле в Экселе"
                />
              </v-col>
              <v-col class="pa-1" cols="1">
                <BtnIconsV
                  :action="addJoin"
                  color="white"
                  colorbtn="blue"
                  icon="plus"
                  title="Добавить связь"
                />
              </v-col>
            </v-row>
            <v-row class="ma-1">
              <v-col class="pa-1">
                <BtnIconsV
                  :action="syncField"
                  icon="sync"
                  title="Синхронизировать поля по названию"
                />
              </v-col>
            </v-row>
            <DataTableV
              v-if="file && xlsxData.length"
              v-model="selectedFields"
              :caption="'Данные файла ' + file.name"
              class="bg-green-lighten-4"
              fixed-header
              height="33vh"
              :item-key="Object.keys(xlsxData[0])[0]"
              :items="xlsxData"
              :items-per-page="10"
              show-select
              :single-select="false"
            />

            <v-row v-if="parseJoinedData.length" class="ma-1">
              <DataTableV
                caption="Выбраны записи"
                class="bg-blue-lighten-4"
                fixed-header
                height="33vh"
                :items="parseJoinedData"
                :items-per-page="10"
              />

              <v-col cols="12">
                <BtnIconsV
                  :action="saveToDataBase"
                  icon="plus"
                  title="Добавить записи в БД"
                />
                <BtnIconsV
                  :action="mergeToDataBase"
                  color="white"
                  colorbtn="blue"
                  icon="call_merge"
                  title="Обновить записи в БД"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { dataApiComposition } from "@/compositionApi/dataApi";
import { EKNOWLEGEBASE } from "@/const/schemaEnums";
import { computed, PropType, ref } from "vue";
import { read, Sheet2JSONOpts, utils } from "xlsx";
import AutocompleteV from "./AutocompleteV.vue";
import DataTableV from "./DataTableV.vue";
import BtnIconsV from "./BtnIconsV.vue";
import CheckBoxTitleV from "./CheckBoxTitleV.vue";
import { FieldList } from "@/types/global";

interface JoinExcelTable {
  col_xlsx: string;
  col_table: string;
  unique: boolean;
}

const props = defineProps({
  space: { type: String, required: true },
  table: { type: String, required: true },
  fields: { type: Array as PropType<FieldList[]>, default: () => [] },
});
const { r_insert, r_update, checkDataModify } = dataApiComposition();
const xlsxData = ref<Record<string, string>[]>([]);
const selectedFields = ref<Record<string, string>[]>([]);
const xlsxTableJoins = ref<JoinExcelTable[]>([]);
const newJoin = ref<JoinExcelTable>({
  col_xlsx: "",
  col_table: "",
  unique: false,
});
const file = ref<File>();
const xlsxFields = computed(() => {
  if (xlsxData.value.length === 0) {
    return [];
  }

  return Object.keys(xlsxData.value[0]).map((r) => ({ text: r, value: r }));
});
const parseJoinedData = computed(() => {
  const data = selectedFields.value.map((object) => {
    const newObj = {} as { [x: string]: any };
    for (const iterator of xlsxTableJoins.value) {
      newObj[iterator.col_table] = object[iterator.col_xlsx];
    }
    return newObj;
  });

  return data;
});
const addJoin = () => {
  xlsxTableJoins.value.push({ ...newJoin.value });
};
const delJoin = (index: number) => {
  xlsxTableJoins.value = xlsxTableJoins.value.filter((e, i) => i !== index);
};
const readFile = () => {
  if (!file.value) return;
  if (~file.value.name.indexOf("xlsx") || ~file.value.name.indexOf("xls")) {
    const reader = new FileReader();
    reader.onload = (res) => {
      const data = res.target?.result;
      const workbook = read(data, { type: "binary" });
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const opt = {} as Sheet2JSONOpts;
      opt.defval = "-";
      xlsxData.value = utils.sheet_to_json(ws, opt);
    };
    reader.readAsBinaryString(file.value);
  }
};
const syncField = () => {
  props.fields.forEach((e) => {
    const testField = xlsxFields.value.filter((x) => x.text === e.column_name);
    if (testField.length === 1) {
      xlsxTableJoins.value.push({
        col_xlsx: e.column_name,
        col_table: e.column_name,
        unique: false,
      });
    }
  });
};
const saveToDataBase = async () => {
  for (let index = 0; index < parseJoinedData.value.length; index++) {
    const element = parseJoinedData.value[index];
    await r_insert({
      to: (props.space + "." + props.table) as EKNOWLEGEBASE,
      fields: element,
    }).then((r) => {
      if (
        !checkDataModify(r, "Строка добавлена", "Строка добавить не удалось")
      ) {
        const uniqElems = xlsxTableJoins.value.filter((e) => e.unique);
        const filter = {} as { [x: string]: any };
        for (let index = 0; index < uniqElems.length; index++) {
          const fil = uniqElems[index];
          filter[fil.col_table] = element[fil.col_table];
        }
        r_update({
          to: (props.space + "." + props.table) as EKNOWLEGEBASE,
          set: element,
          filter,
        }).then((r) =>
          checkDataModify(
            r,
            `Строка ${index + 1} обновлена`,
            `Строку ${index + 1} обновить не удалось`
          )
        );
      }
    });
  }
};
const mergeToDataBase = async () => {
  for (let index = 0; index < parseJoinedData.value.length; index++) {
    const element = parseJoinedData.value[index];
    const uniqElems = xlsxTableJoins.value.filter((e) => e.unique);
    const filter = {} as { [x: string]: any };
    for (let index = 0; index < uniqElems.length; index++) {
      const fil = uniqElems[index];
      filter[fil.col_table] = element[fil.col_table];
    }
    await r_update({
      to: (props.space + "." + props.table) as EKNOWLEGEBASE,
      set: element,
      filter,
    }).then((r) =>
      checkDataModify(
        r,
        `Строка ${index} обновлена`,
        `Строку ${index} обновить не удалось`
      )
    );
  }
};
</script>
