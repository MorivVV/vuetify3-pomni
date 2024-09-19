<template>
  <v-autocomplete
    v-model="lazyValue"
    :append-icon="appendIcon"
    auto-select-first
    :chips="chips"
    :clearable="!readonly && clearable"
    :custom-filter="filter"
    :deletable-chips="deletableChips"
    density="compact"
    :disabled="disabled"
    :hide-details="hideDetails"
    :hide-selected="hideSelected"
    :item-title="_itemText"
    :item-value="_itemValue"
    :items="items"
    :label="label"
    :multiple="multiple"
    :open-on-clear="openOnClear"
    :placeholder="placeholder"
    :prepend-icon="prependIcon"
    :readonly="readonly"
    :rules="rules"
    :small-chips="smallChips"
    variant="outlined"
    @input="$emit('input', lazyValue)"
  >
    <template v-if="slots && !!slots['prepend']" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="slots && !!slots['item']" #item="{ item }">
      <slot :item="(item as any)" name="item" />
    </template>
    <template v-if="slots && !!slots['selection']" #selection="{ item }">
      <slot :item="(item as any)" name="selection" />
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { SelectItemKey, ValidationRule, ValueItem } from "@/types/components";
import {
  ref,
  RendererElement,
  RendererNode,
  toRefs,
  useSlots,
  VNode,
  watch,
} from "vue";
defineSlots<{
  default?:(props: { msg: string }) => any;
  item?: (arg: { item: T }) => VNode<
    RendererNode,
    RendererElement,
    {
      [key: string]: any;
    }
  >[];
  prepend?: never;
  selection?: (arg: { item: T }) => VNode<
    RendererNode,
    RendererElement,
    {
      [key: string]: any;
    }
  >[];
}>();
const slots = useSlots();
interface IAutocomplete {
  /** значение поля */
  value?: ValueItem<number>;
  /** автовыбор первого значения */
  autoSelectFirst?: boolean;
  /** только для чтения */
  readonly?: boolean;
  /** список опций для выбора */
  items?: T[] | string[];
  /** цвет значения */
  itemColor?: string;
  /** отображаемый текст */
  itemText?: SelectItemKey<T>;
  /** значение в модели */
  itemValue?: SelectItemKey<T>;
  /** скрыть пояснение под полем */
  hideDetails?: boolean;
  /** отключение компонента */
  disabled?: boolean;
  /** отображение значение в виде чипса */
  chips?: boolean;
  /** иконка очистки поля */
  clearable?: boolean;
  /** иконка удаления чипса */
  deletableChips?: boolean;
  /** маленькие чипсы */
  smallChips?: boolean;
  /** мульти выбор значений */
  multiple?: boolean;
  /** скрывать выбранные значения */
  hideSelected?: boolean;
  /** отображать открытым по умолчанию */
  openOnClear?: boolean;
  /** заголовок поля */
  label?: string;
  /** иконка перед полем */
  prependIcon?: string;
  /** текст в поле по умолчанию */
  placeholder?: string;
  /** иконка после поля */
  appendIcon?: string;
  /** правила проверки значения */
  rules?: ValidationRule[];
}
const props = withDefaults(defineProps<IAutocomplete>(), {
  value: null,
  title: "",
  label: "",
  appendIcon: "",
  prependIcon: "",
  color: "primary",
  disabled: false,
  readonly: false,
  smallChips: false,
  hideSelected: false,
  deletableChips: false,
  chips: false,
  hideDetails: true,
  itemValue: "value",
  itemText: "text",
});

const _itemText = props.itemText as any;
const _itemValue = props.itemValue as any;
const lazyValue = ref<any>(props.value);
const { value } = toRefs(props);
const filter = (_itemTitle: string, queryText: string, item: any) => {
  if (!queryText) return props.items;
  return item.raw[String(props.itemText)]
    .toLocaleLowerCase()
    .includes(queryText.toLocaleLowerCase());
};
// const hasMouseDown = ref(false);
watch(value, (val) => {
  lazyValue.value = val;
});
</script>

<style>
.v-list--density-default.v-list--one-line
  .v-list-item--density-default.v-list-item--one-line {
  min-height: 30px;
  padding-top: 4px;
  padding-bottom: 4px;
}
</style>
