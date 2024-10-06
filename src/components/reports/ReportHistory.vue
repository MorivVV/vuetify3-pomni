<template>
  <div>
    <router-view v-if="'stateId' in $route.params && $route.params.stateId" />
    <DataTableV
      v-else
      :caption="props.reportName"
      class="blue lighten-5"
      :headers="tableHeaderReportHistory"
      :items="reportsState"
      show-expand
    >
      <template #expanded-top>
        <v-col class="pa-1" cols="auto">
          <v-row>
            <v-col cols="auto">
              Все поля по умолчанию приведены к строковому типу.
            </v-col>
            <v-col cols="auto">
              <ReportColumnSetting
                :report-id="report_id"
                :report-name="reportName"
              />
            </v-col>
          </v-row>
        </v-col>
      </template>
      <template #[`item.date_add`]="{ item }">
        {{ moment(item.date_add).format(momentFormatFullShort) }}
      </template>
      <template #[`item.naimen`]="{ item }">
        <a
          :href="`/reports/page/${item.kod_report}/view/${item.id}`"
          target="_blank"
        >{{ item.naimen }}</a>
      </template>
      <template #[`item.delete`]="{ item }">
        <BtnIconsV
          :action="
            () => {
              loadingDeleteReport = true;
              delReportState(item.id).then(() =>
                loadReportState().finally(() => (loadingDeleteReport = false))
              );
            }
          "
          color="red"
          :colorbtn="loadingDeleteReport ? 'red' : 'white'"
          :disabled="!moderatorLevel()"
          icon="delete"
          :loading="loadingDeleteReport"
          title="Удалить"
        />
      </template>
      <template #[`item.xlsx`]="{ item }">
        <BtnIconsV
          :action="
            () => {
              loadingXLSXreport = true;
              generateReportXLSX(report_id, item.id, item.naimen).finally(
                () => (loadingXLSXreport = false)
              );
            }
          "
          color="green"
          :colorbtn="loadingXLSXreport ? 'green' : 'white'"
          icon="mdi-microsoft-excel"
          :loading="loadingXLSXreport"
          title="Скачать XLSX"
        />
      </template>
      <template #expanded-item="{ headers, item }">
        <td class="ma-0 pa-0" :colspan="headers.length">
          <ReportView :report-id="report_id" :report-state-id="item.id" />
        </td>
      </template>
    </DataTableV>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import DataTableV from "../basic/DataTableV.vue";
import { IReportsReportState } from "@/types/database/schemas/reports";
import {
  delReportState,
  generateReportXLSX,
  getReportState,
  tableHeaderReportHistory,
} from "./reportActions";
import moment from "moment";
import { momentFormatFullShort } from "@/const/timeFormats";
import ReportView from "./ReportView.vue";
import BtnIconsV from "../basic/BtnIconsV.vue";
import { useRoute } from "vue-router";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import ReportColumnSetting from "./ReportColumnSetting.vue";

const route = useRoute();
const { moderatorLevel } = routeAccessLevelCalculate();
const props = defineProps({
  reportName: {
    type: String,
  },
  reportId: {
    type: Number,
  },
});
const loadingXLSXreport = ref(false);
const loadingDeleteReport = ref(false);

const report_id = ref(props?.reportId ?? 0);
if ("reportId" in route.params) {
  report_id.value = Number(route.params.reportId);
}

onMounted(() => {
  loadReportState();
});

const reportsState = ref<IReportsReportState[]>([]);
const loadReportState = () =>
  getReportState(report_id.value).then((r) => {
    reportsState.value = r;
  });
</script>
