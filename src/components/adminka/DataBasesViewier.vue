<template>
  <div>
    <SelectShcema
      :kod-database-tuz="kod_database_tuz"
      :space="space"
      @change-space="changeSpace"
      @change-tuz="changeTuz"
    />

    <TableList
      :kod-database-tuz="kod_database_tuz"
      :space="space"
      @view-fields="viewFields"
    />
    {{ space }}.{{ table }}
    <FieldList
      :kod-database-tuz="kod_database_tuz"
      :space="space"
      :table="table"
    />
    <FiltersData
      :kod-database-tuz="kod_database_tuz"
      :space="space"
      :table="table"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { usePostgreStore } from "@/store/modules/postgre";
import { storeToRefs } from "pinia";
import SelectShcema from "./tables/SelectShcema.vue";
import TableList from "./tables/TableList.vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import FieldList from "./tables/FieldList.vue";
import FiltersData from "./tables/FiltersData.vue";

const kod_database_tuz = ref(0);

const changeSpace = (s: string) => (space.value = s);
const changeTuz = (t: number) => (kod_database_tuz.value = t);
const space = ref("knowledgebase");
const { r_get } = dataApiComposition();
const loaded = ref(false);
const table = ref("");
const dataRows = reactive({
  select: {} as Record<string, string | number[]>,
  edit: {} as Record<string, string | number[]>,
  new: {} as Record<string, string | number[]>,
});

const { tableList } = storeToRefs(usePostgreStore());

const viewFields = (t: string) => {
  if (tableList.value.filter((e) => e.tablename === t).length) {
    table.value = t;
  } else {
    return;
  }
  loaded.value = false;
  dataRows.new = {};
  r_get<string>(
    {
      from: "information_schema.columns",
      fields: [
        "column_name",
        "ordinal_position",
        "column_default",
        "is_nullable",
        "data_type",
        "character_maximum_length",
        "udt_name",
        "is_updatable",
      ],
      filter: { table_schema: `=:${space.value}`, table_name: `=:${t}` },
      sort: ["ordinal_position"],
      tuz: kod_database_tuz.value,
    },
    "fieldList",
    usePostgreStore
  ).then(() => (loaded.value = true));
  // getDataTable(t);
  r_get<string>(
    {
      fields: ["a.attname:column_name"],
      from: [
        {
          alias: "ck",
          from: ["pg_catalog.pg_constraint:c"],
          fields: ["unnest(c.conkey):col_id", "c.*"],
        },
        "pg_catalog.pg_attribute:a",
        "pg_catalog.pg_class:pc",
        "pg_catalog.pg_namespace:pn",
      ],
      join: [
        "ck.conrelid=a.attrelid",
        "ck.col_id=a.attnum",
        "ck.conrelid=pc.oid",
        "ck.connamespace=pn.oid",
      ],
      filter: {
        "ck.contype": "=:p",
        "pc.relname": `=:${t}`,
        "pn.nspname": `=:${space.value}`,
      },
      sort: ["a.attname"],
      tuz: kod_database_tuz.value,
    },
    "primarykey",
    usePostgreStore
  );
};
</script>
