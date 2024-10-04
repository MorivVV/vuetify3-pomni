import { defineStore } from "pinia";

export const usePostgreStore = defineStore("postgre", {
  state: () => ({
    dataTypes: [],
    pg_namespace: [],
    tableList: [] as TableInfoPG[],
    dataTable: [] as Record<string, string>[],
    fieldList: [] as FieldList[],
    primarykey: [] as { column_name: string }[],
    operators: [
      { id: ">:", name: "Больше (>)" },
      { id: ">=:", name: "Больше или равно  (>=)" },
      { id: "=:", name: "Равно (=)" },
      { id: "<>:", name: "Не равно (<>)" },
      { id: "<=:", name: "Меньше или равно (<=)" },
      { id: "<:", name: "Меньше (<)" },
      { id: "~~:", name: "Cодержит (LIKE)" },
      { id: "!~~:", name: "НЕ Cодержит (NOT LIKE)" },
      { id: "~~*:", name: "содержит регистр-независимый (ILIKE)" },
      { id: "!~~*:", name: "НЕ содержит регистр-независимый (NOT ILIKE)" },
      { id: "~:", name: "RegEx cоответствие" },
      { id: "!~:", name: "RegEx несоответствие" },
      { id: "~*:", name: "RegEx cоответствие регистр-независимый" },
      { id: "!~*:", name: "RegEx несоответствие регистр-независимый" },
    ] as OperatorPG[],
    createTable: "",
  }),
  getters: {},
});
