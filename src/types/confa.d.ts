interface ConfContent {
  id: number;
  kod_block: number;
  content_text: string;
  position: number;
  version: number;
  date_add: string;
  kod_user: number;
  date_modify: string;
  kod_user_modify: number;
}
interface ConfBlock {
  id: number;
  name: string;
  kod_block: number;
  kod_page: number;
  content: string;
  date_add: string;
  kod_user: number;
  date_modify: string;
  kod_user_modify: number;
  kod_content: number;
}
interface ConfPage {
  id: number;
  name: string;
  date_add: string;
  kod_user: number;
}
interface IConfSearchContent {
  content_text: string;
  id: number;
  name: string;
  kod_block: null;
  kod_page: number;
  content: string;
  date_add: string;
  kod_user: number;
  date_modify: null;
  kod_user_modify: null;
  page_name: string;
}
