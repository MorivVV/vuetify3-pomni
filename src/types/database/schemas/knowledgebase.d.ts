export interface IKnowledgebaseAbEmpInfo {
  tabnum: number;
  fio: null | string;
  post: null | string;
  email_alpha: null | string;
  email_omega: null | string;
  email_sigma: null | string;
  phone_inner: null | string;
  phone_mobile: null | string;
  address: null | string;
  room: null | string;
  date_add: null | string;
  id: number;
}
export interface IKnowledgebaseBrowserList {
  browser_name: string;
  id: number;
}
export interface IKnowledgebaseBzAudit {
  kod_ip_addres: null | number;
  kod_user: null | number;
  kod_browser: null | number;
  token: null | string;
  action: null | string;
  comment: null | string;
  time_action: string;
  id: number;
}
export interface IKnowledgebaseBzAutoSystems {
  short_name: string;
  full_name: null | string;
  id: number;
  time_add: string;
  active: boolean;
}
export interface IKnowledgebaseBzContactMatrix {
  id: number;
  modified: null | string;
  depart: string;
  addressbook_ref: string;
  face_friend_template: string;
  sm_name: string;
  communication_process: string;
  contacts: string;
  active: boolean;
}
export interface IKnowledgebaseBzFavoritesPost {
  kod_post: null | number;
  kod_user: null | number;
  date_add: null | string;
  id: number;
}
export interface IKnowledgebaseBzGroupRegister {
  name_group: null | string;
  kod_addressbook: null | number;
  id: number;
  active: null | boolean;
}
export interface IKnowledgebaseBzIpAddres {
  ip: string;
  id: number;
}
export interface IKnowledgebaseBzPostAttach {
  kod_post: null | number;
  kod_file: null | number;
  id: number;
}
export interface IKnowledgebaseBzPostmeta {
  create_time: null | string;
  kod_post: number;
  meta_key: string;
  meta_value: string;
  id: number;
}
export interface IKnowledgebaseBzPost {
  post_date: null | string;
  post_modified: null | string;
  post_title: string;
  post_content: null | string;
  solution: null | string;
  edit_user: null | number;
  kod_user: number;
  active: boolean;
  id: number;
}
export interface IKnowledgebaseBzPostTerms {
  kod_post: number;
  kod_term: number;
  term_order: number;
  id: number;
}
export interface IKnowledgebaseBzSendMails {
  mail_title: null | string;
  mail_to: null | string;
  mail_copy: null | string;
  mail_body: null | string;
  kod_user: null | number;
  id: number;
  time_add: null | string;
}
export interface IKnowledgebaseBzServerInfo {
  server: string;
  ip: string;
  cluster: null | string;
  area: null | string;
  type: null | string;
  cluster_ci: null | string;
  ci: string;
  functional: null | string;
  console: null | string;
  state_url: null | string;
  adapter_eps: null | string;
  log: null | string;
  queue: null | string;
  server_port: null | string;
  responsible: null | string;
  day: null | string;
  week: null | string;
  mounth: null | string;
  time: null | string;
  cpu: null | string;
  ram: null | string;
  hdd: null | string;
  restart_type: null | string;
  comment_restart_type: null | string;
  comment_vulnerability: null | string;
  ac: null | string;
  state: null | string;
  kod_responsible: null | number;
  kod_ac: null | number;
  kod_place: null | number;
  kod_stand: null | number;
  id: number;
}
export interface IKnowledgebaseBzUserGroup {
  group_name: string;
  id: number;
}
export interface IKnowledgebaseBzUsers {
  notification: boolean;
  sm_contact_name: null | string;
  sm_full_name: null | string;
  check_ip: boolean;
  create_time: string;
  login_time: null | string;
  question: null | string;
  session_token: null | string;
  login_ip: null | string;
  tabnum: null | number;
  kod_email: null | number;
  id: number;
  pass: null | string;
  active: boolean;
  login: string;
  family: null | string;
  first_name: null | string;
  second_name: null | string;
}
export interface IKnowledgebaseBzUsersParams {
  create_time: null | string;
  kod_user: number;
  param_key: null | string;
  param_value: null | string;
  active: boolean;
  id: number;
}
export interface IKnowledgebaseBzVersion {
  version_date: string;
  site_version: null | string;
  id: number;
}
export interface IKnowledgebaseCronJobs {
  script: null | string;
  kod_script: null | number;
  period_start: string;
  period_end: null | string;
  naimen: string;
  period_run_month: null | number;
  period_run_week: null | number;
  period_run_week_array: number[];
  period_run_day: null | number;
  period_run_hour: null | number;
  period_run_hour_array: number[];
  period_run_minute: null | number;
  parameters: null | string;
  kod_user: null | number;
  id: number;
  date_modify: null | string;
  last_run: null | string;
  last_done: null | string;
  active: boolean;
  interval_min: number;
  date_add: string;
  description: string;
  chain: string[];
  /** IP-адрес планировщика заданий по расписанию */
  cron_host_ip: string;
  /** ожидание перед запуском в секундах (умножается на 1000 для setTimeout) */
  timeout: number;
}
export interface IKnowledgebaseCronScriptParams {
  kod_script: number;
  order_var: number;
  type_var: "number" | "boolean" | "string" | "object" | "array";
  name_var: string;
  description: null | string;
  default_var: null | string;
  id: number;
  rest_get: string;
}
export interface IKnowledgebaseCronScripts {
  naimen_script: string;
  params_template: null | string;
  id: number;
  date_add: null | string;
}
export interface IKnowledgebaseDezhBook {
  sm_group: null | string;
  dezh_name: null | string;
  respons_short: null | string;
  respons_complete: null | string;
  email_sigma: null | string;
  email_alpha: null | string;
  email_omega: null | string;
  phone_inner: null | string;
  phone_landline: null | string;
  phone_mobile: null | string;
  phone_mobile_second: null | string;
  supervisor_dezh: null | string;
  supervisor_email_sigma: null | string;
  supervisor_email_alpha: null | string;
  manager_phone_inner: null | string;
  id: number;
}
export interface IKnowledgebaseDezhInfoAccept {
  kod_info: number;
  kod_user: number;
  id: number;
  date_add: string;
}
export interface IKnowledgebaseDezhReports {
  date_add: string;
  title: null | string;
  content: null | string;
  kod_create: null | number;
  kod_edit: null | number;
  kod_place: null | number;
  mail_to: null | string;
  mail_copy: null | string;
  kod_sender: null | number;
  id: number;
  date_edit: null | string;
  sended: boolean;
  date_send: null | string;
}
export interface IKnowledgebaseEksDezh {
  date_add: string;
  date_edit: null | string;
  created_user: null | number;
  edit_user: null | number;
  tags: null | number[];
  id: number;
  kod_sender: null | number;
  title: string;
  information: null | string;
  tag: null | string;
  attach_files: null | number[];
  sended: boolean;
  date_send: null | string;
}
export interface IKnowledgebaseEmails {
  time_add: string;
  email: string;
  mobile_phone: null | string;
  id: number;
}
export interface IKnowledgebaseGlobalUrlList {
  time_add: null | string;
  url: string;
  title: string;
  description: null | string;
  active: null | boolean;
  class: null | string;
  id: number;
}
// export interface IKnowledgebaseJiraIssues {
//   created: null | string;
//   key: string;
//   status: null | string;
//   assignee_key: null | string;
//   assignee_name: null | string;
//   assignee_email: null | string;
//   assignee_displayname: null | string;
//   issuetype_name: null | string;
//   issuetype_subtask: null | boolean;
//   project_key: null | string;
//   project_name: null | string;
//   reporter_key: null | string;
//   reporter_name: null | string;
//   reporter_email: null | string;
//   reporter_displayname: null | string;
//   summary: null | string;
//   labels: null | string;
//   description: null | string;
//   comment_total: null | number;
//   id: number;
//   updated: null | string;
//   date_add: null | string;
//   last_check: null | string;
// }
export interface IKnowledgebaseJiraProjects {
  project: string;
  naimen: null | string;
  active: boolean;
  get_bags: boolean;
  id: number;
  time_add: string;
}
export interface IKnowledgebaseMailGroups {
  group_name: null | string;
  kod_place: null | number;
  id: number;
}
export interface IKnowledgebaseMailList {
  time_add: string;
  kod_group: null | number;
  kod_email: null | number;
  active: boolean;
  id: number;
}
export interface IKnowledgebasePartitionAccess {
  id: number;
  date_add: string;
  namien: string;
  route: string;
  access_all: boolean;
  path: string;
}
export interface IKnowledgebasePgTypesFields {
  type_name: string;
  description: null | string;
  id: number;
}
export interface IKnowledgebasePlace {
  name_place: null | string;
  id: number;
}
export interface IKnowledgebasePprProccess {
  ppr_time: null | string;
  ppr_name: string;
  ppr_description: null | string;
  kod_user: null | number;
  kod_tribe: null | number;
  ppr_type: null | number;
  id: number;
  ppr_time_end: null | string;
  date_begin_plan: null | string;
  date_end_plan: null | string;
  date_begin_fact: null | string;
  date_end_fact: null | string;
}
export interface IKnowledgebasePprTaskStatus {
  status_name: null | string;
  id: number;
}
export interface IKnowledgebasePprTask {
  task_time: null | string;
  task_name: string;
  task_description: null | string;
  kod_user: null | number;
  kod_ppr: null | number;
  kod_task: null | number;
  percent: null | number;
  plan_percent: null | number;
  execute_time_plan: null | number;
  status: null | number;
  task_time_end: null | string;
  date_begin_plan: null | string;
  date_end_plan: null | string;
  date_begin_fact: null | string;
  date_end_fact: null | string;
  execute_time_fact: null | number;
  task_close: null | boolean;
  kod_group: null | number;
  id: number;
}
export interface IKnowledgebasePprType {
  type_name: string;
  id: number;
}
export interface IKnowledgebaseRightsElements {
  kod_role: number;
  kod_table: number;
  table_identificator: number;
  id: number;
  active: null | boolean;
  date_add: null | string;
}
export interface IKnowledgebaseRightsTable {
  naimen: string;
  id: number;
  active: null | boolean;
  date_add: null | string;
}
export interface IKnowledgebaseRolesAccess {
  kod_role: number;
  kod_access: number;
  id: number;
  access_level: number;
  active: null | boolean;
  date_add: null | string;
}
export interface IKnowledgebaseRoles {
  naimen: string;
  description: null | string;
  id: number;
  active: boolean;
  date_add: null | string;
  full_access: null | boolean;
}
export interface IKnowledgebaseRolesUsers {
  kod_role: number;
  kod_user: number;
  id: number;
  access_level: number;
  active: null | boolean;
  date_add: null | string;
}
export interface IKnowledgebaseSearchPostIndex {
  kod_post: number;
  fulltext: null | string;
  id: number;
}
export interface IKnowledgebaseServerPlace {
  time_add: string;
  naimen: string;
  id: number;
  active: boolean;
}
export interface IKnowledgebaseServerStand {
  time_add: string;
  stand: string;
  active: boolean;
  id: number;
}
export interface IKnowledgebaseSmList {
  add_date: null | string;
  query_num: string;
  id: number;
  cats: null | number[];
  use: boolean;
  check_status: boolean;
  add_to_bz: null | string;
  kod_user: null | number;
}
export interface IKnowledgebaseSmUrlPatterns {
  file: null | string;
  pattern: null | string;
  query: null | string;
  avcive: null | boolean;
  link_style: null | string;
  id: number;
  kod_resource: number;
}
/**
 * Все подготовленные AJAX запросы
 */
export interface IKnowledgebaseSysSqlQuery {
  kod_database_tuz: null | number;
  sql_name: string;
  result: "json" | string;
  data_base: "pg" | string;
  id: number;
  need_token: boolean;
  sql_params: null | string;
  date_add: null | string;
  date_modify: null | string;
  kod_user_add: null | number;
  kod_user_modify: null | number;
  active: boolean;
  sql_query: string;
  interface: null | string;
  last_run: null | string;
  run_time: null | number;
}

export interface IKSSQAll extends IKnowledgebaseSysSqlQuery {
  cnt_all: string;
  cnt_script: string;
  status: string;
  date_check: string;
  kod_user_check: number;
  kod_sql: number;
}
/**
 * аудит изменения запросов
 */
export interface IKnowledgebaseSysSqlQueryAudit {
  id: number;
  kod_sql: number;
  sql_name: null | string;
  sql_query: null | string;
  sql_params: null | string;
  result: null | string;
  data_base: null | string;
  date_add: null | string;
  date_check: null | string;
  status: null | string;
  kod_user_change: null | number;
  kod_user_check: null | number;
  active: boolean;
  need_token: boolean;
  kod_database_tuz: null | number;
}
export interface IKnowledgebaseTags {
  naimen: string;
  class: null | string;
  active: null | boolean;
  id: number;
}
export interface IKnowledgebaseTerms {
  term_id: number;
  name: string;
  slug: string;
  term_group: number;
  active: boolean;
  id: number;
}
export interface IKnowledgebaseUploadFiles {
  create_time: null | string;
  original_name: string;
  file_name: null | string;
  file_size: null | number;
  kod_user: null | number;
  active: boolean;
  id: number;
  folder: null | string;
  file_path: null | string;
}
export interface IKnowledgebaseUrlResource {
  base_url: string;
  need_quoted: null | boolean;
  url_name: string;
  query_param1: string;
  query_param2: string;
  id: number;
}
export interface IKnowledgebaseUserAccess {
  date_add: null | string;
  kod_user: number;
  kod_access: number;
  id: number;
  access_level: null | number;
}
export interface IKnowledgebaseWorkGroupEmployees {
  kod_group: number;
  tab_num: number;
  id: number;
  date_add: string;
}
export interface IKnowledgebaseWorkGroup {
  naimen: null | string;
  kod_cluster: null | number;
  kod_group: null | number;
  kod_agile: null | string;
  kod_curator: null | number;
  description: null | string;
  color: null | string;
  icon: null | string;
  kod_user: null | number;
  date_moditify: null | string;
  id: number;
  date_add: null | string;
}
export interface IKnowledgebaseWsChannels {
  id: number;
  naimen: string;
  description: null | string;
  date_add: null | string;
  active: null | boolean;
}
export interface IKnowledgebaseWsMessage {
  kod_user: null | number;
  kod_chatroom: null | number;
  kod_user_to: null | number;
  action: null | string;
  text: null | string;
  id: number;
  date_add: null | string;
}
export interface IKnowledgebaseWsRoom {
  id: number;
  naimen: string;
  kod_channel: null | number;
  date_add: null | string;
  active: null | boolean;
}
export interface IKnowledgebaseWsSubscribes {
  kod_user: number;
  kod_room: null | number;
  id: number;
  date_add: null | string;
  active: null | boolean;
}

/**
 * Логирование выполняемых заданий по расписанию
 */
export interface IKnowledgebaseCronJobsAudit {
  id: number;
  /**
   * id из таблицы cron_jobs
   */
  kod_job: number;
  /**
   * идентификатор пользователя, который последним менял скрипт
   */
  kod_user: number;
  /**
   * параметры запуска задания
   */
  parameters: string;
  time_start: string;
  time_end: string;
  /**
   * лог ошибки
   */
  result: string;
  /**
   * успешное выполнение
   */
  success: boolean;
  /**
   * PID процесса
   */
  pid: number;
  /**
   * PID родительского процесса
   */
  parent_pid: number;
  time_len: {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  };
}
/** связка пользователей с IP адресами */
export interface IKnowledgebaseBzUserIp {
  id: number;
  kod_user: number;
  kod_ip: number;
  date_add: string;
  active: boolean;
  date_last_activ: null | string;
}
/** генерируемые для пользователей токены со сроком действия */
export interface IKnowledgebaseBzUserTokens {
  id: number;
  kod_user: number;
  session_token: string;
  date_add: string;
  date_expired: null | string;
  active: boolean;
}
/** задания, отправленные на выполнения в Jenkins */
export interface IKnowledgebaseJenkinsRuns {
  id: number;
  session_token: string;
  kod_job: number;
  date_add: string;
  date_end: null | string;
  params: null | string;
}
