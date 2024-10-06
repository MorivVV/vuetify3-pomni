<template>
  <v-row v-if="tableList.length > 0" align="center" class="ma-1">
    <v-col cols="12">
      <v-divider />
    </v-col>
    <v-col class="text-h4 text-right" cols="5">Список таблиц в схеме</v-col>
    <v-col cols="5">
      <TextFielsV
        v-model="searchTable"
        label="Общий поиск"
        prepend-icon="mdi-magnify"
      />
    </v-col>
    <v-col cols="12">
      <v-data-table
        class="elevation-1 striped blue lighten-5"
        dense
        :headers="Object.keys(tableList[0]).map((r) => ({ text: r, value: r }))"
        :items="tableList"
        :items-per-page="10"
        :search="searchTable"
      >
        <template #[`item.tablename`]="{ item }">
          <v-btn
            block
            class="text-lowercase"
            outlined
            small
            @click="viewFields(item.tablename)"
          >
            {{ item.tablename }}
          </v-btn>
        </template>
        <template
          v-for="k in Object.keys(tableList[0]).filter(
            (e) => ~e.indexOf('has')
          )"
          #[`item.${k}`]="{ item }"
        >
          <v-simple-checkbox :key="'_' + k" v-model="item[k]" disabled />
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import TextFielsV from "@/components/basic/TextFielsV.vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { usePostgreStore } from "@/store/modules/postgre";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const emit = defineEmits(["viewFields"]);
const { r_get } = dataApiComposition();
const { tableList } = storeToRefs(usePostgreStore());
const searchTable = ref("");
const viewFields = (t: string) => {
  emit("viewFields", t);
};
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
const getTables = () =>
  r_get<string>(
    {
      fields: [
        "tablename",
        "tableowner",
        "tablespace",
        "hasindexes",
        "hasrules",
        "hastriggers",
      ],
      from: "pg_catalog.pg_tables",
      filter: { schemaname: `=:${props.space}` },
      sort: ["tablename"],
      tuz: props.kodDatabaseTuz,
    },
    "tableList",
    usePostgreStore
  );
getTables();
</script>
