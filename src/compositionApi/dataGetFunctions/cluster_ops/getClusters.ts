import { dataApiComposition } from "@/compositionApi/dataApi";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import {
  IKnowledgebaseWorkGroup,
  IKnowledgebaseWorkGroupEmployees,
} from "@/types/database/schemas/knowledgebase";
import {
  ISmprimaryAsCluster,
  ISmprimaryAssignmentm1,
  ISmprimaryClusters,
  ISmprimaryDevice2m1,
} from "@/types/database/schemas/smprimary";
import { ICreateTableFields } from "@/types/database/service";
const { r_get } = dataApiComposition();

export const getClusters = () =>
  r_get<
    | ICreateTableFields<keyof ISmprimaryClusters, "c">
    | ICreateTableFields<keyof ISmprimaryAsCluster, "ac">
  >(
    {
      from: ["smprimary.clusters:c"],
      fields: [
        "c.id",
        "c.cluster_name",
        "c.date_add",
        "c.kod_user",
        "c.date_update",
        "c.service_dezh",
        {
          fields: ["count(1):count_ac"],
          from: ["smprimary.as_cluster:ac"],
          filter: { "ac.kod_cluster": "@@:c.id" },
        },
      ],
      sort: ["c.cluster_name"],
    },
    "clusters",
    useServiceManagerStore
  );
export const getOPSClusters = () =>
  r_get<
    | ICreateTableFields<keyof ISmprimaryDevice2m1, "d">
    | ICreateTableFields<keyof ISmprimaryClusters, "c">
    | ICreateTableFields<keyof ISmprimaryAsCluster, "cl">
    | keyof (ISmprimaryDevice2m1 & ISMOPSClusterInfo & ISmprimaryClusters)
  >(
    {
      from: [
        "smprimary.device2m1:d",
        "smprimary.as_cluster:cl",
        "smprimary.clusters:c",
      ],
      fields: [
        "coalesce(c.cluster_name,'Уточняется'):cluster",
        "coalesce(cl.kod_cluster,0):kod_cluster",
        "cl.lider_ops_list",
        "d.p_logical_name:logical_name",
        "p_itservice",
        "d.p_title:tps_name",
        "d.p_tps_name",
        "d.p_hpc_status",
      ],
      join: ["d.p_logical_name=(+)cl.logical_name", "cl.kod_cluster=(+)c.id"],
      filter: {
        p_hpc_status: "<>:Выведен",
      },
      sort: ["1", "3"],
    },
    "OPSclusterList",
    useServiceManagerStore
  );
export const getWorkGroups = () => {
  r_get<keyof IKnowledgebaseWorkGroup>(
    {
      fields: [
        "id",
        "naimen",
        "kod_cluster",
        "kod_curator",
        "kod_agile",
        "description",
        "date_add",
        "kod_user",
        "date_moditify",
        "kod_group",
        "icon",
        "color",
      ],
      from: "work_group",
    },
    "work_group",
    useServiceManagerStore
  );
};
export const getWorkGroupUsers = (group_id = 0) => {
  let kod_group: number | undefined;
  if (group_id > 0) {
    kod_group = group_id;
  }
  r_get<keyof IKnowledgebaseWorkGroupEmployees>(
    {
      fields: ["id", "kod_group", "tab_num", "date_add"],
      from: "work_group_employees",
      filter: {
        kod_group,
      },
    },
    "work_group_employees",
    useServiceManagerStore
  );
};
export const getSmWorkGroupUsers = () => {
  r_get<keyof ISmprimaryAssignmentm1>(
    {
      fields: ["id", "p_name", "p_hpc_name_name"],
      from: "smprimary.assignmentm1",
      sort: ["p_hpc_name_name"],
    },
    "sm_work_group",
    useServiceManagerStore
  );
};
