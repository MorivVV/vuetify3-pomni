import convertToObject from "@/functions/convertToObject";
import { IAuditReasons } from "@/types/database/schemas/audit";
import { defineStore } from "pinia";
interface IReasonPeriod {
  ID: number;
  KO: number;
  KR: number;
  DB: string;
  DE: string;
}
interface IAJAXgetOperations {
  ID: string;
  RS: number;
  DR: number;
  EKSKOD: string;
  EKSNAME: string;
  DESCRIPT: string;
  OPID: number;
}
export interface IAJAXgetStatisticSvod {
  RDATE: string;
  RSUM: string;
  RCNT: string;
  SOM: string;
}
export const useAuditDataStore = defineStore("auditData", {
  state: () => ({
    reason: [] as IAuditReasons[],
    reasonPeriod: [] as IReasonPeriod[],
    operations: [] as IAJAXgetOperations[],
    permition: [],
    svod: [] as IAJAXgetStatisticSvod[],
    users: [],
    result: [],
    groups: [],
    search: "",
    searchCount: 0,
    resultMin: 0,
    resultMax: 10,
    addPeriod: 0,
    delPeriod: -1,
    editReason: 1,
    topicCode: {
      B: "Типы",
      L: "Выполнение",
      D: "Отладка",
      P: "Запуск",
      U: "Доступ",
      E: "Ошибки",
      I: "Сессии",
      J: "Процесс",
      H: "Отправлено",
      N: "Получено",
      C: "Представления",
      M: "Операции",
      A: "Реквизиты",
      S: "Состояния",
      T: "Переходы",
      R: "Параметры",
      V: "Переменные",
      G: "Настройки",
      F: "Формы",
      K: "Таблица",
      X: "Индексы",
      Y: "Триггеры",
      Z: "Ограничения",
      W: "Процедуры",
      Q: "СКЭДО",
    },
  }),

  getters: {
    reasonList(state) {
      const reason = convertToObject(state.reason, "ID");
      return reason;
    },
    svodList(state) {
      return state.svod;
    },
    operationList(state) {
      const operations = convertToObject(state.operations, "ID");
      return operations;
    },
    operationFilterList(state) {
      const object = state.operations;
      const result: IAJAXgetOperations[] = [];
      const min = state.resultMin;
      const max = state.resultMax;
      let i = 0;
      const s = state.search.toLowerCase();
      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          const element = object[key];
          if (
            s === "" ||
            ~element.EKSKOD.toLowerCase().indexOf(s) ||
            ~element.EKSNAME.toLowerCase().indexOf(s)
          ) {
            if (i >= min && i < max) {
              result.push(element);
            }
            i++;
          }
        }
      }
      state.searchCount = i;
      result.sort((a, b) => {
        if (a.EKSNAME > b.EKSNAME) return 1;
        if (a.EKSNAME < b.EKSNAME) return -1;
        return 0;
      });
      return result;
    },
    userList(state) {
      const user = convertToObject(state.users, "ID");
      return user;
    },
    groupList(state) {
      const gr = convertToObject(state.groups, "ID");
      return gr;
    },
    resultList(state) {
      return state.result;
    },
    topicDecode(state) {
      return state.topicCode;
    },
  },
});
