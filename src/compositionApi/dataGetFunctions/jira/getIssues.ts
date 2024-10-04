import { EJIRA } from "@/const/schemaEnums";

import { dataApiComposition } from "@/compositionApi/dataApi";
import { IJiraComments, IJiraIssues } from "@/types/database/schemas/jira";
import { ICreateTableFields } from "@/types/database/service";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";

const { r_get } = dataApiComposition();

export const getIssueComments = () => {
  return r_get<ICreateTableFields<keyof IJiraComments, "c">>(
    {
      from: [`${EJIRA.comments}`],
    },
    "new_jira_issue_comments",
    useServiceManagerStore
  );
};

export const getJiraIssues = () => {
  return r_get<ICreateTableFields<keyof IJiraIssues, "i">>(
    {
      from: [`${EJIRA.issue}:i`],
      filter: {
        "i.status": "<>:Cancelled",
        "i.status@1": "<>:Реализовано",
        "i.status@2": "<>:Resolved",
        "i.status@3": "<>:Closed",
        "i.status@4": "<>:Done",
        "i.status@5": "<>:Сделан",
        "i.status@6": "<>:Закрыт",
        "i.status@7": "<>:Отклонен исполнителем",
        "i.status@8": "<>:Отменён",
        "i.status@9": "<>:ППСИ успешно согласован",
        "i.status@0": "<>:ППСИ утвержден",
      },
    },
    "new_jira_issues",
    useServiceManagerStore
  );
};
