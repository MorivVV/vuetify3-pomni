import { ISmprimaryAssignmentm1 } from "@/types/database/schemas/smprimary";
import { restGet } from "@/types/restApi";

export const filterSMGroup = (
  smGroups: number[]
): restGet<keyof ISmprimaryAssignmentm1> => {
  const filter: restGet<keyof ISmprimaryAssignmentm1> = {
    from: "smprimary.assignmentm1",
    fields: ["p_name"],
    filter: {
      id: smGroups.map((e) => ({ id: e })),
    },
  };
  return filter;
};
