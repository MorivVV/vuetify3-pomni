/**
 * Приоритеты для регистрации инцидентов
 */
interface ServiceManPriority {
  id: string;
  name: string;
}
interface ServiceManEmployee {
  CONTACT_NAME: string;
  FULL_NAME: string;
  HPC_DEPT_NAME: string;
}
interface ServiceManGroup {
  NAME: string;
  HPC_NAME_NAME: string;
  HPC_COORDINATOR_NAME: string;
}
interface ServiceManSystemAC {
  id_id_d: string;
  name: string;
  group: string;
  assignment: string;
}

interface ISMCIinfoGroup {
  cntinc: string;
  cntriskinc: string;
  weigthinc: string;
  cntzno: string;
  cntzni: string;
  cntrisk: string;
  cntproblem: string;
  cntmpr: string;
  cntzpp: string;
  oa_beg_audit: string;
  prom_si: string;
  emergency_exercises: string;
  dezh_daily: string;
  p_title: string;
  p_sb_status: string;
  p_logical_name: string;
  p_itservice: boolean;
  p_tps_trial_operation_date: string;
  p_j_trial_operation_end_date: string;
  p_tps_name: string;
}

interface ISMOPSClusterInfo {
  cluster: string;
  logical_name: string;
  kod_cluster: number;
  lider_ops_list: string[];
  tps_name: string;
  p_tps_name: string;
  p_itservice: boolean;
  p_hpc_status: string;
  date_add: string;
  date_modify: string | null;
  kod_user: number | null;
}
interface IKPIQuality {
  NUMBER: string;
  PRIORITY_CODE: string;
  OPEN_TIME: string;
  OPEN_TIME_Q: string;
  OPEN_TIME_M: string;
  HPC_AFFECTED_ITEM_NAME: string;
  AFFECTED_ITEM: string;
  RESOLUTION_CODE: string;
  CLIENT_IMPACT: string;
  IMPACT_CLASS: string;
  IMPACT_TYPE: null;
  IMPACT_CATEGORY: string;
  IMPACT_TRANS_CNT: number;
  LOSS_PERCENT: number | null;
  IGNORE_KPI_LOSS: string;
  KPI_DOWNTIME: number;
  DOWNTIME_MIN: null;
  SB_SERVICE_LEVEL: string;
  HPC_STATUS: string;
  SUBTYPE: string;
  ENVIRONMENT: string;
  "Инц.Блок": string;
  "Инц.ДИТ_QR": string;
  "Инц.Трайб_QR": string;
  "Инц.Упр_QR": string;
  INC_DESCR_2: string;
  INC_CAUSE: string;
  INC_CAUSE_DATAILS: string | null;
  INC_EXT_INFO: string | null;
  WORKGROUP: string;
  RSK_ID: string | null;
  "RSK REG DATE": string | null;
  DATE_OF_FIRST_ESTIMATION: string | null;
  DATE_OF_ESTIMATION: string | null;
  WHO_ESTIMATED: string | null;
  EFFECT_TYPE: string | null;
  SOURCE_RISK: string | null;
  CAUSE_TYPE: string | null;
  BRIEF_DESCRIPTION: string | null;
  STATUS: string | null;
  CURRENT_RATING: string;
  RT_TIME: string | null;
  CURR_OLD: string | null;
  RISK_PROBABILITY: null | null;
  SERVICE_IMPACT_DURATION: number | null;
  SERVICE_IMPACT: number | null;
  RISK_VALUE: number | null;
  AFFECTED_ITEM_NAME: string | null;
  LOCAL_COORDINATOR_NAME: string | null;
  R_CI_SERVICE_LEVEL: string | null;
  R_CI_STATUS: string | null;
  R_ENVIRONMENT: string | null;
  "Риск Блок": string;
  "Риск ДИТ_QR": string;
  "Риск Трайб_QR": string;
  "Риск Упр_QR": string;
  RESPONSE_STRATEGY: string | null;
  R_RES_CODE: number | null;
  "Реактивно?": number;
  "Недооценен?": number;
  UNDERVALUED: number;
  Вес_инцидента: number;
  C1: number;
  C2: number;
  C3: number;
  C4: number;
  I1: number;
  I2: number;
  I3: number;
  RPPYHIST: number | null;
  C3RSSI: number | null;
  C3INCKPI: number | null;
  C2LIST: string | null;
  C2COUNT: number | null;
  C2EX: number | null;
  C4LIST: string | null;
  RV_HIST: string | null;
  C4D: number | null;
  "Реактивно (вес)": number;
  "Недооценен (вес)": number;
  INC_RANK: number;
}
