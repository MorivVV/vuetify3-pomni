<template>
  <v-tooltip top>
    <template #activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on" v-html="text" />
    </template>
    <span v-html="tip" />
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TooltipTableHeader",
  props: {
    text: { type: String, default: "-", require: true },
    tip: { type: String, default: "-", require: true },
  },
});
</script>
