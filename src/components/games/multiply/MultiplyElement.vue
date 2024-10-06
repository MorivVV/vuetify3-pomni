<template>
  <v-row align="center" class="ml-4 text-h5" justify="center">
    <v-col
      class="text-right"
      cols="auto"
      xl="1"
    >{{ operand1 }} x {{ operand2 }} =
    </v-col>
    <v-col
      class="pa-0"
      :class="`font-weight-bold ${
        viewCheck
          ? operand1 * operand2 === +result
            ? 'green lighten-3'
            : 'red lighten-3'
          : ''
      } `"
      cols="5"
      xl="1"
    ><TextFielsV
      v-model="result"
      :disabled="disable"
      label="Ответ"
      type="number"
      @keypress.native.enter="emit('result', result)"
    /></v-col>
    <v-col
      class="pa-0"
      cols="1"
      xl="1"
    ><BtnIconsV
       v-if="!disable && typeof result !== 'undefined'"
       :action="() => emit('result', result)"
       :disabled="disable"
       label="Ответ"
       type="number"
     />
      <span v-if="viewCheck" class="text-blue ml-1">
        => {{ operand1 * operand2 }}</span>
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
