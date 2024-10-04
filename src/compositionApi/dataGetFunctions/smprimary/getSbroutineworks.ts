import { dataApiComposition } from "@/compositionApi/dataApi";
import { EKNOWLEGEBASE, ESMPRIMARY } from "@/const/schemaEnums";
import {
  ISmprimaryDevice2m1,
  ISmprimarySbroutinetaskm1,
  ISmprimarySbroutineworksm1,
} from "@/types/database/schemas/smprimary";
import { ICreateTableFields } from "@/types/database/service";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import { restGet, restGetType } from "@/types/restApi";
import { filterSMGroup } from "./filterSMGroup";
import { taskFilter } from "./getSbroutinetask";

const { r_get } = dataApiComposition();

const task_count: restGet<
  ICreateTableFields<keyof ISmprimarySbroutinetaskm1, "rwt" | "count(1):count">
> = {
  fields: ["count(1):count"],
  from: [`${ESMPRIMARY.sbroutinetaskm1}:rwt`],
  filter: {
    "rwt.p_tpl_id": "@@=:rw.p_id",
    ...taskFilter,
  },
};

export const getSbroutineworks = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getSbroutineworksFilter(
    ciList,
    clusterList,
    groupList,
    smGroupList
  );
  r_get<
    | ICreateTableFields<keyof ISmprimarySbroutineworksm1, "rw">
    | ICreateTableFields<keyof ISmprimaryDevice2m1, "d">
  >(
    {
      from: [
        `${ESMPRIMARY.sbroutineworksm1}:rw`,
        `${ESMPRIMARY.sbroutinetaskm1}:rwt`,
        `${ESMPRIMARY.as_cluster}:ci`,
        `${ESMPRIMARY.contctsm1}:c`,
        `${EKNOWLEGEBASE.work_group_employees}:wge`,
        `${EKNOWLEGEBASE.work_group}:wg`,
        `${ESMPRIMARY.device2m1}:d`,
      ],
      join: [
        "rw.p_affected_item=(+)ci.logical_name",
        "rw.p_id=(+)rwt.p_tpl_id",
        "ci.logical_name=(+)d.p_logical_name",
        "rw.p_assignee=(+)c.p_full_name",
        "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
        "wge.kod_group=(+)wg.id",
      ],
      fields: ["DISTINCT", "rw.*", task_count as restGet<any>],
      filter,
    },
    "sm_sbroutineworks",
    useServiceManagerStore
  );
};

const getSbroutineworksFilter = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
): restGetType<ICreateTableFields<keyof ISmprimarySbroutineworksm1, "rw">> => {
  const filter: restGetType<
    ICreateTableFields<keyof ISmprimarySbroutineworksm1, "rw">
  > = {
    "rw.p_status": "=:Ведутся работы",
  };

  if (ciList.length) {
    filter["rw.p_affected_item"] = ciList.map((e) => ({
      "rw.p_affected_item": `=:${e}`,
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
    filter["rw.p_assignment"] = filterSMGroup(smGroupList) as any;
  }

  return filter;
};
