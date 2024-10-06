<template>
  <v-container fluid>
    <v-row class="ma-1">
      <v-col>
        <TextFielsV v-model="search" label="Поиск" @input="getProducts" />
      </v-col>
    </v-row>
    <DataTableV
      :items-per-page="25"
      show-expand
      :items="products"
      :headers="mvideoHeaders"
    >
      <template #[`item.name`]="{ item }">
        <a
          target="_blank"
          :href="'https://www.mvideo.ru/products/' + item.id"
          >{{ item.name }}</a
        >
      </template>
      <template #[`item.last_isfinalprice`]="{ item }">
        <CheckBoxTitleV v-model="item.last_isfinalprice" readonly color="red" />
      </template>
      <template #[`item.date_price`]="{ item }">
        {{ moment(item.date_price).format(momentFormatDate) }}
      </template>
      <template #[`item.date_add`]="{ item }">
        {{ moment(item.date_add).format(momentFormatDate) }}
      </template>
      <template #expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="ma-0 pa-0">
          <v-expansion-panels>
            <ProductVue :product="item" />
          </v-expansion-panels>
        </td>
      </template>
    </DataTableV>
    <!-- <v-expansion-panels id="mvideo_price">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <v-icon>assistant_photo</v-icon>
          <v-col cols="2">Товар</v-col>
          <v-col cols="1">Текущая цена</v-col>
          <v-col cols="1">Средняя цена</v-col>
          <v-col cols="1">дельта</v-col>
          <v-col cols="3">мин/макс</v-col>
          <v-col cols="3">База мин/макс</v-col>
        </v-expansion-panel-header>
      </v-expansion-panel>
      <ProductVue v-for="p in products" :key="p.id" :product="p" />
    </v-expansion-panels> -->
  </v-container>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import ProductVue from "./ProductM.vue";
import { useMvideoStore } from "@/store/modules/mvideo";
import { getProducts, mvideoHeaders } from "./mvideoDataFunction";
import TextFielsV from "../basic/TextFielsV.vue";
import DataTableV from "../basic/DataTableV.vue";
import moment from "moment";
import { momentFormatDate } from "@/const/timeFormats";
import CheckBoxTitleV from "../basic/CheckBoxTitleV.vue";

const search = ref("");
const { products } = toRefs(useMvideoStore());
getProducts(search.value);
</script>

<style scoped>
div >>> .v-expansion-panel-header {
  padding: 4px 16px;
}
</style>
