<template>
  <v-card :ref="dns_product.id" v-scroll="scrolPosition" class="mb-2">
    <v-card-title class="blue lighten-4 font-weight-bold text-h6">
      {{ dns_product.dns_name }}
    </v-card-title>
    <v-card-title
      class="green lighten-4 font-weight-bold text-h6 pa-1 ma-1 text-center"
    >
      <v-row align="center" justify="center">
        <v-col> {{ dns_product.last_price }}</v-col>
        <v-col class="text-subtitle-1">
          от {{ moment(dns_product.last_date).format("YYYY-MM-DD") }}</v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <BarChartVue
        v-if="viewChart"
        :chart-data="chartData"
        :chart-options="chartOptions"
        :plugins="[ChartDataLabels]"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import Vue from "vue/types/umd";
import { storeToRefs } from "pinia";
import BarChartVue from "../basic/charts/BarChart.vue";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useMvideoStore } from "@/store/modules/mvideo";
import moment from "moment";

export default defineComponent({
  components: { BarChartVue },
  directives: {
    scroll: {
      inserted (el, binding) {
        const f = function (evt: Event) {
          if (binding.value(evt, el)) {
            window.removeEventListener("scroll", f);
          }
        };
        window.addEventListener("scroll", f);
      },
    },
  },
  props: {
    dns_product: { type: Object as PropType<IDNSProdict>, required: true },
  },
  setup (props) {
    const viewChart = ref(false);
    const { dns_prices } = storeToRefs(useMvideoStore());
    const dns_price = dns_prices.value.filter(
      (e) => e.kod_product === props.dns_product.id
    );
    const chartOptions = {
      plugins: {
        title: {
          display: true,
          text: props.dns_product?.dns_name,
          align: "start",
          position: "top",
          color: "black",
          padding: 2,
          fullSize: true,
          font: { size: 18 },
        },
        datalabels: {
          align: "start",
          offset: 0,
          color: "black",
          backgroundColor: "white",
          font: {
            lineHeight: 1,
          },
          borderRadius: 50,
        },
        decimation: { algorithm: "min-max", enabled: true },
        filler: { drawTime: "beforeDatasetDraw", propagate: true },
        subtitle: {
          display: false,
          text: props.dns_product?.dns_name,
          align: "start",
          position: "top",
          color: "black",
          padding: 2,
          fullSize: true,
          font: { size: 14 },
        },
        legend: {
          display: false,
          position: "left",
          align: "center",
          maxHeight: 5,
          maxWidth: 5,
          fullSize: true,
          textDirection: "",
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            offset: true,
          },
        },
      },
      indexAxis: "y",
    };
    const chartData = computed(() => {
      const dataValues = dns_price.map((e) => Number(e.current_price));
      const max = Math.max(...dataValues);
      const min = Math.min(...dataValues);
      const avg = (max + min) / 2;
      return {
        labels: dns_price.map((e) => moment(e.date_price).format("YYYY-MM-DD")),
        datasets: [
          {
            label: "Цена",
            backgroundColor: dataValues.map((e) => {
              let r = 255;
              let g = 255;
              if (e < avg) {
                r = Math.ceil((255 * (e - min)) / (avg - min + 1));
              }
              if (e > avg) {
                g = 255 - Math.ceil((255 * (e - avg)) / (avg - min + 1));
              }
              return `rgba(${r}, ${g}, 0, 0.65)`;
            }),
            borderColor: "green",
            borderWidth: 2,
            data: dataValues,
          },
        ],
      };
    });
    const scrolPosition = (env: Event | undefined, el: HTMLElement) => {
      if (!el) return false;
      const pos = window.scrollY;
      const top = el.offsetTop;
      if (pos > top - 800) {
        viewChart.value = true;
      }
    };
    return {
      viewChart,
      dns_price,
      ChartDataLabels,
      scrolPosition,
      chartOptions,
      chartData,
    };
  },
  mounted () {
    const el = this.$refs[this.dns_product?.id] as Vue;
    this.scrolPosition(undefined, el.$el as HTMLElement);
  },
});
</script>
