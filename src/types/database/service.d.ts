export type ICreateTableFields<
  Field extends string = string,
  TableAlias extends string = string
> = `${TableAlias}.${Field}` | `${TableAlias}.*`;

export type IAliasTableFields<T extends IAnyObject, A extends string> = {
  [K in keyof T as K extends string ? TaddFA<K, A> : never]: T[K];
};

type TaddFA<T extends string, A extends string> = `${A}.${T}`;
