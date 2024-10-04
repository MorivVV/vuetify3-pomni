export interface IAuditAudGroups {
  id: number;
  naimen: string;
  kod_adr: null | number;
}
export interface IAuditAuditSetting {
  id: number;
  kod_group: null | number;
  naimen: null | string;
  value: null | number;
  active: null | boolean;
}
export interface IAuditDefects {
  id: number;
  naimen: null | string;
  date_beg: string;
  date_end: string;
  description: null | string;
  url: null | string;
  audit_use: null | boolean;
  project: null | string;
  date_resolve: string;
  kod_theme: null | number;
  kod_team: null | number;
}
export interface IAuditDevTeam {
  id: number;
  naimen: null | string;
  project: null | string;
}
export interface IAuditDocComment {
  docum_id: string;
  comments: null | string;
  is_defect: number;
  id: number;
  date_add: null | string;
}
export interface IAuditEksAudit {
  id: number;
  eks_id_aud: string;
  login_eks: null | string;
  kod_operation: null | string;
  eks_obj_id: string;
  diary: null | number;
  op_time: string;
  topic: null | string;
  textaud: null | string;
}
export interface IAuditEksAuditArchive {
  id: number;
  eks_id_aud: string;
  login_eks: null | string;
  kod_operation: null | string;
  eks_obj_id: string;
  diary: null | number;
  op_time: string;
  topic: null | string;
  textaud: null | string;
}
export interface IAuditEksLogin {
  id: number;
  kod_user: number;
  login_eks: string;
  eks_login_id: string;
}
export interface IAuditEksOperation {
  id: number;
  time_add: string;
  when_run: null | number;
  descript: null | string;
  last_run: string;
  eks_id: string;
  method_short: string;
  method_name: string;
  class_id: string;
  class_name: string;
  notification_off: null | boolean;
}
export interface IAuditEksUsers {
  id: number;
  fio: null | string;
  email: null | string;
  tab_num: string;
  last_name: null | string;
  first_name: null | string;
  second_name: null | string;
  to_copy: boolean;
}
export interface IAuditOperationRuns {
  kod_operation: string;
  date_svod: string;
  kol_run: number;
  kod_group: number;
  id: number;
  date_add: null | string;
}
export interface IAuditReasonPeriod {
  id: number;
  kod_operation: null | number;
  kod_reason: null | number;
  date_beg: string;
  date_end: string;
}
export interface IAuditReasons {
  id: number;
  naimen: string;
  doubt: null | number;
  color: null | string;
}
export interface IAuditUserGroups {
  id: number;
  kod_user: number;
  kod_group: number;
}
