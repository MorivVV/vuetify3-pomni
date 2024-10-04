import { defineStore } from "pinia";

export const useMonitoringStore = defineStore("monitoring", {
  state: () => ({
    all: true,
    users: [] as IAnyObject[],
    seodo: [] as IAnyObject[],
    jira: [] as IAnyObject[],
    jira_list: [] as IAnyObject[],
    jira_v: [] as IAnyObject[],
    jira_task_p: [] as IAnyObject[],
    viewUserIssues: [] as IAnyObject[],
    viewUserTasks: [] as IAnyObject[],
    activeUser: "",
  }),
  getters: {
    // jiraIssues(state: { jira: { issues: any } }) {
    //   if ("issues" in state.jira) {
    //     return state.jira.issues;
    //   } else {
    //     return [];
    //   }
    // },
  },
});
