<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3" class="pa-1"
        ><TextFielsV
          v-model="newMonitorinng.pressure_up"
          type="number"
          label="Верхнее"
      /></v-col>
      <v-col cols="12" md="3" class="pa-1"
        ><TextFielsV
          v-model="newMonitorinng.pressure_down"
          type="number"
          label="Нижнее"
      /></v-col>
      <v-col cols="12" md="3" class="pa-1"
        ><TextFielsV
          v-model="newMonitorinng.heartbeat"
          type="number"
          label="ЧСС"
      /></v-col>
      <v-col cols="12" md="3" class="pa-1"
        ><BtnIconsV
          icon="add"
          title="Добавить в дневник"
          :action="addMonZdorov"
      /></v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <DataTableV :items="zdorovie" :headers="zdorovieHeader">
          <template #[`item.time_add`]="{ item }">
            {{ $moment(item.time_add).format(momentFormatFullShort) }}
          </template>
        </DataTableV>
      </v-col>
      <v-col>
        <LineChart :chart-data="chartZdorovie" :height="300" :width="600" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { dataApiComposition } from "@/compositionApi/dataApi";
import BtnIconsV from "../basic/BtnIconsV.vue";
import DataTableV from "../basic/DataTableV.vue";
import { IMonitoringZdorovie } from "@/types/database/schemas/billing";
import { computed, ref, toRefs } from "vue";
import { useBillingsStore } from "@/store/modules/billings";
import TextFielsV from "../basic/TextFielsV.vue";
import { TipsDTH } from "../monitoring/monsm/monSmHeaders";
import { momentFormatFullShort } from "@/const/timeFormats";
import LineChart from "../basic/charts/LineChart.vue";
import moment from "moment";
const { r_get, r_insert, checkDataModify } = dataApiComposition();
const { zdorovie } = toRefs(useBillingsStore());
interface IZdorovie {
  pressure_up: number;
  pressure_down: number;
  heartbeat: number;
}
const zdorovieHeader: TipsDTH[] = [
  { text: "Верхнее", value: "pressure_up", tip: "Верхний показатель давления" },
  { text: "Нижне", value: "pressure_down", tip: "Нижний показатель давления" },
  { text: "ЧСС", value: "heartbeat", tip: "Частота сердечных сокращений" },
  { text: "Время", value: "time_add", tip: "Время занесения в дневник" },
];
const newMonitorinng = ref<IZdorovie>({
  heartbeat: 0,
  pressure_up: 0,
  pressure_down: 0,
});
const chartZdorovie = computed(() => {
  const labels = zdorovie.value.map((e) =>
    moment(e.time_add).format("DDMMM HHч")
  );
  const datasets = [
    {
      label: "Верхнее",
      borderColor: "#FC2525",
      pointBackgroundColor: "red",
      borderWidth: 1,
      pointBorderColor: "red",
      backgroundColor: "rgba(0, 0,0, 0.1)",
      data: zdorovie.value.map((e) => e.pressure_up),
    },
    {
      label: "Нижнее",
      borderColor: "orange",
      pointBackgroundColor: "orange",
      borderWidth: 1,
      pointBorderColor: "red",
      backgroundColor: "rgba(0, 0,0, 0.1)",
      data: zdorovie.value.map((e) => e.pressure_down),
    },
    {
      label: "ЧСС",
      borderColor: "blue",
      pointBackgroundColor: "white",
      borderWidth: 1,
      pointBorderColor: "blue",
      backgroundColor: "rgba(0, 55, 0, 0.1)",
      data: zdorovie.value.map((e) => e.heartbeat),
    },
  ];
  return { labels, datasets };
});
const addMonZdorov = () =>
  r_insert<keyof IMonitoringZdorovie>({
    to: "billing.zdorovie",
    fields: { ...newMonitorinng.value },
  })
    .then(checkDataModify)
    .finally(() => getMonZdorov());
const getMonZdorov = () =>
  r_get<keyof IMonitoringZdorovie>(
    {
      from: "billing.zdorovie",
      sort: ["-id"],
    },
    "zdorovie",
    useBillingsStore
  );
getMonZdorov();
</script>
