<template>
  <v-row v-if="fieldList.length > 0" class="ma-1">
    <v-col cols="12">
      <v-divider />
    </v-col>
    <v-col class="text-h5 text-right" cols="5">
      таблица {{ space + "." + table }}
    </v-col>
    <v-col cols="5">
      <v-text-field
        v-model="searchData"
        dense
        hide-details
        label="Общий поиск"
        outlined
        prepend-icon="mdi-magnify"
        single-line
      />
    </v-col>

    <v-col class="text-right" cols="2">
      <BtnIconsVVue
        :action="genExcel"
        color="green"
        icon="mdi-microsoft-excel"
        title="Скачать XLSX"
      />
      <BtnIconsVVue
        :action="addModalRow"
        color="purple"
        :disabled="!addLevel"
        icon="add"
        title="Добавить"
      />
    </v-col>
    <v-col v-if="workData.length" cols="12">
      <v-data-table
        calculate-widths
        class="elevation-1 striped"
        dense
        fixed-header
        :headers="[
          ...Object.keys(workData[0]).map((r) => ({ text: r, value: r })),
          { text: '+', value: 'tableRowEdit', width: 100, align: 'end' },
        ]"
        height="80vh"
        :items="workData"
        :items-per-page="15"
        light
        multi-sort
        no-data-text="данные не найдены"
        :search="searchData"
      >
        <tr>
          <td v-for="f in fieldList" :key="'fl_' + f.column_name">
            <v-row>
              <v-col cols="auto">
                <v-checkbox
                  v-if="f.data_type === 'boolean'"
                  v-model="dataRows.new[f.column_name]"
                  class="ma-0 pa-0"
                  hide-details
                />
                <v-text-field
                  v-else
                  v-model="dataRows.new[f.column_name]"
                  dense
                  :hide-details="true"
                  :label="f.column_name"
                  outlined
                />
              </v-col>
            </v-row>
          </td>
          <td>
            <BtnIconsVVue
              :action="addRow"
              color="purple"
              :disabled="!addLevel"
              icon="add"
              title="Добавить"
            />
          </td>
        </tr>
        <template
          v-for="k in fieldList
            .filter((e) => e.data_type === 'boolean')
            .map((e) => e.column_name)"
          #[`item.${k}`]="{ item }"
        >
          <v-simple-checkbox :key="'_' + k" v-model="item[k]" disabled />
        </template>
        <template #[`item.tableRowEdit`]="{ item }">
          <v-row align="start" justify="end">
            <BtnIconsVVue
              :action="() => deleteRow(pkey, item[pkey])"
              color="red"
              :disabled="!editLevel"
              icon="delete"
              title="Удалить запись"
            />
            <BtnIconsVVue
              :action="() => editModalRow(item)"
              color="green"
              :disabled="!editLevel"
              icon="edit"
              title="Редактировать запись"
            />
          </v-row>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { EKNOWLEGEBASE } from "@/const/schemaEnums";
import projectDebug from "@/functions/projectDebug";
import { usePostgreStore } from "@/store/modules/postgre";
import { toast } from "materialize-css";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
const { editLevel, addLevel } = routeAccessLevelCalculate();
const { fieldList, dataTable } = storeToRefs(usePostgreStore());
const { r_delete } = dataApiComposition();
const workData = computed(() => dataTable.value.map((e) => ({ ...e })).slice());
const searchData = ref("");
const deleteRow = (key: string, val: number) => {
  const t = table;
  if (
    !confirm(
      "Подтвердите удаление записи " + key + "=" + val + " из таблицы " + t
    )
  ) {
    return;
  }
  const fields: Record<string, string | number[]> = {};
  fields[key] = "" + val;
  r_delete({
    from: (space + "." + t) as EKNOWLEGEBASE,
    filter: {
      ...fields,
    },
  }).then((r) => {
    projectDebug(r);
    if (r.count === 1) {
      toast({
        html: "Запись " + key + "=" + val + " из " + t + "<br>удалена успешно",
      });
      getDataTable(t);
    } else {
      toast({ html: r.err.detail });
    }
  });
  projectDebug("Удаление ", key, val);
};
</script>
