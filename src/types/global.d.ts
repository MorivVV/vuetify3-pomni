import { R } from "node_modules/unplugin-vue-router/dist/options-yBvUhD_i.d.mts";
import { RouteRecordSingleView } from "vue-router";

export interface Route extends RouteRecordSingleView {
  name: string;
  order: number;
  path: string;
  href?: string;
  title?: string;
  icon?: string;
  class?: string;
  children?: Array<Route>;
  component?: any;
}
export interface User {
  active: boolean;
  id: number;
  family: string;
  first_name: string;
  second_name: string;
  login: string;
  tabnum: string;
  sm_contact_name: string;
  sm_full_name: string;
}
export interface IRightTable {
  id: number;
  naimen: string;
  active: boolean;
  date_add: string;
}
export interface IRightElement {
  id: number;
  kod_role: number;
  kod_table: number;
  table_identificator: number;
  active: boolean;
  date_add: string;
}
export interface IPartitionAccess extends Record<string, any> {
  id: number;
  namien: string;
  route: string;
  access_all: boolean;
  date_add: string;
  path: string;
}
export interface IMailGroup {
  id: number;
  group_name: string;
  kod_place: number;
}
export interface IRoles {
  id: number;
  naimen: string;
  description: string;
  active: boolean;
  date_add: string;
  full_access: boolean;
}
export interface IAllUserInfo {
  empid: number;
  login: string;
  empfamilyname: string;
  empgivenname: string;
  emppatronymic: string;
  pass: string;
  session_token: string;
  question: string;
  active: boolean;
  tabnum: null;
  login_ip: string;
  create_time: string;
  login_time: string;
  emailsigma?: string;
  mainmail?: string;
  emailomega?: string;
  emailalpha?: string;
  empmobilephone?: string;
  empinnerphone?: string;
  dir?: string;
  deptname?: string;
  agileroles?: string;
  funcdir?: string;
  date_moditify?: string;
  checkroom?: string;
  loginsigma?: string;
  birthday?: string;
  loginomega?: string;
  jobtitle?: string;
  photo30?: string;
  fullphoto?: string;
  check_ip: boolean;
}
export interface IUserFullInfo extends User {
  fio: string;
  short: string;
  full: string;
  last_name: string;
  first_name: string;
  second_name: string;
  login: string;
  tabnum: string;
  id: number;
  family: string;
  sm_contact_name: string;
  sm_full_name: string;
}
export interface Filter {
  [key: string]: string | null | string[] | number[];
}
export interface PomniRestData {
  [key: string]: string;
}
export interface TableTest {
  key_field: string;
  name: string;
  valdata: PomniRestData[];
  id: string;
  naimen: string;
  func?: (e: string) => string; // (значение)=>{return обработанное_значение;}
}
export interface Nfield {
  fname: string;
  ftype: number;
  fnull: boolean;
  scale: string;
  default: string;
}
export interface FieldList extends Record<string, any> {
  column_name: string;
  ordinal_position: string;
  column_default: string;
  is_nullable: string;
  data_type: string;
  character_maximum_length: string;
  udt_name: string;
  is_updatable: string;
}
export interface OperatorPG {
  id: string;
  name: string;
}
export interface IPgInterval {
  days?: number;
  hours?: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}
export interface TableInfoPG {
  hasindexes: boolean;
  hasrules: boolean;
  hastriggers: boolean;
  table?: string;
  tablename: string;
  tableowner: string;
  tablespace: string;
}
export interface UserBZFio extends IUserFio {
  fio: string;
  short: string;
  full: string;
  last_name: string;
  first_name: string;
  second_name: string;
  login: string;
  tabnum: number;
  id: number;
  family: string;
}
export interface IUserFio {
  active: boolean;
  family: string;
  first_name: string;
  id: number;
  login: string;
  second_name: string;
  sm_contact_name: string;
  sm_full_name: string;
  tabnum: number;
}
export interface IPost {
  active: boolean;
  cat: Array<number>;
  fav: string;
  favs: string;
  files: string;
  id: number;
  kod_user: number;
  n: string;
  post_content: string;
  post_date: string;
  post_modified: string | null;
  post_title: string;
  sm_id: Array<string>;
  solution: string;
  usr: string;
}
export interface IRoleUser {
  id: number;
  kod_role: number;
  kod_user: number;
  access_level: number;
  active: boolean;
  date_add: string;
}
export interface IRoleAccess {
  id: number;
  kod_role: number;
  kod_access: number;
  access_level: number;
  active: boolean;
  date_add: string;
}
export interface IBZTerms {
  term_id: number;
  name: string;
  slug: string;
  term_group: number;
  active: boolean;
  id: number;
}
export interface IUserPrifile {
  empid: number;
  empgivenname: string;
  checkroom: number;
  checkroomdep: number;
  empfamilyname: string;
  emppatronymic: string;
  empoldfamilyname: string | null;
  emptbname: string;
  empinnerphone: string;
  mainmail: string;
  deptname: string;
  jobtitle: string;
  deptroot: string;
  outdatesoon: string | null;
  isremote: number;
  photo30: string;
  tabel: string | null;
  hourbelt: number;
  isrk: string | null;
  isbtmanager: string | null;
  birthdaytoday: number;
  isfav: number;
  type: number;
  isagile: number;
  outstatus: string | null;
  empname: string;
  deptrootname: string;
  empmobilephone: string;
  empmobilephone2: string | null;
  phonelist: string;
  phoneslist: string | null;
  emailalpha: string | null;
  emailsigma: string;
  emailomega: string;
  email: string | null;
  empaddress: string;
  emproom: string;
  empplace: string | null;
  birthday: string;
  tabnum: string;
  carnumber: string;
  agileroot: string;
  agilemanagers: string;
  agileroles: string;
  dir: string;
  dirid: number;
  secid: string | null;
  secfio: string | null;
  funcdir: string;
  funcdirid: number;
  fullphoto: string;
  loginomega: string;
  loginsigma: string;
  date_moditify: string;
  active: boolean;
  create_time: string;
  uid: number;
  login_ip: string;
  login: string;
  login_time: string;
}
export interface IAnyObject {
  [x: string]: any;
}
export interface IParserURLResource {
  id: number;
  base_url: string;
  query_param1: string;
  query_param2: string;
  need_quoted: boolean;
  url_name: string;
}
export interface IParserURLPattern {
  id: number;
  file: string;
  pattern: string;
  query: string;
  avcive: boolean;
  link_style: string;
  kod_resource: number;
}
export interface IFileInfo {
  active: boolean;
  n: string;
  original_name: string;
  create_time: string;
  file_name: string;
  kod_post: null | number;
  file_size: number;
  kod_user: number;
  family: string;
  login: string;
  first_name: string;
}

export interface TipsDTH {
  text: string;
  value: string;
  class?: string;
  align?: "start" | "center" | "end";
  cellClass?: string | string[];
  divider?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  tip?: string;
  width?: number | string;
  cellProps?: (any) => Record<string, string>;
}
export type ValidationRule = (args: string | number) => string;
export type ItemType<T> = T extends infer U ? U : never;

export type SelectItemKey<T extends Record<string, any>> =
  | boolean
  | null
  | undefined
  | string
  | readonly (string | number)[]
  | ((item: T, fallback?: any) => any);
export type ValueItem<T extends any> =
  | T
  | boolean
  | null
  | undefined
  | string
  | readonly (string | number)[];
