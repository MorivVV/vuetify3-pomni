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
                  :value="home"
                  :items="apartments"
                  item-value="id"
                  item-text="naimen"
                  :extend="false"
                  @input="changeHome"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-menu
                  ref="dateMenu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="date_billing"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      :value="date_billing"
                      label="Дата показаний"
                      prepend-icon="mdi-calendar"
                      outlined
                      dense
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    :value="date_billing"
                    :events="functionEvents"
                    event-color="green"
                    no-title
                    scrollable
                    @input="changeDate"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      Отмена
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
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
              <v-col md="12" class="text-center">
                <h2 class="text-h2 ma-1">{{ calcSum }}</h2>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-card>
          <v-container class="pa-0">
            <v-row class="ma-0 pa-0 blue white-text">
              <v-col style="width: 45px" cols="auto">вкл</v-col>
              <v-col class="ma-0 pl-0 pr-6">
                <v-row class="ma-0">
                  <v-col
                    class="col"
                    cols="12"
                    md="3"
                    lg="10"
                    xl="3"
                    order-md="1"
                    >Счетчик</v-col
                  >
                  <v-col class="col" cols="6" md="3" lg="3" xl="2" order-md="3">
                    Предыдущие
                  </v-col>
                  <v-col class="col" cols="6" md="3" lg="2" xl="2" order-md="2"
                    >Расценки</v-col
                  >
                  <v-col class="col" cols="6" md="3" lg="3" xl="2" order-md="4"
                    >Текущие</v-col
                  >
                  <v-col class="col" cols="6" md="3" lg="3" xl="1" order-md="5"
                    >Расход</v-col
                  >
                  <v-col
                    class="col right-align"
                    cols="12"
                    md="3"
                    lg="3"
                    xl="2"
                    order-md="6"
                    >Сумма {{ calcSum }}р.</v-col
                  >
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
import { defineComponent, ref, toRefs, computed, watch } from "vue";
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
  setup() {
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
  mounted() {
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
