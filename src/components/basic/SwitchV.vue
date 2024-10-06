<template>
  <span>
    <v-tooltip
      :open-on-click="activeTooltip"
      :open-on-focus="activeTooltip"
      :open-on-hover="activeTooltip"
      top
    >
      <template #activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <v-switch
            v-model="lazyValue"
            :append-icon="appendIcon"
            class="ma-0 pa-0"
            :color="color"
            :dark="dark"
            dense
            :disabled="disabled"
            hide-details
            :inset="inset"
            :label="label"
            :prepend-icon="prependIcon"
            :readonly="readonly"
            @change="changeEvents"
          >
            <template v-if="!!slots['label']" #[`label`]>
              <slot name="label" />
            </template>
          </v-switch>
        </div>
      </template>
      <span>{{ title }}</span>
    </v-tooltip>
  </span>
</template>

<script setup lang="ts">
import { ref, useSlots, watch } from "vue";
const emit = defineEmits(["input", "change"]);
const slots = useSlots();
interface IProps {
  value?: any;
  dark?: boolean;
  title?: string;
  label?: string;
  appendIcon?: string;
  prependIcon?: string;
  color?: string;
  disabled?: boolean;
  readonly?: boolean;
  inset?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  dark: false,
  title: "",
  label: "",
  appendIcon: "",
  prependIcon: "",
  color: "primary",
  disabled: false,
  readonly: false,
  inset: false,
});
const lazyValue = ref(props.value);
const activeTooltip = props.title !== "";
const changeEvents = () => {
  emit("input", lazyValue.value);
  emit("change", lazyValue.value);
};
watch(
  () => props.value,
  (val) => {
    lazyValue.value = val;
  }
);
</script>
