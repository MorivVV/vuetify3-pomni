import { dataApiComposition } from "@/compositionApi/dataApi";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import { EKNOWLEGEBASE, ESMPRIMARY } from "@/const/schemaEnums";
import {
  ISmprimaryAsCluster,
  ISmprimaryContctsm1,
  ISmprimaryRootcausem1,
  ISmprimaryRootcsetsksm1,
} from "@/types/database/schemas/smprimary";
import { ICreateTableFields } from "@/types/database/service";
import {
  IKnowledgebaseWorkGroup,
  IKnowledgebaseWorkGroupEmployees,
} from "@/types/database/schemas/knowledgebase";
import { restGet, restGetType } from "@/types/restApi";
import { filterSMGroup } from "./filterSMGroup";

const { r_get, r_state } = dataApiComposition();

const zppFilter = {
  "pt.p_sb_rc_local_coordinator_name": "=:Рыбакин Н. Л. (588087)",
  "pt.p_hpc_status": [
    { "pt.p_hpc_status": "=:1 Назначено" },
    { "pt.p_hpc_status": "=:2 В работе" },
  ],
  "pt.p_sb_autopilot": [
    {
      "pt.p_sb_autopilot": "=:null",
    },
    {
      "pt.p_sb_autopilot": "<>:true",
    },
  ],
};

const zpp_count: restGet<
  ICreateTableFields<keyof ISmprimaryRootcsetsksm1, "pt">
> = {
  fields: ["count(1):zpp_count"],
  from: [`${ESMPRIMARY.rootcsetsksm1}:pt`],
  filter: {
    "pt.p_parent_problem": "@@=:p.p_id",
    ...zppFilter,
  },
};

export const getProblems = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getProblemFilters(ciList, clusterList, groupList, smGroupList);
  r_get<
    | string
    | ICreateTableFields<keyof ISmprimaryRootcausem1, "p">
    | ICreateTableFields<keyof ISmprimaryAsCluster, "ci">
    | ICreateTableFields<keyof ISmprimaryContctsm1, "c">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
  >({
    from: [
      `${ESMPRIMARY.rootcausem1}:p`,
      `${ESMPRIMARY.as_cluster}:ci`,
      `${ESMPRIMARY.contctsm1}:c`,
      `${EKNOWLEGEBASE.work_group_employees}:wge`,
      `${EKNOWLEGEBASE.work_group}:wg`,
    ],
    join: [
      "p.p_sb_affected_item=ci.logical_name",
      "p.p_hpc_assignee_name=(+)c.p_full_name",
      "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
      "wge.kod_group=(+)wg.id",
    ],
    fields: [
      "DISTINCT",
      "p.p_id",
      "p.p_hpc_status",
      "p.p_priority_code",
      "p.p_hpc_contact_name_name",
      "p.p_sb_affected_item_name",
      "p.p_hpc_assignee_name",
      "p.p_sb_assignment_name",
      "p.p_open_time",
      "p.p_hpc_next_breach",
      "p.p_brief_description",
      "p.p_description",
      "p.p_solve_next_breach",
      "p.p_monitoring_to",
      zpp_count as restGet<any>,
    ],
    sort: ["p_hpc_next_breach", "p_solve_next_breach", "p_monitoring_to"],
    filter,
  }).then((r) => {
    const problems = (r as ISmprimaryRootcausem1[]).map((p) => p.p_id);

    r_state(useServiceManagerStore, "sm_problems", r);
    getHpcauditrootcausem1(problems);
  });
};

export const getProblemFilters = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
): restGetType<ICreateTableFields<keyof ISmprimaryRootcausem1, "p">> => {
  const filter: restGetType<
    ICreateTableFields<keyof ISmprimaryRootcausem1, "p">
  > = {
    "p.p_sb_local_coordinator_name": "=:Рыбакин Н. Л. (588087)",
    "p.p_hpc_status@1": "<>:6 Решена",
    "p.p_hpc_status@2": "<>:7 Закрыта",
    "p.p_sb_autopilot@1": "=:false",
  };

  if (ciList.length) {
    filter["p.p_sb_affected_item"] = ciList.map((e) => ({
      "p.p_sb_affected_item": `=:${e}`,
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
    filter["p.p_assignment"] = filterSMGroup(smGroupList) as any;
  }

  return filter;
};

export const getProblemsTasks = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getProblemsTaskFilters(
    ciList,
    clusterList,
    groupList,
    smGroupList
  );
  r_get<
    | string
    | ICreateTableFields<keyof ISmprimaryRootcsetsksm1, "pt">
    | ICreateTableFields<keyof ISmprimaryAsCluster, "ci">
    | ICreateTableFields<keyof ISmprimaryContctsm1, "c">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
  >(
    {
      from: [
        `${ESMPRIMARY.rootcsetsksm1}:pt`,
        `${ESMPRIMARY.as_cluster}:ci`,
        `${ESMPRIMARY.contctsm1}:c`,
        `${EKNOWLEGEBASE.work_group_employees}:wge`,
        `${EKNOWLEGEBASE.work_group}:wg`,
      ],
      join: [
        "pt.p_sb_service=ci.logical_name",
        "pt.p_hpc_assignee_name=(+)c.p_full_name",
        "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
        "wge.kod_group=(+)wg.id",
      ],
      fields: [
        "DISTINCT",
        "pt.p_id",
        "pt.p_hpc_status",
        "pt.p_open_time",
        "pt.p_subcategory",
        "pt.p_sb_teg",
        "pt.p_hpc_contact_name_name",
        "pt.p_sb_service_name",
        "pt.p_hpc_assignee_name",
        "pt.p_sb_assignment_name",
        "pt.p_hpc_next_breach",
        "pt.p_brief_description",
        "pt.p_description",
        "pt.p_parent_problem",
        "pt.p_sb_plan_finish",
        "pt.p_sb_high_priority_inc_control",
      ],
      sort: ["pt.p_hpc_next_breach"],
      filter,
    },
    "sm_problems_tasks",
    useServiceManagerStore
  );
};

export const getProblemsTaskFilters = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
): restGetType<ICreateTableFields<keyof ISmprimaryRootcsetsksm1, "pt">> => {
  const filter: restGetType<
    ICreateTableFields<keyof ISmprimaryRootcsetsksm1, "pt">
  > = zppFilter;

  if (ciList.length) {
    filter["pt.p_sb_service"] = ciList.map((e) => ({
      "pt.p_sb_service": `=:${e}`,
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
    filter["pt.p_assignment"] = filterSMGroup(smGroupList) as any;
  }

  return filter;
};

export const getHpcauditrootcausem1 = (problems_ids: string[] = []) => {
  if (problems_ids.length) {
    let problems:
      | {
          "au.p_id"?: `=:${string}`;
        }[]
      | undefined;
    if (problems_ids.length) {
      problems = problems_ids.map((e) => ({
        "au.p_id": `=:${e}`,
      }));
    }
    r_get<string>(
      {
        from: [`${ESMPRIMARY.hpcauditrootcausem1}:au`],
        fields: ["DISTINCT", "au.p_time", "au.p_id", "au.p_new_simple_val"],
        filter: {
          "au.p_field": "=:Статус",
          problems,
        },
        sort: ["-au.p_time"],
      },
      "sm_hpcauditrootcausem1",
      useServiceManagerStore
    );
  }
};
