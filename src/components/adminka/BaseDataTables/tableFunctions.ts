import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import { ECONFIG, EKNOWLEGEBASE } from "@/const/schemaEnums";
import { useAdminStore } from "@/store/modules/admin";
import { usePostgreStore } from "@/store/modules/postgre";
import { IConfigDataBases } from "@/types/database/schemas/config";
import { ICreateTableFields } from "@/types/database/service";
export interface IFilterFields {
  name: string;
  op: string;
  value: string | number;
}
const { r_get } = dataApiComposition();
export const reloadSchema = (kod_database_tuz: number) =>
  r_get<string>(
    {
      fields: ["nspname"],
      from: "pg_catalog.pg_namespace",
      sort: ["nspname"],
      tuz: kod_database_tuz,
    },
    "pg_namespace",
    usePostgreStore
  );
export const getDatabaseTUZ = () =>
  r_get<ICreateTableFields<keyof IConfigDataBases, "db">>(
    {
      fields: ["db.base_name", "db.id", "db.naimen", "db.kod_driver"],
      from: [`${ECONFIG.data_bases}:db`],
      filter: {
        "db.active": true,
        "db.kod_driver": 1,
      },
      sort: ["db.naimen"],
    },
    "bd_list_tuz",
    useAdminStore
  );
export const getData = (space: string, kod_database_tuz = 0) => {
  r_get<string>(
    {
      from: "pg_types_fields",
      sort: ["type_name"],
      tuz: kod_database_tuz,
    },
    "dataTypes",
    usePostgreStore
  );
  reloadSchema(kod_database_tuz);
  r_get<string>(
    {
      fields: [
        "tablename",
        "tableowner",
        "tablespace",
        "hasindexes",
        "hasrules",
        "hastriggers",
      ],
      from: "pg_catalog.pg_tables",
      filter: { schemaname: `=:${space}` },
      sort: ["tablename"],
      tuz: kod_database_tuz,
    },
    "tableList",
    usePostgreStore
  );
};
export const getColumnInfo = (
  space: string,
  table: string,
  kod_database_tuz = 0
) =>
  r_get<string>(
    {
      from: "information_schema.columns",
      fields: [
        "column_name",
        "ordinal_position",
        "column_default",
        "is_nullable",
        "data_type",
        "character_maximum_length",
        "udt_name",
        "is_updatable",
      ],
      filter: { table_schema: `=:${space}`, table_name: `=:${table}` },
      sort: ["ordinal_position"],
      tuz: kod_database_tuz,
    },
    "fieldList",
    usePostgreStore
  );
export const getDataTable = (
  schema: string,
  table: string,
  // fieldName: string,
  // search: string,
  // operator: string,
  filterFields: IFilterFields[],
  kod_database_tuz = 0,
  selectedFields: FieldList[] = [],
  sort = ["-1"],
  page = 1,
  limit = 20
) => {
  const filter: Record<string, string> = {};
  for (let index = 0; index < filterFields.length; index++) {
    const element = filterFields[index];
    if (element.value) {
      if (element.name) {
        filter[element.name + "@" + index] = element.op + element.value;
      } else {
        toast.warning("Не выбрано поле для поиска");
      }
    }
  }

  r_get<string>(
    {
      fields: [...selectedFields.map((e) => e.column_name)],
      from: (schema + "." + table) as EKNOWLEGEBASE,
      sort: sort,
      filter,
      limit: limit,
      page: page,
      tuz: kod_database_tuz,
    },
    "dataTable",
    usePostgreStore
  );
};
export const getPrimaryKeys = (
  schema: string,
  table: string,
  kod_database_tuz = 0
) =>
  r_get<string>(
    {
      fields: ["a.attname:column_name"],
      from: [
        {
          alias: "ck",
          from: ["pg_catalog.pg_constraint:c"],
          fields: ["unnest(c.conkey):col_id", "c.*"],
        },
        "pg_catalog.pg_attribute:a",
        "pg_catalog.pg_class:pc",
        "pg_catalog.pg_namespace:pn",
      ],
      join: [
        "ck.conrelid=a.attrelid",
        "ck.col_id=a.attnum",
        "ck.conrelid=pc.oid",
        "ck.connamespace=pn.oid",
      ],
      filter: {
        "ck.contype": "=:p",
        "pc.relname": `=:${table}`,
        "pn.nspname": `=:${schema}`,
      },
      sort: ["a.attname"],
      tuz: kod_database_tuz,
    },
    "primarykey",
    usePostgreStore
  );
