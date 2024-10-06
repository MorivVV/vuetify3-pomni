import { dataApiComposition } from "@/compositionApi/dataApi";
import { EKNOWLEGEBASE, ESMPRIMARY } from "@/const/schemaEnums";
import {
  ISmprimaryDevice2m1,
  ISmprimarySbroutinetaskm1,
} from "@/types/database/schemas/smprimary";
import { ICreateTableFields } from "@/types/database/service";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import { restGetType } from "@/types/restApi";
import { filterSMGroup } from "./filterSMGroup";

const { r_get } = dataApiComposition();

export const getSbroutinetask = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = sbroutinetaskFilter(
    ciList,
    clusterList,
    groupList,
    smGroupList
  );
  r_get<
    | ICreateTableFields<keyof ISmprimarySbroutinetaskm1, "rwt">
    | ICreateTableFields<keyof ISmprimaryDevice2m1, "d">
  >(
    {
      from: [
        `${ESMPRIMARY.sbroutinetaskm1}:rwt`,
        `${ESMPRIMARY.as_cluster}:ci`,
        `${ESMPRIMARY.contctsm1}:c`,
        `${EKNOWLEGEBASE.work_group_employees}:wge`,
        `${EKNOWLEGEBASE.work_group}:wg`,
        `${ESMPRIMARY.device2m1}:d`,
      ],
      join: [
        "rwt.p_affected_item=(+)ci.logical_name",
        "ci.logical_name=(+)d.p_logical_name",
        "rwt.p_assignee=(+)c.p_full_name",
        "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
        "wge.kod_group=(+)wg.id",
      ],
      filter,
      sort: ["-rwt.p_planned_start"],
    },
    "sm_sbroutinetask",
    useServiceManagerStore
  );
};

export const taskFilter = {
  "rwt.p_status": [
    {
      "rwt.p_status": "=:Запланирована",
    },
    {
      "rwt.p_status": "=:В работе",
    },
  ],
};

const sbroutinetaskFilter = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
): restGetType<ICreateTableFields<keyof ISmprimarySbroutinetaskm1, "rwt">> => {
  const filter: restGetType<
    ICreateTableFields<keyof ISmprimarySbroutinetaskm1, "rwt">
  > = JSON.parse(JSON.stringify(taskFilter));

  if (ciList.length) {
    filter["rwt.p_affected_item"] = ciList.map((e) => ({
      "rwt.p_affected_item": `=:${e}`,
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
    filter["rwt.p_assignment"] = filterSMGroup(smGroupList) as any;
  }

  return filter;
};
