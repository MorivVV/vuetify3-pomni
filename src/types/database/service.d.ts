export type ICreateTableFields<
  Field extends string = string,
  TableAlias extends string = string
> = `${TableAlias}.${Field}` | `${TableAlias}.*`;

export type IAliasTableFields<T extends IAnyObject, A extends string> = {
  [K in keyof T as K extends string ? TaddFA<K, A> : never]: T[K];
};

type TaddFA<T extends string, A extends string> = `${A}.${T}`;

export type TTipsDTH<R extends Record<string, any> = Record<string, any>> = {
  text: string;
  value: keyof R;
  align?: "start" | "center" | "end";
  sortable?: boolean;
  filterable?: boolean;
  groupable?: boolean;
  divider?: boolean;
  class?: string | string[];
  cellClass?: string | string[];
  width?: string | number;
  filter?: (value: any, search: string | null, item: any) => boolean;
  sort?: DataTableCompareFunction<T>;
  /** всплывающая подсказка для VTooltipTableHeader */
  tip?: string;
};
