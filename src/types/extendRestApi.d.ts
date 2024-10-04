import { currentAuthUser, currentTimestamp } from "@/const/globalRestAPI";
import { type TBDALLTABLES } from "@/const/schemaEnums";

type restBasicOperator = ">" | "<" | "=";
type TRegLike = "~" | "~~";
type TPGBool = "t" | "f" | "true" | "false" | boolean;
type TBoolNegative = "" | "!";
type TCase = "" | "*";
type TqEXISTS = "EXISTS" | "NOT_EXISTS";
type TOpBase = ">" | ">=" | "=" | "<>" | "<=" | "!=" | "<";
type TOpStr = `${TBoolNegative}${TRegLike}${TCase}`;
export type TExtendAlias<T extends Record<string, any>, A extends string> = {
  [K in keyof T as K extends string ? `${A}${K}` : never]?: T[K];
};
type restValue2<T> = T extends typeof currentAuthUser
  ? typeof currentAuthUser
  : T extends typeof currentTimestamp
  ? typeof currentTimestamp
  : T extends TOpBase
  ? TOpBase
  : T extends TOpStr
  ? TOpStr
  : T extends `${TOpStr | TOpBase}:${string}`
  ? `${TOpStr | TOpBase}:${string}`
  : string | number | null | boolean | undefined;

export type restGetType2<
  T extends IAnyObject = IAnyObject,
  F extends string = TBDALLTABLES
> = {
  [K in keyof T]?:
    | (T[K] extends null
        ? `${TBoolNegative}null`
        : T[K] extends boolean
        ? TPGBool
        : T[K] extends number
        ? `${TOpBase}:${T[K]}`
        : T[K] extends string
        ? `${TOpStr | TOpBase}:${T[K]}`
        : never)
    | restGetExtend<T, F>
    | restGetType2<T, F>[];
};
interface restGetExtend<
  T extends IAnyObject = IAnyObject,
  F extends string = TBDALLTABLES
> {
  filter?: restGetType2<T, F> | restGetType2<T, F>[];
  /**
   * Секция from для указания таблиц в БД, из которых будут извлекаться данные
   * для выбора из нескольких таблиц используется массив строк
   * так же в виде таблицы может быть использован подзапрос
   * все таблицы представлены в enum'ах = E[SCHEMA].имя_таблицы
   * рекомендумемое объявление [`${ECONFIG.data_base}:db`]
   */
  from:
    | `${F}:${string}`
    | `${F}`
    | Array<`${F}:${string}` | `${F}` | restGetExtend<T, F>>;
  /**
   * Перечисление полей для запроса, подсказки можно активировать передав типы
   */
  fields?: restFields2<T>[];
  join?: Array<
    IRestJoin<TaKS<T>> | IRestJoinLeft<TaKS<T>> | IRestJoinRight<TaKS<T>>
  >;
  group?: Array<keyof T>;
  sort?: Array<`${restSortOrder}${TaKS<T>}` | `${restSortOrder}${number}`>;
  limit?: number;
  page?: number;
  alias?: string;
}
type restFields2<T extends { [x: string]: string }> =
  | "DISTINCT"
  | TaKS<T>
  | `${TaKS<T>}:${string}`
  | `${string}(${TaKS<T>},${string}):${string}`
  | `${string}(${TaKS<T> | number}):${string}`
  | restGetExtend<T>;
type TaKS<T> = string & keyof T;
