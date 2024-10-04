import { dataApiComposition } from "@/compositionApi/dataApi";
import {
  IReportsCells,
  IReportsColumnType,
  IReportsReportColumns,
  IReportsReportName,
  IReportsReportRows,
  IReportsReportState,
} from "@/types/database/schemas/reports";
import { TipsDTH } from "../monitoring/monsm/monSmHeaders";
import { IRestJoinLeft, restGet } from "@/types/restApi";
import { useReportStore } from "@/store/modules/reports";
import { toRefs } from "vue";
import { ICreateTableFields } from "@/types/database/service";
// import { mqlFetchQuery } from "@morivvv/json-sql-builder/dist/functions/fetchQuery";
import {
  IAliasTableFields,
  TMergeTInterface,
  IJMQL,
  mqlFetchQuery,
} from "@morivvv/json-sql-builder";

const { r_get, r_delete, r_getFile, r_update } = dataApiComposition();

export const tableHeaderReportHistory: TipsDTH[] = [
  { value: "naimen", text: "Название отчета", divider: true },
  { value: "date_add", text: "Создан", divider: true },
  { value: "row_count", text: "Строк в отчете", divider: true },
  {
    value: "xlsx",
    text: "XLSX",
    tip: "Скачать в Эксель файл XLSX",
    width: 40,
    divider: true,
  },
  { value: "delete", text: "Действие", width: 40, divider: true },
];

export const tableHeader: TipsDTH[] = [
  { value: "naimen", text: "Название отчета", divider: true },
  { value: "date_add", text: "Создан", divider: true },
  { value: "report_count", text: "Сохранено версий", divider: true },
  { value: "report_last", text: "Последняя версия", divider: true },
];

export const getReports = () => {
  type _R = TMergeTInterface<
    IAliasTableFields<IReportsReportState, "s">,
    IAliasTableFields<IReportsReportName, "r">
  >;
  const mql_report: IJMQL<_R> = {
    from: ["reports.report_name:r"],
    fields: [
      "r.id",
      "r.naimen",
      "r.date_add",
      {
        from: ["reports.report_state:s"],
        filter: { "s.kod_report": "@@=:r.id" },
        fields: ["count(1):report_count"],
      },
      {
        from: ["reports.report_state:s"],
        filter: { "s.kod_report": "@@=:r.id" },
        fields: ["s.date_add:report_last"],
        sort: ["-s.id"],
        limit: 1,
      },
    ],
    sort: ["-r.id"],
  };
  return r_get<
    | ICreateTableFields<keyof IReportsReportName, "r">
    | ICreateTableFields<keyof IReportsReportState, "s">
  >(mql_report as any, "reports", useReportStore);
};

export const getReportState = (reportId = 0) => {
  type _R = TMergeTInterface<
    IAliasTableFields<IReportsReportState, "s">,
    IAliasTableFields<IReportsReportRows, "r">
  >;
  const mql_report: IJMQL<_R> = {
    from: ["reports.report_state:s"],
    fields: [
      "s.id",
      "s.naimen:naimen",
      "s.kod_report",
      "s.date_add",
      {
        from: ["reports.report_rows:r"],
        filter: { "r.kod_report": "@@=:s.id" },
        fields: ["count(r.id):row_count"],
      },
    ] as const,
    sort: ["-s.id"],
    filter: { "s.kod_report": reportId },
  };
  mqlFetchQuery<_R>(
    mql_report,
    "http://localhost:3000/api/v2/restGet",
    "e86e97d517deacce309deadc96d54ae5"
  );
  return r_get<
    | ICreateTableFields<keyof IReportsReportState, "s">
    | ICreateTableFields<keyof IReportsReportRows, "r">
  >(mql_report as any, "reportsState", useReportStore).then((r) => {
    r.filter((a) => a);
  });
};
export const getReportColumnType = () =>
  r_get<keyof IReportsColumnType>(
    {
      from: "reports.column_type",
      fields: ["id", "naimen"],
    },
    "reportsColumnType",
    useReportStore
  );

export const getReportColumn = (reportId = 0) =>
  r_get<keyof IReportsReportColumns>({
    from: "reports.report_columns",
    fields: [
      "id",
      "name_col",
      "description",
      "position_col",
      "date_add",
      "type_col",
    ],
    sort: ["position_col", "id"],
    filter: { kod_report: reportId },
  });

const generateReportQuery = (reportId = 0, reportStateId = 0) =>
  getReportColumn(reportId).then((col) => {
    const { reportsColumnType } = toRefs(useReportStore());
    const reportFields = col.map((c) => {
      const colType = reportsColumnType.value.find(
        (t) => t.id === c.type_col
      )?.naimen;
      return `c${c.id}.val::${colType ?? "varchar"}:"${
        c.description ? c.description : c.name_col
      }"`;
    });
    const reportCells = col.map(
      (c) =>
        ({
          from: "reports.cells:c" + c.id,
          alias: "c" + c.id,
          filter: { kod_column: c.id },
        } as restGet<keyof IReportsCells>)
    );
    const reportJoin = col.map(
      (c) => `r.id=(+)c${c.id}.kod_row` as IRestJoinLeft
    );
    const genRepoort: restGet<string | keyof IReportsReportRows> = {
      fields: ["row_position", ...reportFields, "date_add"],
      from: ["reports.report_rows:r", ...reportCells],
      join: [...reportJoin],
      sort: ["row_position"],
      filter: { "r.kod_report": reportStateId },
    };
    return genRepoort;
  });

export const generateReport = (
  reportId = 0,
  reportStateId = 0,
  limit?: number
) =>
  generateReportQuery(reportId, reportStateId).then((genRepoort) =>
    r_get({ ...genRepoort, limit })
  );

export const generateReportXLSX = (
  reportId = 0,
  reportStateId = 0,
  name = ""
) =>
  generateReportQuery(reportId, reportStateId).then((genRepoort) =>
    r_getFile(
      genRepoort,
      name + "_reportId" + reportId + "_viewId" + reportStateId,
      "XLSX"
    )
  );

export const delReportState = (reportId = 0) => {
  if (confirm("Данное действие удалит отчет со всеми данными. Продолжить?")) {
    return r_delete({ from: "reports.report_state", filter: { id: reportId } });
  }
  return new Promise(() => false);
};
export const updateReportColumn = (
  kod_column: number,
  type_col: number,
  description: string | null
) =>
  r_update<keyof IReportsReportColumns>({
    to: "reports.report_columns",
    set: { description, type_col },
    filter: { id: kod_column },
  });
