<template>
  <v-row>
    Настройки {{ msg }}
    <v-col cols="2">
      <AutocompleteV
        item-text="naimen"
        item-value="id"
        :items="apartments"
        label="Квартира"
      />
    </v-col>
    <v-col cols="2">
      <AutocompleteV
        v-model="msg"
        item-text="naimen"
        item-value="id"
        :items="resources"
        label="Ресурсы"
      />
    </v-col>
    <v-col cols="2">
      <AutocompleteV
        v-model="msg"
        item-text="naimen"
        item-value="id"
        :items="meters"
        label="счетчик"
      />
    </v-col>
    <v-col cols="2">
      <TextFielsV v-model="msg" label="test" />
    </v-col>
    <v-col>
      <BtnIconsV :action="getMeters" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useBillingsStore } from "@/store/modules/billings";
import { ref, toRefs } from "vue";
import AutocompleteV from "../basic/AutocompleteV.vue";
import TextFielsV from "../basic/TextFielsV.vue";
import BtnIconsV from "../basic/BtnIconsV.vue";
const store = useBillingsStore();
const { apartments, resources, meters } = toRefs(store);

const { r_get } = dataApiComposition();
const msg = ref("Hello!");
r_get(
  { from: "billing.apartments", sort: ["naimen"] },
  "apartments",
  useBillingsStore
);
r_get(
  { from: "billing.resources", sort: ["naimen"] },
  "resources",
  useBillingsStore
);
const getMeters = () =>
  r_get(
    { from: "billing.meters", sort: ["naimen"] },
    "meters",
    useBillingsStore
  );
</script>
