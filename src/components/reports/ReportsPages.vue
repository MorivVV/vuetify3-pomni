<template>
  <div>
    <router-view v-if="'reportId' in $route.params" />
    <DataTableV
      v-else
      caption="Отчеты"
      class="green lighten-5"
      :headers="tableHeader"
      :items="reports"
      show-expand
    >
      <template #[`item.date_add`]="{ item }">
        {{ moment(item.date_add).format(momentFormatFullShort) }}
      </template>
      <template #[`item.report_last`]="{ item }">
        <span v-if="item.report_last">{{
          moment(item.report_last).format(momentFormatFullShort)
        }}</span>
      </template>
      <template #[`item.naimen`]="{ item }">
        <a :href="`/reports/page/${item.id}`" target="_blank">{{
          item.naimen
        }}</a>
      </template>
      <template #expanded-item="{ headers, item }">
        <td class="ma-0 pa-0" :colspan="headers.length">
          <ReportHistory :report-id="item.id" :report-name="item.naimen" />
        </td>
      </template>
    </DataTableV>
  </div>
</template>

<script setup lang="ts">
import DataTableV from "../basic/DataTableV.vue";
import { toRefs } from "vue";
import { momentFormatFullShort } from "@/const/timeFormats";
import moment from "moment";
import { getReportColumnType, getReports, tableHeader } from "./reportActions";
import ReportHistory from "./ReportHistory.vue";
import { useReportStore } from "@/store/modules/reports";

const { reports } = toRefs(useReportStore());

getReports();
getReportColumnType();
</script>
