export interface MessageWS {
  id: number;
  room?: number;
  text: string;
  action?: string;
  token?: string;
  date_add?: number;
  to?: string;
  user: { token: string; fio: string };
  soc?: string;
  kod_user?: number;
  ip?: string;
}
export interface IWSUserOnline {
  user: string;
  ip: string;
  token: string;
  action: string;
  text: string;
  soc: string;
  date_add: number;
}
