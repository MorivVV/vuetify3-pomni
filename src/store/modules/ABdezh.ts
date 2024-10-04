import { defineStore } from "pinia";

export const useABDezhStore = defineStore("ABdezh", {
  state: () => ({
    dezh_book: [] as IDezhAddressBook[],
    search: "",
  }),
  getters: {},
});
