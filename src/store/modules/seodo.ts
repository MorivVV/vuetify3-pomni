import { defineStore } from "pinia";

export const useSeodoStore = defineStore("seodo", {
  state: () => ({
    documents: [],
    key_words: [] as { key_word: string }[],
    logics: [] as SeodoLogic[],
    actions: [],
    executor_groups: [] as ExecutorGroups[],
    employees: [],
    executors: [] as Executor[],
    kinds: [] as { id: string; name: string }[],
    assist: [],
    seodoId: [],
  }),
  getters: {
    autoKeyWords(state: any) {
      const obj: any = {};
      for (const w of state.key_words) {
        obj[w.key_word] = null;
      }
      return obj;
    },
    employeesSeo(state: any) {
      let emp = [];
      if (state.employees.length && state.seodoId) {
        emp = state.employees.filter((e: any) => ~state.seodoId.indexOf(e._id));
      }
      return emp;
    },
  },
});
