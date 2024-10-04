interface ASystems {
  active: boolean;
  date_add: string;
  id: number;
  naimen: string;
  sm_group: string;
  sm_id: string;
  sm_name: string;
}
interface IIncidentSendBody {
  id: number;
  Title: string;
  Description: string;
  OpenedBy: string;
  Object: string;
  Priority: string;
  AssigneeName: string;
  Contact: string;
  AssGroupID: string;
  ServiceName: string;
  Solution: string;
}
interface IncidentSMBody {
  /** пример IM0117770160 */
  IncidentID: string;
  /** инцидент */
  Category: string;
  /** 2021-12-29T11:49:36+00:00 */
  OpenTime: string;
  /** Моривец В. В. (857192) */
  OpenedBy: string;
  /** 5. Низкий */
  Priority: string;
  UpdatedTime: string;
  /** Диспетчерская ОДС (Петров Н.В.) (281874333504408) */
  AssignmentGroup: string;
  /** описание */
  Description: { Description: string };
  /** Моривец В. В. (00652232) */
  ContactID: string;
  /** Заголовок инцидента */
  Title: string;
  /** Mon_AS_EKS */
  TicketOwner: string;
  /** Mon_AS_EKS */
  UpdatedBy: string;
  /** Инцидент */
  Subcategory: string;
  /** инцидент */
  ProblemType: string;
  /** Все запросы */
  folder: string;
  /** CI00198925 */
  Service: string;
  /** 2 Назначен */
  Status: string;
  /** Сопровождение БИК IBSO Запад (00001184) */
  AssGroupID: string;
  /** Моривец В. В. (00652232) */
  Assignee: string;
  /** Моривец В. В. (857192) */
  AssigneeName: string;
  /** ДИТ КИБ Сопровождение АС ЕКС Самара (Рыбакин Н.Л.) */
  AssGroup: string;
  /** Единая корпоративная система (CI00198925) */
  ServiceName: string;
  /** Моривец В. В. (857192) */
  Contact: string;
  /** 2022-01-11T11:04:35+00:00 */
  NextBreach: string;
  /** решение */
  Solution: string;
  /** Конфигурационный элемент (КЭ): для регистрации на ФП */
  AffectedCI: string;
  /** Код закрытия */
  ClosureCode: string;
  /** Причина инцидента */
  IncCause: string;
}
interface DezhInfoAccept {
  id: number;
  kod_info: number;
  kod_user: number;
  date_add: string;
}
interface DezhInfoPost {
  [x: string]: any;
  attach_files: number[];
  created_user: number;
  date_add: string;
  date_edit: string;
  date_send: string;
  dezh_id: number;
  edit_user: number;
  information: string;
  kod_sender: string;
  sended: number;
  tag: string;
  tags: number[];
  title: string;
}
interface AlertPool {
  id: number;
  kod_system: number;
  kod_action: number;
  kod_table: number;
  kod_user: number;
  system_smname: string;
  metric_name: string;
  text_alert: string;
  status: string;
  num: string;
  auto: boolean;
  date_add: string;
  active: boolean;
}
interface RuleAction {
  id: number;
  kod_rule: number;
  kod_action: number;
  auto_apply: boolean;
  prioritet: string;
  sm_group: string;
  period_end: number;
  period_start: number;
  date_modify: string;
  kod_user_modify: number;
  date_add: string;
  kod_user: number;
  active: boolean;
  wait_action: number;
  mail_address: string | null;
}
interface PultRule {
  id: number;
  kod_metric_as: number;
  kod_action: number;
  off_rule_before: string | null;
  ssq_id: string | null;
  date_add: string;
  active: boolean;
  kod_user: number;
  date_modify: string;
  min_count: number;
  period_min: number;
  kod_metric: number;
  metric_name: number;
  instruction: string;
}
interface IDezhReport {
  id: number;
  title: string;
  content: string;
  kod_create: number;
  kod_edit: null;
  date_add: string;
  date_edit: null;
  kod_place: number;
  sended: boolean;
  mail_to: null;
  mail_copy: null;
  kod_sender: null;
  date_send: null;
}
interface IPultMonitor {
  id: number;
  naimen: string;
  date_add: string;
  active: boolean;
}
interface ITuzUser {
  id: number;
  login: string;
  v_token: string;
  tabnum: null;
  family: string;
  first_name: string;
  second_name: null;
  login_ip: null;
  login_time: null;
  create_time: string;
  active: boolean;
}
interface IReportIncident {
  incident_id: string;
  DS_BEGIN: string;
  DS_END: string;
  ac_name: string;
  hpc_assignee: string;
  contact_name: string;
  ticket_owner: string;
  status: string;
  brief_description: string;
  date_beg: string;
  last_update: string;
  date_end: string;
  descript: string;
  resolution: string;
  ac_name_1: string;
}
interface ABdezh {
  id: number;
  dezh_name: string;
  respons_short: string;
  respons_complete: string;
  email_sigma: string;
  email_alpha: string;
  email_omega: string;
  phone_inner: string;
  phone_landline: string;
  phone_mobile: string;
  phone_mobile_second: null;
  supervisor_dezh: string;
  supervisor_email_sigma: string;
  supervisor_email_alpha: string;
  manager_phone_inner: string;
  sm_group: string;
}
interface IPultTKSPriority {
  id: number;
  priority: string;
  naimen: "Подозрение" | "Низкий" | "Средний" | "Высокий";
}
interface IPultASMetric {
  id: number;
  kod_as: number;
  kod_metric: number;
  naimen: string;
  date_add: string;
  active: boolean;
}

interface IPultMetric {
  id: number;
  naimen: string;
  date_add: string;
  active: boolean;
  default_action: number;
}
interface IPultAction {
  id: number;
  naimen: string;
  date_add: string;
  active: boolean;
  code: string;
}
interface IPultSystem {
  id: number;
  naimen: string;
  sm_id: string;
  sm_name: string;
  date_add: string;
  active: boolean;
  sm_group: string;
  tks_room: number | null;
}
interface PultIncident {
  id: number;
  num: string;
  alert_table: null;
  kod_alert: number;
  kod_test: number;
  kod_user: number;
  date_add: string;
  kod_alert_table: number;
  service_name: string;
}
interface IPultTksPattern {
  id: number;
  kod_id_system: number;
  kod_id_priority: number;
  kod_id_employee: number;
  email: string;
  mobile_phone: null | string;
}
interface IPultSMSystems {
  id_id_d: string;
  name: string;
  group: string;
  assignment: string;
}
interface PultEmail {
  id: number;
  email: string;
}
interface PultPatternEmail {
  id: number;
  kod_id_asystems: number;
  kod_id_priority: number;
  mail_body: string;
}
