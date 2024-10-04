<template>
  <v-row v-if="tableList.length > 0" class="ma-1" align="center">
    <v-col cols="12">
      <v-divider></v-divider>
    </v-col>
    <v-col cols="5" class="text-h4 text-right">Список таблиц в схеме</v-col>
    <v-col cols="5">
      <TextFielsV
        v-model="searchTable"
        prepend-icon="mdi-magnify"
        label="Общий поиск"
      ></TextFielsV>
    </v-col>
    <v-col cols="12">
      <v-data-table
        dense
        :search="searchTable"
        :headers="Object.keys(tableList[0]).map((r) => ({ text: r, value: r }))"
        :items="tableList"
        :items-per-page="10"
        class="elevation-1 striped blue lighten-5"
      >
        <template #[`item.tablename`]="{ item }">
          <v-btn
            outlined
            small
            block
            class="text-lowercase"
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
const emit = defineEmits(["viewFields"]);
import { ref } from "vue";
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
