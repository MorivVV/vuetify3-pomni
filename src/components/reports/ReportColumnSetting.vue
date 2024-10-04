<template>
  <v-dialog
    v-model="fieldSettingDialog"
    max-width="600px"
    persistent
    scrollable
  >
    <template #activator="{ on }">
      <BtnIconsV
        :action="() => activateDialogColumn()"
        color="primary"
        icon="settings"
        title="Настройка полей"
        v-on="on"
      />
    </template>
    <v-card>
      <v-card-title>Настройка полей отчета {{ props.reportName }}</v-card-title>
      <v-divider />
      <v-card-text style="height: 500px">
        <v-row>
          <v-col>
            Для каждого поля можно установить связку типа возвращаемых данных.
            <br>
            Например: дата не будет распознаваться без указания этого
            параметра<br>
            Если указывать неконвертируемые типы данных, возникнет ошибка<br>
            Можно указать псевдоним для поля, которое будет заменяться при
            формировании отчета (Кастомное имя колонки)
          </v-col>
        </v-row>
        <v-row
          v-for="col in reportColumn"
          :key="'column_' + col.id"
          class="ma-1 pa-0"
        >
          <v-col
            align-self="center"
            class="ma-0 pa-0 pr-2 text-right"
            cols="4"
          >{{ col.name_col }}</v-col>
          <v-col class="ma-0 pa-0" cols="3">
            <AutocompleteV
              v-model="col.type_col"
              :clearable="false"
              item-text="naimen"
              item-value="id"
              :items="reportsColumnType"
              label="Тип поля"
            />
          </v-col>
          <v-col class="ma-0 pa-0" cols="5">
            <TextFielsV v-model="col.description" label="Псевдоним" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn color="red darken-1" text @click="cancelEditColumns">
          Отмена
        </v-btn>
        <v-btn
          color="blue darken-1"
          :disabled="!moderatorLevel()"
          text
          @click="saveColumnType"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useReportStore } from "@/store/modules/reports";
import AutocompleteV from "../basic/AutocompleteV.vue";
import TextFielsV from "../basic/TextFielsV.vue";
import { ref, toRefs } from "vue";
import { IReportsReportColumns } from "@/types/database/schemas/reports";
import { getReportColumn, updateReportColumn } from "./reportActions";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import BtnIconsV from "../basic/BtnIconsV.vue";
const props = defineProps({
  reportName: {
    type: String,
  },
  reportId: {
    type: Number,
    required: true,
  },
});
const { moderatorLevel } = routeAccessLevelCalculate();

const fieldSettingDialog = ref(false);
const reportColumn = ref<IReportsReportColumns[]>([]);
const reportColumnSave = ref("");

const { reportsColumnType } = toRefs(useReportStore());

const activateDialogColumn = () => {
  getReportColumn(props.reportId).then((r) => {
    reportColumn.value = r;
    reportColumnSave.value = JSON.stringify(r);
    fieldSettingDialog.value = true;
  });
};
const saveColumnType = () => {
  const promise = reportColumn.value.map((col) => {
    const reSave = JSON.parse(
      reportColumnSave.value
    ) as IReportsReportColumns[];
    if (
      !reSave.find(
        (s) =>
          s.id === col.id &&
          s.description === col.description &&
          s.type_col === col.type_col
      )
    ) {
      return updateReportColumn(col.id, col.type_col, col.description);
    } else {
      return false;
    }
  });
  Promise.all(promise).then(() => {
    fieldSettingDialog.value = false;
  });
};

const cancelEditColumns = () => {
  reportColumn.value = JSON.parse(
    reportColumnSave.value
  ) as IReportsReportColumns[];
  fieldSettingDialog.value = false;
};
</script>
