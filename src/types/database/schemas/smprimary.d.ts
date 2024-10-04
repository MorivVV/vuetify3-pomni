/**
 * КЭ, Лидер ОПС, Кластер
 */
export interface ISmprimaryAsCluster {
  id: number;
  logical_name: string;
  lider_ops: null | string;
  cluster: null | string;
  date_add: null | string;
  date_modify: null | string;
  kod_user: null | number;
  kod_cluster: null | number;
  lider_ops_list: null | string[];
}
/**
 * Список лидеров ОПС (+ почты)
 */
export interface ISmprimaryAsLiderOps {
  id: number;
  naimen: string;
  email_list: string[] | null;
  kod_user: number;
  date_add: string;
  date_modify: string | null;
}
/**
 * Рабочая группа
 */
export interface ISmprimaryAssignmentm1 {
  p_name: string;
  p_hpc_name_name: null | string;
  p_hpc_parent_name: null | string;
  p_hpc_parent: null | string;
  p_sb_for_sbrequest_from_portal: null | boolean;
  p_hpc_modified_by_name: null | string;
  p_hpc_created_by_name: null | string;
  p_sb_rc_local_coordinator_name: null | string;
  p_sb_rsk_local_coordinator_name: null | string;
  p_hpc_department_name: null | string;
  p_sb_cm3r_responsible_update_ci1: null | string;
  p_hpc_coordinator_name: null | string;
  p_hpc_coordinator: null | string;
  id: number;
  p_sb_kurator_name: null | string;
  p_hpc_status: null | string;
  p_sb_terbank: null | string;
  p_hpc_email: null | string;
  p_sb_smax_id: null | string;
  date_update: null | string;
  date_add: string;
}

/**
 * Соответствие рабочая группа - персонал
 */
export interface ISmprimaryAssignmentb3 {
  id: number;
  p_name: null | string;
  p_record_number: number;
  p_hpc_assignees_name: null | string;
}

/**
 * Иеарархия КЭ, все связанные сущности
 */
export interface ISmprimaryCiFullhierarchy {
  p_id: string;
  p_rid: string;
  p_category: null | string;
  p_category_code: null | string;
  p_typee: null | string;
  p_type_code: null | string;
  p_status: null | string;
  p_rcategory: null | string;
  p_rcategory_code: null | string;
  p_rtypee: null | string;
  id: number;
  p_rtype_code: null | string;
  p_rstatus: null | string;
  p_pathh: null | string;
  p_is_leaf: null | number;
  p_lvl: null | number;
  date_update: null | string;
  date_add: string;
}
/**
 * Релизы и РОВы из Jira
 */
export interface ISmprimaryCiJiraReleases {
  created: null | string;
  summary: null | string;
  status: null | string;
  ci: null | string;
  issue: string;
  priority: null | string;
  psi_protocol_appr_day: null | string;
  approving: null | string;
  service_short_name: null | string;
  issuetype: null | string;
  date_modify: null | string;
  id: number;
  date_add: null | string;
}

/**
 * названия кластеров
 */
export interface ISmprimaryClusters {
  cluster_name: null | string;
  kod_user: null | number;
  date_update: null | string;
  id: number;
  date_add: null | string;
  service_dezh: boolean;
}

/**
 * assets КЭ (КЭ в конфигурационной информации в ЗНИ), по каким КЭ ЗНИ
 */
export interface ISmprimaryCm3ra3 {
  p_number: string;
  p_record_number: number;
  p_assets: null | string;
  date_update: null | string;
  id: number;
  date_add: null | string;
}

/**
 * ЗНИ
 */
export interface ISmprimaryCm3rm1 {
  p_number: string;
  p_hpc_assign_dept_name: null | string;
  p_assign_dept: null | string;
  p_affected_item: null | string;
  p_current_phase: null | string;
  p_hpc_tpl_id: null | string;
  p_hpc_tpl_name: null | string;
  p_assigned_to: null | string;
  p_category: null | string;
  p_initial_impact: null | string;
  p_close_time: null | string;
  p_sb_approval_start: null | string;
  p_sb_approval_finish: null | string;
  p_orig_date_entered: null | string;
  p_options: null | string;
  p_sb_is_backout_change: null | boolean;
  p_date_entered: null | string;
  p_hpc_initiator_name: null | string;
  p_hpc_contact_name_name: null | string;
  p_contact_name: null | string;
  p_hpc_modified_by_name: null | string;
  p_hpc_created_by_name: null | string;
  p_hpc_created_by: null | string;
  p_hpc_resolution_code: null | string;
  p_closing_comments: null | string;
  p_hpc_next_breach: null | string;
  p_hpc_assignee_name: null | string;
  p_hpc_assignee: null | string;
  p_brief_description: null | string;
  p_sb_deadline_overdue: null | boolean;
  p_hpc_manager_name: null | string;
  p_hpc_manager: null | string;
  p_description: null | string;
  p_hpc_affected_item_name: null | string;
  p_sb_plan_end_plan: null | string;
  p_sb_plan_end_approval: null | string;
  p_backout_comments: null | string;
  p_planned_start: null | string;
  p_planned_end: null | string;
  p_priority_code: null | string;
  p_rejectreason: null | string;
  p_closurecomments: null | string;
  p_hpc_significance: null | string;
  p_hpc_status: null | string;
  p_sb_approval_status1: null | string;
  p_sb_approval_status2: null | string;
  p_sb_approval_status3: null | string;
  p_sb_environmenttype: null | string;
  p_sb_current_appr_phase: null | string;
  p_hpc_type_of_tpl: null | string;
  p_hpc_actual_start: null | string;
  p_hpc_actual_finish: null | string;
  p_approval_status: null | string;
  p_sysmodtime: null | string;
  p_open: null | boolean;
  p_status: null | string;
  p_subcategory: null | string;
  p_product_type: null | string;
  p_hpc_logical_name_name: null | string;
  p_hpc_approve_initiator_name: null | string;
  p_hpc_urgent: null | boolean;
  date_update: null | string;
  id: number;
  date_add: string;
}

/**
 * T-шки - Задача по ЗНИ
 */
export interface ISmprimaryCm3tm1 {
  p_number: string;
  p_page: null | number;
  p_total_pages: null | number;
  p_category: null | string;
  p_status: null | string;
  p_approval_status: null | string;
  p_assign_dept: null | string;
  p_reason: null | string;
  p_current_phase: null | string;
  p_priority_code: null | string;
  p_date_entered: null | string;
  p_operator: null | string;
  p_last: null | boolean;
  p_open: null | boolean;
  p_orig_date_entered: null | string;
  p_orig_operator: null | string;
  p_parent_change: null | string;
  p_backout_duration: null | string;
  p_parent_phase: null | string;
  p_close_time: null | string;
  p_agreement_ids: null | string;
  p_description: null | string;
  p_jobname: null | string;
  p_brief_desc: null | string;
  p_sla_breach: null | boolean;
  p_id: null | number;
  p_completion_code: null | number;
  p_sysmodcount: null | number;
  p_sysmoduser: null | string;
  p_sysmodtime: null | string;
  p_affected_item: null | string;
  p_hpc_status: null | string;
  p_hpc_assignee: null | string;
  p_hpc_resolution_code: null | string;
  p_hpc_planned_duration: null | string;
  p_hpc_planned_caldutyh: null | string;
  p_sb_planning_skipped: null | boolean;
  p_hpc_tpl_name: null | string;
  p_hpc_stage_no: null | number;
  p_hpc_created_by: null | string;
  p_hpc_created_by_name: null | string;
  p_hpc_modified_by: null | string;
  p_hpc_modified_by_name: null | string;
  p_hpc_actual_finish: null | string;
  p_hpc_actual_start: null | string;
  p_hpc_plan_finish: null | string;
  p_hpc_plan_start: null | string;
  p_hpc_actual_duration: null | string;
  p_sb_c_planned_duration: null | string;
  p_sb_c_planned_caldutyh: null | string;
  p_sb_proto_no_answer: null | boolean;
  p_sb_stop_workflow: null | boolean;
  p_sb_normative_date: null | string;
  p_hpc_start_correct_plan: null | string;
  p_sb_assign_time: null | string;
  p_sb_affected_item_name: null | string;
  p_sb_affected_item_category: null | string;
  p_hpc_is_custom_sla: null | boolean;
  p_hpc_open_time: null | string;
  p_hpc_sla_duration: null | string;
  p_hpc_assign_dept_name: null | string;
  p_hpc_closurecomments: null | string;
  p_hpc_corrected_plan_done: null | string;
  p_hpc_assignee_name: null | string;
  p_hpc_tpl_id: null | string;
  p_subcategory: null | string;
  p_tps_intsd_source_id: null | string;
  p_hpc_initiator: null | string;
  p_hpc_initiator_name: null | string;
  p_hpc_next_breach: null | string;
  p_sb_1_hour_to_deadline: null | boolean;
  p_sb_deadline_overdue: null | boolean;
  p_hpc_update_time: null | string;
  p_hpc_workflow_number: null | number;
  p_sb_helpdesk: null | string;
  p_sb_terbank: null | string;
  p_hpc_thread_number: null | number;
  p_sb_init_start_date: null | string;
  p_sb_task_close_notify: null | boolean;
  p_sb_is_plan_service_unavailabi: null | boolean;
  p_sb_granted_by_next_breach: null | boolean;
  date_update: null | string;
  id: number;
  date_add: string;
}

/**
 * Персонал
 */
export interface ISmprimaryContctsm1 {
  p_contact_name: string;
  p_dept: null | string;
  p_last_name: null | string;
  p_first_name: null | string;
  p_contact_phone: null | string;
  p_extension: null | string;
  p_location: null | string;
  p_email: null | string;
  p_home_phone: null | string;
  p_comments: null | string;
  p_title: null | string;
  p_portable_phone: null | string;
  p_sb_old_dept: null | string;
  p_email_events: null | string;
  p_location_code: null | string;
  p_updated_by: null | string;
  p_event_updated: null | boolean;
  p_sysmodtime: null | string;
  p_wdcontacttimestamp: null | number;
  p_sysmodcount: null | number;
  p_sysmoduser: null | string;
  p_valid_to: null | string;
  p_operator_id: null | string;
  p_user_type: null | string;
  p_location_full_name: null | string;
  p_time_zone: null | string;
  p_full_name: null | string;
  p_hpc_dept_name: null | string;
  p_hpc_corp_structure: null | string;
  p_hpc_no_integration: null | boolean;
  p_tps_midname: null | string;
  p_hpc_dept_id: null | string;
  p_tps_birth_date: null | string;
  p_tps_sex: null | string;
  p_tps_initials: null | string;
  p_tps_dept1_name: null | string;
  p_tps_dept2_name: null | string;
  p_tps_dept3_name: null | string;
  p_tps_registration_request: null | string;
  p_tps_employee_id: null | string;
  p_tps_status: null | string;
  p_tps_alpha_login: null | string;
  p_tps_primary_email: null | string;
  p_tps_kob_install: null | boolean;
  p_tps_avpo_install: null | boolean;
  p_tps_blocked: null | boolean;
  p_tps_ext_email: null | string;
  p_tps_create_time: null | string;
  p_hpc_created_by: null | string;
  p_hpc_created_by_name: null | string;
  p_hpc_modified_by_name: null | string;
  p_tps_intsd_source_id: null | string;
  p_tps_send_email_group_assign: null | boolean;
  p_tps_send_email_me_assign: null | boolean;
  p_tps_aib: null | boolean;
  p_tps_aib_comment: null | string;
  p_tps_email_me_approval: null | boolean;
  p_hpc_default_format_probsummar: null | string;
  p_hpc_default_format_incidents: null | string;
  p_hpc_default_format_rootcause: null | string;
  p_hpc_modified_by: null | string;
  p_tps_date_format: null | number;
  p_hpc_update_time: null | string;
  p_hpc_default_format_rctask: null | string;
  p_hpc_default_tpl_incidents: null | string;
  p_hpc_default_tpl_probsummary: null | string;
  p_hpc_default_tpl_cm3r: null | string;
  p_hpc_default_tpl_cm3t: null | string;
  p_hpc_default_tpl_rootcause: null | string;
  p_hpc_default_tpl_rctask: null | string;
  p_hpc_tpl_id: null | string;
  p_tps_name: null | string;
  p_sb_sap_identification: null | string;
  p_sb_smsdelivery: null | boolean;
  p_sb_smsdeliveryon: null | boolean;
  p_sb_limitedsmsdelivery: null | boolean;
  p_sb_vsp: null | boolean;
  p_sb_terbank: null | string;
  p_sb_rw_email_me_assign: null | boolean;
  p_sb_rw_email_group_assign: null | boolean;
  p_sb_emaildeliveryon: null | boolean;
  p_sb_dept: null | string;
  p_portal_pin: null | string;
  p_portal_pin_temp: null | string;
  p_portal_pin_date: null | string;
  p_sb_subscription_change: null | boolean;
  p_sb_prolong_request: null | string;
  p_sb_last_release_notes_id: null | string;
  p_sb_activate_risk_emails: null | boolean;
  p_sb_activate_risk_emails_wg: null | boolean;
  p_sb_title_id: null | number;
  p_sb_language: null | string;
  p_sb_absence_code: null | string;
  p_sb_absence_reason: null | string;
  p_sb_absence_start: null | string;
  p_sb_absence_end: null | string;
  p_sb_sap_guid: null | string;
  p_sb_work_type_value: null | string;
  p_sb_work_type_desc: null | string;
  p_sb_work_type_start: null | string;
  p_sb_work_type_end: null | string;
  p_sb_work_type_bitl_start: null | string;
  p_sb_fire_date: null | string;
  p_sb_monitoring_system: null | boolean;
  p_sb_close_access_change_dept: null | string;
  p_sb_smax_id: null | string;
  p_sb_sap_last_appear: null | string;
  p_sb_fire_without_delay: null | boolean;
  p_sb_sbrequest_protocol_notify: null | boolean;
  p_sb_sbrequest_return_notify: null | boolean;
  p_sb_probsummary_notify_90: null | boolean;
  p_sb_probsummary_notify_50: null | boolean;
  p_sb_sbimtask_notify_50: null | boolean;
  p_sb_sbimtask_breach_notify: null | boolean;
  p_sb_sbrequesttask_group_notify: null | boolean;
  p_sb_sbrequest_notify_80: null | boolean;
  p_sb_probsummary_notify_80: null | boolean;
  p_sb_sbimtask_notify_80: null | boolean;
  date_update: null | string;
  id: number;
  date_add: string;
}

/**
 * Организации
 */
export interface ISmprimaryDeptm1 {
  p_dept_id: string;
  p_dept: null | string;
  p_tps_location_id: null | string;
  p_tps_source_id: null | string;
  p_sb_sap_identification: null | string;
  p_tps_tb_id: null | string;
  p_sb_inn: null | string;
  p_tps_category: null | string;
  p_tps_short_name: null | string;
  p_tps_location_name: null | string;
  p_tps_name: null | string;
  p_hpc_dept_name: null | string;
  p_hpc_responsible_for_budget: null | string;
  p_sb_sep_dept: null | boolean;
  p_sb_dept_for_subscription: null | boolean;
  p_sb_curator_dept_name: null | string;
  p_sb_curator_dept_id: null | string;
  p_hpc_corp_structure: null | string;
  p_title: null | string;
  p_hpc_parent_name: null | string;
  p_hpc_parent: null | string;
  p_tps_manager_name: null | string;
  p_tps_manager_id: null | string;
  p_sb_manager_approval_name: null | string;
  p_sb_manager_approval_id: null | string;
  p_tps_status: null | string;
  p_sb_terbank: null | string;
  p_sb_functional_module: null | string;
  p_dept_name: null | string;
  p_tps_intsd_source_id: null | string;
  p_sb_for_vj_only: null | boolean;
  date_update: null | string;
  id: number;
  date_add: string;
}

/**
 * Администраторы КЭ
 */
export interface ISmprimaryDevice2a5 {
  p_logical_name: null | string;
  p_record_number: number;
  p_tps_support_groups: null | string;
  date_update: null | string;
  id: number;
  date_add: string;
}

/**
 * CI КЭ - Конфигурационные элементы
 */
export interface ISmprimaryDevice2m1 {
  p_logical_name: string;
  p_sb_administrator_group: null | string;
  p_sb_administrator_group_id: null | string;
  p_assignment: null | string;
  p_group: null | string;
  p_sb_responsibility_wg_name: null | string;
  p_sb_responsibility_wg: null | string;
  p_sb_zni_id: null | string;
  p_tps_up_ci_code: null | string;
  p_sb_old_ci: null | string;
  p_tps_assignee_id: null | string;
  p_tps_assignee_name: null | string;
  p_sb_vendor: null | string;
  p_sb_vendor_id: null | string;
  p_version: null | string;
  p_tps_own_coordinator_name: null | string;
  p_tps_own_coordinator_id: null | string;
  p_hpc_assignment_parent_name: null | string;
  p_hpc_assignment_parent: null | string;
  p_tps_trial_operation_date: null | string;
  p_install_date: null | string;
  p_tps_retirement_date: null | string;
  p_tps_web_name: null | string;
  p_tps_dns_name: null | string;
  p_tps_characteristics: null | string;
  p_sb_it_leader_name: null | string;
  p_sb_it_leader_id: null | string;
  p_type: null | string;
  p_sb_nexus_short_link: null | string;
  p_subnet_mask: null | string;
  p_sb_service_man_name: null | string;
  p_sb_service_man: null | string;
  p_tps_name: null | string;
  p_title: null | string;
  p_tps_service_description: null | string;
  p_itservice: null | boolean;
  p_tps_up_ci_code_name: null | string;
  p_sb_release_link: null | string;
  p_hpc_status: null | string;
  p_subtype: null | string;
  p_owner: null | string;
  p_ip_address: null | string;
  p_mac_address: null | string;
  p_tps_port: null | string;
  date_update: null | string;
  id: number;
  date_add: string;
  p_sb_status: null | string;
  p_hpc_device_type_rus: null | string;
  p_created_by_date: null | string;
  p_sb_service_level: null | string;
  p_hpc_created_by_name: null | string;
  p_tps_block: null | string;
}

/**
 * КЭ (+ основной локальный координатор Рисков)
 */
export interface ISmprimaryDevicea13 {
  p_logical_name: string;
  p_record_number: number;
  p_sb_risk_local_coord: null | string;
  date_update: null | string;
  id: number;
  date_add: null | string;
}

/**
 * КЭ (+ основной локальный координатор Проблем)
 */
export interface ISmprimaryDevicea9 {
  p_logical_name: string;
  p_record_number: number;
  p_sb_prob_local_coord: null | string;
  date_update: null | string;
  id: number;
  date_add: null | string;
}

/**
 * Аудит полей Задания по Изменению
 */
export interface ISmprimaryHpcauditcm3rm1 {
  p_thenumber: string;
  p_id: null | string;
  p_old_simple_val: null | string;
  p_new_simple_val: null | string;
  p_who: null | string;
  p_who_name: null | string;
  p_time: null | string;
  p_old_simple_key_val: null | string;
  p_new_simple_key_val: null | string;
  p_name_of_field: null | string;
  p_old_rel_type: null | string;
  p_new_rel_type: null | string;
  p_field: null | string;
  date_update: null | string;
  id: number;
  date_add: null | string;
}

/**
 * Аудит полей КЭ
 */
export interface ISmprimaryHpcauditdevicem1 {
  p_thenumber: string;
  p_id: null | string;
  p_old_simple_val: null | string;
  p_new_simple_val: null | string;
  p_who: null | string;
  p_who_name: null | string;
  p_time: null | string;
  p_old_simple_key_val: null | string;
  p_new_simple_key_val: null | string;
  p_name_of_field: null | string;
  p_old_rel_type: null | string;
  p_new_rel_type: null | string;
  p_field: null | string;
  id: number;
  date_add: null | string;
  date_update: null | string;
}

/**
 * Аудит полей инцидента
 */
export interface ISmprimaryHpcauditprobsummarym1 {
  p_thenumber: string;
  p_id: null | string;
  p_old_simple_val: null | string;
  p_new_simple_val: null | string;
  p_old_array_val: null | string;
  p_new_array_val: null | string;
  p_who: null | string;
  p_who_name: null | string;
  p_time: null | string;
  p_old_simple_key_val: null | string;
  p_new_simple_key_val: null | string;
  p_name_of_field: null | string;
  p_old_rel_type: null | string;
  p_new_rel_type: null | string;
  p_field: null | string;
  date_update: null | string;
  id: number;
  date_add: null | string;
}

/**
 * SD (Обращение)
 */
export interface ISmprimaryIncidentsm1 {
  p_incident_id: string;
  p_hpc_assigned_helpdesk: null | string;
  p_hpc_tpl_name: null | string;
  p_logical_name: null | string;
  p_assignment: null | string;
  p_category: null | string;
  p_closed_by: null | string;
  p_opened_by: null | string;
  p_affected_item: null | string;
  p_initial_impact: null | string;
  p_sb_vsp_self_decision: null | boolean;
  p_sb_actual_finish: null | string;
  p_close_time: null | string;
  p_hpc_actual_finish: null | string;
  p_subcategory: null | string;
  p_hpc_workaround: null | string;
  p_hpc_modified_by_name: null | string;
  p_hpc_created_by_name: null | string;
  p_open_time: null | string;
  p_resolution_code: null | string;
  p_sb_callback_contact_name: null | string;
  p_hpc_next_breach: null | string;
  p_sla_breach: null | boolean;
  p_hpc_logical_name_name: null | string;
  p_hpc_actual_start: null | string;
  p_hpc_active: null | boolean;
  p_hpc_contact_name_name: null | string;
  p_sb_k2: null | boolean;
  p_hpc_dept_name: null | string;
  p_description: null | string;
  p_priority_code: null | string;
  p_sb_forecast_time: null | string;
  p_resolution: null | string;
  p_hpc_status: null | string;
  p_sb_tb_id: null | string;
  p_title: null | string;
  p_hpc_affected_item_name: null | string;
  p_sb_rm_incident_id: null | string;
  p_sb_rm_rights_id: null | string;
  p_sb_rm_profile_id: null | string;
  p_opened_by_uid: null | string;
  p_callback_contact: null | string;
  p_contact_name: null | string;
  p_first_call: null | boolean;
  p_open: null | string;
  p_sysmodtime: null | string;
  p_unassigned: null | boolean;
  p_update_action: null | string;
  p_severity: null | string;
  p_hpc_assignment_name: null | string;
  p_hpc_assignment: null | string;
  p_hpc_assignee_name: null | string;
  p_hpc_assignee: null | string;
  p_sb_drug_id: null | string;
  date_update: null | string;
  id: number;
  date_add: string;
}

/**
 * IM (Инцидент)
 */
export interface ISmprimaryProbsummarym1 {
  /** номер инцидента */
  p_number: string;
  p_hpc_tpl_name: null | string;
  p_hpc_assignment_name: null | string;
  p_affected_services: null | string;
  p_assignee_name: null | string;
  p_assignment: null | string;
  p_category: null | string;
  p_owner: null | string;
  p_parent_incident: null | string;
  p_opened_by: null | string;
  p_logical_name: null | string;
  p_hpc_assignment: null | string;
  /** КЭ услуги  */
  p_affected_item: null | string;
  p_hpc_tpl_id: null | string;
  p_sb_basic_incident: null | boolean;
  p_hpc_external_identification: null | string;
  p_close_time: null | string;
  p_hpc_assigned_time: null | string;
  p_hpc_actual_finish: null | string;
  p_sb_actual_finish: null | string;
  p_options: null | string;
  p_hpc_workaround: null | string;
  p_hpc_contact_name_name: null | string;
  p_hpc_caused_by_change: null | boolean;
  p_hpc_inc_closed: null | boolean;
  p_hpc_incident: null | boolean;
  p_hpc_is_mass: null | boolean;
  p_hpc_assignee_name: null | string;
  p_subcategory: null | string;
  p_hpc_ci_category: null | string;
  p_hpc_modified_by_name: null | string;
  p_hpc_created_by_name: null | string;
  p_product_type: null | string;
  /** время зарегестрирован */
  p_open_time: null | string;
  p_resolution_code: null | string;
  p_hpc_next_breach: null | string;
  p_sla_breach: null | boolean;
  p_hpc_logical_name_name: null | string;
  p_sb_root_incident: null | boolean;
  p_sb_next_breach_increased: null | boolean;
  p_hpc_ci_maintenance_group: null | string;
  p_hpc_active: null | boolean;
  p_sb_inthub_id: null | string;
  p_sb_tst_tid: null | string;
  p_contact_name: null | string;
  /** Оказано влияние в периметре инцидента */
  p_hot_tic: null | boolean;
  p_title: null | string;
  p_hpc_dept_name: null | string;
  p_folder: null | string;
  p_hpc_plan_start: null | string;
  p_hpc_plan_start2: null | string;
  p_action: null | string;
  p_sb_substatus: null | string;
  p_first_time_fix: null | boolean;
  p_priority_code: string;
  p_hpc_cause: null | string;
  p_sb_forecast_move_cause: null | string;
  p_hpc_plan_finish: null | string;
  p_resolution: null | string;
  p_hpc_status: null | string;
  p_sb_teg: null | string;
  p_brief_description: null | string;
  p_city: null | string;
  /** Наименование услуги */
  p_hpc_affected_item_name: null | string;
  p_hpc_flag: null | boolean;
  p_flag: null | boolean;
  p_hpc_monitoring_state_unused: null | string;
  p_hpc_created_by: null | string;
  p_incident_id: null | string;
  p_sysmodtime: null | string;
  p_tps_intsd_source_id: null | string;
  p_update_time: null | string;
  p_sb_sbs_identification: null | string;
  p_hpc_assignee: null | string;
  p_sb_drug_id: null | string;
  p_hpc_parent_id: null | string;
  p_hpc_sourceid: null | string;
  date_update: null | string;
  id: number;
  date_add: string;
  /** Приведенное время простоя (мин.) */
  p_kpi_value: null | number;
  p_sb_actual_time_fail_start: null | string;
  p_sb_actual_time_fail_end: null | string;
}

/**
 * PM (Проблема)
 */
export interface ISmprimaryRootcausem1 {
  p_id: string;
  p_category: null | string;
  p_assignment: null | string;
  p_status: null | string;
  p_logical_name: null | string;
  p_brief_description: null | string;
  p_description: null | string;
  p_root_cause: null | string;
  p_open: null | boolean;
  p_open_time: null | string;
  p_opened_by: null | string;
  p_update_time: null | string;
  p_updated_by: null | string;
  p_close_time: null | string;
  p_closed_by: null | string;
  p_priority_code: null | string;
  p_sysmodtime: null | string;
  p_sysmodcount: null | number;
  p_sysmoduser: null | string;
  p_subcategory: null | string;
  p_product_type: null | string;
  p_resolution: null | string;
  id: number;
  p_workaround: null | string;
  p_affected_ci_count: null | number;
  p_sla_breach: null | boolean;
  p_next_breach: null | string;
  p_closure_code: null | string;
  p_rcstatus: null | string;
  p_hpc_status: null | string;
  p_hpc_contact_name: null | string;
  p_hpc_assignee: null | string;
  p_hpc_open_time: null | string;
  p_hpc_assignee_name: null | string;
  p_sb_assignment_name: null | string;
  p_sb_known_error: null | boolean;
  p_hpc_created_by: null | string;
  p_hpc_created_by_name: null | string;
  p_hpc_modified_by: null | string;
  p_hpc_modified_by_name: null | string;
  p_sb_logical_name_name: null | string;
  p_sb_actual_finish: null | string;
  p_sb_actual_start: null | string;
  p_hpc_contact_name_name: null | string;
  p_sb_known_error_time: null | string;
  p_sb_user_contact: null | string;
  p_sb_user_contact_name: null | string;
  p_hpc_next_breach: null | string;
  p_hpc_update_time: null | string;
  p_sb_affected_item: null | string;
  p_sb_affected_item_name: null | string;
  p_sb_helpdesk: null | string;
  p_sb_terbank: null | string;
  p_sb_local_coordinator: null | string;
  p_sb_local_coordinator_name: null | string;
  p_sb_have_custom_op_in_prod: null | boolean;
  p_sb_registration_base: null | string;
  p_sb_return_to_analysis_count: null | number;
  p_sb_pvb_risk_factor_id: null | string;
  p_coordinator_dept: null | string;
  p_coordinator_dept_name: null | string;
  p_local_coordinator_dept: null | string;
  p_local_coordinator_dept_name: null | string;
  p_sb_incident_number: null | string;
  p_sb_custom_operation_in_prod: null | string;
  p_sb_affected_item_category: null | string;
  p_sb_teg: null | string;
  p_options: null | string;
  p_sb_tplrespcenter_name: null | string;
  p_sb_tplrespcenter_version: null | string;
  p_sb_problem_coordinator: null | string;
  p_sb_problem_coordinator_name: null | string;
  p_sb_custom_sla_breach: null | boolean;
  p_sb_number_of_changes_next_bre: null | number;
  p_source: null | string;
  p_contact_name: null | string;
  p_sb_coordinator_control: null | boolean;
  p_sb_registration_duration: null | string;
  p_sb_tech_mandatory: null | boolean;
  p_sb_source_error: null | string;
  p_sb_advice_priority: null | string;
  p_sb_autopilot: null | boolean;
  p_solve_next_breach: null | string;
  p_scoring: null | number;
  p_monitoring_date: null | string;
  p_monitoring_to: null | string;
  p_assign_date: null | string;
  p_solve_start_date: null | string;
  p_subcategory_id: null | string;
  p_sb_source_error_id: null | string;
  p_product_type_id: null | string;
  p_sb_plan_analysis: null | string;
  p_sb_is_plan_analysis_violated: null | boolean;
  p_sb_need_attention_expert: null | boolean;
  p_sb_reliability_experts_wg: null | string;
  p_sb_reliability_experts_wg_id: null | string;
  p_sb_need_attention_date: null | string;
  p_sb_risk_probability_per_year: null | number;
  p_sb_service_impact_duration: null | number;
  date_update: null | string;
  date_add: string;
}

/**
 * Аудит полей Задания по проблеме
 */
export interface ISmprimaryHpcauditrootcausem1 {
  id: number;
  p_thenumber: string;
  p_id: null | string;
  p_old_simple_val: null | string;
  p_new_simple_val: null | string;
  p_who: null | string;
  p_who_name: null | string;
  p_time: null | string;
  p_old_simple_key_val: null | string;
  p_new_simple_key_val: null | string;
  p_name_of_field: null | string;
  p_old_rel_type: null | string;
  p_new_rel_type: null | string;
  p_field: null | string;
  date_add: string;
  date_update: null | string;
}

/**
 * PT (Задание по проблеме)
 */
export interface ISmprimaryRootcsetsksm1 {
  id: number;
  p_id: string;
  p_parent_problem: null | string;
  p_brief_description: null | string;
  p_assignment: null | string;
  p_logical_name: null | string;
  p_status: null | string;
  p_task_category: null | string;
  p_open: null | boolean;
  p_opened_by: null | string;
  p_updated_by: null | string;
  p_closed_by: null | string;
  p_open_time: null | string;
  p_update_time: null | string;
  p_close_time: null | string;
  p_subcategory: null | string;
  p_product_type: null | string;
  p_problem_type: null | string;
  p_description: null | string;
  p_sla_breach: null | boolean;
  p_next_breach: null | string;
  p_sysmodtime: null | string;
  p_sysmoduser: null | string;
  p_sysmodcount: null | number;
  p_agreement_ids: null | string;
  p_rcstatus: null | string;
  p_hpc_status: null | string;
  p_hpc_contact_name: null | string;
  p_hpc_assignee: null | string;
  p_sb_actual_start: null | string;
  p_sb_actual_finish: null | string;
  p_hpc_solution: null | string;
  p_hpc_template_name: null | string;
  p_hpc_is_custom_sla: null | boolean;
  p_hpc_open_time: null | string;
  p_hpc_assignee_name: null | string;
  p_sb_assignment_name: null | string;
  p_sb_modified_by: null | string;
  p_sb_modified_by_name: null | string;
  p_sb_created_by: null | string;
  p_sb_created_by_name: null | string;
  p_sb_plan_finish: null | string;
  p_sb_logical_name_name: null | string;
  p_hpc_sla_duration: null | string;
  p_sb_closure_code: null | string;
  p_hpc_contact_name_name: null | string;
  p_hpc_tpl_id: null | string;
  p_hpc_next_breach: null | string;
  p_hpc_update_time: null | string;
  p_sb_helpdesk: null | string;
  p_sb_terbank: null | string;
  p_sb_next_breach_shift_count: null | number;
  p_sb_service: null | string;
  p_sb_service_name: null | string;
  p_sb_affected_item_category: null | string;
  p_sb_custom_sla_breach: null | boolean;
  p_sb_control_date: null | string;
  p_sb_complete_date: null | string;
  p_sb_jira_id: null | number;
  p_sb_do_jira_synch: null | boolean;
  p_sb_registration_duration: null | string;
  p_sb_tech_mandatory: null | boolean;
  p_sb_jira_params: null | string;
  p_sb_rc_local_coordinator_name: null | string;
  p_sb_rc_local_coordinator: null | string;
  p_sb_problem_analyst: null | string;
  p_sb_problem_analyst_name: null | string;
  p_old_id: null | string;
  p_sb_teg: null | string;
  p_closed_by_id: null | string;
  date_add: string;
  date_update: null | string;
  p_sb_autopilot: null | boolean;
  p_sb_high_priority_inc_control: null | boolean;
}

/**
 * СОГЛ - согласования
 */
export interface ISmprimarySbapprovalm1 {
  p_number: string;
  p_open_time: null | string;
  p_approval_time: null | string;
  p_opened_by: null | string;
  p_status: null | string;
  p_parent_id: null | string;
  p_assignee: null | string;
  p_assignee_name: null | string;
  p_type: null | string;
  p_stage: null | string;
  p_approved_by: null | string;
  p_comments: null | string;
  p_sequence: null | number;
  p_approved_by_name: null | string;
  p_title: null | string;
  p_description: null | string;
  p_tablename: null | string;
  p_sb_step: null | number;
  id: number;
  p_approve_duration: null | string;
  p_approve_deadline: null | string;
  p_strategy: null | string;
  p_sort_field: null | string;
  p_need_ecp: null | boolean;
  p_sla_breach: null | boolean;
  p_sb_delegate_module: null | string;
  p_ecosystem: null | boolean;
  p_approval_start_time: null | string;
  p_assignment: null | string;
  date_update: null | string;
  date_add: null | string;
}

/**
 * ЗПИ - задача по инциденту
 */
export interface ISmprimarySbimtaskm1 {
  p_number: string;
  p_logical_name: null | string;
  p_affected_item: null | string;
  p_assignment_name: null | string;
  p_assignment: null | string;
  p_probsummary_id: null | string;
  p_sla_breach: null | boolean;
  p_close_time: null | string;
  p_hpc_update_time: null | string;
  p_open_time: null | string;
  p_sb_extra_task: null | boolean;
  p_sb_drug_id: null | string;
  p_contact_name_name: null | string;
  p_contact_name: null | string;
  p_description: null | string;
  p_sb_is_k2: null | boolean;
  p_affected_item_category: null | string;
  p_hpc_created_by_name: null | string;
  p_hpc_created_by: null | string;
  p_closure_code: null | string;
  p_hpc_next_breach: null | string;
  p_actual_start: null | string;
  p_affected_item_name: null | string;
  p_actual_finish: null | string;
  p_reassign: null | number;
  p_resolution: null | string;
  p_logical_name_name: null | string;
  p_assignee_name: null | string;
  p_assignee: null | string;
  p_status: null | string;
  p_sb_teg: null | string;
  p_hpc_tpl_name: null | string;
  p_phase: null | string;
  p_opened_by: null | string;
  p_active: null | boolean;
  p_bug_id: null | string;
  p_option_validations: null | string;
  p_options: null | string;
  p_sb_options: null | string;
  date_update: null | string;
  id: number;
  date_add: string;
}

/**
 * КЭ - расширение полей
 */
export interface ISmprimarySbjitservicem1 {
  p_logical_name: string;
  p_j_service_category: null | string;
  p_j_ext_sys_arc_id: null | string;
  p_j_architect_support: null | string;
  p_sysmodtime: null | string;
  p_sysmodcount: null | number;
  p_sysmoduser: null | string;
  p_j_main_consumer: null | string;
  p_j_conceptual_architecture: null | string;
  p_j_target_status: null | string;
  p_j_providing_unit_name: null | string;
  p_j_providing_unit_id: null | string;
  p_j_tb: null | string;
  p_j_unused_1: null | boolean;
  p_j_unused_2: null | boolean;
  p_j_set_detailed_cause: null | boolean;
  p_j_architect_support_id: null | string;
  p_j_authentication_method: null | string;
  p_j_stand_in: null | boolean;
  p_j_reserve_area: null | boolean;
  p_j_disable_area: null | boolean;
  p_j_disable_part: null | boolean;
  p_j_restore_backup: null | boolean;
  p_j_remove_vpi: null | boolean;
  p_j_check_zud: null | boolean;
  p_j_check_varm: null | boolean;
  p_j_other_backup: null | boolean;
  p_j_dont_close_access_by_rm_calc: null | boolean;
  p_j_short_name: null | string;
  p_j_sysytem_code: null | string;
  p_j_corporate_architect: null | string;
  p_j_as_lider: null | string;
  p_j_aris_created_date: null | string;
  p_j_as_lider_id: null | string;
  p_j_owner_as_id: null | string;
  p_j_corporate_architect_id: null | string;
  p_j_app_develop_control: null | boolean;
  p_j_control_qg: null | boolean;
  p_j_test_system: null | string;
  p_j_develop_team: null | string;
  p_j_nexus_area: null | string;
  p_j_tribe_code: null | string;
  p_j_tribe_owner: null | string;
  p_j_tribe_owner_id: null | string;
  p_j_guid_related_as: null | string;
  p_j_architect_dit_name: null | string;
  p_j_architect_dit_id: null | string;
  p_j_second_service_man_name: null | string;
  p_j_second_service_man_id: null | string;
  p_j_assistant_owner_as_name: null | string;
  p_j_assistant_owner_as_id: null | string;
  p_j_assistant_ppsi_rov_name: null | string;
  p_j_assistant_ppsi_rov_id: null | string;
  p_j_progress_responsible_man_na: null | string;
  p_j_progress_responsible_man_id: null | string;
  p_j_assignment_gak_name: null | string;
  p_j_assignment_gak_id: null | string;
  p_j_techcards_id: null | string;
  p_j_area_owner_di_id: null | string;
  p_j_area_developer_di_id: null | string;
  p_j_url_for_admin_as: null | string;
  p_j_url_for_user: null | string;
  p_j_category_pdn: null | string;
  p_j_process_for_as: null | string;
  p_j_nw_zones: null | string;
  p_j_assistant_rov_name: null | string;
  p_j_assistant_rov_id: null | string;
  p_j_is_its: null | boolean;
  p_j_conf_information_category: null | string;
  p_j_critical_data_content: null | boolean;
  p_j_tribe_develop: null | string;
  p_j_standin_decision_time: null | number;
  p_j_standin_transit_time: null | number;
  p_j_is_greenfield: null | boolean;
  p_j_reserv_corp_architect_id: null | string;
  p_j_reserv_corp_architect_name: null | string;
  p_j_is_public: null | boolean;
  p_j_trial_operation_end_date: null | string;
  p_j_ift_manager: null | string;
  p_j_ift_manager_id: null | string;
  p_j_psi_manager: null | string;
  p_j_psi_manager_id: null | string;
  p_j_short_name_comments: null | string;
  p_j_inherit_admins: null | boolean;
  p_j_ivu_is_actual: null | boolean;
  p_j_ivu_date: null | string;
  p_j_service_level_passport_date: null | string;
  p_j_emergency_training_group: null | string;
  p_j_emergency_training_group_na: null | string;
  p_j_emergency_training_coord: null | string;
  p_j_emergency_training_coord_na: null | string;
  p_j_drp_date: null | string;
  p_j_drp_is_actual: null | boolean;
  p_j_restart_it_service: null | boolean;
  p_j_arch_board_number: null | string;
  date_update: null | string;
  id: number;
  date_add: null | string;
}

/**
 * IMTS Инциденты тестовых сред
 */
export interface ISmprimarySbprobsummarytsm1 {
  p_number: string;
  p_open_time: null | string;
  p_priority_code: null | string;
  p_resolution_code: null | string;
  p_action: null | string;
  p_resolution: null | string;
  p_brief_description: null | string;
  p_time_spent: null | string;
  p_sb_type: null | string;
  p_kpi_value: null | boolean;
  p_hpc_status: null | string;
  p_contact_name: null | string;
  p_hpc_contact_name_name: null | string;
  p_hpc_assignee: null | string;
  p_hpc_assignee_name: null | string;
  p_hpc_assignment: null | string;
  p_hpc_assignment_name: null | string;
  p_hpc_created_by_name: null | string;
  p_hpc_modified_by_name: null | string;
  p_logical_name: null | string;
  p_hpc_logical_name_name: null | string;
  p_hpc_actual_start: null | string;
  p_hpc_actual_finish: null | string;
  p_hpc_plan_start: null | string;
  p_hpc_plan_finish: null | string;
  p_hpc_actual_duration: null | string;
  p_hpc_plan_duration: null | string;
  p_affected_item: null | string;
  p_hpc_affected_item_name: null | string;
  p_hpc_cause: null | string;
  p_next_breach: null | string;
  p_hpc_next_breach: null | string;
  p_hpc_is_mass: null | boolean;
  p_hpc_update_time: null | string;
  p_sb_forecast_move_cause: null | string;
  p_sb_affected_item_category: null | string;
  p_sb_registration_duration: null | string;
  p_sb_root_incident: null | boolean;
  p_sb_teg: null | string;
  p_sb_ord_item: null | string;
  p_sb_ord_item_name: null | string;
  p_sysmodtime: null | string;
  p_sysmoduser: null | string;
  p_sysmodcount: null | number;
  p_hpc_dept: null | string;
  p_hpc_dept_name: null | string;
  p_hpc_created_by: null | string;
  p_hpc_modified_by: null | string;
  p_close_time: null | string;
  p_sb_helpdesk: null | string;
  p_sb_direction: null | string;
  p_subcategory: null | string;
  p_sb_schedule: null | string;
  p_hpc_medium: null | string;
  p_sb_detailed_cause: null | string;
  p_hpc_reassign_cnt: null | boolean;
  p_sla_breach: null | boolean;
  p_stand_type: null | string;
  p_hpc_sla_duration: null | string;
  p_sb_slo_id: null | string;
  p_sb_smax_id: null | string;
  p_sb_jira_key: null | string;
  p_sb_environment_unavailability: null | number;
  date_update: null | string;
  id: number;
  date_add: string;
}

/**
 * ЗНО
 */
export interface ISmprimarySbrequestm1 {
  p_number: string;
  p_status: null | string;
  p_category: null | string;
  p_title: null | string;
  p_description: null | string;
  p_resolution_code: null | string;
  p_resolution: null | string;
  p_open_time: null | string;
  p_incident_id: null | string;
  p_contact_name: null | string;
  p_contact_name_name: null | string;
  p_dept: null | string;
  p_dept_name: null | string;
  p_affected_item: null | string;
  p_affected_item_name: null | string;
  p_substatus: null | string;
  p_hpc_tpl_id: null | string;
  p_hpc_tpl_name: null | string;
  p_priority_code: null | string;
  p_hpc_open_time: null | string;
  p_approve_deadline: null | string;
  p_plan_finish: null | string;
  p_approval_start: null | string;
  p_approval_finish: null | string;
  p_actual_start: null | string;
  p_actual_finish: null | string;
  p_close_time: null | string;
  p_assignment: null | string;
  p_assignment_name: null | string;
  p_assignee: null | string;
  p_assignee_name: null | string;
  p_reassign_count: null | number;
  p_options: null | string;
  p_agreement_ids: null | string;
  p_approval_status: null | string;
  p_sb_tpl_id_related_inc: null | string;
  p_sb_scoring_text_1: null | string;
  p_sb_scoring_text_2: null | string;
  p_sb_scoring_text_3: null | string;
  p_sb_scoring_bool_1: null | boolean;
  p_sb_tree_id: null | string;
  p_sb_helpdesk: null | string;
  p_sb_direction: null | string;
  p_sb_recategorize_from: null | string;
  p_sb_medium: null | string;
  p_hpc_sla_duration: null | string;
  p_hpc_active: null | boolean;
  p_initial_impact: null | string;
  p_approve_duration: null | string;
  p_work_duration: null | string;
  p_duration: null | string;
  p_sb_next_breach_freezed: null | boolean;
  p_sb_change_scoring_cause: null | string;
  p_sb_actual_finish: null | string;
  p_sb_schedule: null | string;
  p_sb_login: null | string;
  p_options_validations: null | string;
  p_sb_affected_item_category: null | string;
  p_sb_is_k2: null | boolean;
  p_sb_slo_id: null | string;
  p_update_time: null | string;
  p_sb_options: null | string;
  p_sb_option_validations: null | string;
  p_sb_rm_profile_id: null | string;
  p_sb_approval_duration_percent: null | number;
  p_sb_hash: null | string;
  p_sb_aiss_repeat: null | boolean;
  p_sb_registration_duration: null | string;
  p_sb_rm_login_type: null | string;
  p_approve_user_deadline: null | string;
  p_sb_teg: null | string;
  p_block_after_complete: null | boolean;
  p_sb_rm_appr_type: null | string;
  p_ecosystem: null | boolean;
  p_complete_for_reject_task: null | boolean;
  p_sb_next_breach_increased: null | boolean;
  p_hpc_next_breach: null | string;
  date_update: null | string;
  id: number;
  date_add: string;
}

/**
 * ЗНР - Задача по ЗНО
 */
export interface ISmprimarySbrequesttaskm1 {
  p_number: string;
  p_open_time: null | string;
  p_parent_id: null | string;
  p_status: null | string;
  p_substatus: null | string;
  p_affected_item: null | string;
  p_affected_item_name: null | string;
  p_assignment: null | string;
  p_assignment_name: null | string;
  p_assignee: null | string;
  p_assignee_name: null | string;
  p_title: null | string;
  p_description: null | string;
  p_planned_start: null | string;
  p_planned_finish: null | string;
  p_actual_start: null | string;
  p_actual_finish: null | string;
  p_resolution_code: null | string;
  p_resolution: null | string;
  p_sysmodtime: null | string;
  p_sysmoduser: null | string;
  p_hpc_created_by_name: null | string;
  p_hpc_modified_by_name: null | string;
  p_hpc_update_time: null | string;
  p_hpc_created_by: null | string;
  p_hpc_modified_by: null | string;
  p_opened_by: null | string;
  p_logical_name: null | string;
  p_logical_name_name: null | string;
  p_agreement_ids: null | string;
  p_sla_breach: null | boolean;
  p_hpc_next_breach: null | string;
  p_contact_name: null | string;
  p_contact_name_name: null | string;
  p_dept: null | string;
  p_dept_name: null | string;
  p_hpc_tpl_id: null | string;
  p_hpc_tpl_name: null | string;
  p_phase: null | number;
  p_incident_id: null | string;
  p_parent_assignment: null | string;
  p_parent_assignment_name: null | string;
  p_sb_helpdesk: null | string;
  p_sb_direction: null | string;
  p_hpc_is_custom_sla: null | boolean;
  p_hpc_sla_duration: null | string;
  p_type: null | string;
  p_sb_tpl_id_related_inc: null | string;
  p_options: null | string;
  p_sb_is_vip: null | boolean;
  p_sb_flag: null | boolean;
  p_hpc_open_time: null | string;
  p_sb_login: null | string;
  p_category: null | string;
  p_sb_copy_resolution: null | boolean;
  p_sb_affected_item_category: null | string;
  p_sb_actual_assign: null | string;
  p_sb_auth_visible: null | boolean;
  p_sb_auth_mandatory: null | boolean;
  p_sb_is_tech_account: null | boolean;
  p_sb_auth_method: null | string;
  p_sb_tree_id: null | string;
  date_update: null | string;
  id: number;
  date_add: string;
}
export interface ISmprimarySbriskm1 {
  p_number: string;
  p_status: null | string;
  p_open_time: null | string;
  p_hpc_update_time: null | string;
  p_close_time: null | string;
  p_hpc_created_by: null | string;
  p_hpc_created_by_name: null | string;
  p_hpc_modified_by: null | string;
  p_hpc_modified_by_name: null | string;
  p_closed_by: null | string;
  p_closed_by_name: null | string;
  p_sysmodtime: null | string;
  p_sysmoduser: null | string;
  p_account_defect_as: null | string;
  p_risk_probability: null | string;
  p_defect_number: null | string;
  p_contact_name: null | string;
  p_contact_name_name: null | string;
  p_callback_contact: null | string;
  p_callback_contact_name: null | string;
  p_resolution_code: null | string;
  p_logical_name: null | string;
  p_logical_name_name: null | string;
  p_in_control: null | boolean;
  p_inaccessibility_time: null | number;
  p_screenplay: null | string;
  p_description: null | string;
  p_dept: null | string;
  p_dept_name: null | string;
  p_substatus: null | string;
  p_effects_unused: null | string;
  p_resolution_unused: null | string;
  p_problem_number: null | string;
  p_hpc_add_info: null | string;
  p_residual_rating: null | string;
  p_inherent_rating: null | string;
  p_current_rating: null | string;
  p_coordinator_name: null | string;
  p_coordinator_name_name: null | string;
  p_vulnerability: null | boolean;
  p_affected_item: null | string;
  p_affected_item_name: null | string;
  p_model_risk: null | string;
  p_guid_ci_with_id: null | string;
  p_guid_ci_without_id: null | string;
  p_account_defect_as_name: null | string;
  p_ppm_change_unused: null | string;
  p_ppm_change_name_unused: null | string;
  p_local_coordinator: null | string;
  p_local_coordinator_name: null | string;
  p_downtime_hours: null | number;
  p_damage_assessment: null | number;
  p_response_strategy: null | string;
  p_fact_damage: null | number;
  p_control_date: null | string;
  p_old_number: null | string;
  p_coordinator_dept: null | string;
  p_coordinator_dept_name: null | string;
  p_assignment: null | string;
  p_sla_breach: null | boolean;
  p_brief_description: null | string;
  p_have_custom_operations_in_pro: null | string;
  p_date_to_analysis: null | string;
  p_date_to_work: null | string;
  p_date_to_monitoring: null | string;
  p_date_to_complete: null | string;
  p_date_to_close: null | string;
  p_control_flag: null | boolean;
  p_typical_risk_flag: null | boolean;
  p_typical_risk: null | string;
  p_sb_affected_item_category: null | string;
  p_proactive_risk: null | boolean;
  p_date_to_commission_man: null | string;
  p_options: null | string;
  p_option_validations: null | string;
  p_sb_tplriskrating_name: null | string;
  p_sb_tplriskrating_version: null | string;
  p_current_estimate_rating: null | string;
  p_actual_impact: null | number;
  p_actual_risk_realizations: null | number;
  p_initial_estimate_impact: null | number;
  p_initial_estimate_impact_date: null | string;
  p_date_of_estimation: null | string;
  p_actual_max_priority: null | string;
  p_who_estimated: null | string;
  p_current_estimate_impact: null | string;
  p_assignment_name: null | string;
  p_sb_vendor: null | string;
  p_sb_logical_name_name: null | string;
  p_sb_logical_name: null | string;
  p_model_risk_id: null | string;
  p_stage_coordinator_control: null | boolean;
  p_sb_tag: null | string;
  p_service_impact_duration: null | number;
  p_sb_registration_duration: null | string;
  p_tech_mandatory: null | boolean;
  p_source_risk: null | string;
  p_cause_type: null | string;
  p_effect_type: null | string;
  p_tm_approval_date: null | string;
  p_im_downtime_avg: null | number;
  p_sb_po_spo: null | string;
  p_rating_change_date: null | string;
  p_vulnerable_version: null | string;
  p_target_version: null | string;
  p_auto_upd_ci_flaw: null | boolean;
  p_who_estimated_id: null | string;
  p_effect_type_id: null | string;
  p_source_risk_id: null | string;
  p_cause_type_id: null | string;
  p_sb_reliability_experts_wg: null | string;
  p_sb_reliability_experts_wg_id: null | string;
  p_sb_mandatory_validation: null | boolean;
  p_sb_validation_route: null | string;
  p_sb_draft: null | boolean;
  p_validated_current_rating: null | string;
  p_validated_service_impact_dura: null | number;
  p_validated_service_impact: null | number;
  p_date_to_validation: null | string;
  p_comment_risk_probability_per_: null | string;
  p_comment_service_impact_durati: null | string;
  p_comment_service_impact: null | string;
  p_sb_category: null | string;
  p_sb_load_key: null | string;
  p_sb_external_contract_number: null | string;
  p_sb_contract_type: null | string;
  p_sb_risk_subject: null | string;
  p_sb_provider: null | string;
  p_sb_provider_itn: null | string;
  p_sb_contract_subject: null | string;
  p_sb_initiator_dept: null | string;
  p_sb_customer_dept: null | string;
  p_sb_balance_sheet_unit: null | string;
  p_sb_do_not_update: null | boolean;
  p_sb_contract_conclusion_date: null | string;
  p_sb_parent_contract_id: null | string;
  p_sb_prepayment_percentage: null | number;
  p_sb_amount_with_vat: null | number;
  p_sb_contract_start_date: null | string;
  p_sb_contract_finish_date: null | string;
  p_sb_ubuio_registration_date: null | string;
  p_sb_contract_card_status: null | string;
  p_sb_contract_finish_actual_dat: null | string;
  p_sb_customer_dept_id: null | string;
  p_sb_initiator_dept_id: null | string;
  p_is_ucmdb_validation_runed: null | boolean;
  p_is_manual_validation_runed: null | boolean;
  p_sb_case_id: null | string;
  p_sb_initiator_rfs: null | string;
  p_sb_initiator_rfs_name: null | string;
  p_sb_tplriskrating_id: null | string;
  p_sb_provider_rating: null | number;
  p_sb_risk_zone: null | string;
  p_sb_rating_explanation: null | string;
  p_vendor_it_products: null | string;
  p_vendor_it_products_id: null | string;
  p_vendor_it_products_other: null | string;
  p_vendor_country: null | string;
  p_country_unfriendly: null | boolean;
  p_vendor_country_id: null | string;
  id: number;
  date_add: null | string;
  date_update: null | string;
}
export interface ISmprimarySbrisktaskm1 {
  p_number: string;
  p_open_time: null | string;
  p_update_time: null | string;
  p_close_time: null | string;
  p_hpc_created_by: null | string;
  p_hpc_created_by_name: null | string;
  p_updated_by: null | string;
  p_updated_by_name: null | string;
  p_closed_by: null | string;
  p_closed_by_name: null | string;
  p_risk_number: null | string;
  p_action: null | string;
  p_category: null | string;
  p_sysmodtime: null | string;
  p_sysmoduser: null | string;
  p_resolution_code: null | string;
  p_hpc_next_breach: null | string;
  p_description: null | string;
  p_plan_duration: null | string;
  p_plan_start: null | string;
  p_plan_finish: null | string;
  p_assignment: null | string;
  p_assignment_name: null | string;
  p_resolution: null | string;
  p_assignee: null | string;
  p_assignee_name: null | string;
  p_status: null | string;
  p_start_time: null | string;
  p_finish_time: null | string;
  p_hpc_tpl_id: null | string;
  p_shift_count: null | number;
  p_breach_duration: null | string;
  p_expenses: null | number;
  p_resource_count: null | number;
  p_sla_breach: null | boolean;
  p_old_number: null | string;
  p_next_breach: null | string;
  p_hpc_is_custom_sla: null | boolean;
  p_hpc_sla_duration: null | string;
  p_have_custom_operations_in_pro: null | string;
  p_sb_service: null | string;
  p_sb_service_name: null | string;
  p_sb_affected_item_category: null | string;
  p_sb_start_control: null | string;
  p_sb_jira_id: null | number;
  p_sb_do_jira_synch: null | boolean;
  p_sb_initiator_name: null | string;
  p_sb_initiator: null | string;
  p_sb_registration_duration: null | string;
  p_tech_mandatory: null | boolean;
  p_jira_params: null | string;
  p_sb_rsk_local_coordinator_name: null | string;
  p_sb_rsk_local_coordinator: null | string;
  p_sb_phase: null | string;
  p_communal_task: null | boolean;
  p_creation_source: null | string;
  p_ci_stand: null | string;
  date_update: null | string;
  id: number;
  date_add: null | string;
}

/**
 * Задачи по Регламентным работам - TRW
 */
export interface ISmprimarySbroutinetaskm1 {
  p_id: string;
  p_contact_name: null | string;
  p_contact_name_name: null | string;
  p_topic: null | string;
  p_category: null | string;
  p_priority: null | string;
  p_planned_start: null | string;
  p_planned_finish: null | string;
  p_start_downtime: null | string;
  p_finish_downtime: null | string;
  p_affected_item: null | string;
  p_affected_item_name: null | string;
  p_assignment: null | string;
  p_assignment_name: null | string;
  p_assignee: null | string;
  p_assignee_name: null | string;
  p_status: null | string;
  p_resolution: null | string;
  p_closure_code: null | string;
  p_description: null | string;
  p_close_time: null | string;
  p_done_time: null | string;
  p_hpc_created_by_name: null | string;
  p_hpc_modified_by_name: null | string;
  p_hpc_update_time: null | string;
  p_open_time: null | string;
  p_tpl_id: null | string;
  p_tpl_name: null | string;
  p_label: null | string;
  p_conflict_task: null | string;
  p_planned_start_start: null | string;
  p_planned_finish_start: null | string;
  p_customer_name: null | string;
  p_customer_name_name: null | string;
  p_workhours: null | string;
  p_ignore_conflict: null | boolean;
  p_sb_terbank: null | string;
  p_sb_affected_item: null | string;
  p_sb_affected_item_name: null | string;
  p_sb_affected_item_category: null | string;
  p_sb_affected_item_category_exe: null | string;
  p_flag_controller: null | boolean;
  p_reason_delay: null | string;
  p_reason_delay_other: null | string;
  p_sb_started_having_conflicts: null | boolean;
  p_release_compatibility: null | string;
  p_probability: null | number;
  p_risk: null | string;
  date_update: null | string;
  id: number;
  date_add: string;
}

/**
 * RW - Регламентные работы
 */
export interface ISmprimarySbroutineworksm1 {
  p_id: string;
  p_name: null | string;
  p_affected_item: null | string;
  p_affected_item_name: null | string;
  p_assignment: null | string;
  p_assignment_name: null | string;
  p_assignee: null | string;
  p_assignee_name: null | string;
  p_contact_name: null | string;
  p_contact_name_name: null | string;
  p_description: null | string;
  p_status: null | string;
  p_duration: null | string;
  p_category: null | string;
  p_priority: null | string;
  p_done_time: null | string;
  p_hpc_created_by_name: null | string;
  p_hpc_modified_by_name: null | string;
  p_hpc_update_time: null | string;
  p_open_time: null | string;
  p_start_time: null | string;
  p_sbroutine_tpl1: null | string;
  p_sbroutine_condition1: null | string;
  p_timezone: null | string;
  p_repeat_type: null | string;
  p_arbitrary_dates: null | string;
  p_terminate_type: null | string;
  p_scheduled: null | string;
  p_graph_old: null | string;
  p_create_before: null | string;
  p_customer_name: null | string;
  p_customer_name_name: null | string;
  p_workhours: null | string;
  p_approval_status: null | string;
  p_approve_initiator: null | string;
  p_approve_initiator_name: null | string;
  p_approve_deadline: null | string;
  p_sb_terbank: null | string;
  p_sb_affected_item_category: null | string;
  p_sb_registration_duration: null | string;
  p_flag_controller: null | string;
  p_sb_approval_strategy1: null | string;
  p_sb_approval_strategy2: null | string;
  p_sb_approve_duration: null | string;
  p_sb_approval_start: null | string;
  p_sb_approval_finish: null | string;
  p_sb_approval_substatus: null | string;
  p_create_type: null | string;
  p_release_compatibility: null | string;
  p_probability: null | number;
  p_sb_aiss_repeat: null | boolean;
  p_release_compatibility_expert: null | string;
  p_risk: null | string;
  date_update: null | string;
  id: number;
  date_add: string;
}

/**
 * Рабочие группы на КЭ
 */
export interface ISmprimarySbservicewoa2 {
  p_service_id: null | string;
  p_area_id: null | string;
  p_record_number: number;
  p_groups_id: null | string;
  date_update: null | string;
  id: number;
  date_add: null | string;
}

/**
 * Мероприятие по обновлению (SWUT00000001)
 */
export interface ISmprimarySbsoftupdatetaskm1 {
  p_number: string;
  p_sysmoduser: null | string;
  p_sysmodtime: null | string;
  p_sysmodcount: null | number;
  p_current_phase: null | string;
  p_open_time: null | string;
  p_opened_by: null | string;
  p_hpc_created_by: null | string;
  p_hpc_created_by_name: null | string;
  p_hpc_modified_by: null | string;
  p_hpc_modified_by_name: null | string;
  p_hpc_update_time: null | string;
  p_status: null | string;
  p_category: null | string;
  p_parent_id: null | string;
  p_resolution_code: null | string;
  p_description: null | string;
  p_update_type: null | string;
  p_versions: null | string;
  p_is_manual_validation: null | boolean;
  p_pospo_id: null | string;
  p_pospo_name: null | string;
  p_record_active: null | boolean;
  p_resolution: null | string;
  p_assignment_name: null | string;
  p_assignment: null | string;
  p_assignee_name: null | string;
  p_assignee: null | string;
  p_ucmdb_params: null | string;
  p_coordinator: null | string;
  p_coordinator_name: null | string;
  p_hpc_next_breach: null | string;
  p_hpc_sla_duration: null | string;
  p_sla_breach: null | boolean;
  p_agreement_ids: null | string;
  p_actual_start: null | string;
  p_actual_finish: null | string;
  p_hpc_open_time: null | string;
  p_sb_sla_breach: null | boolean;
  p_reopen_count: null | number;
  p_affected_item: null | string;
  p_distribution_pospo: null | string;
  date_update: null | string;
  id: number;
  date_add: string;
}

/**
 * Связи сущностей СМ
 * Инциденты, риски, проблемы, SD, ЗНИ и т.д.
 */
export interface ISmprimaryScrelationm1 {
  p_source: string;
  p_source_filename: null | string;
  p_depend: null | string;
  p_depend_filename: null | string;
  p_type: null | string;
  p_source_active: null | boolean;
  p_depend_active: null | boolean;
  p_sysmodcount: null | number;
  p_sysmoduser: null | string;
  p_sysmodtime: null | string;
  p_desc: null | string;
  p_sb_create_time: null | string;
  p_sb_created_by: null | string;
  date_update: null | string;
  id: number;
  date_add: string;
}

/**
 * Аудит полей риска
 */
export interface ISmprimaryHpcauditsbriskm1 {
  id: number;
  p_thenumber: string;
  p_id: null | string;
  p_old_simple_val: null | string;
  p_new_simple_val: null | string;
  p_who: null | string;
  p_who_name: null | string;
  p_time: null | string;
  p_old_simple_key_val: null | string;
  p_new_simple_key_val: null | string;
  p_name_of_field: null | string;
  p_old_rel_type: null | string;
  p_new_rel_type: null | string;
  p_field: null | string;
  date_add: string;
  date_update: null | string;
}
/**
 * Причина закрытия инцидента, ссылка на поле HPC_CAUSE
 */
export interface ISmprimarySbimcausem1 {
  id: number;
  /** ===HPC_CAUSE */
  p_number: string;
  /** причина */
  p_name: null | string;
  p_sysmodtime: null | string;
  p_sysmoduser: null | string;
  p_sysmodcount: null | number;
  p_open_time: null | string;
  p_hpc_update_time: null | string;
  p_opened_by: null | string;
  p_hpc_created_by: null | string;
  p_hpc_created_by_name: null | string;
  p_hpc_modified_by: null | string;
  p_hpc_modified_by_name: null | string;
  p_blocked: null | boolean;
  p_sb_smax_id: null | string;
  date_add: null | string;
  date_update: null | string;
}
/**
 * Связи с задачами JIRA
 */
export interface ISmprimarySbjiraissuem1 {
  id: number;
  p_number: string;
  p_jira_issue_id: null | string;
  /**
   * Идентификатор задачи в Jira
   */
  p_jira_issue_key: null | string;
  p_jira_issue_type: null | string;
  p_jira_issue_status: null | string;
  p_jira_issue_assignee: null | string;
  p_jira_issue_priority: null | string;
  p_jira_issue_summary: null | string;
  p_jira_issue_description: null | string;
  p_jira_issue_stage: null | string;
  p_jira_issue_issue_bug_type: null | string;
  p_jira_issue_bench_type: null | string;
  p_jira_planned_end: null | string;
  p_jira_due_date: null | string;
  p_hpc_created_by: null | string;
  p_hpc_modified_by: null | string;
  p_hpc_modified_by_name: null | string;
  p_hpc_update_time: null | string;
  p_hpc_create_time: null | string;
  p_jira_project_id: null | string;
  p_jira_issue_network_segment: null | string;
  p_sm_id: null | string;
  p_jira_issue_link: null | string;
  p_jira_issue_statusresolution: null | string;
  p_jira_issue_source: null | string;
  p_security_level: null | string;
  /**
   * номер проблемы по которой связан инцидент
   */
  p_parent_id: null | string;
  p_jira_issue_assignee_id: null | string;
  p_inc_id: null | string;
  p_risk_incident_id: null | string;
  p_jira_issue_reporter: null | string;
  p_jira_issue_reporter_id: null | string;
  p_jira_issue_affected_item: null | string;
  p_jira_issue_affected_item_id: null | string;
  p_risk_number: null | string;
  p_tech_mandatory: null | boolean;
  p_pm_subcategory: null | string;
  p_pm_sb_source_error: null | string;
  p_pm_product_type: null | string;
  p_pm_sb_atd_id: null | string;
  date_add: null | string;
  date_update: null | string;
}

/**
 * Риск для ЗНИ
 */
export interface ISmprimaryCm3rm2 {
  id: number;
  /**
   * Номер ЗНИ
   */
  p_number: string;
  p_sb_helpdesk: null | string;
  p_sb_direction: null | string;
  p_sb_terbank: null | string;
  p_sb_assign_parameter: null | string;
  p_sb_introduction: null | string;
  p_option_validations: null | string;
  p_sb_affected_cis: null | string;
  p_sb_affected_cis_name: null | string;
  p_sb_plan_from_end: null | boolean;
  p_sb_risk: null | string;
  p_sb_final_assessment: null | number;
  p_sb_task_act_rw_off: null | boolean;
  p_sb_task_act_doc_off: null | boolean;
  p_sb_task_act_mon_off: null | boolean;
  p_sb_affected_services_name_unus: null | string;
  p_sb_count_approval_start: null | number;
  p_sb_affected_item_category: null | string;
  p_sb_started_having_conflicts: null | boolean;
  p_sb_conflicts_recalc_time: null | string;
  p_sb_init_start_date: null | string;
  p_sb_cloned_from_id: null | string;
  p_sb_issue_kts: null | string;
  p_sb_registration_duration: null | string;
  p_sb_assignee_assing_date: null | string;
  p_sb_env_logical_name: null | string;
  p_sb_check_rel_in_bg_complete: null | boolean;
  p_sb_release_risk_level: null | string;
  p_sb_release_risk_score: null | string;
  p_sb_integration_impact: null | string;
  p_sb_service_interruption_start: null | string;
  p_sb_service_interruption_end: null | string;
  p_sb_ecosystem: null | boolean;
  p_sb_inthub_id: null | string;
  p_sb_cancel_cause: null | string;
  p_sb_autopilot: null | boolean;
  p_sb_inthub_approval_id: null | string;
  p_sb_category: null | string;
  p_sb_rollback_possibility: null | string;
  p_sb_max_rollback_duration: null | string;
  p_sb_rollback_start: null | string;
  p_sb_rollback_finish: null | string;
  p_sb_rollback_plan_start: null | string;
  p_sb_rollback_plan_finish: null | string;
  p_sb_plan_service_unavailabilit: null | string;
  date_add: string;
  date_update: null | string;
}
/**
 * Оказанное влияние в периметре инцидента
 */
export interface ISmprimarySbreferencea7 {
  id: number;
  /** Номер инцидента */
  p_id: null | string;
  p_record_number: number;
  /** Класс влияния */
  p_class: null | string;
  p_type: null | string;
  p_category: null | string;
  p_category_other: null | string;
  p_transaction_count: null | number;
  /** не учитывать потери в КПЭ */
  p_ignore_kpi_loss: null | boolean;
  p_loss_percent: string;
  /** Влияние на ПС */
  p_sberpay: null | boolean;
  p_minimized: null | string;
  p_greenfield_only: null | boolean;
  date_add: null | string;
  date_update: null | string;
}
/** таблица сотрудников в рабочих группах */
export interface ISmprimaryAssignmentb2 {
  id: number;
  p_name: null | string;
  p_record_number: number;
  p_hpc_assignees: null | string;
  date_add: string;
  date_update: null | string;
}
/** Аудит по ЗНО */
export interface ISmprimaryHpcauditsbrequestm1 {
  id: number;
  p_thenumber: string;
  p_id: null | string;
  p_old_simple_val: null | string;
  p_new_simple_val: null | string;
  p_old_array_val: null | string;
  p_new_array_val: null | string;
  p_who: null | string;
  p_who_name: null | string;
  p_time: null | string;
  p_old_simple_key_val: null | string;
  p_new_simple_key_val: null | string;
  p_name_of_field: null | string;
  p_old_rel_type: null | string;
  p_new_rel_type: null | string;
  p_field: null | string;
  date_add: string;
  date_update: null | string;
}
/** Мероприятия по обновлению (МПО) */
export interface ISmprimarySbsoftupdatetaskm1 {
  id: number;
  p_number: string;
  p_sysmoduser: null | string;
  p_sysmodtime: null | string;
  p_sysmodcount: null | number;
  p_current_phase: null | string;
  p_open_time: null | string;
  p_opened_by: null | string;
  p_hpc_created_by: null | string;
  p_hpc_created_by_name: null | string;
  p_hpc_modified_by: null | string;
  p_hpc_modified_by_name: null | string;
  p_hpc_update_time: null | string;
  p_status: null | string;
  p_category: null | string;
  p_parent_id: null | string;
  p_resolution_code: null | string;
  p_description: null | string;
  p_update_type: null | string;
  p_versions: null | string;
  p_is_manual_validation: null | boolean;
  p_pospo_id: null | string;
  p_pospo_name: null | string;
  p_record_active: null | boolean;
  p_resolution: null | string;
  p_assignment_name: null | string;
  p_assignment: null | string;
  p_assignee_name: null | string;
  p_assignee: null | string;
  p_ucmdb_params: null | string;
  p_coordinator: null | string;
  p_coordinator_name: null | string;
  p_hpc_next_breach: null | string;
  p_hpc_sla_duration: null | string;
  p_sla_breach: null | boolean;
  p_agreement_ids: null | string;
  p_actual_start: null | string;
  p_actual_finish: null | string;
  p_hpc_open_time: null | string;
  p_sb_sla_breach: null | boolean;
  p_reopen_count: null | number;
  p_affected_item: null | string;
  p_distribution_pospo: null | string;
  date_add: string;
  date_update: null | string;
}
