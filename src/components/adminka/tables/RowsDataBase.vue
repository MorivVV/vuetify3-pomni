<template>
  <v-row v-if="fieldList.length > 0" class="ma-1">
    <v-col cols="12">
      <v-divider />
    </v-col>
    <v-col cols="5" class="text-h5 text-right">
      таблица {{ space + "." + table }}
    </v-col>
    <v-col cols="5">
      <v-text-field
        v-model="searchData"
        dense
        outlined
        prepend-icon="mdi-magnify"
        label="Общий поиск"
        single-line
        hide-details
      />
    </v-col>

    <v-col cols="2" class="text-right">
      <BtnIconsVVue
        color="green"
        icon="mdi-microsoft-excel"
        title="Скачать XLSX"
        :action="genExcel"
      />
      <BtnIconsVVue
        :disabled="!addLevel"
        color="purple"
        :action="addModalRow"
        icon="add"
        title="Добавить"
      />
    </v-col>
    <v-col v-if="workData.length" cols="12">
      <v-data-table
        dense
        light
        multi-sort
        calculate-widths
        fixed-header
        height="80vh"
        :items-per-page="15"
        no-data-text="данные не найдены"
        class="elevation-1 striped"
        :search="searchData"
        :headers="[
          ...Object.keys(workData[0]).map((r) => ({ text: r, value: r })),
          { text: '+', value: 'tableRowEdit', width: 100, align: 'end' },
        ]"
        :items="workData"
      >
        <tr>
          <td v-for="f in fieldList" :key="'fl_' + f.column_name">
            <v-row>
              <v-col cols="auto">
                <v-checkbox
                  v-if="f.data_type === 'boolean'"
                  v-model="dataRows.new[f.column_name]"
                  hide-details
                  class="ma-0 pa-0"
                />
                <v-text-field
                  v-else
                  v-model="dataRows.new[f.column_name]"
                  dense
                  :hide-details="true"
                  outlined
                  :label="f.column_name"
                />
              </v-col>
            </v-row>
          </td>
          <td>
            <BtnIconsVVue
              :disabled="!addLevel"
              color="purple"
              :action="addRow"
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
          <v-row justify="end" align="start">
            <BtnIconsVVue
              :action="() => deleteRow(pkey, item[pkey])"
              :disabled="!editLevel"
              title="Удалить запись"
              color="red"
              icon="delete"
            />
            <BtnIconsVVue
              :action="() => editModalRow(item)"
              :disabled="!editLevel"
              title="Редактировать запись"
              color="green"
              icon="edit"
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
