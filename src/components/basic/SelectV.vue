<template>
  <v-select
    v-model="lazyValue"
    auto-select-first
    :clearable="clearable"
    :append-outer-icon="appendOuterIcon"
    dense
    :append-icon="appendIcon"
    hide-details
    :filter="filter"
    :hide-selected="hideSelected"
    :multiple="multiple"
    :open-on-clear="openOnClear"
    :chips="chips"
    outlined
    :disabled="disabled"
    :deletable-chips="deletableChips"
    :label="label"
    :items="items"
    :item-value="itemValue"
    :placeholder="placeholder"
    :item-text="itemText"
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
