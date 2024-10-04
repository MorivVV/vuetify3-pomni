/**
 * Тикеты
 */
export interface IJiraIssues {
  id?: number;
  key: string;
  segment: string;
  summary: null | string;
  issuetype: null | string;
  priority: null | string;
  created: null | string;
  updated: null | string;
  project: null | string;
  labels: null | string;
  status: null | string;
  status_category: null | string;
  reporter_tabnum?: null | string;
  assignee_tabnum?: null | string;
  date_add?: null | string;
  date_modify?: null | string;
  reporter_display_name: null | string;
  reporter_email: null | string;
  assignee_email: null | string;
  assignee_display_name: null | string;
  comments?: null | IJiraComments[];
}

/**
 * Связь тикет-услуги
 */
export interface IJiraIssueService {
  id: number;
  key: string;
  segment: string;
  ci_name: string;
  ci_id: string;
  itservice: null | boolean;
}

/**
 * Комментарии тикетов
 */
export interface IJiraComments {
  id: number;
  key: string;
  segment: string;
  commnet_id: string;
  author_tabnum: string;
  author_display_name: string;
  update_author_tabnum: string;
  update_author_display_name: string;
  body: string;
  created: null | string;
  updated: null | string;
}

/**
 * Дефекты новые
 */
export interface IJiraDefects extends IJiraIssues {
  id: number;
  key: string;
  segment: string;
  detection_stand: null | string;
  stand: null | string;
  type: null | string;
  found_in_rel: null | string;
  fixed_in_rel: null | string;
  affects_availability: null | string;
  known_in_prom: null | string;
  known_in_prom_date: null | string;
  incident_id: null | string;
  problem_id: null | string;
  problem_task_id: null | string;
  date_add: null | string;
  date_modify: null | string;
}

/**
 * Релизы
 */
export interface IJiraReleases extends IJiraIssues {
  id: number;
  key: string;
  segment: string;
  approver_tabnum: null | string;
  approver_display_name: null | string;
  psi_approve_date: null | string;
  date_add: null | string;
  date_modify: null | string;
}

/**
 * Дефекты старые
 */
export interface IJiraCiJiraDefects {
  id: number;
  issue_key: string;
  defect_type: null | string;
  priority: null | string;
  summary: null | string;
  detection: null | string;
  stand: null | string;
  status: null | string;
  ci: null | string;
  ci_id: null | string;
  it_service: null | string;
  reporter: null | string;
  reporter_email: null | string;
  assignee: null | string;
  assignee_email: null | string;
  labels: null | string;
  known_defect_prom: null | string;
  affects_availability: null | string;
  fixed_in_rel: null | string;
  found_in_rel: null | string;
  incident_id: null | string;
  problem_id: null | string;
  problem_task_id: null | string;
  created: null | string;
  issuetype: null | string;
  known_defect_prom_date: null | string;
  date_add: null | string;
  date_modify: null | string;
  status_category: null | string;
}
