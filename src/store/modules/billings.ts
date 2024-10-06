import {
  IBillingApartments,
  IBillingBillings,
  IBillingMeters,
  IBillingPrices,
  IBillingResources,
  IMonitoringZdorovie,
} from "@/types/database/schemas/billing";
import { defineStore } from "pinia";
interface ICalcMeter extends IBillingMeters {
  calc_sum: number;
}
export const useBillingsStore = defineStore("billings", {
  state: () => ({
    prices: [] as IBillingPrices[],
    meters: [] as ICalcMeter[],
    dates: [] as { date_bil: string }[],
    billings: [] as IBillingBillings[],
    home: 4,
    apartments: [] as IBillingApartments[],
    resources: [] as IBillingResources[],
    zdorovie: [] as IMonitoringZdorovie[],
    date_billing: "",
    total: 0,
  }),
  getters: {},
});
