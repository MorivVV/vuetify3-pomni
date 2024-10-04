import { dataApiComposition } from "@/compositionApi/dataApi";
import { ESMPRIMARY, EKNOWLEGEBASE } from "@/const/schemaEnums";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import {
  IKnowledgebaseWorkGroup,
  IKnowledgebaseWorkGroupEmployees,
} from "@/types/database/schemas/knowledgebase";
import {
  ISmprimaryAsCluster,
  ISmprimaryContctsm1,
  ISmprimarySbrequestm1,
  ISmprimarySbrequesttaskm1,
} from "@/types/database/schemas/smprimary";
import { ICreateTableFields } from "@/types/database/service";
import { restGet, restGetType } from "@/types/restApi";
import { filterSMGroup } from "./filterSMGroup";

const { r_get } = dataApiComposition();

const znr_count: restGet<
  ICreateTableFields<keyof ISmprimarySbrequesttaskm1, "znr">
> = {
  fields: ["count(1):znr_count"],
  from: [`${ESMPRIMARY.sbrequesttaskm1}:znr`],
  filter: {
    "znr.p_status": "<>:Выполнена",
    "znr.p_parent_id": "@@=:zno.p_number",
  },
};

export const getZNO = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getZNOFilter(ciList, clusterList, groupList, smGroupList);
  r_get<
    | "wge.tab_num::character varying"
    | ICreateTableFields<keyof ISmprimarySbrequestm1, "zno">
    | ICreateTableFields<keyof ISmprimaryAsCluster, "ci">
    | ICreateTableFields<keyof ISmprimaryContctsm1, "c">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
  >(
    {
      from: [
        `${ESMPRIMARY.sbrequestm1}:zno`,
        `${ESMPRIMARY.as_cluster}:ci`,
        `${ESMPRIMARY.contctsm1}:c`,
        `${EKNOWLEGEBASE.work_group_employees}:wge`,
        `${EKNOWLEGEBASE.work_group}:wg`,
      ],
      join: [
        "zno.p_affected_item=ci.logical_name",
        "zno.p_assignee_name=(+)c.p_full_name",
        "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
        "wge.kod_group=(+)wg.id",
      ],
      fields: [
        "DISTINCT",
        "zno.p_number",
        "zno.p_status",
        "zno.p_title",
        "zno.p_open_time",
        "zno.p_description",
        "zno.p_affected_item_name",
        "zno.p_assignee_name",
        "zno.p_assignment_name",
        "zno.p_hpc_next_breach",
        "zno.p_priority_code",
        znr_count as restGet<any>,
      ],
      sort: ["zno.p_hpc_next_breach", "zno.p_assignee_name"],
      filter,
    },
    "sm_zno",
    useServiceManagerStore
  );
};

const getZNOFilter = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
): restGetType<ICreateTableFields<keyof ISmprimarySbrequestm1, "zno">> => {
  const filter: restGetType<
    ICreateTableFields<keyof ISmprimarySbrequestm1, "zno">
  > = {
    "zno.p_status@1": "<>:Закрыт",
    "zno.p_status@2": "<>:Выполнен",
    "zno.p_assignment_name": "<>:Автоисполнение",
  };

  if (ciList.length) {
    filter["zno.p_affected_item"] = ciList.map((e) => ({
      "zno.p_affected_item": `=:${e}`,
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
    filter["zno.p_assignment"] = filterSMGroup(smGroupList) as any;
  }

  return filter;
};

export const getZNR = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getZNRFilter(ciList, clusterList, groupList, smGroupList);
  r_get<
    | "wge.tab_num::character varying"
    | ICreateTableFields<keyof ISmprimarySbrequesttaskm1, "znr">
    | ICreateTableFields<keyof ISmprimaryAsCluster, "ci">
    | ICreateTableFields<keyof ISmprimaryContctsm1, "c">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
  >(
    {
      from: [
        `${ESMPRIMARY.sbrequesttaskm1}:znr`,
        `${ESMPRIMARY.as_cluster}:ci`,
        `${ESMPRIMARY.contctsm1}:c`,
        `${EKNOWLEGEBASE.work_group_employees}:wge`,
        `${EKNOWLEGEBASE.work_group}:wg`,
      ],
      join: [
        "znr.p_affected_item=ci.logical_name",
        "znr.p_assignee_name=(+)c.p_full_name",
        "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
        "wge.kod_group=(+)wg.id",
      ],
      fields: [
        "DISTINCT",
        "znr.p_number",
        "znr.p_status",
        "znr.p_title",
        "znr.p_open_time",
        "znr.p_description",
        "znr.p_title",
        "znr.p_affected_item_name",
        "znr.p_assignee_name",
        "znr.p_assignment_name",
        "znr.p_hpc_next_breach",
        "znr.p_parent_id",
      ],
      sort: ["znr.p_hpc_next_breach", "znr.p_assignee_name"],
      filter,
    },
    "sm_znr",
    useServiceManagerStore
  );
};

const getZNRFilter = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
): restGetType<ICreateTableFields<keyof ISmprimarySbrequesttaskm1, "znr">> => {
  const filter: restGetType<
    ICreateTableFields<keyof ISmprimarySbrequesttaskm1, "znr">
  > = {
    "znr.p_status": "<>:Выполнена",
    "znr.p_assignment_name": "<>:Автоисполнение",
  };

  if (ciList.length) {
    filter["znr.p_affected_item"] = ciList.map((e) => ({
      "znr.p_affected_item": `=:${e}`,
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
    filter["znr.p_assignment"] = filterSMGroup(smGroupList) as any;
  }

  return filter;
};
