import { dataApiComposition } from "@/compositionApi/dataApi";
import { ESMPRIMARY, EKNOWLEGEBASE } from "@/const/schemaEnums";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import {
  ISmprimaryDevice2m1,
  ISmprimarySbimtaskm1,
} from "@/types/database/schemas/smprimary";
import { ICreateTableFields } from "@/types/database/service";
import { restGetType } from "@/types/restApi";
import { filterSMGroup } from "./filterSMGroup";

const { r_get } = dataApiComposition();

export const getSbimtask = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getSbimtaskFilter(ciList, clusterList, groupList, smGroupList);
  r_get<
    | ICreateTableFields<keyof ISmprimarySbimtaskm1, "zpi">
    | ICreateTableFields<keyof ISmprimaryDevice2m1, "d">
  >(
    {
      from: [
        `${ESMPRIMARY.sbimtaskm1}:zpi`,
        `${ESMPRIMARY.as_cluster}:ci`,
        `${ESMPRIMARY.contctsm1}:c`,
        `${EKNOWLEGEBASE.work_group_employees}:wge`,
        `${EKNOWLEGEBASE.work_group}:wg`,
        `${ESMPRIMARY.device2m1}:d`,
      ],
      join: [
        "zpi.p_affected_item=(+)ci.logical_name",
        "ci.logical_name=(+)d.p_logical_name",
        "zpi.p_assignee_name=(+)c.p_full_name",
        "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
        "wge.kod_group=(+)wg.id",
      ],
      fields: ["DISTINCT", "zpi.*", "d.p_title:ci"],
      filter,
    },
    "sm_sbimtask",
    useServiceManagerStore
  );
};

const getSbimtaskFilter = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
): restGetType<ICreateTableFields<keyof ISmprimarySbimtaskm1, "zpi">> => {
  const filter: restGetType<
    ICreateTableFields<keyof ISmprimarySbimtaskm1, "zpi">
  > = {
    "zpi.p_status": [
      {
        "zpi.p_status": "=:2 Назначена",
      },
      {
        "zpi.p_status": "=:3 В работе",
      },
    ],
  };

  if (ciList.length) {
    filter["zpi.p_affected_item"] = ciList.map((e) => ({
      "zpi.p_affected_item": `=:${e}`,
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
    filter["zpi.p_assignment"] = filterSMGroup(smGroupList) as any;
  }

  return filter;
};
