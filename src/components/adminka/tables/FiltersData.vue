<template>
  <v-row align="center" class="ma-0 mt-4">
    <v-col class="text-h5" cols="12" md="2"> Выборка из БД </v-col>
    <v-col cols="4" md="1">
      <TextFielsV v-model="limit" label="Отобразить записей" />
    </v-col>
    <v-col cols="4" md="1">
      <TextFielsV v-model="page" label="Номер страницы" min="1" type="number" />
    </v-col>
    <v-col cols="12" md="2">
      <AutocompleteV
        v-model="fieldName"
        item-text="column_name"
        item-value="column_name"
        :items="fieldList"
        label="Поле поиска"
      />
    </v-col>
    <v-col cols="12" md="2">
      <SelectV
        v-if="operators.length"
        v-model="operator"
        class="pa-0"
        clearable
        item-text="name"
        item-value="id"
        :items="operators"
        label="Оператор сравнения"
      />
    </v-col>
    <v-col cols="12" md="2">
      <TextFielsV v-model="search" label="Введите поисковую фразу" />
    </v-col>
    <v-col cols="auto">
      <BtnIconsV
        :action="() => getDataTable(table)"
        color="green"
        icon="autorenew"
        title="Применить фильтр"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import AutocompleteV from "@/components/basic/AutocompleteV.vue";
import BtnIconsV from "@/components/basic/BtnIconsV.vue";
import SelectV from "@/components/basic/SelectV.vue";
import TextFielsV from "@/components/basic/TextFielsV.vue";
import { toast } from "materialize-css";
import { EKNOWLEGEBASE } from "@/const/schemaEnums";
import { ref } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { usePostgreStore } from "@/store/modules/postgre";
import { storeToRefs } from "pinia";
const props = defineProps({
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
const { fieldList, operators } = storeToRefs(usePostgreStore());
const operator = ref(":=");
const limit = ref(15);
const page = ref(1);
const fieldName = ref("");
const search = ref("");
const sort = ref(["-1"]);
const selectedFields = ref<FieldList[]>([]);
const { r_get } = dataApiComposition();
const getDataTable = (t: string) => {
  const filter: Record<string, string> = {};
  if (search.value) {
    if (fieldName.value) {
      filter[fieldName.value] = operator.value + search.value;
    } else {
      toast({ html: "Не выбрано поле для поиска" });
    }
  }
  r_get<string>(
    {
      fields: [...selectedFields.value.map((e) => e.column_name)],
      from: (props.space + "." + t) as EKNOWLEGEBASE,
      sort: sort.value,
      filter,
      limit: limit.value,
      page: page.value,
      tuz: props.kodDatabaseTuz,
    },
    "dataTable",
    usePostgreStore
  );
};
</script>
