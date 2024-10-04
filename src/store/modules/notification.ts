import { defineStore } from "pinia";
export interface ISnackNotify {
  text: string;
  color: string;
  view: boolean;
  timeout: number;
  timecreate: number;
  count: number;
}
export const useNotificationStore = defineStore("notification", {
  state: () => ({
    errors: [] as ISnackNotify[],
    info: [] as ISnackNotify[],
    warning: [] as ISnackNotify[],
  }),
});
