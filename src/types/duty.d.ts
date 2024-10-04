interface IDutySchedule {
  id: number;
  kod_user: number;
  period_start: string;
  period_end: string;
  work_time: number;
  date_modify: null | string;
  date_add: string;
  kod_user_modify: null | number;
}
