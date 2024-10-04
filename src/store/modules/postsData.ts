import { defineStore } from "pinia";

export const usePostDataStore = defineStore("postData", {
  state: () => ({
    posts: [] as Post[],
    smlist: [] as { query_num: string; add_date: string }[],
    search: "",
    clearSearch: "false",
    searchCount: 0,
    sberSpace: [],
    matrixContacts: [],
    favorites: false,
    mypost: false,
    kod_post: "",
    searchList: [],
    resultMin: 0,
    resultMax: 10,
    dateBeg: "",
    dateEnd: "",
    perPage: 10,
    insert: "",
    editpost: "",
    addfiles: [],
    terms_list: [] as IBZTerms[],
  }),
});
