export interface IConfaBlock {
  name: null | string;
  kod_block: null | number;
  kod_page: number;
  content: null | string;
  kod_user: null | number;
  date_modify: null | string;
  kod_user_modify: null | number;
  date_add: null | string;
  id: number;
}
export interface IConfaContent {
  kod_block: number;
  kod_user: null | number;
  date_modify: null | string;
  kod_user_modify: null | number;
  kod_content: null | number;
  content_text: string;
  position: number;
  version: number;
  date_add: string;
  id: number;
}
export interface IConfaPages {
  name: null | string;
  date_add: null | string;
  kod_user: null | number;
  id: number;
}
