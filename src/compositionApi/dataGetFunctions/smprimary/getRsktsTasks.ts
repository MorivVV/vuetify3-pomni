import { dataApiComposition } from "@/compositionApi/dataApi";
import { EKNOWLEGEBASE, ESMPRIMARY } from "@/const/schemaEnums";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import {
  IKnowledgebaseWorkGroup,
  IKnowledgebaseWorkGroupEmployees,
} from "@/types/database/schemas/knowledgebase";
import {
  ISmprimaryAsCluster,
  ISmprimaryCiFullhierarchy,
  ISmprimaryContctsm1,
  ISmprimarySbrisktaskm1,
} from "@/types/database/schemas/smprimary";
import { ICreateTableFields } from "@/types/database/service";
import { restGetType } from "@/types/restApi";
import { filterSMGroup } from "./filterSMGroup";
const { r_get } = dataApiComposition();

export const getRsktsTasksFilters = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
): restGetType<ICreateTableFields<keyof ISmprimarySbrisktaskm1, "rskt">> => {
  const filter: restGetType<
    ICreateTableFields<keyof ISmprimarySbrisktaskm1, "rskt">
  > = {
    "rskt.p_sb_rsk_local_coordinator_name": "=:Рыбакин Н. Л. (588087)",
    "rskt.p_status@1": "<>:4 Выполнено",
    "rskt.p_status@2": "<>:5 Отклонено",
    "rskt.p_status@3": "<>:6 Закрыто",
  };

  if (ciList.length) {
    filter["rskt.p_sb_service"] = ciList.map((e) => ({
      "rskt.p_sb_service": `=:${e}`,
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
    filter["rskt.p_assignment"] = filterSMGroup(smGroupList) as any;
  }
  return filter;
};
export const getRsktsTasks = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getRsktsTasksFilters(
    ciList,
    clusterList,
    groupList,
    smGroupList
  );
  return r_get<
    | string
    | "p_affected_item"
    | "kod_cluster"
    | "kod_group"
    | ICreateTableFields<keyof ISmprimaryCiFullhierarchy, "cf">
    | ICreateTableFields<keyof ISmprimarySbrisktaskm1, "rskt">
    | ICreateTableFields<keyof ISmprimaryAsCluster, "ci">
    | ICreateTableFields<keyof ISmprimaryContctsm1, "c">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
  >(
    {
      from: [
        `${ESMPRIMARY.ci_fullhierarchy}:cf`,
        `${ESMPRIMARY.sbrisktaskm1}:rskt`,
        `${ESMPRIMARY.as_cluster}:ci`,
        `${ESMPRIMARY.contctsm1}:c`,
        `${EKNOWLEGEBASE.work_group_employees}:wge`,
        `${EKNOWLEGEBASE.work_group}:wg`,
      ],
      join: [
        "cf.p_id=rskt.p_ci_stand(+)",
        "rskt.p_sb_service=ci.logical_name",
        "rskt.p_assignee_name=(+)c.p_full_name",
        "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
        "wge.kod_group=(+)wg.id",
      ],
      fields: [
        "DISTINCT",
        "rskt.p_number",
        "rskt.p_status",
        "CASE WHEN strpos(rskt.p_description, '#Vulns') > 0 THEN 1 ELSE 0 END:vulns",
        "CASE WHEN strpos(rskt.p_description, '#КБ') > 0 THEN 1 ELSE 0 END:kb",
        "CASE WHEN rskt.p_ci_stand is not null THEN concat(concat(rskt.p_ci_stand, ' '), cf.p_typee) ELSE 'Не указано' END:stand",
        "rskt.p_sb_service_name",
        "rskt.p_assignee_name",
        "rskt.p_assignment_name",
        "rskt.p_open_time",
        "rskt.p_plan_finish",
        "rskt.p_hpc_next_breach",
        "rskt.p_description", //для указания условий подсветки полей - иначе подстветка не работает
        "rskt.p_action", //вывод ИНФО в мониторинге
        "CASE WHEN (rskt.p_plan_finish is null or rskt.p_plan_finish > rskt.p_hpc_next_breach or rskt.p_sla_breach = 't') THEN 'Нарушение КПЭ есть' ELSE 'Нарушения КПЭ нет' END:breach_plan_time_work",
      ],
      filter,
    },
    "sm_risks_tasks",
    useServiceManagerStore
  );
};
