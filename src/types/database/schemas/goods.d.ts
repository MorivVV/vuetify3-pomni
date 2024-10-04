export interface IGoodsDnsPrice {
  id: number;
  kod_product: number;
  current_price: string;
  date_price: string;
  date_add: null | string;
}
export interface IGoodsDnsProducts {
  id: number;
  dns_id: string;
  dns_name: string;
  date_add: null | string;
  active: null | boolean;
}
export interface IGoodsMvideoPrice {
  id: number;
  productid: string;
  baseprice: null | number;
  saleprice: null | number;
  basepromoprice: null | number;
  isfinalprice: boolean;
  date_price: string;
  date_add: null | string;
}
export interface IGoodsMvideoProduct {
  id: number;
  name: string;
  monitoring: number;
  date_add: string;
}
