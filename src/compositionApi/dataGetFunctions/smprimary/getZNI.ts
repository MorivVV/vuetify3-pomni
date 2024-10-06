import { dataApiComposition } from "@/compositionApi/dataApi";
import { EKNOWLEGEBASE, ESMPRIMARY } from "@/const/schemaEnums";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import {
  IKnowledgebaseWorkGroup,
  IKnowledgebaseWorkGroupEmployees,
} from "@/types/database/schemas/knowledgebase";
import {
  ISmprimaryCm3rm1,
  ISmprimaryCm3rm2,
  ISmprimarySbapprovalm1,
} from "@/types/database/schemas/smprimary";
import { ICreateTableFields } from "@/types/database/service";
import { restGet, restGetType } from "@/types/restApi";
import { filterSMGroup } from "./filterSMGroup";
const { r_get } = dataApiComposition();
export type ISmZNI = Pick<
  ISmprimaryCm3rm1,
  "p_number" | "p_orig_date_entered"
> & {
  model_zni: string;
  object: string;
  coordinator: string;
  infrastructure_implementation: string;
  status: string;
  brief_description: string;
  group_coordinators: string;
  impact: string;
  risk: string;
  stage_work_approval: string;
  plan_finish: string;
  ks: string;
};
export const getZNIFilters = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
): restGetType<ICreateTableFields<keyof ISmprimaryCm3rm1, "zni">> => {
  const filter: restGetType<ICreateTableFields<keyof ISmprimaryCm3rm1, "zni">> =
    {
      "zni.p_hpc_status@1": "<>:7 Закрыто",
      "zni.p_hpc_status@2": "<>:1 Инициация",
      "zni.p_hpc_tpl_name": "<>:ЗНИ Аварийных учений",
    };

  if (ciList.length) {
    filter["zni.p_affected_item"] = ciList.map((e) => ({
      "zni.p_affected_item": `=:${e}`,
    }));
  }

  if (clusterList.length) {
    filter.kod_cluster = clusterList.map((e) => ({ "ci.kod_cluster": e }));
  }

  if (groupList.length) {
    filter.kod_group = groupList.map((e) => ({ "wg.kod_group": e }));
    filter.kod_group = filter.kod_group.concat(
      groupList.map((e) => ({ "wg.id": e }))
    );
  }

  if (smGroupList.length) {
    filter["zni.p_assign_dept"] = filterSMGroup(smGroupList) as any;
  }
  return filter;
};
export const getZNI = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getZNIFilters(ciList, clusterList, groupList, smGroupList);

  const stage_work_approval: restGet<
    ICreateTableFields<keyof ISmprimarySbapprovalm1, "sogl">
  > = {
    fields: ["string_agg(sogl.p_assignee_name, ', '):stage_work_approval"],
    from: [`${ESMPRIMARY.sbapprovalm1}:sogl`],
    filter: {
      "sogl.p_status": "=:На согласовании",
      "sogl.p_parent_id": "@@=:zni.p_number",
    },
  };

  return r_get<
    | string
    | "p_affected_item"
    | "kod_cluster"
    | "kod_group"
    | ICreateTableFields<keyof ISmprimarySbapprovalm1, "sogl">
    | ICreateTableFields<keyof ISmprimaryCm3rm1, "zni">
    | ICreateTableFields<keyof ISmprimaryCm3rm2, "zni_risk">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
  >(
    {
      fields: [
        "DISTINCT",
        "zni.p_number",
        "zni.p_orig_date_entered",
        "zni.p_hpc_tpl_name:model_zni",
        "CASE WHEN zni.p_hpc_tpl_name = 'Внедрение инфраструктуры' THEN 'Да' ELSE '' END:infrastructure_implementation",
        "zni.p_hpc_status:status",
        "zni.p_hpc_affected_item_name:object",
        "zni.p_brief_description:brief_description",
        "zni.p_hpc_assignee_name:coordinator",
        "zni.p_hpc_assign_dept_name:group_coordinators",
        "zni.p_initial_impact:impact",
        "zni_risk.p_sb_risk:risk",
        stage_work_approval as restGet<any>,
        // "string_agg(sogl.p_assignee_name, ', '):stage_work_approval",
        // "CASE WHEN sogl.p_status = 'Согласовано' THEN concat('Согласовано: ', listagg(sogl.p_assignee_name, ', ')) WHEN sogl.p_status = 'На согласовании' THEN concat('На согласовании: ', listagg(sogl.p_assignee_name, ', ')) WHEN sogl.p_status = 'Отклонено' THEN concat('Отклонено: ', listagg(sogl.p_assignee_name, ', ')) WHEN sogl.p_status = 'Отозвано' THEN concat('Отозвано: ', listagg(sogl.p_assignee_name, ', ')) WHEN sogl.p_status = 'Отменено' THEN concat('Отменено: ', listagg(sogl.p_assignee_name, ', ')) WHEN sogl.p_status = 'Зарегистрировано' THEN concat('Зарегистрировано: ', listagg(sogl.p_assignee_name, ', ')) ELSE '' END:stage_work_approval",
        "zni.p_planned_start:plan_start",
        "zni.p_planned_end:plan_finish",
        "zni.p_hpc_next_breach:ks",
      ],
      from: [
        // `${ESMPRIMARY.sbapprovalm1}:sogl`,
        `${ESMPRIMARY.cm3rm1}:zni`,
        `${ESMPRIMARY.cm3rm2}:zni_risk`,
        `${ESMPRIMARY.as_cluster}:ci`,
        `${ESMPRIMARY.contctsm1}:c`,
        `${EKNOWLEGEBASE.work_group_employees}:wge`,
        `${EKNOWLEGEBASE.work_group}:wg`,
      ],
      join: [
        // "zni.p_number=(+)sogl.p_parent_id", //должен быть inner join "zni.p_number=(+)sogl.p_parent_id",
        // "zni.p_number=sogl.p_parent_id(+)",
        "zni.p_affected_item=ci.logical_name",
        "zni.p_number=(+)zni_risk.p_number",
        "zni.p_hpc_assignee_name=(+)c.p_full_name",
        "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
        "wge.kod_group=(+)wg.id",
      ],
      sort: ["zni.p_planned_start"],
      group: [
        "zni.p_number",
        "zni.p_orig_date_entered",
        "zni.p_hpc_tpl_name",
        // "CASE WHEN zni.p_hpc_tpl_name = 'Внедрение инфраструктуры' THEN 'Да' ELSE '' END",
        "zni.p_hpc_status",
        "zni.p_hpc_affected_item_name",
        "zni.p_brief_description",
        "zni.p_hpc_assignee_name",
        "zni.p_hpc_assign_dept_name",
        "zni.p_initial_impact",
        "zni_risk.p_sb_risk",
        "zni.p_planned_start",
        "zni.p_planned_end",
        "zni.p_hpc_next_breach",
      ],
      filter,
    },
    "sm_zni",
    useServiceManagerStore
  );
};
