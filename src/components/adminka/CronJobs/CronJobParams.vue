<template>
  <v-row class="ma-1">
    <v-col
      v-for="param in jobParamValues"
      :key="'job_' + param.id"
      class="ma-0 pa-1"
      cols="12"
      md="6"
      xl="4"
    >
      <CronParamVue
        :key="'job_' + param.default_var"
        :param="param"
        @changeParam="changeParam"
        @changeStart="$emit('changeStart')"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { IKnowledgebaseCronScriptParams } from "@/types/database/schemas/knowledgebase";
import { defineComponent, PropType } from "vue";
import CronParamVue from "./CronParam.vue";

export default defineComponent({
  components: { CronParamVue },
  props: {
    jobParams: {
      type: Array as PropType<IKnowledgebaseCronScriptParams[]>,
      required: true,
    },
    paramValue: { type: String, required: true },
  },
  computed: {
    jobParamValues(): IKnowledgebaseCronScriptParams[] {
      const values = JSON.parse(this.paramValue);

      const param = this.jobParams.map((e) => {
        let value = values[e.order_var - 1];
        if (value === undefined) {
          value = e.default_var;
        } else {
          value = JSON.stringify(value);
        }

        if (value == "false") {
          value = false;
        }

        return { ...e, default_var: value };
      });
      return param;
    },
  },
  methods: {
    changeParam(e: string, p: IKnowledgebaseCronScriptParams) {
      try {
        const values = JSON.parse(this.paramValue);
        values[p.order_var - 1] = JSON.parse(e);
        const newParam = JSON.stringify(values);
        this.$emit("changeParam", newParam);
      } catch (error) {
        this.$toast({
          html: "Параметры не валидны, проверьте правильность параметров",
        });
      }
    },
  },
});
</script>
