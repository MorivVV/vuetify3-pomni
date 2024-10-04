import { dataApiComposition } from "@/compositionApi/dataApi";
import { EKNOWLEGEBASE, ESMPRIMARY, EJIRA } from "@/const/schemaEnums";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import {
  IJiraDefects,
  IJiraIssues,
  IJiraIssueService,
} from "@/types/database/schemas/jira";
import { ICreateTableFields } from "@/types/database/service";
import { restGetType } from "@/types/restApi";
import { filterSMGroup } from "./filterSMGroup";
import { restGet } from "@/types/restApi";
import {
  IKnowledgebaseWorkGroup,
  IKnowledgebaseWorkGroupEmployees,
} from "@/types/database/schemas/knowledgebase";
import {
  ISmprimaryAsCluster,
  ISmprimaryAssignmentb3,
  ISmprimaryClusters,
  ISmprimaryContctsm1,
} from "@/types/database/schemas/smprimary";

const { r_get } = dataApiComposition();

const full = (
  entity = "ci"
): restGet<
  | "string_agg(ci_name || ' (' || ci_id || ')',', ')"
  | ICreateTableFields<keyof IJiraIssueService, "iser">
> => {
  return {
    from: [`${EJIRA.issue_service}:iser`],
    filter: {
      "iser.key": "@@:i.key",
      "iser.itservice": `${entity === "it"}`,
    },
    fields: [`string_agg(ci_name || ' (' || ci_id || ')',', '):${entity}_full`],
  };
};

const idList = (
  entity = "ci"
): restGet<
  "string_agg(ci_id,',')" | ICreateTableFields<keyof IJiraIssueService, "iser">
> => {
  return {
    from: [`${EJIRA.issue_service}:iser`],
    filter: {
      "iser.key": "@@:i.key",
      "iser.itservice": `${entity === "it"}`,
    },
    fields: [`string_agg(ci_id,','):${entity}_id`],
  };
};

const groupCount: restGet<
  | "сntc.p_sb_sap_identification"
  | "@@:w.tab_num::character varying"
  | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "w">
> = {
  fields: ["count(w.kod_group):group"],
  from: [`${EKNOWLEGEBASE.work_group_employees}:w`],
  filter: {
    "сntc.p_sb_sap_identification": "@@:w.tab_num::character varying",
  },
};

const groupCountAssignee: restGet<
  | "wa.tab_num::character varying"
  | "сntc1.p_sb_sap_identification"
  | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wa">
> = {
  fields: ["count(wa.kod_group):assignee_group"],
  from: [`${EKNOWLEGEBASE.work_group_employees}:wa`],
  filter: {
    "сntc1.p_sb_sap_identification": "@@:wa.tab_num::character varying",
  },
};

const clusters = (
  what = "id"
): restGet<
  | ICreateTableFields<keyof ISmprimaryClusters, "c">
  | ICreateTableFields<keyof ISmprimaryAsCluster, "ac">
  | `string_agg(c.${string}::text,','):clusters_${string}`
> => {
  return {
    from: [`${ESMPRIMARY.clusters}:c`, `${ESMPRIMARY.as_cluster}:ac`],
    join: ["c.id=ac.kod_cluster"],
    fields: [`string_agg(c.${what}::text,','):clusters_${what}`],
    filter: {
      "ac.logical_name": "@@:any(string_to_array(def.it_id,','))",
    },
  };
};

export const defects: restGet<
  | ICreateTableFields<keyof IJiraDefects, "def">
  | ICreateTableFields<keyof IJiraIssues, "i">
> = {
  alias: "defs",
  from: [
    {
      alias: "def",
      from: [`${EJIRA.defects}:d`, `${EJIRA.issue}:i`],
      join: ["d.key=i.key", "d.segment=i.segment"],
      fields: [
        "d.*",
        "i.*",
        "regexp_replace(i.reporter_tabnum, '(^|-)0*', '', 'g'):rep_tab",
        "regexp_replace(i.assignee_tabnum, '(^|-)0*', '', 'g'):ass_tab",
        idList("ci") as restGet<any>,
        full("ci") as restGet<any>,
        idList("it") as restGet<any>,
        full("it") as restGet<any>,
      ],
      filter: {
        "i.issuetype": "Дефект",
      },
    } as restGet<any>,
  ],
  fields: ["def.*", clusters(), clusters("cluster_name") as restGet<any>],
};

export const getDefects = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getDefectsFilter(ciList, clusterList, groupList, smGroupList);

  r_get<
    | ICreateTableFields<keyof IJiraDefects, "defs">
    | ICreateTableFields<keyof ISmprimaryContctsm1, "сntc">
    | ICreateTableFields<keyof ISmprimaryContctsm1, "сntc1">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
    | ICreateTableFields<keyof ISmprimaryAssignmentb3, "a">
    | "coalesce(сntc.p_full_name, i.reporter_display_name)"
    | "coalesce(сntc1.p_full_name, i.assignee_display_name):assignee"
  >(
    {
      from: [
        defects as restGet<any>,
        `${ESMPRIMARY.contctsm1}:сntc1`,
        `${ESMPRIMARY.contctsm1}:сntc`,
        `${EKNOWLEGEBASE.work_group_employees}:wge`,
        `${EKNOWLEGEBASE.work_group}:wg`,
        `${ESMPRIMARY.assignmentb3}:a`,
      ],
      join: [
        "defs.rep_tab=(+)сntc.p_sb_sap_identification",
        "defs.ass_tab=(+)сntc1.p_sb_sap_identification",
        "defs.reporter_tabnum::int=(+)wge.tab_num::int",
        "wge.kod_group=(+)wg.id",
        "сntc.p_full_name=(+)a.p_hpc_assignees_name",
      ],
      sort: ["defs.created", "defs.known_in_prom_date"],
      fields: [
        "DISTINCT",
        "defs.*",
        "coalesce(сntc.p_full_name, defs.reporter_display_name):reporter",
        "coalesce(сntc1.p_full_name, defs.assignee_display_name):assignee",
        groupCount as restGet<any>,
        groupCountAssignee as restGet<any>,
      ],
      filter,
    },
    "defects",
    useServiceManagerStore
  );
};

export const getDefectsFilter = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter: restGetType<ICreateTableFields<keyof IJiraDefects, "defs">> = {
    "defs.status@1": "<>:Закрыт",
    "defs.status@2": "<>:Сделан",
  };
  if (ciList.length) {
    filter[
      `string_to_array(defs.ci_id,',')::text[]&&string_to_array('${ciList.join(
        ","
      )}',',')::text[]`
    ] = true;
  }

  if (clusterList.length) {
    filter[
      `string_to_array(defs.clusters_id,',')::text[]&&string_to_array('${clusterList.join(
        ","
      )}',',')::text[]`
    ] = true;
  }

  if (groupList.length) {
    filter["kod_group"] = groupList.map((e) => ({ "wg.kod_group": e }));
    filter["kod_group"] = filter["kod_group"].concat(
      groupList.map((e) => ({ "wg.id": e }))
    );
  }

  if (smGroupList.length) {
    filter["a.p_name"] = filterSMGroup(smGroupList) as any;
  }
  return filter;
};
