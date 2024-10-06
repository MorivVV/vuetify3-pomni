<template>
  <v-row>
    <v-col>
      <v-data-table
        show-expand
        :headers="headerResources"
        :items="resources"
        class="striped blue lighten-4"
        dense
        hide-default-footer
        :items-per-page="-1"
      >
        <template #expanded-item="{ item, headers }">
          <ResoucePrice :colspan="headers.length" :kod_resource="item.id" />
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { dataApiComposition } from "@/compositionApi/dataApi";
import { EBILLING } from "@/const/schemaEnumsHome";
import { useBillingsStore } from "@/store/modules/billings";
import { IBillingResources } from "@/types/database/schemas/billing";
import { toRefs } from "vue";
import { DataTableHeader } from "vuetify";
import ResoucePrice from "./price/ResoucePrice.vue";

const headerResources: DataTableHeader[] = [
  { value: "naimen", text: "Ресурс" },
  { value: "post", text: "постоянные" },
  { value: "on_meter", text: "за метраж" },
  { value: "on_people", text: "за человека" },
  { value: "add", text: "+" },
];
const { r_get } = dataApiComposition();
const getResources = () => {
  r_get<keyof IBillingResources>(
    {
      fields: [
        "id",
        "naimen",
        "date_add",
        "post",
        "on_meter",
        "on_people",
        "active",
      ],
      from: `${EBILLING.resources}`,
    },
    "resources",
    useBillingsStore
  );
};
const { resources } = toRefs(useBillingsStore());
getResources();
</script>
