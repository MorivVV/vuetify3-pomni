import { dataApiComposition } from "@/compositionApi/dataApi";
import { currentAuthUser } from "@/const/globalRestAPI";
import { useConfaStore } from "@/store/modules/confa";
import {
  IConfaBlock,
  IConfaContent,
  IConfaPages,
} from "@/types/database/schemas/confa.t";
import { ICreateTableFields } from "@morivvv/json-sql-builder";

const { r_get, r_insert, checkDataModify } = dataApiComposition();
export const getConfaBlocks = (kodPage: number) =>
  r_get<"coalesce(kod_block,id)" | keyof ConfBlock, ConfBlock>(
    {
      from: "confa.block",
      filter: { kod_page: kodPage },
      sort: ["coalesce(kod_block,id)", "id"],
    },
    "blocks",
    useConfaStore
  );

export const addConfaBlock = (
  nameBlock: string,
  pageId: number,
  contentBlock: string,
  kod_block?: number
) => {
  return r_insert({
    to: "confa.block",
    fields: {
      name: nameBlock,
      kod_user: currentAuthUser,
      kod_page: pageId,
      content: contentBlock,
      kod_block,
    },
  }).then((r) => checkDataModify(r));
};

export const getPagesData = () => {
  return r_get<keyof ConfPage>(
    {
      from: ["confa.pages"],
      sort: ["name"],
    },
    "pages",
    useConfaStore
  );
};

export const getConfSearchResults = (search: string) => {
  if (search.length < 2) return;
  return r_get<
    | ICreateTableFields<keyof IConfaContent, "c">
    | ICreateTableFields<keyof IConfaBlock, "b">
    | ICreateTableFields<keyof IConfaPages, "p">
  >(
    {
      fields: ["c.content_text", "b.*", "p.name:page_name"],
      from: ["confa.content:c", "confa.block:b", "confa.pages:p"],
      join: ["c.kod_block=b.id", "b.kod_page=p.id"],
      filter: {
        "c.content_text": `~:${search}`,
        "c.kod_content": "null",
      },
    },
    "content_search",
    useConfaStore
  );
};
