<script lang="ts">
import { defineComponent } from "vue";
import { Pie } from "vue-chartjs";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default defineComponent({
  mixins: [Pie],
  props: {
    chartData: {
      type: Object,
      default: () => ({
        labels: ["VueJs", "ReactJs", "AngularJs"],
        datasets: [
          { data: [40, 80, 10], backgroundColor: ["palegreen", "cyan", "red"] },
        ],
      }),
    },
    chartOptions: {
      type: Object,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,
      }),
    },
    chartId: {
      type: String,
      default: "bar-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => ({}),
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
});
</script>
