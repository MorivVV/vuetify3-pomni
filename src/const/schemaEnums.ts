export const enum EJIRA {
  comments = "jira.comments",
  issue_service = "jira.issue_service",
  releases = "jira.releases",
  defects = "jira.defects",
  issue = "jira.issues",
  releases_rovs = "jira.ci_jira_releases",
  projects = "jira.jira_projects",
  issues = "jira.jira_issues",
  old_defs = "jira.ci_jira_defects",
}

export const enum EPGCATALOG {
  pg_tables = "pg_catalog.pg_tables",
  pg_attribute = "pg_catalog.pg_attribute",
  pg_namespace = "pg_catalog.pg_namespace",
  pg_constraint = "pg_catalog.pg_constraint",
  pg_class = "pg_catalog.pg_class",
}
export const enum EINFORMATIONSCHEMA {
  columns = "information_schema.columns",
}
export const enum EAUDIT {
  aud_groups = "audit.aud_groups",
  audit_setting = "audit.audit_setting",
  bd_users = "audit.bd_users",
  defects = "audit.defects",
  dev_team = "audit.dev_team",
  doc_comment = "audit.doc_comment",
  eks_audit = "audit.eks_audit",
  eks_audit_archive = "audit.eks_audit_archive",
  eks_login = "audit.eks_login",
  eks_operation = "audit.eks_operation",
  eks_users = "audit.eks_users",
  operation_runs = "audit.operation_runs",
  partition_access = "audit.partition_access",
  permit_user_operation = "audit.permit_user_operation",
  reason_period = "audit.reason_period",
  reasons = "audit.reasons",
  sys_sql_query = "audit.sys_sql_query",
  user_access = "audit.user_access",
  user_groups = "audit.user_groups",
}
export const enum ECONFIG {
  bd_driver = "config.bd_driver",
  data_bases = "config.data_bases",
  default_settings = "config.default_settings",
  individual_user_settings = "config.individual_user_settings",
  techemail = "config.techemail",
  inbox_mail = "config.inbox_mail",
}
export const enum ECONFA {
  block = "confa.block",
  content = "confa.content",
  pages = "confa.pages",
}
export const enum EREPORTS {
  report_name = "reports.report_name",
  report_state = "reports.report_state",
  column_type = "reports.column_type",
  report_columns = "reports.report_columns",
  report_rows = "reports.report_rows",
  cells = "reports.cells",
}
export const enum EALERT {
  alert = "alert.term",
  dynatrace_yedinaya_korporativnaya_sistema = "alert.dynatrace_yedinaya_korporativnaya_sistema",
  eks_dynatracealert = "alert.eks_dynatracealert",
}
export const enum EMONITORING {
  fp_other_status = "monitoring.fp_other_status",
  fp_transfer_to_eks = "monitoring.fp_transfer_to_eks",
  fp_zachislenie_servces = "monitoring.fp_zachislenie_servces",
  fp_ispolnenie_servces = "monitoring.fp_ispolnenie_servces",
  pgw_status = "monitoring.pgw_status",
  rpp_front_status = "monitoring.rpp_front_status",
  kpi_risk_temp = "monitoring.kpi_risk_temp",
  kpi_inc_exclide = "monitoring.kpi_inc_exclide",
  module_id = "monitoring.module_id",
}
export const enum ECHECKROOM {
  employees = "checkroom.employees",
  r_admins = "checkroom.r_admins",
  r_box = "checkroom.r_box",
  r_departs = "checkroom.r_departs",
  r_location = "checkroom.r_location",
  r_sessions = "checkroom.r_sessions",
  r_users = "checkroom.r_users",
}
export const enum EPULT {
  actions = "pult.actions",
  alert_rule_pool = "pult.alert_rule_pool",
  alert_tables = "pult.alert_tables",
  as_metrics = "pult.as_metrics",
  asystems = "pult.asystems",
  ds_tks_patterns_email = "pult.ds_tks_patterns_email",
  ds_tks_patterns_mail_body = "pult.ds_tks_patterns_mail_body",
  ds_tks_patterns_pattern = "pult.ds_tks_patterns_pattern",
  ds_tks_patterns_pattern_priority = "pult.ds_tks_patterns_pattern_priority",
  duty_schedule = "pult.duty_schedule",
  incidents = "pult.incidents",
  metrics = "pult.metrics",
  monitors = "pult.monitors",
  rule_actions = "pult.rule_actions",
  rules = "pult.rules",
  send_sms = "pult.send_sms",
}
export const enum EKNOWLEGEBASE {
  ab_emp_info = "ab_emp_info",
  browser_list = "browser_list",
  bz_audit = "bz_audit",
  bz_auto_systems = "bz_auto_systems",
  bz_contact_matrix = "bz_contact_matrix",
  bz_favorites_post = "bz_favorites_post",
  bz_group_register = "bz_group_register",
  bz_ip_addres = "bz_ip_addres",
  bz_post = "bz_post",
  bz_post_attach = "bz_post_attach",
  bz_post_terms = "bz_post_terms",
  bz_postmeta = "bz_postmeta",
  bz_send_mails = "bz_send_mails",
  bz_server_info = "bz_server_info",
  bz_user_group = "bz_user_group",
  bz_users = "bz_users",
  bz_users_ip = "bz_users_ip",
  bz_user_tokens = "bz_user_tokens",
  bz_users_params = "bz_users_params",
  bz_version = "bz_version",
  cron_jobs = "cron_jobs",
  cron_jobs_audit = "cron_jobs_audit",
  cron_script_params = "cron_script_params",
  cron_scripts = "cron_scripts",
  dezh_book = "dezh_book",
  dezh_info_accept = "dezh_info_accept",
  dezh_reports = "dezh_reports",
  eks_dezh = "eks_dezh",
  emails = "emails",
  global_url_list = "global_url_list",
  jenkins_runs = "jenkins_runs",
  mail_groups = "mail_groups",
  mail_list = "mail_list",
  partition_access = "partition_access",
  pg_types_fields = "pg_types_fields",
  place = "place",
  ppr_proccess = "ppr_proccess",
  ppr_task = "ppr_task",
  ppr_task_status = "ppr_task_status",
  ppr_type = "ppr_type",
  rights_elements = "rights_elements",
  rights_table = "rights_table",
  roles = "roles",
  roles_access = "roles_access",
  roles_users = "roles_users",
  search_post_index = "search_post_index",
  server_place = "server_place",
  server_stand = "server_stand",
  sm_list = "sm_list",
  sm_url_patterns = "sm_url_patterns",
  sys_sql_query = "sys_sql_query",
  sys_sql_query_audit = "sys_sql_query_audit",
  tags = "tags",
  terms = "terms",
  upload_files = "upload_files",
  url_resource = "url_resource",
  user_access = "user_access",
  work_group = "work_group",
  work_group_employees = "work_group_employees",
  ws_channels = "ws_channels",
  ws_message = "ws_message",
  ws_room = "ws_room",
  ws_subscribes = "ws_subscribes",
}
export const enum ESEODO {
  addressees = "seodo.addressees",
  approvals = "seodo.approvals",
  approvers = "seodo.approvers",
  assistents = "seodo.assistents",
  auto_executor_groups = "seodo.auto_executor_groups",
  auto_logic = "seodo.auto_logic",
  auto_logic_actions = "seodo.auto_logic_actions",
  auto_logic_executors = "seodo.auto_logic_executors",
  auto_logic_logs = "seodo.auto_logic_logs",
  auto_logic_settings = "seodo.auto_logic_settings",
  documents = "seodo.documents",
  employees = "seodo.employees",
  executors = "seodo.executors",
  files = "seodo.files",
  kind = "seodo.kind",
  organization = "seodo.organization",
  search = "seodo.search",
  signature_type = "seodo.signature_type",
  state = "seodo.state",
  task = "seodo.task",
  task_resolution = "seodo.task_resolution",
  users_documents = "seodo.users_documents",
}
export const enum ESMPRIMARY {
  as_cluster = "smprimary.as_cluster",
  as_lider_ops = "smprimary.as_lider_ops",
  assignmentm1 = "smprimary.assignmentm1",
  assignmentb3 = "smprimary.assignmentb3",
  ci_fullhierarchy = "smprimary.ci_fullhierarchy",
  clusters = "smprimary.clusters",
  cm3ra3 = "smprimary.cm3ra3",
  cm3rm1 = "smprimary.cm3rm1",
  cm3tm1 = "smprimary.cm3tm1",
  contctsm1 = "smprimary.contctsm1",
  deptm1 = "smprimary.deptm1",
  device2a5 = "smprimary.device2a5",
  device2m1 = "smprimary.device2m1",
  devicea13 = "smprimary.devicea13",
  devicea9 = "smprimary.devicea9",
  hpcauditcm3rm1 = "smprimary.hpcauditcm3rm1",
  hpcauditdevicem1 = "smprimary.hpcauditdevicem1",
  hpcauditprobsummarym1 = "smprimary.hpcauditprobsummarym1",
  hpcauditrootcausem1 = "smprimary.hpcauditrootcausem1",
  incidentsm1 = "smprimary.incidentsm1",
  probsummarym1 = "smprimary.probsummarym1",
  rootcausem1 = "smprimary.rootcausem1",
  rootcsetsksm1 = "smprimary.rootcsetsksm1",
  sbapprovalm1 = "smprimary.sbapprovalm1",
  sbimtaskm1 = "smprimary.sbimtaskm1",
  sbjitservicem1 = "smprimary.sbjitservicem1",
  sbprobsummarytsm1 = "smprimary.sbprobsummarytsm1",
  sbrequestm1 = "smprimary.sbrequestm1",
  sbrequesttaskm1 = "smprimary.sbrequesttaskm1",
  sbriskm1 = "smprimary.sbriskm1",
  hpcauditsbriskm1 = "smprimary.hpcauditsbriskm1",
  sbrisktaskm1 = "smprimary.sbrisktaskm1",
  sbroutinetaskm1 = "smprimary.sbroutinetaskm1",
  sbroutineworksm1 = "smprimary.sbroutineworksm1",
  sbservicewoa2 = "smprimary.sbservicewoa2",
  sbsoftupdatetaskm1 = "smprimary.sbsoftupdatetaskm1",
  screlationm1 = "smprimary.screlationm1",
  sbimcausem1 = "smprimary.sbimcausem1",
  sbjiraissuem1 = "smprimary.sbjiraissuem1",
  cm3rm2 = "smprimary.cm3rm2",
  sbreferencea7 = "smprimary.sbreferencea7",
  sbjitservica3 = "smprimary.sbjitservica3",
}
export type TBDALLTABLES = `${
  | EPGCATALOG
  | EINFORMATIONSCHEMA
  | EAUDIT
  | ECHECKROOM
  | ECONFA
  | EREPORTS
  | ECONFIG
  | EKNOWLEGEBASE
  | EPULT
  | EMONITORING
  | ESEODO
  | ESMPRIMARY
  | EJIRA}`;

export type TBDMODTABLES = `${
  | EAUDIT
  | ECHECKROOM
  | ECONFA
  | EREPORTS
  | ECONFIG
  | EKNOWLEGEBASE
  | EMONITORING
  | EPULT
  | ESEODO
  | ESMPRIMARY
  | EJIRA}`;
