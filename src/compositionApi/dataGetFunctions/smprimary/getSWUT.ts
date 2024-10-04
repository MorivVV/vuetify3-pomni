import { dataApiComposition } from "@/compositionApi/dataApi";
import { EKNOWLEGEBASE, ESMPRIMARY } from "@/const/schemaEnums";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import {
  IKnowledgebaseWorkGroup,
  IKnowledgebaseWorkGroupEmployees,
} from "@/types/database/schemas/knowledgebase";
import {
  ISmprimaryAsCluster,
  ISmprimaryContctsm1,
  ISmprimarySbsoftupdatetaskm1,
} from "@/types/database/schemas/smprimary";
import { ICreateTableFields } from "@/types/database/service";
import { restGetType } from "@/types/restApi";
import { filterSMGroup } from "./filterSMGroup";
const { r_get } = dataApiComposition();

export const getSWUTFilters = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
): restGetType<
  ICreateTableFields<keyof ISmprimarySbsoftupdatetaskm1, "swut">
> => {
  const filter: restGetType<
    ICreateTableFields<keyof ISmprimarySbsoftupdatetaskm1, "swut">
  > = {
    "swut.p_status@1": "<>:4 Выполнено",
    "swut.p_status@2": "<>:4 Закрыто",
    "swut.p_status@3": "<>:3 Выполнено",
  };

  if (ciList.length) {
    filter["swut.p_affected_item"] = ciList.map((e) => ({
      "swut.p_affected_item": `=:${e}`,
    }));
  }

  if (clusterList.length) {
    filter["kod_cluster"] = clusterList.map((e) => ({ "ci.kod_cluster": e }));
  }

  if (groupList.length) {
    filter["kod_group"] = groupList.map((e) => ({ "wg.kod_group": e }));
    filter["kod_group"] = filter["kod_group"].concat(
      groupList.map((e) => ({ "wg.id": e }))
    );
  }

  if (smGroupList.length) {
    filter["swut.p_assignment"] = filterSMGroup(smGroupList) as any;
  }
  return filter;
};
export const getSWUT = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getSWUTFilters(ciList, clusterList, groupList, smGroupList);
  return r_get<
    | string
    | "p_affected_item"
    | "kod_cluster"
    | "kod_group"
    | ICreateTableFields<keyof ISmprimarySbsoftupdatetaskm1, "swut">
    | ICreateTableFields<keyof ISmprimaryAsCluster, "ci">
    | ICreateTableFields<keyof ISmprimaryContctsm1, "c">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
  >(
    {
      from: [
        `${ESMPRIMARY.sbsoftupdatetaskm1}:swut`,
        `${ESMPRIMARY.as_cluster}:ci`,
        `${ESMPRIMARY.contctsm1}:c`,
        `${EKNOWLEGEBASE.work_group_employees}:wge`,
        `${EKNOWLEGEBASE.work_group}:wg`,
      ],
      join: [
        "swut.p_affected_item=ci.logical_name",
        "swut.p_assignee_name=(+)c.p_full_name",
        "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
        "wge.kod_group=(+)wg.id",
      ],
      fields: [
        "DISTINCT",
        "swut.p_number",
        "swut.p_status",
        "swut.p_pospo_name",
        "swut.p_affected_item",
        "swut.p_assignment_name",
        "swut.p_assignee_name",
        "swut.p_hpc_next_breach",
      ],
      filter,
    },
    "sm_swut",
    useServiceManagerStore
  );
};
