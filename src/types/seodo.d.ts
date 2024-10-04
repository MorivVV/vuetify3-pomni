interface SeodoLogic {
  active: boolean;
  date_add: string;
  date_modify: string | null;
  executors: string[];
  id: number;
  key_word: string[];
  doc_type: string[];
  kod_user: number;
  kod_group: number | null;
  kod_user_modify: number | null;
  min_satellite: number;
  satellite_word: string[];
  stop_word: string[];
  task_action: number;
  task_owner: string;
}
interface LogicSearch {
  task_action?: string | null;
  word?: string | null;
  task_owner?: string | null;
  kod_group?: string | null;
  kod_executor?: string | null;
  active?: boolean | null;
}
interface Executor {
  date_add: string;
  id: number;
  kod_executor: string;
  kod_logic?: number;
  kod_group?: number;
  main: boolean;
}
interface ExecutorGroups {
  id: number;
  naimen: string;
  kod_user: number;
  date_add: string;
}
