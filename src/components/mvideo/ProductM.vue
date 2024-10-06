<template>
  <v-expansion-panel ref="itemRef" v-scroll="scrolPosition">
    <v-expansion-panel-header @click="getData">
      <v-icon v-if="product.last_isfinalprice" color="red"> lock </v-icon>
      <v-icon v-else>add_shopping_cart</v-icon>
      <v-col cols="2">
        <a
          target="_blank"
          :href="'https://www.mvideo.ru/products/' + product.id"
          >{{ product.name }}</a
        >
      </v-col>
      <v-col
        cols="1 blue lighten-3 text-right"
        :class="{
          'light-green': +priceStatistic.deltaProc < 0,
          orange: +priceStatistic.deltaProc > 0,
        }"
      >
        <span class="text-h4">
          {{ product.last_price }}
        </span>
      </v-col>
      <v-col cols="1">{{ (+priceStatistic.avgPrice).toFixed(2) }}</v-col>
      <v-col cols="1">
        <label for="">{{
          moment(product.date_price).format("YYYY-MM-DD")
        }}</label
        ><br />{{ (+priceStatistic.deltaProc / 10).toFixed(1) }}%
      </v-col>
      <v-col cols="3">{{ priceStatistic.minPrice }}</v-col>
      <v-col cols="3">{{ priceStatistic.maxPrice }}</v-col>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <template v-if="productPrices.length > 0">
        <v-row>
          <v-col>
            <LineChartVue
              class="limhei"
              :chart-data="charData"
              :height="120"
              :chart-options="options"
              :plugins="[ChartDataLabels]"
            />
          </v-col>
        </v-row>
      </template>
      <LoaderCircle v-else />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import LoaderCircle from "../basic/LoaderCircle.vue";
import LineChartVue from "../basic/charts/LineChart.vue";
import { PropType, computed, onMounted, ref, watch } from "vue";
import ChartDataLabels from "chartjs-plugin-datalabels";
// import { useMvideoStore } from "@/store/modules/mvideo";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { IGoodsMvideoPrice } from "@/types/database/schemas/goods";
import moment from "moment";
const vScroll = {
  inserted: function (el, binding) {
    const f = function (evt: Event) {
      if (binding.value(evt, el)) {
        window.removeEventListener("scroll", f);
      }
    };
    window.addEventListener("scroll", f);
  },
};
const props = defineProps({
  product: { type: Object as PropType<IMProduct>, required: true },
});
const { r_get } = dataApiComposition();
// const { prices } = toRefs(useMvideoStore());
const itemRef = ref();
const limit = ref(50);
const loadData = ref(false);
const productPrices = ref<IMvideoPrice[]>([]);
const options = {
  interaction: {
    intersect: false,
    mode: "index",
  },
  plugins: {
    title: {
      display: true,
      text: props.product?.name,
    },
    datalabels: {
      ancor: "center",
      color: function (context: any): string {
        return context.dataset.borderColor;
      },
      backgroundColor: "white",
      font: {
        lineHeight: 1,
      },
      borderRadius: 50,
    },
  },
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
const priceStatistic = computed(() => {
  const p = productPrices.value;
  const currPrice = props.product.last_price;
  const prices = p.map((e) => e.saleprice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = (minPrice + maxPrice) / 2;
  const deltaProc = (100 * (currPrice - avgPrice)) / avgPrice;
  return {
    minPrice,
    maxPrice,
    avgPrice,
    deltaProc,
  };
});
const charData = computed(() => {
  const char = {
    labels: productPrices.value.map((e) =>
      moment(e.date_price).format("DD-MMM-YY")
    ),
    datasets: [
      {
        label: "Базовая",
        borderColor: "rgb(0, 0, 200)",
        pointBackgroundColor: "white",
        borderWidth: 1,
        tension: 0.2,
        fill: "origin",
        pointBorderColor: "white",
        backgroundColor: "rgba(0, 100, 200, 0.2)",
        data: productPrices.value.map((e) => e.baseprice),
      },
      {
        label: "Продажа",
        borderColor: "rgb(0, 208, 0)",
        pointBackgroundColor: "white",
        borderWidth: 1,
        tension: 0.2,
        fill: "origin",
        pointBorderColor: "white",
        backgroundColor: "rgba(0, 208,0, 0.3)",
        data: productPrices.value.map((e) => e.saleprice),
      },
      {
        label: "ПРОМО",
        borderColor: "rgb(200, 0, 0)",
        pointBackgroundColor: "white",
        borderWidth: 1,
        tension: 0.2,
        fill: "origin",
        pointBorderColor: "white",
        backgroundColor: "rgba(200, 0,0, 0.4)",
        data: productPrices.value.map((e) => e.basepromoprice),
      },
    ],
  };
  return char;
});
const getData = () => {
  const pid = Number(props.product?.id);
  r_get<keyof IGoodsMvideoPrice, IMvideoPrice>({
    fields: [
      "baseprice",
      "saleprice",
      "basepromoprice",
      "isfinalprice",
      "date_price",
    ],
    from: "goods.mvideo_price",
    sort: ["date_price"],
    filter: {
      productid: +pid,
    },
  }).then((r) => {
    productPrices.value = r;
  });
};
const scrolPosition = (env: Event | undefined, el: HTMLElement) => {
  if (!el) return false;
  const pos = window.scrollY;
  const top = el.offsetTop;
  if (pos > top - 1000) {
    loadData.value = true;
    console.log("scrol");
  }
};
watch([limit, loadData], getData);
onMounted(() => {
  const el = itemRef.value;
  scrolPosition(undefined, el.$el as HTMLElement);
});
</script>
