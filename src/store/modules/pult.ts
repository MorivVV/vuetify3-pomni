import { IPultAlertTables, IPultAsystems } from "@/types/database/schemas/pult";
import { defineStore } from "pinia";

export const usePultStore = defineStore("pult", {
  state: () => ({
    actions: [] as IPultAction[],
    monsystems: [] as IPultMonitor[],
    SMsystems: [] as IPultSMSystems[],
    rules: [] as PultRule[],
    tksPatternMailList: [] as IPultTksPattern[],
    alert_rule_pool: [] as AlertPool[],
    alert_tables: [] as IPultAlertTables[],
    TUZusers: [] as ITuzUser[],
    metrics: [] as IPultMetric[],
    systems: [] as IPultAsystems[],
    pattern_priority: [] as IPultTKSPriority[],
    sm_groups: [] as ServiceManGroup[],
    bz_users: [],
  }),
  getters: {},
});
