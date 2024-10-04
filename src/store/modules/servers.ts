import {
  IKnowledgebaseBzAutoSystems,
  IKnowledgebaseBzServerInfo,
  IKnowledgebaseServerPlace,
  IKnowledgebaseServerStand,
} from "@/types/database/schemas/knowledgebase";
import { defineStore } from "pinia";

export const useServersStore = defineStore("servers", {
  state: () => ({
    servers: [] as IKnowledgebaseBzServerInfo[],
    ac_system: [] as IKnowledgebaseBzAutoSystems[],
    place: [] as IKnowledgebaseServerPlace[],
    stand: [] as IKnowledgebaseServerStand[],
    deleteServer: "",
    addServer: "",
    editServer: "",
  }),
});
