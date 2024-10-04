export interface IPultActions {
  code: null | string;
  naimen: null | string;
  id: number;
  date_add: null | string;
  active: null | boolean;
}

/**
 * Таблица со всеми алертами в Пульте ДС
 */
export interface IPultAlertRulePool {
  status: null | string;
  auto: null | boolean;
  kod_alert: null | number;
  kod_table: null | number;
  kod_rule: null | number;
  kod_action: null | number;
  kod_system: null | number;
  /** название генерируемой метрики */
  metric_name: null | string;
  system_smname: null | string;
  kod_user: null | number;
  id: number;
  date_add: null | string;
  active: null | boolean;
  text_alert: null | string;
}

/**
 * Информация о всех таблицах в которые собираются алерты
 */
export interface IPultAlertTables {
  kod_user: null | number;
  naimen: null | string;
  /**
   * ссылка на id из pult.asystems
   */
  kod_system: null | number;
  id: number;
  date_add: null | string;
  active: null | boolean;
  kod_monitor: null | number;
}
export interface IPultAsMetrics {
  kod_as: null | number;
  kod_metric: null | number;
  id: number;
  date_add: null | string;
  active: null | boolean;
}
export interface IPultAsystems {
  sm_group: null | string;
  tks_room: null | number;
  naimen: string;
  sm_name: string;
  sm_id: null | string;
  service_level: null | string;
  id: number;
  date_add: null | string;
  active: null | boolean;
}
export interface IPultDsTksPatternsEmail {
  email: string;
  id: number;
}
export interface IPultDsTksPatternsMailBody {
  kod_id_priority: number;
  kod_id_asystems: number;
  mail_body: string;
  id: number;
}
export interface IPultDsTksPatternsPattern {
  kod_id_system: number;
  kod_id_priority: number;
  kod_id_employee: number;
  id: number;
}
export interface IPultDsTksPatternsPatternPriority {
  priority: string;
  naimen: string;
  id: number;
}
export interface IPultDutySchedule {
  id: number;
  kod_user: number;
  period_start: string;
  period_end: string;
  work_time: null | number;
  date_modify: null | string;
  kod_user_modify: null | number;
  date_add: null | string;
}
export interface IPultIncidents {
  service_name: null | string;
  kod_alert_table: null | number;
  alert_table: null | string;
  num: string;
  kod_alert: null | number;
  kod_test: null | number;
  kod_user: null | number;
  id: number;
  date_add: null | string;
  sbor_tks: null | boolean;
}
export interface IPultMetrics {
  default_action: null | number;
  naimen: null | string;
  id: number;
  date_add: null | string;
  active: null | boolean;
}
export interface IPultMonitors {
  naimen: string;
  id: number;
  date_add: null | string;
  active: null | boolean;
}
export interface IPultRuleActions {
  kod_rule: number;
  kod_action: number;
  date_modify: null | string;
  kod_user_modify: null | number;
  kod_user: null | number;
  id: number;
  auto_apply: null | boolean;
  prioritet: string;
  date_add: null | string;
  active: null | boolean;
  wait_action: number;
  mail_address: null | string;
  period_end: number;
  period_start: number;
  week_array_active: number[];
}
export interface IPultRules {
  kod_metric_as: null | number;
  kod_action: null | number;
  off_rule_before: null | string;
  id: number;
  date_add: null | string;
  active: null | boolean;
  kod_user: null | number;
  date_modify: null | string;
  min_count: null | number;
  period_min: number;
}
export interface IPultSendSms {
  id: number;
  number_sms: null | string;
  text_sms: null | string;
  server_response: null | string;
  time_add: string;
}
