<template>
  <div>
    <DataTableV
      :caption="reportName"
      :items="report"
      :items-per-page="20"
      :loading="loadingReport"
    >
      <template #expanded-top>
        <v-col class="pa-1" cols="auto">
          <v-row>
            <v-col cols="4">
              <span
                v-if="reportRowCount > report.length"
                class="purple--text"
              >По умолчанию выводятся первые {{ reportDefaultLimit }} строк из
                {{ reportRowCount }}. Полный отчет можно получить нажав по
                кнопке, либо скачать в эксель</span>
            </v-col>
            <v-col cols="auto">
              <BtnIconsV
                :action="() => loadReportData()"
                color="primary"
                :colorbtn="loadingReport ? 'primary' : 'white'"
                icon="file_download"
                :loading="loadingReport"
                title="Получить полный отчет"
              />
            </v-col>
            <v-col cols="auto">
              <BtnIconsV
                :action="
                  () => {
                    loadingReport = true;
                    generateReportXLSX(report_id, state_id, reportName).finally(
                      () => (loadingReport = false)
                    );
                  }
                "
                color="green"
                :colorbtn="loadingReport ? 'green' : 'white'"
                icon="mdi-microsoft-excel"
                :loading="loadingReport"
                title="Скачать XLSX"
              />
            </v-col>
          </v-row>
        </v-col>
      </template>
      <template #[`item.date_add`]="{ item }">
        {{ moment(item.date_add).format(momentFormatFull) }}
      </template>

      <template
        v-for="col in reportColumn"
        #[`item.${col.description}`]="{ item }"
      >
        <span :key="'cd' + col.id" class="blue--text text--darken-4">{{
          moment(item[col.description]).format(col.format)
        }}</span>
      </template>
    </DataTableV>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from "vue";
import DataTableV from "../basic/DataTableV.vue";
import {
  IReportsReportColumns,
  IReportsReportState,
} from "@/types/database/schemas/reports";
import {
  generateReport,
  generateReportXLSX,
  getReportColumn,
} from "./reportActions";
import moment from "moment";
import { momentFormatDate, momentFormatFull } from "@/const/timeFormats";
import { useRoute } from "vue-router";
import { useReportStore } from "@/store/modules/reports";
import BtnIconsV from "../basic/BtnIconsV.vue";
const reportDefaultLimit = 20;
const route = useRoute();
const { reportsState, reportsColumnType } = toRefs(useReportStore());

const props = defineProps({
  reportStateId: { type: Number },
  reportId: { type: Number },
});
const state_id = ref(props?.reportStateId ?? 0);
if ("stateId" in route.params) {
  state_id.value = Number(route.params.stateId);
}
const report_id = ref(props?.reportId ?? 0);
if ("reportId" in route.params) {
  report_id.value = Number(route.params.reportId);
}
const loadingReport = ref(true);
const reportName = ref("");
const reportRowCount = ref(0);
const reportColumn = ref<IReportsReportColumns[]>([]);
const loadReportData = (limit?: number) => {
  loadingReport.value = true;
  generateReport(report_id.value, state_id.value, limit).then((r) => {
    report.value = r;
    loadingReport.value = false;
    const reportFind = reportsState.value.find((r) => r.id === state_id.value);
    if (reportFind) {
      reportName.value = reportFind.naimen;
      reportRowCount.value = Number(reportFind.row_count);
    }
  });
};
const report = ref<IReportsReportState[]>([]);
onMounted(() => {
  getReportColumn(report_id.value).then((r) => {
    const datetimeColumnType = reportsColumnType.value
      .filter((t) => ["timestamptz", "timestamp"].includes(t.naimen))
      .map(({ id }) => id);

    reportColumn.value = r
      .filter((c: IReportsReportColumns) =>
        datetimeColumnType.includes(c.type_col)
      )
      .map((c) => ({
        ...c,
        format: momentFormatFull,
        description: c.description ?? c.name_col,
      }));
    const dateColumnType = reportsColumnType.value
      .filter((t) => ["date"].includes(t.naimen))
      .map(({ id }) => id);
    reportColumn.value = reportColumn.value.concat(
      r
        .filter((c: IReportsReportColumns) =>
          dateColumnType.includes(c.type_col)
        )
        .map((c) => ({
          ...c,
          format: momentFormatDate,
          description: c.description ?? c.name_col,
        }))
    );
    loadReportData(reportDefaultLimit);
  });
});
</script>
