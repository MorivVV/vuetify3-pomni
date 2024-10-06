<template>
  <v-container>
    <v-row class="ma-0">
      <v-col cols="12">
        <v-row class="ma-1">
          <v-col cols="12" lg="4">
            <v-text-field
              v-model="search"
              dense
              hide-details
              label="Наименование"
              outlined
            />
          </v-col>
          <v-col cols="12" lg="2">
            <v-text-field
              v-model="min_price"
              dense
              hide-details
              label="Цена минимум"
              outlined
            />
          </v-col>
          <v-col cols="12" lg="2">
            <v-text-field
              v-model="max_price"
              dense
              hide-details
              label="Цена максимум"
              outlined
            />
          </v-col>
          <v-col cols="12" lg="2">
            <v-text-field
              v-model="max_date"
              dense
              hide-details
              label="Дата обновления максимум"
              outlined
            />
          </v-col>
          <v-col cols="6" lg="1">
            <BtnIconsVVue
              :action="getData"
              icon="search"
              title="Применить фильтр"
            />
            {{ dns_products.length }}
          </v-col>
          <v-col cols="6" lg="1">
            <ImportPresentVue :element_id="['dns_list']" />
          </v-col>
        </v-row>
      </v-col>
      <v-progress-circular
        v-if="loading"
        color="purple"
        indeterminate
        :size="70"
        :width="7"
      />
      <v-col v-else cols="12" lg="11">
        <v-row id="dns_list" class="ma-0">
          <v-col
            v-for="product in dns_products"
            :key="'_' + product.dns_id"
            cols="12"
            lg="3"
            md="4"
          >
            <GoodsCard :dns_product="product" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import GoodsCard from "./GoodsCard.vue";
import ImportPresentVue from "../basic/ImportPresent.vue";
import BtnIconsVVue from "../basic/BtnIconsV.vue";
import { useMvideoStore } from "@/store/modules/mvideo";
import { ref, toRefs } from "vue";
import { getDNSPrice, getDNSProducts } from "./dnsDataFunction";

const loading = ref(false);
const search = ref("");
const max_date = ref("2022-01-01");
const min_price = ref(0);
const max_price = ref(999999);
const { dns_products } = toRefs(useMvideoStore());
const getData = () => {
  loading.value = true;
  getDNSProducts(search.value, max_date.value, min_price.value, max_price.value)
    .then(() => getDNSPrice(search.value))
    .then(() => (loading.value = false));
};
getData();
</script>
