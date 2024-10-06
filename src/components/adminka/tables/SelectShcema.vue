<template>
  <v-row class="row center ma-2" justify="center">
    <v-col cols="12" lg="4" md="6">
      <AutocompleteV
        v-model="local_tuz"
        item-text="naimen"
        item-value="id"
        :items="[{ id: 0, naimen: 'Нет' }].concat(bd_list_tuz)"
        label="ТУЗ (данные со смежных БД)"
        prepend-icon="account_box"
        @input="$emit('changeTuz', local_tuz)"
      />
    </v-col>
    <v-col cols="12" lg="4" md="6">
      <AutocompleteV
        v-model="localSpace"
        item-text="nspname"
        item-value="nspname"
        :items="pg_namespace"
        label="Схема"
        @input="$emit('changeSpace', localSpace)"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { usePostgreStore } from "@/store/modules/postgre";
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/store/modules/admin";
import AutocompleteV from "@/components/basic/AutocompleteV.vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { ICreateTableFields } from "@/types/database/service";
import { IConfigDataBases } from "@/types/database/schemas/config";
import { ECONFIG } from "@/const/schemaEnums";

const { bd_list_tuz } = storeToRefs(useAdminStore());
const { r_get } = dataApiComposition();
const props = defineProps({
  kodDatabaseTuz: {
    type: Number,
    required: true,
  },
  space: {
    type: String,
    required: true,
  },
});
const localSpace = ref(props.space);
const local_tuz = ref(props.kodDatabaseTuz);
const { pg_namespace } = storeToRefs(usePostgreStore());

const reloadSchema = () =>
  r_get<string>(
    {
      fields: ["nspname"],
      from: "pg_catalog.pg_namespace",
      sort: ["nspname"],
      tuz: local_tuz.value,
    },
    "pg_namespace",
    usePostgreStore
  );
r_get<ICreateTableFields<keyof IConfigDataBases, "db">>(
  {
    fields: ["db.base_name", "db.id", "db.naimen", "db.kod_driver"],
    from: [`${ECONFIG.data_bases}:db`],
    filter: {
      "db.active": true,
      "db.kod_driver": 1,
    },
    sort: ["db.naimen"],
  },
  "bd_list_tuz",
  useAdminStore
);
reloadSchema();
watch(local_tuz, reloadSchema);
</script>
