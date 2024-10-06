<template>
  <v-select
    v-model="lazyValue"
    :append-icon="appendIcon"
    :append-outer-icon="appendOuterIcon"
    auto-select-first
    :chips="chips"
    :clearable="clearable"
    :deletable-chips="deletableChips"
    dense
    :disabled="disabled"
    :filter="filter"
    hide-details
    :hide-selected="hideSelected"
    :item-text="itemText"
    :item-value="itemValue"
    :items="items"
    :label="label"
    :multiple="multiple"
    :open-on-clear="openOnClear"
    outlined
    :placeholder="placeholder"
    :prepend-icon="prependIcon"
    :small-chips="smallChips"
    @input="$emit('input', lazyValue)"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { PropValidator } from "vue/types/options";
import { VNode } from "vue/types/umd";
import { SelectItemKey } from "vuetify";

export default defineComponent({
  props: {
    value: null as any as PropType<any>,
    autoSelectFirst: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: String,
    prependIcon: String,
    appendOuterIcon: String,
    placeholder: String,
    filter: {
      type: Function,
      default: (item: any, queryText: string, itemText: string) => {
        return (
          itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
          -1
        );
      },
    } as PropValidator<
      (item: any, queryText: string, itemText: string) => boolean
    >,
    hideNoData: Boolean,
    noFilter: Boolean,
    searchInput: {
      type: String as PropType<string | null>,
    },
    appendIcon: {
      type: String,
      default: "$dropdown",
    },
    attach: {
      type: null as unknown as PropType<string | boolean | Element | VNode>,
      default: false,
    },
    cacheItems: Boolean,
    chips: Boolean,
    clearable: { type: Boolean, delault: true },
    deletableChips: Boolean,
    disableLookup: Boolean,
    eager: Boolean,
    hideSelected: Boolean,
    items: {
      type: Array,
      default: () => [],
    } as PropValidator<any[]>,
    itemColor: {
      type: String,
      default: "primary",
    },
    itemDisabled: {
      type: [String, Array, Function] as PropType<SelectItemKey>,
      default: "disabled",
    },
    itemText: {
      type: [String, Array, Function] as PropType<SelectItemKey>,
      default: "text",
    },
    itemValue: {
      type: [String, Array, Function] as PropType<SelectItemKey>,
      default: "value",
    },
    multiple: Boolean,
    openOnClear: Boolean,
    returnObject: Boolean,
    smallChips: Boolean,
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
