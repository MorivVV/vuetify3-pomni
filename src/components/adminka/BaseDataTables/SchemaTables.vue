<template>
  <DataTableV
    :caption="`Список таблиц в схеме ${props.space}`"
    class="blue lighten-5"
    :items="tableList"
    :items-per-page="10"
  >
    <template #expanded-top="">
      <v-col class="pa-1">Для выбора таблицы кликните по кнопке с названием таблицы</v-col>
    </template>
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
      v-for="k in Object.keys(tableList[0]).filter((e) => ~e.indexOf('has'))"
      #[`item.${k}`]="{ item }"
    >
      <v-simple-checkbox :key="'_' + k" v-model="item[k]" disabled />
    </template>
  </DataTableV>
</template>

<script setup lang="ts">
import DataTableV from "@/components/basic/DataTableV.vue";
import { usePostgreStore } from "@/store/modules/postgre";
import { toRefs } from "vue";
const emit = defineEmits(["view-fields"]);
const props = defineProps({
  space: { type: String, default: "public" },
});
const { tableList } = toRefs(usePostgreStore());
const viewFields = (tablename: string) => emit("view-fields", tablename);
</script>
