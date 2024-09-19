<template>
  <v-data-table
    v-model="lazyValue"
    v-model:options="options"
    :caption="caption"
    class="elevation-1 striped"
    :custom-filter="customFilter"
    density="compact"
    :disable-filtering="false"
    :fixed-header="fixedHeader"
    :footer-props="{
      'items-per-page-options': [10, 15, 20, 25, 50, 100, -1],
    }"
    :headers="columns"
    :height="height"
    :hide-default-footer="hideDefaultFooter"
    :hide-default-header="hideDefaultHeader"
    :items="filterItems"
    :items-per-page="itemsPerPage"
    :loading="loading"
    :multi-sort="multiSort"
    :search="searchTable"
    :select-strategy="singleSelect ? 'single' : 'all'"
    :server-items-length="serverItemsLength"
    :show-expand="showExpand"
    :show-select="showSelect"
    @input="$emit('input', lazyValue)"
  >
    <template
      v-for="head in columns"
      :key="'inc_head_' + head.value"
      #[`header.${head.value}`]="{}"
    >
      <TooltipTableHeaderV
        :text="head.text"
        :tip="head.tip ? head.tip : head.value"
      />
    </template>

    <template v-if="!!slots['expanded-top'] || filterHeader" #[`top`]>
      <v-row class="ma-0">
        <v-col class="pa-0 ma-0">
          <slot name="expanded-top" />
        </v-col>
        <v-col v-if="filterHeader" class="pa-1 ma-0" cols="4">
          <TextFielsV
            v-model="searchTable"
            label="Поиск по таблице"
            prepend-icon="mdi-magnify"
          />
        </v-col>
      </v-row>
    </template>
    <template v-if="!!slots['expanded-item']" #expanded-row="{ columns, item }">
      <slot :headers="columns" :item="item" name="expanded-item" />
    </template>

    <template v-if="!!slots['body.prepend']" #[`body.prepend`]="{ headers }">
      <slot :headers="headers" name="body.prepend" />
    </template>

    <template
      v-for="k in columns.filter((e) => `item.${e.value}` in slots)"
      #[`item.${k.value}`]="{ item }"
    >
      <slot :item="item" :name="`item.${k.value}`" />
    </template>
  </v-data-table>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// @ts-nocheck
import {
  computed,
  ref,
  RendererElement,
  RendererNode,
  toRefs,
  useSlots,
  watch,
} from "vue";
import TooltipTableHeaderV from "./TooltipTableHeaderV.vue";
import TextFielsV from "./TextFielsV.vue";
import { ItemType, SelectItemKey, TipsDTH, ValueItem } from "@/types/global";
const emit = defineEmits(["options-sync", "input"]);

defineSlots<{
  default?:(props: { msg: string }) => any;
  "expanded-top"?: never;
  [x: `item.${string}`]: (arg: {
    item: ItemType<T>;
    headers: Record<string, unknown>[];
    props: Record<string, unknown>;
  }) => VNode<
    RendererNode,
    RendererElement,
    {
      [key: string]: any;
    }
  >[];
  "expanded-item"?: (arg: {
    item: T;
    headers: Record<string, unknown>[];
  }) => VNode<
    RendererNode,
    RendererElement,
    {
      [key: string]: any;
    }
  >[];
  prepend?: (arg: { headers: Record<string, unknown>[] }) => VNode<
    RendererNode,
    RendererElement,
    {
      [key: string]: any;
    }
  >[];
  "body.prepend"?: (props: { headers: Record<string, unknown>[] }) => any;
  selection?: (arg: { item: ItemType<T>; index: number }) => VNode<
    RendererNode,
    RendererElement,
    {
      [key: string]: any;
    }
  >[];
}>();
const slots = useSlots();
const searchTable = ref("");

const options = ref({});
watch(options, (val, old) => {
  emit("options-sync", val, old);
});
interface IDataTableProps {
  /** цвет */
  color?: string;
  /** значение поля */
  value?: ValueItem<keyof T>;

  /** список опций для выбора */
  items: T[];
  /** значение в модели */
  itemValue?: SelectItemKey<ItemType<T>>;
  /** записей на страницу */
  itemsPerPage?: number;
  /** описание заголовков таблицы */
  headers?: TipsDTH[];
  /** загрузка количества записей с сервера */
  serverItemsLength?: number;
  /** отображение процесса загрузки */
  loading?: boolean;
  /** скрыть стандартный заголовок */
  hideDefaultHeader?: boolean;
  /** скрыть стандартный футер */
  hideDefaultFooter?: boolean;
  /** заголовок таблицы */
  caption?: string;
  /** высота таблицы */
  height?: string | number;
  /** отобразить раскрывающиеся строки таблицы */
  showExpand?: boolean;
  /** отображать фильтр в заголовке */
  filterHeader?: boolean;
  /** фиксированный заголовок таблицы при проктрутке */
  fixedHeader?: boolean;
  singleSelect?: boolean;
  showSelect?: boolean;
  multiSort?: boolean;
}
const props = withDefaults(defineProps<IDataTableProps>(), {
  serverItemsLength: -1,
  hideDefaultFooter: false,
  hideDefaultHeader: false,
  filterHeader: true,
  multiSort: true,
  headers: () => [],
});

const customFilter = (value: string, search: string) => {
  return String(value).toLowerCase().includes(String(search).toLowerCase());
};

const filterItems = computed<T[]>(() => {
  if (props.serverItemsLength === -1) return props.items;
  return props.items.filter((temp1: Record<string, any>) =>
    customFilter(
      JSON.stringify(Object.keys(temp1).map((e) => temp1[e])),
      searchTable.value,
    ),
  );
});
const { items, headers, value } = toRefs(props);
const lazyValue = value.value;
const columns = ref<TipsDTH[]>(headers.value.map((h: TipsDTH) => ({ ...h })));
const createHeader = () => {
  if (headers.value.length === 0 && items.value.length > 0) {
    columns.value = Object.keys(items.value[0]).map((r) => ({
      text: r,
      value: r,
    }));
  }
};
watch(items, createHeader);
createHeader();
</script>
