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
  ISmprimarySbriskm1,
} from "@/types/database/schemas/smprimary";
import { ICreateTableFields } from "@/types/database/service";
import { restGetType } from "@/types/restApi";
import { filterSMGroup } from "./filterSMGroup";
const { r_get } = dataApiComposition();

export const getRisksFilters = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
): restGetType<ICreateTableFields<keyof ISmprimarySbriskm1, "rsk">> => {
  const filter: restGetType<
    ICreateTableFields<keyof ISmprimarySbriskm1, "rsk">
  > = {
    "rsk.p_local_coordinator_name": "=:Рыбакин Н. Л. (588087)",
    "rsk.p_status@1": "<>:6 Закрыт",
    "rsk.p_status@2": "<>:5 Выполнен",
    "rsk.p_status@3": "<>:4 На контроле",
    "rsk.p_status@4": "<>:3 Минимизация",
    //"rsk.p_status@1": "=:1 Новый",
    //"rsk.p_status@2": "=:2 Оценка и анализ",
    "rsk.p_sb_category": "=:Риск простоя",
  };

  if (ciList.length) {
    filter["rsk.p_affected_item"] = ciList.map((e) => ({
      "rsk.p_affected_item": `=:${e}`,
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
    filter["rsk.p_assignment"] = filterSMGroup(smGroupList) as any;
  }
  return filter;
};
export const getRisks = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getRisksFilters(ciList, clusterList, groupList, smGroupList);
  return r_get<
    | string
    | "p_affected_item"
    | "kod_cluster"
    | "kod_group"
    | ICreateTableFields<keyof ISmprimarySbriskm1, "rsk">
    | ICreateTableFields<keyof ISmprimaryAsCluster, "ci">
    | ICreateTableFields<keyof ISmprimaryContctsm1, "c">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
  >(
    {
      from: [
        `${ESMPRIMARY.sbriskm1}:rsk`,
        `${ESMPRIMARY.as_cluster}:ci`,
        `${ESMPRIMARY.contctsm1}:c`,
        `${EKNOWLEGEBASE.work_group_employees}:wge`,
        `${EKNOWLEGEBASE.work_group}:wg`,
      ],
      join: [
        "rsk.p_affected_item=ci.logical_name",
        "rsk.p_contact_name_name=(+)c.p_full_name",
        "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
        "wge.kod_group=(+)wg.id",
      ],
      fields: [
        "DISTINCT",
        "rsk.p_number",
        "rsk.p_status",
        "rsk.p_substatus",
        "rsk.p_affected_item_name",
        "rsk.p_coordinator_name_name",
        "rsk.p_assignment_name",
        "rsk.p_open_time",
        "rsk.p_date_to_analysis",
        "rsk.p_brief_description",
        "rsk.p_description",
        "CASE WHEN rsk.p_substatus = 'Устранить замечания' THEN (SELECT audit_rsk.p_time FROM smprimary.hpcauditsbriskm1 audit_rsk WHERE rsk.p_number = audit_rsk.p_id AND audit_rsk.p_name_of_field = 'Подстатус' AND audit_rsk.p_new_simple_val = 'Устранить замечания' ORDER BY audit_rsk.p_time DESC FETCH FIRST 1 ROWS ONLY) ELSE NULL END:date_up_substatus",
      ],
      filter,
    },
    "sm_risks",
    useServiceManagerStore
  ).then((r) => {
    const risks = (r as ISmprimarySbriskm1[]).map((p) => p.p_number);
    getHpcauditsbriskm1(risks);
  });
};

export const getHpcauditsbriskm1 = (risk_audit: string[] = []) => {
  if (risk_audit.length) {
    let risks:
      | {
          "audit_rsk.p_id"?: `=:${string}`;
        }[]
      | undefined;
    if (risk_audit.length)
      risks = risk_audit.map((e) => ({
        "audit_rsk.p_id": `=:${e}`,
      }));
    r_get<string>(
      {
        from: [`${ESMPRIMARY.hpcauditsbriskm1}:audit_rsk`],
        fields: [
          "DISTINCT",
          "audit_rsk.p_id",
          "audit_rsk.p_new_simple_val",
          "audit_rsk.p_time",
        ],
        filter: {
          "audit_rsk.p_field": "=:Статус",
          risks,
        },
        sort: ["-audit_rsk.p_time"],
      },
      "sm_hpcauditsbriskm1",
      useServiceManagerStore
    );
  }
};
