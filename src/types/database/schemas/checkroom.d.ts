export interface ICheckroomEmployees {
  id: number;
  empgivenname: null | string;
  empfamilyname: null | string;
  emppatronymic: null | string;
  empoldfamilyname: null | string;
  emptbname: null | string;
  empinnerphone: null | string;
  mainmail: null | string;
  deptname: null | string;
  jobtitle: null | string;
  deptroot: null | string;
  outdatesoon: null | string;
  isremote: null | number;
  photo30: null | string;
  tabel: null | number;
  hourbelt: null | number;
  isrk: null | string;
  isbtmanager: null | string;
  birthdaytoday: null | number;
  isfav: null | number;
  type: null | number;
  isagile: null | number;
  outstatus: null | string;
  empname: null | string;
  deptrootname: null | string;
  empmobilephone: null | string;
  empmobilephone2: null | string;
  phonelist: null | string;
  phoneslist: null | string;
  emailalpha: null | string;
  emailsigma: null | string;
  emailomega: null | string;
  email: null | string;
  empaddress: null | string;
  emproom: null | string;
  empplace: null | string;
  birthday: null | string;
  tabnum: null | string;
  carnumber: null | string;
  agileroot: null | string;
  agilemanagers: null | string;
  agileroles: null | string;
  dir: null | string;
  dirid: null | number;
  secid: null | string;
  secfio: null | string;
  funcdir: null | string;
  funcdirid: null | number;
  fullphoto: null | string;
  loginomega: null | string;
  loginsigma: null | string;
  date_moditify: null | string;
  outstatusstart: null | number;
  outstatusend: null | number;
  birthday_date: string;
  loginalpha: null | string;
  empcontactphone: null | string;
  remotetype: null | string;
  agile_id: null | string;
  depart_id: null | string;
  date_add: string;
}
export interface ICheckroomRAdmins {
  kod_user: number;
  login: string;
  level: number;
  passhash: null | string;
  session_hash: null | string;
  id: number;
}
export interface ICheckroomRBox {
  num_box: string;
  kod_depart: null | number;
  kod_location: number;
  id: number;
}
export interface ICheckroomRDeparts {
  naimen: string;
  color: string;
  kod_addressbook: number;
  id: number;
}
export interface ICheckroomRLocation {
  coordinats: string;
  id: number;
  unit: number;
}
export interface ICheckroomRSessions {
  kod_user: number;
  sessionhash: string;
  id: number;
}
export interface ICheckroomRUsers {
  family: string;
  kod_depart: number;
  kod_box: null | number;
  tab_num: number;
  fname: null | string;
  sname: null | string;
  admin: boolean;
  active: boolean;
  id: number;
}
