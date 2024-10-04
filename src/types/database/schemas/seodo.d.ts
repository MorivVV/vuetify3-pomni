export interface ISeodoAddressees {
  id: number;
  date_add: null | string;
  _id: string;
  _order_number: null | number;
  _reference: null | string;
  _type: null | number;
  _addressee_type: null | number;
  _sign_approved: null | boolean;
  parent_id: string;
}
export interface ISeodoApprovals {
  id: number;
  date_add: null | string;
  _id: string;
  _cycle_number: null | string;
  _approval_type: null | number;
  _reg_card: null | string;
  _author: null | string;
  _file_group: null | string;
  _cycle_description: null | string;
  _kind: null | string;
  _approval_completion_action: null | number;
  _reply_required: null | string;
  _performer: null | string;
  _sign_approved: null | boolean;
  _operator: null | string;
  _approvers: null | number;
  _approval_duration: null | number;
  _appendix_files: null | string;
  _description: null | string;
  _state: null | string;
  _is_template: null | boolean;
  _url: null | string;
  parent_id: string;
}
export interface ISeodoApprovers {
  id: number;
  date_add: null | string;
  _id: string;
  _document_approver: null | string;
  _task: null | string;
  _reply_file: null | string;
  _order_number: null | number;
  _approval_type: null | number;
  _approval_status: null | number;
  _approval_remarks: null | string;
  _employee: null | string;
  _approval_employee: null | string;
  _signature_type: null | string;
  _approval_duration: null | string;
  _sign_approved: null | boolean;
  _approver_file_versions: null | string;
  parent_id: null | string;
}
export interface ISeodoAssistents {
  id: number;
  kod_user: number;
  emp_seodo: string;
  user_add: null | number;
  active: null | boolean;
  date_add: null | string;
}
export interface ISeodoAutoExecutorGroups {
  naimen: string;
  kod_user: null | number;
  id: number;
  date_add: null | string;
}
export interface ISeodoAutoLogicActions {
  _name: null | string;
  _action: null | string;
  id: number;
  date_add: null | string;
}
export interface ISeodoAutoLogic {
  active: null | boolean;
  min_satellite: null | number;
  kod_user_modify: null | number;
  date_modify: null | string;
  kod_group: null | number;
  date_add: null | string;
  id: number;
  kod_user: null | number;
  task_owner: null | string;
  task_action: null | number;
}
export interface ISeodoAutoLogicExecutors {
  kod_logic: null | number;
  kod_executor: string;
  id: number;
  main: boolean;
  date_add: string;
  kod_group: null | number;
}
export interface ISeodoAutoLogicLogs {
  kod_logic: null | number;
  kod_task: null | string;
  field: null | string;
  text: null | string;
  span: null | string;
  match: null | string;
  id: number;
  date_add: null | string;
  prioritet: null | number;
}
export interface ISeodoAutoLogicSettings {
  setting_key: string;
  setting_val: null | string;
  setting_active: null | boolean;
  id: number;
  date_add: null | string;
  date_mod: null | string;
}
export interface ISeodoDocuments {
  _registrator: null | string;
  _external_control: null | boolean;
  _template_id: null | string;
  _performer: null | string;
  _packet_number: null | string;
  _files: null | number;
  _last_files_version_id: null | string;
  _addressees: null | number;
  _executors: null | number;
  _local_org: null | string;
  _origin: null | number;
  _security_refreshing: null | string;
  _template_name: null | string;
  _description: null | string;
  _state: null | string;
  _is_template: null | boolean;
  _url: null | string;
  id: number;
  date_add: null | string;
  _id: string;
  _is_access_type_cofidential: null | boolean;
  _type: null | number;
  _content: null | string;
  _registration_number: null | string;
  _system_number: null | string;
  _kind: null | string;
  _access_type: null | string;
  _urgency: null | string;
  _operator: null | string;
  _registrator_department: null | string;
}
export interface ISeodoEmployees {
  id: number;
  _id: string;
  _last_name: null | string;
  _first_name: null | string;
  _middle_name: null | string;
  _position: null | string;
  _position_importance: null | string;
  _account_name: null | string;
  _phone: null | string;
  _email: null | string;
  _status: null | number;
  _active_employee: null | string;
  _importance: null | string;
  _unit: null | string;
  _deputies: null | number;
  _mobile_phone: null | string;
  _location: null | string;
  _root_organization: null | string;
  _name: null | string;
}
export interface ISeodoExecutors {
  id: number;
  date_add: null | string;
  parent_id: string;
  _id: string;
  _order: null | number;
  _employee: null | string;
}
export interface ISeodoFiles {
  _id: string;
  _extension: null | string;
  _size: null | number;
  _size_string: null | string;
  _name: null | string;
  _owner_id: null | string;
  _importance: null | number;
  _lock_owner: null | string;
  _parent_id: null | string;
  _is_signed: null | boolean;
  parent_id: string;
  id: number;
}
export interface ISeodoKind {
  id: number;
  date_add: null | string;
  _id: string;
  _not_available: null | boolean;
  _child_kinds: null | string;
  _name: null | string;
}
export interface ISeodoOrganization {
  _id: string;
  _name: null | string;
  _not_available: null | boolean;
  id: number;
}
export interface ISeodoSearch {
  docum_id: null | string;
  employee_id: null | string;
  field_name: null | string;
  id: number;
}
export interface ISeodoSignatureType {
  _id: string;
  _properties: null | number;
  _comment: null | string;
  _not_available: null | boolean;
  _name: null | string;
  id: number;
}
export interface ISeodoState {
  id: number;
  date_add: null | string;
  _id: string;
  _name: null | string;
}
export interface ISeodoTask {
  _id: string;
  _appointed_type: null | number;
  _control: null | number;
  _author: null | string;
  _control_term: null | string;
  _actual_term: null | string;
  _finish_work_term: null | string;
  _text: null | string;
  _files: null | string;
  _is_new: null | boolean;
  _is_expired: null | boolean;
  _expired_days: null | number;
  _categories: null | string;
  _source: null | string;
  _document: null | string;
  _parent_part_reg_number: null | string;
  _pursuance_document: null | string;
  _resolution: null | string;
  _kind: null | string;
  _pursuance_require: null | boolean;
  _report_require: null | boolean;
  _executor: null | string;
  _theme: null | string;
  _approver_id: null | string;
  _reply_files: null | number;
  _collection_of_reply_files: null | boolean;
  _approval_remarks: null | string;
  _delegated_approval_task: null | boolean;
  _approval_status: null | number;
  _task_number: null | string;
  _execution_progress: null | string;
  _autoexecuted: null | boolean;
  _appointed: null | string;
  _signer: null | string;
  _arranger: null | string;
  _part_executors: null | string;
  _urgency: null | string;
  _controller: null | string;
  _status: null | number;
  _head_control: null | number;
  _approver_file_versions: null | string;
  _appendix_files: null | string;
  _root_task: null | string;
  _control_root_part_reg_number: null | string;
  _parent_part_number: null | number;
  _resolution_state: null | string;
  _resolution_arranger: null | string;
  _description: null | string;
  _state: null | string;
  _is_template: null | boolean;
  _url: null | string;
  id: number;
  date_add: null | string;
}
export interface ISeodoTaskResolution {
  _id: string;
  _signer: null | string;
  _parent_task: null | string;
  _approver: null | string;
  _arranger: null | string;
  _state: null | string;
  _parts: null | number;
  _child_resolution: null | string;
  _child_resolution_state: null | string;
  _name: null | string;
  id: number;
}
export interface ISeodoUsersDocuments {
  _id: string;
  _appointed_type: null | number;
  _control: null | number;
  _author: null | string;
  _text: null | string;
  _files: null | string;
  _is_new: null | boolean;
  _is_expired: null | boolean;
  _expired_days: null | number;
  _categories: null | string;
  _source: null | string;
  _document: null | string;
  _parent_part_reg_number: null | string;
  _pursuance_document: null | string;
  _resolution: null | string;
  _kind: null | string;
  _pursuance_require: null | boolean;
  _report_require: null | boolean;
  _executor: null | string;
  _theme: null | string;
  _approver_id: null | string;
  _reply_files: null | number;
  _collection_of_reply_files: null | boolean;
  _approval_remarks: null | string;
  _delegated_approval_task: null | boolean;
  _approval_status: null | number;
  _task_number: null | string;
  _execution_progress: null | string;
  _autoexecuted: null | boolean;
  _appointed: null | string;
  _signer: null | string;
  _arranger: null | string;
  _part_executors: null | string;
  _urgency: null | string;
  _controller: null | string;
  _status: null | number;
  _head_control: null | number;
  _approver_file_versions: null | string;
  _appendix_files: null | string;
  _root_task: null | string;
  _control_root_part_reg_number: null | string;
  _parent_part_number: null | number;
  _resolution_state: null | string;
  _resolution_arranger: null | string;
  _description: null | string;
  _state: null | string;
  _is_template: null | boolean;
  _url: null | string;
  parent_id: string;
  auto_work: null | number;
  time_get_data: null | string;
  add_date: null | string;
  update_date: null | string;
  id: number;
  prioritet: number;
}
