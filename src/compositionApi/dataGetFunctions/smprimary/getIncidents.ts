import { dataApiComposition } from "@/compositionApi/dataApi";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import {
  IKnowledgebaseWorkGroup,
  IKnowledgebaseWorkGroupEmployees,
} from "@/types/database/schemas/knowledgebase";
import {
  ISmprimaryAsCluster,
  ISmprimaryContctsm1,
  ISmprimaryProbsummarym1,
  ISmprimaryScrelationm1,
  ISmprimaryHpcauditprobsummarym1,
  ISmprimarySbjiraissuem1,
  ISmprimaryRootcausem1,
  ISmprimarySbimcausem1,
  ISmprimarySbreferencea7,
} from "@/types/database/schemas/smprimary";
import { ICreateTableFields } from "@/types/database/service";
import { restGet, restGetType } from "@/types/restApi";
import { filterSMGroup } from "./filterSMGroup";
const { r_get } = dataApiComposition();

export const getIncidentFilters = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = [],
  statusList: string[] = [
    "1 Зарегистрирован",
    "2 Назначен",
    "3 В работе",
    "4 Ожидание",
    "5 Выполнен",
    "6 Закрыт",
  ]
): restGetType<ICreateTableFields<keyof ISmprimaryProbsummarym1, "im">> => {
  const filter: restGetType<
    ICreateTableFields<keyof ISmprimaryProbsummarym1, "im">
  > = {};
  filter["im.p_hpc_status"] = statusList.map((s) => ({
    [`im.p_hpc_status`]: `=:${s}`,
  }));

  if (ciList.length) {
    filter["im.p_affected_item"] = ciList.map((e) => ({
      "im.p_affected_item": `=:${e}`,
    }));
  }

  if (clusterList.length) {
    filter["kod_cluster"] = clusterList.map((e) => ({
      "ci.kod_cluster": `=:${e}`,
    }));
  }

  if (groupList.length) {
    filter["kod_group"] = groupList.map((e) => ({ "wg.kod_group": `=:${e}` }));
    filter["kod_group"] = filter["kod_group"].concat(
      groupList.map((e) => ({ "wg.id": `=:${e}` }))
    );
  }
  if (smGroupList.length) {
    filter["im.p_hpc_assignment"] = filterSMGroup(smGroupList) as any;
  }

  return filter;
};
const ignore_kpi_loss: restGet<
  | "string_agg(ignore_kpi_loss,'/')"
  | "CASE WHEN a7.p_ignore_kpi_loss THEN 'Да' ELSE 'Нет' END:ignore_kpi_loss"
  | ICreateTableFields<keyof ISmprimarySbreferencea7, "a7">
> = {
  fields: ["string_agg(ignore_kpi_loss,'/'):ignore_kpi_loss"],
  from: [
    {
      fields: [
        "DISTINCT",
        "CASE WHEN a7.p_ignore_kpi_loss THEN 'Да' ELSE 'Нет' END:ignore_kpi_loss",
      ],
      from: ["smprimary.sbreferencea7:a7"],
      filter: {
        "a7.p_id": "@@:im.p_number",
      },
    },
  ],
};
const relType: restGet<ICreateTableFields<keyof ISmprimaryScrelationm1, "r">> =
  {
    fields: ["string_agg(substring(r.p_type,1, 1),'/'):relation"],
    from: [
      {
        alias: "r",
        fields: ["DISTINCT", "r.p_type"],
        from: ["smprimary.screlationm1:r"],
        filter: {
          "r.p_type": [
            { "r.p_type": "=:Следствие" },
            { "r.p_type": "=:Причина" },
            { "r.p_type": "=:Дубль" },
            { "r.p_type": "=:Мастер" },
          ],
          "r.p_depend": "@@:im.p_number",
        },
        sort: ["r.p_type"],
      },
    ],
  };

export const getIncidents = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getIncidentFilters(
    ciList,
    clusterList,
    groupList,
    smGroupList,
    ["2 Назначен", "3 В работе", "4 Ожидание"]
  );
  return r_get<
    | "p_affected_item"
    | "kod_cluster"
    | "kod_group"
    | "im.p_hpc_next_breach - now()"
    | "wge.tab_num::character varying"
    | ICreateTableFields<keyof ISmprimaryProbsummarym1, "im">
    | ICreateTableFields<keyof ISmprimaryContctsm1, "c">
    | ICreateTableFields<keyof ISmprimaryAsCluster, "ci">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
  >(
    {
      fields: [
        "im.p_number",
        "im.p_hpc_status",
        "im.p_priority_code",
        "im.p_hpc_contact_name_name",
        "im.p_hpc_affected_item_name",
        "im.p_hpc_is_mass",
        "im.p_brief_description",
        "im.p_action",
        "im.p_hot_tic",
        "im.p_hpc_assignment_name",
        "im.p_hpc_next_breach",
        "im.p_hpc_next_breach - now():expire",
        "im.p_hpc_assignee_name",
        "im.p_first_time_fix",
        "im.p_sb_root_incident",
        "im.date_update",
        "im.date_add",
        relType as restGet<any>,
      ],
      from: [
        "smprimary.probsummarym1:im",
        "smprimary.as_cluster:ci",
        "smprimary.contctsm1:c",
        "work_group_employees:wge",
        "work_group:wg",
      ],
      join: [
        "im.p_affected_item=ci.logical_name",
        "im.p_hpc_assignee_name=(+)c.p_full_name",
        "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
        "wge.kod_group=(+)wg.id",
      ],
      filter,
      sort: ["im.p_hpc_next_breach"],
    },
    "sm_incidents",
    useServiceManagerStore
  );
};
export const getIncidentsDone = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getIncidentFilters(
    ciList,
    clusterList,
    groupList,
    smGroupList,
    ["5 Выполнен"]
  );
  const jira: restGet<
    | ICreateTableFields<keyof ISmprimaryRootcausem1, "p">
    | ICreateTableFields<keyof ISmprimarySbjiraissuem1, "j">
  > = {
    fields: ["string_agg(j.p_jira_issue_key,'; '):jira"],
    from: ["smprimary.sbjiraissuem1:j", "smprimary.rootcausem1:p"],
    join: ["j.p_parent_id=p.p_id"],
    filter: {
      "p.p_sb_incident_number": "@@=:im.p_number",
    },
  };
  const causeName: restGet<
    ICreateTableFields<keyof ISmprimarySbimcausem1, "bc">
  > = {
    fields: ["bc.p_name:p_hpc_cause_name"],
    from: ["smprimary.sbimcausem1:bc"],
    filter: {
      "bc.p_number": "@@:im.p_hpc_cause",
    },
  };
  const relation: restGet<
    ICreateTableFields<keyof ISmprimaryScrelationm1, "r">
  > = {
    fields: ["string_agg(r.p_source,', '):relation"],
    from: [
      {
        alias: "r",
        fields: ["DISTINCT", "r.p_source"],
        from: ["smprimary.screlationm1:r"],
        filter: {
          "r.p_depend": "@@:im.p_number",
        },
        sort: ["r.p_source"],
      },
    ],
  };
  return r_get<
    | "p_affected_item"
    | "to_char(im.p_open_time,'YYYYMMDD')"
    | "kod_cluster"
    | "kod_group"
    | "im.p_hpc_next_breach - now()"
    | "wge.tab_num::character varying"
    | ICreateTableFields<keyof ISmprimaryProbsummarym1, "im">
    | ICreateTableFields<keyof ISmprimaryContctsm1, "c">
    | ICreateTableFields<keyof ISmprimaryAsCluster, "ci">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
  >(
    {
      fields: [
        "im.p_number",
        "im.p_hpc_status",
        "im.p_priority_code",
        "im.p_hpc_contact_name_name",
        "im.p_hpc_affected_item_name",
        "im.p_sb_actual_time_fail_start",
        "im.p_sb_actual_time_fail_end",
        "im.p_open_time",
        "im.p_hpc_is_mass",
        "im.p_hot_tic",
        "im.p_kpi_value",
        "im.p_hpc_assignment_name",
        "im.p_hpc_next_breach",
        "im.p_hpc_next_breach - now():expire",
        "im.p_hpc_assignee_name",
        "im.p_first_time_fix",
        "im.p_sb_root_incident",
        "im.p_resolution",
        "im.p_resolution_code",
        "im.p_hpc_cause",
        "im.date_update",
        "im.date_add",
        jira as restGet<any>,
        causeName as restGet<any>,
        relation as restGet<any>,
        ignore_kpi_loss as restGet<any>,
      ],
      from: [
        "smprimary.probsummarym1:im",
        "smprimary.as_cluster:ci",
        "smprimary.contctsm1:c",
        "work_group_employees:wge",
        "work_group:wg",
      ],
      join: [
        "im.p_affected_item=ci.logical_name",
        "im.p_hpc_assignee_name=(+)c.p_full_name",
        "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
        "wge.kod_group=(+)wg.id",
      ],
      filter: {
        ...filter,
        "im.p_resolution_code": "<>:Перекатегоризация",
      },
      sort: ["-to_char(im.p_open_time,'YYYYMMDD')", "im.p_priority_code"],
    },
    "sm_incidents",
    useServiceManagerStore
  );
};

/**
 * получение закрытых инцидентов
 */
export const getIncidentsClose = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getIncidentFilters(
    ciList,
    clusterList,
    groupList,
    smGroupList,
    ["6 Закрыт"]
  );
  const audit: restGet<
    ICreateTableFields<keyof ISmprimaryHpcauditprobsummarym1, "a">
  > = {
    fields: [
      "a.p_time",
      "a.p_field",
      "a.p_new_simple_val",
      "a.p_old_simple_val",
    ],
    from: ["smprimary.hpcauditprobsummarym1:a"],
    sort: ["a.p_time"],
    filter: {
      "a.p_id": "@@:im.p_number",
      "a.p_time": "@@>:im.close",
      "a.p_name_of_field": [
        { "a.p_name_of_field": "=:hot.tic" },
        { "a.p_name_of_field": "=:hpc.is.mass" },
        { "a.p_name_of_field": "=:sb.root.incident" },
        { "a.p_name_of_field": "=:Связь" },
        { "a.p_name_of_field": "=:KPI.value" },
      ],
    },
  };

  const audit2: restGet<
    ICreateTableFields<keyof ISmprimaryHpcauditprobsummarym1, "a2">
  > = {
    alias: "a2",
    fields: ["min(a2.p_time):close"],
    from: ["smprimary.hpcauditprobsummarym1:a2"],
    filter: {
      "a2.p_id": "@@:im.p_number",
      "a2.p_name_of_field": "=:hpc.status",
      "a2.p_new_simple_val": "=:6 Закрыт",
    },
  };

  return r_get<
    | "to_char(im.p_open_time,'YYYYMMDD')"
    | "p_affected_item"
    | "now()-interval'3 month'"
    | "kod_cluster"
    | "kod_group"
    | "im.close"
    | "im.p_hpc_next_breach - now()"
    | "wge.tab_num::character varying"
    | ICreateTableFields<keyof ISmprimaryProbsummarym1, "im">
    | ICreateTableFields<keyof ISmprimaryContctsm1, "c">
    | ICreateTableFields<keyof ISmprimaryAsCluster, "ci">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
  >(
    {
      fields: [
        "im.p_number",
        "im.p_hpc_status",
        "im.p_priority_code",
        "im.p_hpc_contact_name_name",
        "im.p_hpc_affected_item_name",
        "im.p_hpc_is_mass",
        "im.p_hot_tic",
        "im.p_hpc_assignment_name",
        "im.p_hpc_next_breach",
        "im.p_hpc_next_breach - now():expire",
        "im.p_hpc_assignee_name",
        "im.p_first_time_fix",
        "im.p_sb_root_incident",
        "im.date_update",
        "im.date_add",
        "im.p_close_time",
        "im.p_open_time",
        "im.close",
        {
          fields: [
            "string_agg(concat(p_time,';',p_field,';',p_new_simple_val,';',p_old_simple_val),',\n '):changed",
          ],
          from: [audit as restGet<any>],
        },
        relType as restGet<any>,
      ],
      from: [
        {
          alias: "im",
          fields: [
            "im.p_number",
            "im.p_hpc_status",
            "im.p_priority_code",
            "im.p_hpc_contact_name_name",
            "im.p_open_time",
            "im.p_affected_item",
            "im.p_hpc_affected_item_name",
            "im.p_hpc_is_mass",
            "im.p_hot_tic",
            "im.p_hpc_assignment_name",
            "im.p_hpc_next_breach",
            "im.p_hpc_assignee_name",
            "im.p_first_time_fix",
            "im.p_sb_root_incident",
            "im.date_update",
            "im.date_add",
            "im.p_close_time",
            audit2 as restGet<any>,
            ignore_kpi_loss as restGet<any>,
          ],
          from: ["smprimary.probsummarym1:im"],
        },
        "smprimary.as_cluster:ci",
        "smprimary.contctsm1:c",
        "work_group_employees:wge",
        "work_group:wg",
      ],
      join: [
        "im.p_affected_item=ci.logical_name",
        "im.p_hpc_assignee_name=(+)c.p_full_name",
        "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
        "wge.kod_group=(+)wg.id",
      ],
      filter: {
        ...filter,
        "im.p_close_time": "@@>=:now()-interval'3 month'",
        EXISTS: audit as restGet<any>,
      },
      sort: ["-to_char(im.p_open_time,'YYYYMMDD')", "im.p_priority_code"],
    },
    "sm_incidents",
    useServiceManagerStore
  );
};
