export interface IMonitoringFpTransferToEks {
  id: string;
  kod_service: string;
  create_gbk: null | string;
  gbk_status: null | string;
  docum_id: string;
  docum_state: null | string;
  date_docum_prov: null | string;
  time_add: string;
  time_update: null | string;
  c_text_vozv: null | string;
}
export interface IMonitoringFpIspolnenieServces {
  id: string;
  service_id: string;
  time_send_ticket: null | string;
  text_error: null | string;
  time_add: string;
}
export interface IMonitoringFpZachislenieServces {
  id: string;
  service_id: string;
  time_send_ticket: null | string;
  moduleid: null | string;
  time_add: string;
}
export interface IMonitoringPgwStatus {
  id: number;
  sendservice_id: string;
  sendfactory_id: string;
  status: null | string;
  outputdate: null | string;
  date_add: null | string;
}
export interface IMonitoringRppFrontStatus {
  id: number;
  naimen: string;
  operations: number;
  date_add: string;
}
export interface IMonitoringKpiRiskTemp {
  id: number;
  NUMBER: string;
  PRIORITY_CODE: null | string;
  OPEN_TIME: null | string;
  OPEN_TIME_Q: null | string;
  OPEN_TIME_M: null | string;
  HPC_AFFECTED_ITEM_NAME: null | string;
  AFFECTED_ITEM: null | string;
  RESOLUTION_CODE: null | string;
  CLIENT_IMPACT: null | string;
  IMPACT_CLASS: null | string;
  IMPACT_CATEGORY: null | string;
  IMPACT_TRANS_CNT: null | number;
  LOSS_PERCENT: string;
  IGNORE_KPI_LOSS: null | string;
  KPI_DOWNTIME: string;
  '"SB_SERVICE_LEVEL"': null | string;
  HPC_STATUS: null | string;
  ENVIRONMENT: null | string;
  INC_DESCR_2: null | string;
  INC_CAUSE: null | string;
  WORKGROUP: null | string;
  RSK_ID: null | string;
  "RSK REG DATE": null | string;
  EFFECT_TYPE: null | string;
  SOURCE_RISK: null | string;
  CAUSE_TYPE: null | string;
  BRIEF_DESCRIPTION: null | string;
  STATUS: null | string;
  CURRENT_RATING: null | string;
  RT_TIME: null | string;
  CURR_OLD: null | string;
  SERVICE_IMPACT_DURATION: null | number;
  SERVICE_IMPACT: string;
  RISK_VALUE: string;
  AFFECTED_ITEM_NAME: null | string;
  LOCAL_COORDINATOR_NAME: null | string;
  R_CI_SERVICE_LEVEL: null | string;
  R_CI_STATUS: null | string;
  R_ENVIRONMENT: null | string;
  RESPONSE_STRATEGY: null | string;
  UNDERVALUED: null | number;
  Вес_инцидента: string;
  C1: null | number;
  C2: null | number;
  C3: null | number;
  C4: null | number;
  I1: null | number;
  I2: null | number;
  I3: null | number;
  RPPYHIST: string;
  C3RSSI: string;
  C3INCKPI: string;
  C2COUNT: null | number;
  C2EX: string;
  RV_HIST: null | string;
  C4D: string;
  INC_RANK: null | number;
  time_add: string;
}
