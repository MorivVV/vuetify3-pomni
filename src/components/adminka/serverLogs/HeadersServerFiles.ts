import { DataTableHeader } from "vuetify";

export const HeadersServerFiles: DataTableHeader[] = [
  {
    value: "filename",
    text: "Имя файла",
    divider: true,
  },
  {
    value: "stat.mtime",
    text: "Создан",
    divider: true,
  },
  {
    value: "stat.atime",
    text: "Изменен",
    divider: true,
  },
  {
    value: "stat.size",
    text: "размер",
    divider: true,
  },
];
