import { ISmWorkGrEmployees } from "@/compositionApi/dataGetFunctions/smprimary/getSMContacts";
import { ISmZNI } from "@/compositionApi/dataGetFunctions/smprimary/getZNI";
import {
  IKnowledgebaseWorkGroup,
  IKnowledgebaseWorkGroupEmployees,
} from "@/types/database/schemas/knowledgebase";
import {
  ISmprimaryAsLiderOps,
  ISmprimaryClusters,
  ISmprimaryContctsm1,
  ISmprimaryDevice2m1,
  ISmprimaryProbsummarym1,
  ISmprimarySbriskm1,
  ISmprimaryRootcausem1,
  ISmprimaryRootcsetsksm1,
  ISmprimarySbrisktaskm1,
  ISmprimaryHpcauditrootcausem1,
  ISmprimaryHpcauditsbriskm1,
  ISmprimarySbrequestm1,
  ISmprimarySbrequesttaskm1,
  ISmprimaryAssignmentm1,
  ISmprimarySbsoftupdatetaskm1,
  ISmprimarySbimcausem1,
  ISmprimarySbapprovalm1,
  ISmprimarySbimtaskm1,
  ISmprimarySbroutineworksm1,
  ISmprimarySbroutinetaskm1,
} from "@/types/database/schemas/smprimary";
import {
  // IJiraComments,
  IJiraDefects,
  // IJiraIssues,
} from "@/types/database/schemas/jira";
import { defineStore } from "pinia";

export const useServiceManagerStore = defineStore("service_manager", {
  state: () => ({
    ZNO: "",
    patterns_time: 0,
    kpiPeriods: [] as { period: string }[],
    url_resource: [] as IParserURLResource[],
    sm_url_patterns: [] as IParserURLPattern[],
    sm_prioritets: [
      { id: "5. Низкий", name: "5. Низкий" },
      { id: "4. Средний", name: "4. Средний" },
      { id: "3. Высокий", name: "3. Высокий" },
    ] as ServiceManPriority[],
    sm_status_inc: [
      {
        p_hpc_status: "2 Назначен",
      },
      {
        p_hpc_status: "3 В работе",
      },
      {
        p_hpc_status: "5 Выполнен",
      },
      {
        p_hpc_status: "6 Закрыт",
      },
    ],
    sm_resolution_codes: [
      {
        p_resolution_code: null,
      },
      {
        p_resolution_code: "Дублирование",
      },
      {
        p_resolution_code: "Инцидент не подтвердился",
      },
      {
        p_resolution_code: "Невозможно воспроизвести",
      },
      {
        p_resolution_code: "Отказ - неверный шаблон",
      },
      {
        p_resolution_code: "Отказ - не согласовано",
      },
      {
        p_resolution_code: "Отказ - нет информации от инициатора",
      },
      {
        p_resolution_code: "Перекатегоризация",
      },
      {
        p_resolution_code: "Решено/отменено пользователем",
      },
      {
        p_resolution_code: "Решено полностью",
      },
      {
        p_resolution_code: "Решено с замечаниями/обходным путём",
      },
    ],
    sm_nameusers: [],
    sm_groups: [] as ServiceManGroup[],
    sm_systems: [],
    sm_im_incidents: [] as PultIncident[],
    sm_incidents: [] as ISmprimaryProbsummarym1[],
    sm_contacts: [] as ISmprimaryContctsm1[],
    sm_sbimcause: [] as ISmprimarySbimcausem1[],
    /**
     * список сотрудников для мониторинга
     */
    sm_work_group_employees: [] as ISmWorkGrEmployees[],
    sm_problems: [] as ISmprimaryRootcausem1[],
    sm_hpcauditrootcausem1: [] as ISmprimaryHpcauditrootcausem1[],
    sm_problems_tasks: [] as ISmprimaryRootcsetsksm1[],
    sm_zno: [] as ISmprimarySbrequestm1[],
    sm_znr: [] as ISmprimarySbrequesttaskm1[],
    defects: [] as IJiraDefects[],
    pattents: [],
    protocol: [],
    audit: [],
    files: [],
    fullDataSet: [],
    OPSclusterList: [] as ISMOPSClusterInfo[],
    clusters: [] as ISmprimaryClusters[],
    devicem1: [] as ISmprimaryDevice2m1[],
    liderOpsList: [] as ISmprimaryAsLiderOps[],
    KPIresult: [] as IKPIQuality[],
    work_group: [] as IKnowledgebaseWorkGroup[],
    sm_work_group: [] as Pick<
      ISmprimaryAssignmentm1,
      "p_name" | "id" | "p_hpc_name_name"
    >[],
    work_group_employees: [] as IKnowledgebaseWorkGroupEmployees[],
    work_group_users: [] as IKnowledgebaseWorkGroupEmployees[],
    employees: [] as ICheckroomEmployee[],
    sm_risks: [] as ISmprimarySbriskm1[],
    sm_hpcauditsbriskm1: [] as ISmprimaryHpcauditsbriskm1[],
    sm_risks_tasks: [] as ISmprimarySbrisktaskm1[],
    sm_swut: [] as ISmprimarySbsoftupdatetaskm1[],
    sm_zni: [] as ISmZNI[],
    sm_sogl: [] as ISmprimarySbapprovalm1[],
    sm_env_stands: ["ПРОМ (промышленная среда)", "ПРОМ (Stand-In)"] as string[],
    // jira_issues: [] as IKnowledgebaseJiraIssues[],
    sm_sbimtask: [] as ISmprimarySbimtaskm1[],
    sm_sbroutineworks: [] as ISmprimarySbroutineworksm1[],
    sm_sbroutinetask: [] as ISmprimarySbroutinetaskm1[],
  }),

  getters: {
    activeRegSetting(state) {
      let actSetting = state.sm_url_patterns;
      if (actSetting.length > 0) {
        actSetting = actSetting.filter((e) => e.avcive);
      }

      return actSetting;
    },
    urlResource(state) {
      return state.url_resource;
    },
  },
});
