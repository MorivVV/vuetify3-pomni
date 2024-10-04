import { defineStore } from "pinia";
interface IJiraProject {
  id: number;
  project: string;
  naimen: string;
  time_add: string;
  active: boolean;
  get_bags: boolean;
}
const issue = {
  expand:
    "operations,versionedRepresentations,editmeta,changelog,renderedFields",
  id: "",
  self: "",
  key: "",
  fields: {
    summary: "",
    issuetype: {
      self: "",
      id: "",
      description: "",
      iconUrl: "",
      name: "",
      subtask: false,
      avatarId: 17018,
    },
    description: "",
    project: {
      self: "",
      id: "",
      key: "",
      name: "",
      projectTypeKey: "",
      avatarUrls: {
        "48x48": "",
        "24x24": "",
        "16x16": "",
        "32x32": "",
      },
    },
    comment: {
      comments: [],
      maxResults: 5,
      total: 5,
      startAt: 0,
    },
    reporter: {
      self: "",
      name: "",
      key: "",
      emailAddress: "",
      avatarUrls: {
        "48x48": "",
        "24x24": "",
        "16x16": "",
        "32x32": "",
      },
      displayName: "",
      active: true,
      timeZone: "",
    },
    fixVersions: [],
    assignee: {
      self: "",
      name: "",
      key: "",
      emailAddress: "",
      avatarUrls: {
        "48x48": "",
        "24x24": "",
        "16x16": "",
        "32x32": "",
      },
      displayName: "",
      active: true,
      timeZone: "",
    },
    updated: "2023-05-04T14:58:12.000+0300",
    labels: [],
    status: {
      self: "",
      description: "",
      iconUrl: "",
      name: "",
      id: "",
      statusCategory: {
        self: "",
        id: 4,
        key: "",
        colorName: "",
        name: "",
      },
    },
  },
};
type JIssue = typeof issue;
export const useJiraStore = defineStore("jira", {
  state: () => ({
    jira: {} as { issues: JIssue[]; total: number; maxResults: number },
    projectList: [] as IJiraProject[],
    resultMin: 0,
    resultMax: 20,
    perPage: 50,
  }),

  getters: {},
});
