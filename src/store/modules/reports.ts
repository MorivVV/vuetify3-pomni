import {
  IReportsColumnType,
  IReportsReportNameEx,
  IReportsReportStateEx,
} from "@/types/database/schemas/reports";
import { defineStore } from "pinia";

export const useReportStore = defineStore("reportsHist", {
  state: () => ({
    reports: [] as IReportsReportNameEx[],
    reportsState: [] as IReportsReportStateEx[],
    reportsColumnType: [] as IReportsColumnType[],
  }),
});
