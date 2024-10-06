<template>
  <v-row class="ml-4 text-h5" justify="center" align="center">
    <v-col cols="auto" xl="1" class="text-right"
      >{{ operand1 }} x {{ operand2 }} =
    </v-col>
    <v-col
      class="pa-0"
      cols="5"
      xl="1"
      :class="`font-weight-bold ${
        viewCheck
          ? operand1 * operand2 === +result
            ? 'green lighten-3'
            : 'red lighten-3'
          : ''
      } `"
      ><TextFielsV
        v-model="result"
        :disabled="disable"
        type="number"
        label="Ответ"
        @keypress.native.enter="emit('result', result)"
    /></v-col>
    <v-col class="pa-0" cols="1" xl="1"
      ><BtnIconsV
        v-if="!disable && typeof result !== 'undefined'"
        :disabled="disable"
        type="number"
        label="Ответ"
        :action="() => emit('result', result)"
      />
      <span v-if="viewCheck" class="text-blue ml-1">
        => {{ operand1 * operand2 }}</span
      >
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import BtnIconsV from "@/components/basic/BtnIconsV.vue";
import TextFielsV from "@/components/basic/TextFielsV.vue";
import { ref } from "vue";
const emit = defineEmits(["result"]);
defineProps({
  operand1: {
    type: Number,
    required: true,
  },
  operand2: {
    type: Number,
    required: true,
  },
  disable: {
    type: Boolean,
    required: true,
  },
  viewCheck: {
    type: Boolean,
    required: true,
  },
});
const result = ref();
</script>
