<template>
  <v-row
    v-if="fieldList.length > 0"
    class="ma-1 mt-4"
    justify="end"
    align="end"
  >
    <v-col>
      <BtnIconsV
        title="Интерфейс"
        icon="mdi-clipboard-text"
        color="green"
        :action="
          () => {
            createInterface(space, table, fieldList);
          }
        "
      />
    </v-col>
    <v-col cols="auto" class="text-h5">
      Просмотр полей и данных в таблице
    </v-col>
    <v-col cols="12" md="6" lg="4">
      <AutocompleteV
        v-model="localTable"
        label="Выбрать таблицу"
        :items="tableList"
        item-text="tablename"
        item-value="tablename"
        @input="viewFields"
      />
    </v-col>
    <v-col cols="4">
      <TextFielsV
        v-model="searchFields"
        prepend-icon="mdi-magnify"
        label="Поиск полей в таблице"
      />
    </v-col>
    <v-col cols="12">
      <v-data-table
        v-model="selectedFields"
        dense
        show-select
        :single-select="false"
        :search="searchFields"
        :caption="'Поля в таблице ' + space + '.' + table"
        :headers="Object.keys(fieldList[0]).map((r) => ({ text: r, value: r }))"
        item-key="column_name"
        :items="fieldList"
        :items-per-page="10"
        class="elevation-1 striped purple lighten-5"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import AutocompleteV from "@/components/basic/AutocompleteV.vue";
import BtnIconsV from "@/components/basic/BtnIconsV.vue";
import TextFielsV from "@/components/basic/TextFielsV.vue";
import { ref } from "vue";
import { usePostgreStore } from "@/store/modules/postgre";
import { storeToRefs } from "pinia";
import { toast } from "materialize-css";
defineProps({
  kodDatabaseTuz: {
    type: Number,
    required: true,
  },
  space: {
    type: String,
    required: true,
  },
  table: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["viewFields"]);
const viewFields = (t: string) => {
  emit("viewFields", t);
};
const createInterface = (space: string, table: string, obj: FieldList[]) => {
  const int = obj.map((e) => {
    let field_type = "";
    if (e.is_nullable === "YES") {
      field_type = "null | ";
    }
    switch (e.data_type) {
      case "integer":
      case "float":
        field_type += "number";
        break;

      case "character varying":
      case "text":
      case "timestamp with time zone":
        field_type += "string";
        break;

      case "boolean":
        field_type += "boolean";
        break;

      case "ARRAY":
        switch (e.udt_name) {
          case "_bool":
            field_type += "boolean";
            break;

          case "_int4":
          case "_int8":
            field_type += "number";
            break;

          case "_varchar":
          case "_text":
          case "_timestamptz":
            field_type += "string";
            break;

          default:
            field_type += "string";
            break;
        }
        field_type += "[]";
        break;

      default:
        field_type = "string";
        break;
    }
    return `${e.column_name}: ${field_type};
        `;
  });
  const textInterface = `export interface I${space
    .toUpperCase()
    .substring(0, 1)}${space.substring(1)}${table
    .toUpperCase()
    .substring(0, 1)}${table
    .substring(1)
    .replace(/_(\w)/g, (m, s) => s.toUpperCase())} {
        ${int.join("")}}`;
  navigator.clipboard.writeText(textInterface).then(() => {
    toast({ html: "Интерфейс скопирован в буфер обмена" });
  });
};
const { fieldList, tableList } = storeToRefs(usePostgreStore());
const searchFields = ref("");
const localTable = ref("");
const selectedFields = ref<FieldList[]>([]);
</script>
