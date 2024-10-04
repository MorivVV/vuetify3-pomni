import { defineStore } from "pinia";

export const useMvideoStore = defineStore("mvideo", {
  state: () => ({
    dns_prices: [] as IDNSPrice[],
    dns_products: [] as IDNSProdict[],
    prices: [] as IMvideoPrice[],
    products: [] as IMvideoProduct[],
  }),
  actions: {},
  getters: {},
});
