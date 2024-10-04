export interface IConfigBdDriver {
  naimen: null | string;
  id: number;
}
export interface IConfigDataBases {
  naimen: string;
  kod_driver: number;
  user_tuz: string;
  password_aes: string;
  pool_alias: null | string;
  host: string;
  base_name: null | string;
  connection_limit: null | string;
  port: number;
  active: null | boolean;
  date_modify: null | string;
  kod_user: null | number;
  id: number;
  date_add: null | string;
  /** роль пользователя при выполнении запроса */
  user_role: null | string;
  /** Указания TNS строки для подключения  */
  connection_string: string | null;
  /** не проверять сертификат SSL */
  ssl_reject: boolean;
  /** подтверждение изменения второй рукой в AJAX запросах */
  change_accept: boolean;
}
export interface IConfigDefaultSettings {
  kod_techemail: null | number;
  kod_service_manager_db: null | number;
  id: number;
}
export interface IConfigIndividualUserSettings {
  id: number;
  kod_user: number;
  route_name: string;
  parameter_key: null | string;
  parameter_value: null | string;
  date_add: string;
  date_update: null | string;
}
export interface IConfigTechemail {
  naimen: string;
  username: string;
  passaes: string;
  addres: string;
  smtp_host: string;
  smtp_port: number;
  imap_host: null | string;
  imap_port: null | number;
  id: number;
  secure: null | boolean;
  igrone_tls: null | boolean;
}
export interface IConfigInboxMail {
  id: number;
  uid: number;
  subject: string;
  from_mail: string;
  to_mail: string;
  body: null | string;
  html: null | string;
  date_mail: string;
  date_add: string;
}
