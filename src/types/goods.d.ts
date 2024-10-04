interface IDNSProdict {
  id: number;
  dns_id: string;
  last_price: number;
  last_date: string;
  dns_name: string;
  date_add: string;
  active: boolean;
}

interface IDNSPrice {
  id: number;
  kod_product: number;
  current_price: string;
  date_price: string;
  date_add: string;
}

interface IMvideoPrice {
  baseprice: number;
  saleprice: number;
  basepromoprice: number;
  isfinalprice: boolean;
  date_price: string;
}

interface IMvideoProduct extends IMProduct {
  id: string;
  name: string;
  lastPrice: number;
  actualToday: number;
  deltaRub: string;
  deltaProc: string;
  avgSP: string;
  lastDate: string;
  delt: number;
  basePrice: string;
  salePrice: string;
  basePromoPrice: string;
  isFinalPrice: boolean;
}
interface IMProduct {
  id: string;
  name: string;
  last_price: number;
  last_isfinalprice: boolean;
  monitoring: number;
  date_price: string;
  date_add: string;
}
