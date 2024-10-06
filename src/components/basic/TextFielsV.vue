<template>
  <v-text-field
    v-model="lazyValue"
    :append-icon="appendIcon"
    :append-outer-icon="appendOuterIcon"
    auto-select-first
    :chips="chips"
    :clearable="!readonly && clearable"
    :counter="counter"
    :deletable-chips="deletableChips"
    density="compact"
    :disabled="disabled"
    :filter="filter"
    hide-details
    :hide-selected="hideSelected"
    :item-text="itemText"
    :item-value="itemValue"
    :items="items"
    :label="label"
    :maxlength="maxlength"
    :multiple="multiple"
    :open-on-clear="openOnClear"
    :placeholder="placeholder"
    :prepend-icon="prependIcon"
    :readonly="readonly"
    :rules="rules"
    :small-chips="smallChips"
    :suffix="suffix"
    :type="type"
    variant="outlined"
    @input="$emit('input', lazyValue)"
  />
</template>

<script lang="ts">
import { TmdiIcons } from "@/const/mdiIcons";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    value: { type: null as any as PropType<any>, default: null },
    autoSelectFirst: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    counter: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String as PropType<string | undefined>,
      default: null,
    },
    type: {
      type: String as PropType<string | undefined>,
      default: null,
    },
    prependIcon: {
      type: String as PropType<`mdi-${TmdiIcons}` | undefined>,
      default: null,
    },
    appendOuterIcon: {
      type: String as PropType<TmdiIcons | undefined>,
      default: null,
    },
    placeholder: {
      type: String as PropType<string | undefined>,
      default: null,
    },
    filter: {
      type: Function,
      default: (
        item: { [x: string]: string | number },
        queryText: string,
        itemText: string
      ) => {
        return (
          itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
          -1
        );
      },
    },
    hideNoData: { type: Boolean, default: false },
    noFilter: { type: Boolean, default: false },
    searchInput: {
      type: String as PropType<string | null>,
      default: null,
    },
    appendIcon: {
      type: String as PropType<TmdiIcons | undefined>,
      default: "",
    },
    maxlength: {
      type: String,
      default: "",
    },
    attach: {
      type: null as unknown as PropType<string | boolean | Element | VNode>,
      default: false,
    },
    cacheItems: { type: Boolean, default: false },
    chips: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true },
    deletableChips: { type: Boolean, default: false },
    disableLookup: { type: Boolean, default: false },
    eager: { type: Boolean, default: false },
    hideSelected: { type: Boolean, default: false },
    rules: { type: Array as PropType<any[]> },
    items: {
      type: Array,
      default: () => [],
    },
    itemColor: {
      type: String,
      default: "primary",
    },
    suffix: {
      type: String,
      default: "",
    },
    itemDisabled: {
      type: [String, Array, Function],
      default: "disabled",
    },
    itemText: {
      type: [String, Array, Function],
      default: "text",
    },
    itemValue: {
      type: [String, Array, Function],
      default: "value",
    },
    multiple: { type: Boolean, default: false },
    openOnClear: { type: Boolean, default: false },
    returnObject: { type: Boolean, default: false },
    smallChips: { type: Boolean, default: false },
  },
  data () {
    return {
      lazyValue: this.value,
      hasMouseDown: false,
    };
  },
  watch: {
    value (val) {
      this.lazyValue = val;
    },
  },
});
</script>
