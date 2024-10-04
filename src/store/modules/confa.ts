import { defineStore } from "pinia";

export const useConfaStore = defineStore("confa", {
  state: () => ({
    activeBlock: 0,
    namePage: "",
    nameBlock: "",
    kodPage: 0,
    pages: [] as ConfPage[],
    blocks: [] as ConfBlock[],
    content: [] as ConfContent[],
    content_search: [] as IConfSearchContent[],
    content_versions: [] as ConfContent[],
  }),
  getters: {},
});
