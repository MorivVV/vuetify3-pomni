import { dataApiComposition } from "@/compositionApi/dataApi";
import { ESMPRIMARY, EKNOWLEGEBASE } from "@/const/schemaEnums";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import {
  ISmprimaryDevice2m1,
  ISmprimarySbapprovalm1,
} from "@/types/database/schemas/smprimary";
import { ICreateTableFields } from "@/types/database/service";
import { restGetType } from "@/types/restApi";
import { filterSMGroup } from "./filterSMGroup";

const { r_get } = dataApiComposition();

export const getSogl = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
) => {
  const filter = getSoglFilter(ciList, clusterList, groupList, smGroupList);
  r_get<
    | "case when sogl.p_parent_id like 'ЗНО%' then (select zno.p_affected_item from smprimary.sbrequestm1 zno where sogl.p_parent_id = zno.p_number) when sogl.p_parent_id like 'C0%' then (select zni.p_affected_item from smprimary.cm3rm1 zni where sogl.p_parent_id = zni.p_number) when sogl.p_parent_id like 'RW%' then (select rw.p_affected_item from smprimary.sbroutineworksm1 rw where sogl.p_parent_id = rw.p_id) when sogl.p_parent_id like 'RISK%' then (select risk.p_affected_item from smprimary.sbriskm1 risk where sogl.p_parent_id = risk.p_number) else null  end : object"
    | ICreateTableFields<keyof ISmprimarySbapprovalm1, "sogl">
    | "sogl.object=ci.logical_name"
    | ICreateTableFields<keyof ISmprimaryDevice2m1, "d">
  >(
    {
      from: [
        {
          alias: "sogl",
          fields: [
            "sogl.p_number",
            "sogl.p_parent_id",
            "sogl.p_status",
            "sogl.p_assignee_name",
            "sogl.p_approve_deadline",
            "sogl.p_title",
            "sogl.p_open_time",
            "sogl.p_assignment",
            "case when sogl.p_parent_id like 'ЗНО%' then (select zno.p_affected_item from smprimary.sbrequestm1 zno where sogl.p_parent_id = zno.p_number) when sogl.p_parent_id like 'C0%' then (select zni.p_affected_item from smprimary.cm3rm1 zni where sogl.p_parent_id = zni.p_number) when sogl.p_parent_id like 'RW%' then (select rw.p_affected_item from smprimary.sbroutineworksm1 rw where sogl.p_parent_id = rw.p_id) when sogl.p_parent_id like 'RISK%' then (select risk.p_affected_item from smprimary.sbriskm1 risk where sogl.p_parent_id = risk.p_number) else null  end : object",
          ],
          from: ["smprimary.sbapprovalm1:sogl"],
          filter: { "sogl.p_status": "=:На согласовании" },
        },
        `${ESMPRIMARY.as_cluster}:ci`,
        `${ESMPRIMARY.contctsm1}:c`,
        `${EKNOWLEGEBASE.work_group_employees}:wge`,
        `${EKNOWLEGEBASE.work_group}:wg`,
        `${ESMPRIMARY.device2m1}:d`,
      ],
      join: [
        "sogl.object=(+)ci.logical_name",
        "ci.logical_name=(+)d.p_logical_name",
        "sogl.p_assignee_name=(+)c.p_full_name",
        "c.p_sb_sap_identification=(+)wge.tab_num::character varying",
        "wge.kod_group=(+)wg.id",
      ],
      fields: ["DISTINCT", "sogl.*", "d.p_title:ci"],
      filter,
    },
    "sm_sogl",
    useServiceManagerStore
  );
};

const getSoglFilter = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = [],
  smGroupList: number[] = []
): restGetType<ICreateTableFields<keyof ISmprimarySbapprovalm1, "sogl">> => {
  const filter: restGetType<
    ICreateTableFields<keyof ISmprimarySbapprovalm1, "sogl">
  > = {};

  if (ciList.length) {
    filter["sogl.object"] = ciList.map((e) => ({
      "sogl.object": `=:${e}`,
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
    filter["sogl.p_assignment"] = filterSMGroup(smGroupList) as any;
  }

  return filter;
};
