<template>
  <v-menu
    ref="menu"
    v-model="dateBegMenu"
    v-model:return-value="date"
    :close-on-content-click="false"
    min-width="auto"
    offset-y
    transition="scale-transition"
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="date"
        density="compact"
        hide-details
        :label="label"
        outlined
        prepend-icon="mdi-calendar"
        readonly
        v-bind="props"
      />
    </template>
    <v-date-picker v-model="date" scrollable @input="setDate" />
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    label: { type: String, default: "Период" },
    modelValue: { type: String, default: "" },
  },
  setup (props) {
    const date = ref(props.modelValue);
    const dateBegMenu = ref(false);
    return { date, dateBegMenu };
  },
  methods: {
    setDate () {
      console.log(this.date);

      this.$emit("input", this.date);
      this.dateBegMenu = false;
    },
  },
});
</script>
