<template>
  <v-row class="row center ma-2" justify="center">
    <v-col cols="12" lg="4" md="6">
      <AutocompleteV
        v-model="kod_database_tuz"
        item-text="naimen"
        item-value="id"
        :items="[{ id: 0, naimen: 'Нет' }].concat(bd_list_tuz)"
        label="ТУЗ (данные со смежных БД)"
        prepend-icon="account_box"
      />
    </v-col>
    <v-col cols="12" lg="4" md="6">
      <AutocompleteV
        v-model="schema"
        item-text="nspname"
        item-value="nspname"
        :items="pg_namespace"
        label="Схема"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import AutocompleteV from "@/components/basic/AutocompleteV.vue";
import { useAdminStore } from "@/store/modules/admin";
import { usePostgreStore } from "@/store/modules/postgre";
import { ref, toRefs, watch } from "vue";
const emit = defineEmits(["set-tuz", "set-schema"]);
const props = defineProps({
  kodDatabaseTuz: { type: Number, default: 0 },
  space: { type: String, default: "public" },
});
const { pg_namespace } = toRefs(usePostgreStore());
const { bd_list_tuz } = toRefs(useAdminStore());
const kod_database_tuz = ref(props.kodDatabaseTuz);
const schema = ref(props.space);
watch(kod_database_tuz, (val) => emit("set-tuz", val));
watch(schema, (val) => emit("set-schema", val));
</script>
