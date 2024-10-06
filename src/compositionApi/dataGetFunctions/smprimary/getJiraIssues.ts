import { dataApiComposition } from "@/compositionApi/dataApi";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import { ICheckroomEmployees } from "@/types/database/schemas/checkroom";
import { IJiraIssues } from "@/types/database/schemas/jira";
import {
  IKnowledgebaseWorkGroup,
  IKnowledgebaseWorkGroupEmployees,
} from "@/types/database/schemas/knowledgebase";
import { ICreateTableFields } from "@/types/database/service";
import { restGetType } from "@/types/restApi";

const { r_get } = dataApiComposition();

type IFilterInc = restGetType<
  | ICreateTableFields<keyof IJiraIssues, "j">
  | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
>;

export const getJiraFilters = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = []
): IFilterInc => {
  const filter: IFilterInc = {
    "j.status": "<>:Cancelled",
    "j.status@1": "<>:Реализовано",
    "j.status@2": "<>:Resolved",
    "j.status@3": "<>:Closed",
    "j.status@4": "<>:Done",
    "j.status@5": "<>:Сделан",
    "j.status@6": "<>:Закрыт",
    "j.status@7": "<>:Отклонен исполнителем",
    "j.status@8": "<>:Отменён",
    "j.status@9": "<>:ППСИ успешно согласован",
    "j.status@0": "<>:ППСИ утвержден",
  };

  if (clusterList.length) {
    filter["wg.kod_cluster"] = clusterList.map((e) => ({
      "wg.kod_cluster": `=:${e}`,
    }));
    filter["wg.kod_cluster"].push({
      "wg.kod_group": {
        fields: ["wg.id"],
        from: ["work_group:wg"],
        filter: clusterList.map((e) => ({
          "wg.kod_cluster": `=:${e}`,
        })),
      },
    });
  }

  if (ciList.length) {
    filter["wg.kod_cluster"] = 0;
  }

  if (groupList.length) {
    filter.kod_group = groupList.map((e) => ({ "wg.kod_group": `=:${e}` }));
    filter.kod_group = filter.kod_group.concat(
      groupList.map((e) => ({ "wg.id": `=:${e}` }))
    );
  }
  return filter;
};

export const getJiraIssues = (
  ciList: string[] = [],
  clusterList: number[] = [],
  groupList: number[] = []
) => {
  const filter = getJiraFilters(ciList, clusterList, groupList);
  return r_get<
    | ICreateTableFields<keyof IJiraIssues, "j">
    | ICreateTableFields<keyof ICheckroomEmployees, "e">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroup, "wg">
    | ICreateTableFields<keyof IKnowledgebaseWorkGroupEmployees, "wge">
    | "'': description"
  >(
    {
      fields: [
        "DISTINCT",
        "j.assignee_display_name",
        "j.key",
        "e.emailsigma",
        "e.id",
        "j.status",
        "'': description",
        "j.issuetype:issuetype_name",
        "j.reporter_display_name",
        "j.summary",
        "j.created",
        "j.updated",
      ],
      from: [
        "jira.issues:j",
        "checkroom.employees:e",
        "work_group_employees:wge",
        "work_group:wg",
      ],
      join: [
        "j.assignee_tabnum::int=(+)e.id",
        "e.id=(+)wge.tab_num",
        "wge.kod_group=(+)wg.id",
      ],
      filter,
      sort: ["-j.updated"],
    },
    "jira_issues",
    useServiceManagerStore
  );
};
