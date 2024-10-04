import { dataApiComposition } from "@/compositionApi/dataApi";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import { ICheckroomEmployees } from "@/types/database/schemas/checkroom";
import {
  IKnowledgebaseBzUsers,
  IKnowledgebaseWorkGroup,
  IKnowledgebaseWorkGroupEmployees,
} from "@/types/database/schemas/knowledgebase";
import { ISmprimaryContctsm1 } from "@/types/database/schemas/smprimary";
import type { ICreateTableFields } from "@/types/database/service";
import type { restGetType } from "@/types/restApi";

export type ISmWorkGrEmployees = Pick<
  ISmprimaryContctsm1,
  "p_sb_sap_identification" | "p_contact_name" | "p_full_name" | "p_tps_name"
> &
  Pick<
    ICheckroomEmployees,
    | "empfamilyname"
    | "agile_id"
    | "depart_id"
    | "outstatusstart"
    | "outstatusend"
  > &
  Pick<
    IKnowledgebaseWorkGroup,
    | "id"
    | "kod_cluster"
    | "kod_curator"
    | "icon"
    | "color"
    | "kod_group"
    | "naimen"
  > & {
    tab_num: null | number;
    key: string;
    kod_bz: number;
  };

const { r_get } = dataApiComposition();
export const getSMContacts = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter: restGetType<
    ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
  > = {};
  if (groupList.length) {
    filter["kod_group"] = groupList.map((e) => ({ "wg.kod_group": `=:${e}` }));
    filter["kod_group"] = filter["kod_group"].concat(
      groupList.map((e) => ({ "wg.id": `=:${e}` }))
    );
  }
  if (clusterList.length) {
    // filter["wg.kod_cluster"] = clusterList.map((e) => ({
    //   "wg.kod_cluster": `=:${e}`,
    // }));
    // filter["wg.kod_cluster"].push({
    //   "wg.kod_group": {
    //     fields: ["wg.id"],
    //     from: ["work_group:wg"],
    //     filter: clusterList.map((e) => ({
    //       "wg.kod_cluster": `=:${e}`,
    //     })),
    //   },
    // });
  }
  if (ciList.length) {
    // console.log(ciList);
  }
  if (smGroupList.length) {
    // console.log(smGroupList);
  }
  return r_get<
    | "p_hpc_corp_structure"
    | "wge.kod_group||'-'||wge.tab_num"
    | "wge.tab_num::character varying"
    | "wg.kod_curator<>wge.tab_num"
    | ICreateTableFields<keyof ISmprimaryContctsm1, "c">
    | ICreateTableFields<keyof ICheckroomEmployees, "e">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
    | ICreateTableFields<keyof IKnowledgebaseBzUsers, "u">
  >({
    fields: [
      "wge.tab_num",
      {
        fields: ["u.id:kod_bz"],
        from: ["bz_users:u"],
        filter: { "u.tabnum": "@@=:wge.tab_num" },
      },
      "wge.kod_group||'-'||wge.tab_num:key",
      "e.empfamilyname",
      "c.p_sb_sap_identification",
      "c.p_contact_name",
      "c.p_full_name",
      "c.p_tps_name",
      "wg.id",
      "wg.kod_group",
      "wg.kod_cluster",
      "wg.kod_curator",
      "e.outstatusstart",
      "e.outstatusend",
      "wg.color",
      "wg.naimen",
      "wg.icon",
      "e.agile_id",
      "e.depart_id",
    ],
    from: [
      "work_group:wg",
      "smprimary.contctsm1:c",
      "checkroom.employees:e",
      "work_group_employees:wge",
    ],
    join: [
      "wg.id=wge.kod_group",
      "wge.tab_num=e.id",
      "wge.tab_num::character varying=c.p_sb_sap_identification",
    ],
    filter: {
      "c.p_tps_status": "<>:Уволен",
      ...filter,
    },
    sort: [
      "wg.id",
      "wg.kod_group",
      "wg.kod_curator<>wge.tab_num",
      "c.p_contact_name",
    ],
  }).then((r) => {
    const smStore = useServiceManagerStore();
    const nullData: ISmWorkGrEmployees = {
      agile_id: null,
      color: "rgb(249, 28, 28)",
      depart_id: null,
      empfamilyname: null,
      icon: "report_problem",
      id: 0,
      key: "null",
      kod_bz: 0,
      kod_cluster: null,
      kod_curator: 0,
      kod_group: null,
      naimen: null,
      outstatusend: null,
      outstatusstart: null,
      p_contact_name: "null",
      p_full_name: null,
      p_sb_sap_identification: null,
      p_tps_name: "2.Нет исполнителя",
      tab_num: null,
    };
    const allData: ISmWorkGrEmployees = {
      agile_id: null,
      color: "rgb(29, 28, 248)",
      depart_id: null,
      empfamilyname: null,
      icon: "add_to_photos",
      id: 0,
      key: "all",
      kod_bz: 0,
      kod_cluster: null,
      kod_curator: 0,
      kod_group: null,
      naimen: null,
      outstatusend: null,
      outstatusstart: null,
      p_contact_name: "null",
      p_full_name: "all",
      p_sb_sap_identification: null,
      p_tps_name: "1.Все задачи",
      tab_num: -2,
    };
    smStore.sm_work_group_employees = [allData, nullData, ...r];
  });
};
