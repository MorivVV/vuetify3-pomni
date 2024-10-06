<template>
  <v-card class="ma-0 pa-0 fill-height">
    <v-card-title class="ma-0 pa-1 grey lighten-2">
      {{ param.name_var }} ({{ param.type_var }})
    </v-card-title>
    <v-card-text>
      {{ param.description }}
      <v-textarea
        v-if="['object', 'array'].includes(param.type_var)"
        v-model.lazy="param_value"
        dense
        hide-details
        outlined
        row-height="20"
        rows="2"
      />
      <TextFielsV
        v-if="param.type_var === 'string'"
        v-model.lazy="param_value"
      />
      <CronMailAddress
        v-if="param.type_var === 'mailaddress'"
        v-model.lazy="param_value"
        :mail-string="param_value"
      />
      <TextFielsV
        v-if="param.type_var === 'number'"
        v-model.lazy="param_value"
        type="number"
      />
      <AutocompleteV
        v-if="
          (param.type_var === 'string' ||
            param.type_var === 'number' ||
            param.type_var === 'array') &&
            param.rest_get
        "
        v-model.lazy="param_value"
        class="mt-2"
        :items="autoData"
        label="Жесткая привязка к данным"
        :multiple="Array.isArray(param_value)"
      />
      <CheckBoxTitleV
        v-if="param.type_var === 'boolean'"
        v-model.lazy="param_value"
      />

      <span>{{ param.default_var }}</span>
      <span v-if="sql_param_value.length" class="ml-2">
        <span>Ссылка на связь</span>
        <a
          v-for="sqlAx in sql_param_value"
          :key="param.name_var + 'sqlAx_' + sqlAx"
          class="ma-0 pa-0 pl-1 purple--text"
          :href="sqlAx"
          target="_blank"
        >
          {{ sqlAx }}
        </a>
      </span>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { IKnowledgebaseCronScriptParams } from "@/types/database/schemas/knowledgebase";
import { PropType, ref, watch } from "vue";
import AutocompleteV from "@/components/basic/AutocompleteV.vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import TextFielsV from "@/components/basic/TextFielsV.vue";
import CheckBoxTitleV from "@/components/basic/CheckBoxTitleV.vue";
import CronMailAddress from "./CronMailAddress.vue";
interface IACData {
  value: string;
  text: string;
}
const emit = defineEmits(["changeStart", "changeParam"]);
const props = defineProps({
  param: {
    type: Object as PropType<IKnowledgebaseCronScriptParams>,
    required: true,
  },
});
const { r_get } = dataApiComposition();
const timer = ref(0);
const param_value = ref(props.param.default_var);
if (props.param.type_var === "array") {
  param_value.value = JSON.parse(param_value.value ?? "[]");
}
const sql_param_value = ref<string[]>([]);
if (props.param.rest_get && props.param.default_var) {
  let perfix = "";
  if (props.param.rest_get.includes("sys_sql_query")) { perfix = "/admin/database/querysetting?sql_name="; }
  if (props.param.rest_get.includes("cron_jobs")) { perfix = "/admin/cronjobs?naimen="; }
  if (perfix) {
    if (
      props.param.default_var?.startsWith("[") &&
      props.param.default_var?.endsWith("]")
    ) {
      const jsqlarr = JSON.parse(props.param.default_var) as string[];
      sql_param_value.value = jsqlarr.map((a) => perfix + a);
    } else {
      sql_param_value.value = [
        perfix + props.param.default_var?.replace(/"/g, ""),
      ];
    }
  }
}
const autoData = ref<IACData[]>([]);
if (props.param.rest_get) {
  let quote = '"';
  if (["number", "array"].includes(props.param.type_var)) quote = "";
  r_get(JSON.parse(props.param.rest_get)).then((r) => {
    autoData.value = r.map((e) => {
      return { ...e, value: quote + e.value + quote };
    });
  });
}
watch(param_value, (newVal) => {
  if (timer.value) clearTimeout(timer.value);
  emit("changeStart");
  timer.value = setTimeout(() => {
    if (props.param.type_var === "array") {
      newVal = JSON.stringify(newVal);
    }
    emit("changeParam", newVal, props.param);
  }, 2000);
});
</script>
