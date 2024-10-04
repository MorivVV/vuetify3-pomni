import projectDebug from "@/functions/projectDebug";
import { DataTableHeader } from "vuetify";
import { utils, write, WritingOptions } from "xlsx";

export const dataToExcel = () => {
  const getXLSX = (
    name: string,
    data: Record<string, string | null | number | boolean>[],
    headers: DataTableHeader[] | undefined = undefined
  ) => {
    const queryResult: Record<string, string>[] = [];
    for (const iterator in data) {
      let rData = {};
      if (headers) {
        for (const h of headers) {
          rData[h.text] = data[iterator][h.value];
        }
      } else {
        rData = data[iterator];
      }
      queryResult.push(rData);
    }
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(queryResult);
    let cols = -1;
    ws["!cols"] = [];
    if (queryResult.length) {
      const row = queryResult[0];
      for (const r in row) {
        projectDebug(r);
        ws["!cols"].push({ wch: 20 });
        cols++;
      }
    }
    const topCell = utils.encode_cell({ r: 0, c: cols });

    ws["!autofilter"] = { ref: "A1:" + topCell };
    utils.book_append_sheet(wb, ws, name.substring(0, 31));
    const wopts: WritingOptions = {
      bookType: "xlsx",
      bookSST: false,
      type: "array",
    };

    const wbout = write(wb, wopts);

    const a = document.createElement("a");
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    a.href = window.URL.createObjectURL(blob);
    a.download = name + ".xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return { getXLSX };
};
