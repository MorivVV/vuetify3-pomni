import { ICheckroomEmployees } from "@/types/database/schemas/checkroom";
import { defineStore } from "pinia";
export type TAgileGroups = Pick<
  ICheckroomEmployees,
  "agile_id" | "agileroles" | "agileroot"
>;
export const useAddressbookStore = defineStore("addressbook", {
  state: () => ({
    rootList: [
      { id: "agilestructures", name: "Структура Sbergile" },
      { id: "consumers", name: "Consumers" },
      { id: "departments", name: "Подразделения" },
      { id: "employees", name: "Сотрудники" },
      { id: "fos", name: "fos-structures" },
      { id: "logs", name: "Логи" },
      { id: "sms", name: "Отправка SMS по табельному номеру" },
      { id: "workgroups", name: "Workgroups" },
    ],
    search: "",
    agile_groups: [] as TAgileGroups[],
  }),
  getters: {},
});
