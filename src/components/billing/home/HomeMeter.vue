<template>
  <v-expansion-panel class="pa-0 ma-0">
    <v-expansion-panel-header
      class="pa-0 ma-0 lighten-5"
      :class="meter.active ? 'green' : 'red'"
    >
      <!-- <v-container> -->
      <v-row align="center" dense justify="center" no-gutters>
        <v-col cols="auto" style="width: 45px">
          <CheckBoxTitleV v-model="meter.active" @click.stop />
        </v-col>

        <v-col>
          <v-row class="ma-0">
            <!-- Счетчик -->
            <v-col
              class="cola ma-0 pa-0"
              cols="12"
              lg="10"
              md="10"
              order-md="1"
              xl="3"
            >
              <span class="text-h4">{{ meter.naimen }}</span>
              {{ meter.model }}
              {{ meter.num }}
            </v-col>
            <!-- Предыдущие показания -->
            <v-col
              v-if="lastMeterBilling"
              class="cola pa-0 ma-0"
              cols="6"
              lg="3"
              md="6"
              order-md="3"
              xl="2"
            >
              <label>на {{ lastMeterBilling.date_bil }}</label><br>
              {{ lastMeterBilling.value / meter.multiplicity }}
            </v-col>
            <!-- Расценки -->
            <v-col
              class="cola pt-1 pb-1"
              cols="6"
              lg="2"
              md="6"
              order-md="2"
              xl="2"
            >
              <label>с
                {{
                  $moment(lastMeterPrice.date_beg).format("YYYY-MM-DD")
                }}</label><br>
              <div>{{ lastMeterPrice.billing / 100 }}р.</div>
            </v-col>
            <!-- Текущие показания -->
            <v-col
              class="cola pt-1 pb-1"
              :class="{
                'purple-text': meter.counter && meter.id !== meter.kod_drain,
                'green lighten-3': currentMeterBilling,
              }"
              cols="6"
              lg="3"
              md="6"
              order-md="4"
              xl="2"
            >
              <span v-if="currentMeterBilling" class="text-h5 cola">
                {{ currentMeterBilling.value / meter.multiplicity }}
              </span>
              <span v-else>-</span>
            </v-col>
            <!-- Расход -->
            <v-col
              class="text-h5 cola pt-1 pb-1"
              cols="6"
              lg="3"
              md="6"
              order-md="5"
              xl="1"
            >
              {{ currentConsumption }}
            </v-col>
            <!-- Сумма -->
            <v-col
              class="text-h5 cola pt-1 pb-1 right-align text-h5"
              cols="12"
              lg="3"
              md="6"
              order-md="6"
              xl="2"
            >{{ calcSum }}р.</v-col>
          </v-row>
        </v-col>
      </v-row>
      <!-- </v-container> -->
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-container>
        <v-row class="ma-1">
          <v-col cols="9">
            <v-text-field
              dense
              hide-details
              label="Ввод показаний"
              outlined
              :value="newVal"
              @input="addBilling"
            />
          </v-col>
          <v-col cols="3">
            <BtnIconsVVue
              :action="clearBilling"
              class="btn-small red left"
              icon="delete"
              @click="event.stopPropagation()"
            />
          </v-col>
        </v-row>

        <LineChartVue
          :chart-data="charData"
          :chart-options="options"
          class="limhei"
          :height="200"
        />
      </v-container>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import BtnIconsVVue from "@/components/basic/BtnIconsV.vue";
import LineChartVue from "@/components/basic/charts/LineChart.vue";
import { defineComponent, ref, toRefs } from "vue";
import { useBillingsStore } from "@/store/modules/billings";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { IBillingBillings } from "@/types/database/schemas/billing";
import CheckBoxTitleV from "@/components/basic/CheckBoxTitleV.vue";

export default defineComponent({
  components: {
    LineChartVue,
    BtnIconsVVue,
    CheckBoxTitleV,
  },
  props: {
    meter: {
      type: Object,
      default: () => ({
        id: 0,
        naimen: "",
        model: "",
        num: "",
        kod_apartments: "",
        kod_resource: "",
        dop: "",
        date_add: "",
        active: "",
      }),
    },
  },
  setup () {
    const { r_delete, r_update, r_insert } = dataApiComposition();
    const newVal = ref(0);
    const timer = ref(0);
    const options = ref({
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    });
    const {
      home,
      apartments,
      meters,
      billings,
      date_billing,
      prices,
      dates,
      total,
    } = toRefs(useBillingsStore());
    return {
      r_delete,
      r_update,
      r_insert,
      newVal,
      timer,
      options,
      home,
      apartments,
      meters,
      billings,
      date_billing,
      prices,
      dates,
      total,
    };
  },
  computed: {
    meterBilling (): any[] {
      return this.billings
        .filter((e: { kod_meter: any }) => e.kod_meter === this.meter.id)
        .map((e: { date_bil: any }) => ({
          ...e,
          date_bil: this.$moment(e.date_bil).format("YYYY-MM-DD"),
        }));
    },
    charData (): { labels: string[]; datasets: any[] } {
      const char = {
        labels: this.meterBilling.map((e: { date_bil: any }) =>
          this.$moment(e.date_bil).format("DD MMM YY")
        ),
        datasets: [
          {
            label: "Показания",
            borderColor: "#FC2525",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "white",
            backgroundColor: "rgba(0, 0,0, 0.1)",
            data: this.meterBilling.map(
              (e: { value: number }, i: number, m: { value: any }[]) => {
                let res = e.value - (i > 0 ? m[i - 1].value : e.value);
                if (res > 83700) {
                  res -= 83700;
                }
                return res;
              }
            ),
          },
        ],
      };
      return char;
    },
    currentMeterBilling (): any {
      return this.meterBilling.find(
        (e: { date_bil: any }) => e.date_bil === this.date_billing
      );
    },
    lastMeterBilling (): any {
      if (this.currentMeterBilling) {
        return this.meterBilling[1];
      } else {
        return this.meterBilling[0];
      }
    },
    meterPrice (): any {
      return this.prices.filter(
        (e: { kod_resource: any }) => e.kod_resource === this.meter.kod_resource
      );
    },
    lastMeterPrice (): any {
      return this.meterPrice[0];
    },
    prevMeterPrice (): any {
      return this.meterPrice[1];
    },
    currentConsumption (): any {
      let count = 0;
      if (this.currentMeterBilling) {
        if (this.meter.counter) {
          count = this.currentMeterBilling.value - this.lastMeterBilling.value;
        } else {
          count = this.lastMeterBilling.value;
        }
      }

      return count / this.meter.multiplicity;
    },
    calcSum (): string {
      let sum = this.currentConsumption * this.lastMeterPrice.billing;
      sum /= 100;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.meter.calc_sum = sum;

      return sum.toFixed(2);
    },
  },
  methods: {
    clearBilling (e: { stopPropagation: () => void }) {
      e.stopPropagation();
      console.log(this.currentMeterBilling);

      this.r_delete({
        from: "billing.billings",
        filter: { id: this.currentMeterBilling.id },
      }).then((r) => {
        if (r.count === 1) {
          // this.$parent.getBilling();
          this.$emit("getBilling");
          this.$toast({ html: "Данные удалены" });
        }
      });
    },
    addBilling (e: any) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        console.log(e);
        const bill = this.meterBilling.find(
          (e: { date_bil: any }) => e.date_bil === this.date_billing
        );
        if (bill) {
          console.log("Нашли", bill);
          this.r_update<keyof IBillingBillings>({
            to: "billing.billings",
            set: { value: e },
            filter: { id: bill.id },
          }).then((r) => {
            if (r.count === 1) {
              // this.$parent.getBilling();
              this.$emit("getBilling");
              this.$toast({ html: "Данные обновлены" });
            }
          });
        } else {
          console.log(" Не Нашли");
          this.r_insert({
            to: "billing.billings",
            fields: {
              value: e,
              date_bil: this.date_billing,
              kod_meter: this.meter.id,
            },
          }).then((r) => {
            if (r.count === 1) {
              // this.$parent.getBilling();
              this.$emit("getBilling");
              this.$toast({ html: "Данные добавлены" });
            }
          });
        }
        //
      }, 2000);
    },
  },
});
</script>

<style scoped>
.cola {
  border: 1px solid silver;
}
.v-expansion-panel-header {
  min-height: 32px;
}
</style>
