<template>
  <v-container>
    <LoaderCircle v-if="loading" />
    <v-row v-else>
      <v-container>
        <v-card>
          <v-container class="ma-0" fluid>
            <v-row dense>
              <v-col cols="12" md="6">
                <AutocompleteV
                  :extend="false"
                  item-text="naimen"
                  item-value="id"
                  :items="apartments"
                  :value="home"
                  @input="changeHome"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-menu
                  ref="dateMenu"
                  v-model="menu"
                  v-model:return-value="date_billing"
                  :close-on-content-click="false"
                  min-width="auto"
                  offset-y
                  transition="scale-transition"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      dense
                      label="Дата показаний"
                      outlined
                      prepend-icon="mdi-calendar"
                      readonly
                      :value="date_billing"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    event-color="green"
                    :events="functionEvents"
                    no-title
                    scrollable
                    :value="date_billing"
                    @input="changeDate"
                  >
                    <v-spacer />
                    <v-btn color="primary" text @click="menu = false">
                      Отмена
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="
                        () => {
                          menu = false;
                          dateMenu.save(date_billing);
                        }
                      "
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-card>
          <v-container>
            <v-row>
              <v-col class="text-center" md="12">
                <h2 class="text-h2 ma-1">{{ calcSum }}</h2>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-card>
          <v-container class="pa-0">
            <v-row class="ma-0 pa-0 blue white-text">
              <v-col cols="auto" style="width: 45px">вкл</v-col>
              <v-col class="ma-0 pl-0 pr-6">
                <v-row class="ma-0">
                  <v-col
                    class="col"
                    cols="12"
                    lg="10"
                    md="3"
                    order-md="1"
                    xl="3"
                  >Счетчик</v-col>
                  <v-col
                    class="col"
                    cols="6"
                    lg="3"
                    md="3"
                    order-md="3"
                    xl="2"
                  >
                    Предыдущие
                  </v-col>
                  <v-col
                    class="col"
                    cols="6"
                    lg="2"
                    md="3"
                    order-md="2"
                    xl="2"
                  >Расценки</v-col>
                  <v-col
                    class="col"
                    cols="6"
                    lg="3"
                    md="3"
                    order-md="4"
                    xl="2"
                  >Текущие</v-col>
                  <v-col
                    class="col"
                    cols="6"
                    lg="3"
                    md="3"
                    order-md="5"
                    xl="1"
                  >Расход</v-col>
                  <v-col
                    class="col right-align"
                    cols="12"
                    lg="3"
                    md="3"
                    order-md="6"
                    xl="2"
                  >Сумма {{ calcSum }}р.</v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-expansion-panels>
              <HomeMeterVue
                v-for="meter in meters"
                :key="'meter_' + meter.id"
                :meter="meter"
              />
            </v-expansion-panels>
          </v-container>
        </v-card>
      </v-container>

      <!-- <TableModifyDataVue :data="meters" /> -->
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useBillingsStore } from "@/store/modules/billings";
import moment from "moment";
import { computed, defineComponent, ref, toRefs, watch } from "vue";
import LoaderCircle from "../basic/LoaderCircle.vue";
import HomeMeterVue from "./home/HomeMeter.vue";
import AutocompleteV from "../basic/AutocompleteV.vue";
import {
  getAppartamens,
  getBilling,
  getBillingDates,
  getMeters,
  getPrices,
} from "./home/billingData";

export default defineComponent({
  components: {
    HomeMeterVue,
    LoaderCircle,
    AutocompleteV,
  },
  setup () {
    const { r_get, r_state } = dataApiComposition();
    const loading = ref(true);
    const menu = ref(false);
    const dateMenu = ref();
    const { meters, total, home, apartments, date_billing, dates } = toRefs(
      useBillingsStore()
    );
    const calcSum = computed(() => {
      const sum = meters.value
        .filter((e) => e.active)
        .reduce((partialSum, a) => partialSum + a.calc_sum, 0);
      return sum.toFixed(2);
    });

    const changeHome = (e: number) => {
      r_state(useBillingsStore, "home", e);
    };
    const changeDate = (e: moment.MomentInput) => {
      r_state(useBillingsStore, "date_billing", moment(e).format("YYYY-MM-DD"));
    };

    const functionEvents = (date: string) => {
      if (~dates.value.map((e) => e.date_bil).indexOf(date)) return true;
      return false;
    };
    const getData = () => {
      loading.value = true;
      useBillingsStore().total = 0;
      return getPrices(date_billing.value)
        .then(() => getBillingDates(home.value))
        .then(() => getMeters(home.value))
        .then(() => getBilling(home.value, date_billing.value))
        .then(() => {
          loading.value = false;
        });
    };
    useBillingsStore().date_billing = moment().format("YYYY-MM-DD");
    getAppartamens().then(() => getData());
    watch(home, getData);
    watch(date_billing, getData);
    return {
      r_get,
      r_state,
      getPrices,
      changeHome,
      changeDate,
      functionEvents,
      loading,
      menu,
      meters,
      total,
      home,
      apartments,
      date_billing,
      dates,
      calcSum,
      dateMenu,
    };
  },
  mounted () {
    this.$on("calc", (val: number) => {
      console.log("oncalc");

      this.total += val;
    });
  },
});
</script>

<style scoped>
.blue.white-text .col {
  border: 1px solid silver;
}
</style>
