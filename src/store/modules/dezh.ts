import {
  IKnowledgebaseEmails,
  IKnowledgebaseMailList,
  IKnowledgebasePlace,
  IKnowledgebaseTags,
} from "@/types/database/schemas/knowledgebase";
import { defineStore } from "pinia";

export const useDezhStore = defineStore("dezh", {
  state: () => ({
    posts: [] as DezhInfoPost[],
    dezh_info_accept: [] as DezhInfoAccept[],
    users: [],
    TUZusers: [],
    emails: [] as IKnowledgebaseEmails[],
    place: [] as IKnowledgebasePlace[],
    report: [] as IReportIncident[],
    duty: [] as IDutySchedule[],
    dezh_reports: [] as IDezhReport[],
    mail_groups: [] as IMailGroup[],
    mail_list: [] as IKnowledgebaseMailList[],
    tags: [] as IKnowledgebaseTags[],
    search: "",
    dateBeg: "",
    dateEnd: "",
    resultMin: 0,
    searchCount: 0,
  }),
  getters: {},
});
