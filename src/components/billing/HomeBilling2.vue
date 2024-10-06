<template>
  <v-container>
    Сумма {{ sumVal }}
    <DataTableV
      :items="meters"
      :headers="headerBillingData"
      :items-per-page="20"
    >
      <template #[`item.calc_sum`]="{ item }">
        <ChildCalc :meter="item" @calc="(v) => (sumVal += v)" />
      </template>
      <template #[`item.naimen`]="{ item }">
        <div class="text-h6">{{ item.naimen }}</div>
        <div class="text-caption">{{ item.model }} {{ item.num }}</div>
      </template>
      <template #expanded-top>
        <v-row class="ma-0">
          <v-col class="pa-1" cols="8"
            ><AutocompleteV
              v-model="home"
              :items="apartments"
              item-value="id"
              item-text="naimen"
          /></v-col>
          <v-col class="pa-1" cols="4">
            <DatePicker2
              v-model="date_billing"
              class="pa-1"
              value-type="format"
            />
          </v-col>
        </v-row>
      </template>
    </DataTableV>
  </v-container>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import ChildCalc from "./ChildCalc.vue";
import {
  getMeters,
  getAppartamens,
  getPrices,
  headerBillingData,
  getBilling,
} from "./home/billingData";
import AutocompleteV from "../basic/AutocompleteV.vue";
import { useBillingsStore } from "@/store/modules/billings";
import DataTableV from "../basic/DataTableV.vue";
import DatePicker2 from "../basic/DatePicker2.vue";
import moment from "moment";
import { momentFormatDate } from "@/const/timeFormats";
const home = ref(1);
const date_billing = ref(moment().format(momentFormatDate));
const sumVal = ref(0);
const { apartments, meters } = toRefs(useBillingsStore());
getAppartamens();
getMeters(home.value);
getPrices(date_billing.value);
getBilling(home.value, date_billing.value);
watch(home, (val) => {
  sumVal.value = 0;
  getMeters(val);
  getBilling(home.value, date_billing.value);
});
watch(date_billing, (val) => {
  sumVal.value = 0;
  getPrices(val);
  getBilling(home.value, date_billing.value);
});
</script>
