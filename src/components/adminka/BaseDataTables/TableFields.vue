<template>
  <DataTableV
    v-model="selectedFields"
    show-select
    :single-select="false"
    :items="fieldList"
    :caption="'Поля в таблице ' + props.space + '.' + props.table"
    item-key="column_name"
    :items-per-page="10"
    class="purple lighten-5"
  >
    <template #expanded-top="">
      <v-col>
        <BtnIconsV
          title="Интерфейс"
          icon="mdi-clipboard-text"
          color="green"
          :action="() => createInterface(space, table, fieldList)"
        />
      </v-col>
    </template>
  </DataTableV>
</template>

<script setup lang="ts">
import BtnIconsV from "@/components/basic/BtnIconsV.vue";
import DataTableV from "@/components/basic/DataTableV.vue";
import { toast } from "@/compositionApi/dataApi";
import { usePostgreStore } from "@/store/modules/postgre";
import { ref, toRefs, watch } from "vue";
const emit = defineEmits(["select-fields"]);
const props = defineProps({
  space: { type: String, default: "public" },
  table: { type: String, default: "bz_users" },
});
const { fieldList } = toRefs(usePostgreStore());
const { table } = toRefs(props);
const selectedFields = ref<FieldList[]>([]);
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
    toast.info("Интерфейс скопирован в буфер обмена");
  });
};
watch(selectedFields, (val) => emit("select-fields", val));
watch(table, () => {
  selectedFields.value.length = 0;
});
</script>
