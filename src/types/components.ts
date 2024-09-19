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
  cellProps?: (arg0: any) => Record<string, string>;
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
