export interface IAlertDynatraceAny {
  id: number;
  state: null | string;
  problem_id: null | string;
  problem_title: null | string;
  time_add: string;
  impacted_entities: null | string;
  impacted_entity: null | string;
  pid: null | string;
  problem_details_html: null | string;
  problem_details_text: null | string;
  problem_impact: null | string;
  host: null | string;
  hand_close: null | boolean;
  user_close: null | number;
  time_close: string;
  date_add: string;
}
