<script lang="ts">
import { defineComponent } from "vue";
import { Line } from "vue-chartjs";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Filler
);

export default defineComponent({
  mixins: [Line],
  props: {
    chartData: {
      type: Object,
      default: () => ({
        labels: ["January", "February", "March"],
        datasets: [{ data: [40, 20, 12] }],
      }),
    },
    chartOptions: {
      type: Object,
      default: () => ({
        responsive: true,
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
