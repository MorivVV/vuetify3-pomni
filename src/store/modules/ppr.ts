import { defineStore } from "pinia";

export const usePPRStore = defineStore("ppr", {
  state: () => ({
    pprs: [],
    tasks: [],
    info: [],
    deleteTask: "",
    deletePPR: "",
    addTask: "",
    taskStatus: [],
    pprType: [],
    userGroup: [],
    addPpr: "",
  }),

  getters: {},
});
