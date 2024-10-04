export interface IBillingApartments {
  id: number;
  naimen: null | string;
  kod_street: null | number;
  home_num: null | number;
  room_num: null | number;
  peoples: null | number;
  area: null | number;
  date_add: null | string;
  active: boolean;
}
export interface IBillingBillings {
  id: number;
  kod_meter: null | number;
  date_bil: string;
  value: number;
  date_add: null | string;
  active: boolean;
}
export interface IBillingMeters {
  id: number;
  naimen: null | string;
  model: null | string;
  num: null | string;
  kod_apartments: null | number;
  kod_resource: null | number;
  counter: null | boolean;
  date_add: null | string;
  active: boolean;
  multiplicity: null | number;
  kod_drain: null | number;
}
export interface IBillingObjStreet {
  id: number;
  type: null | string;
  naimen: null | string;
  date_add: null | string;
  active: boolean;
}
export interface IBillingPrices {
  id: number;
  kod_resource: null | number;
  billing: null | number;
  date_beg: string;
  date_add: null | string;
  active: boolean;
}
export interface IBillingResources {
  id: number;
  naimen: null | string;
  post: null | number;
  on_meter: null | boolean;
  on_people: null | boolean;
  date_add: null | string;
  active: boolean;
}
export interface IMonitoringZdorovie {
  id: number;
  pressure_up: number;
  pressure_down: number;
  heartbeat: null | number;
  time_add: string;
}
