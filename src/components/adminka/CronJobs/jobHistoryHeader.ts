import { IKnowledgebaseCronJobsAudit } from "@/types/database/schemas/knowledgebase";
import { DataTableHeader } from "vuetify";
interface TipsDTH extends DataTableHeader<IKnowledgebaseCronJobsAudit> {
  /** всплывающая подсказка для VTooltipTableHeader */
  tip?: string;
}
export const jobHistoryHeader: TipsDTH[] = [
  {
    text: "pid",
    value: "pid",
    class: "pa-1",
    cellClass: "pa-1",
    divider: true,
    tip: "Идентификатор процесса, в котором запущено задание",
    width: 60,
  },
  {
    text: "Род. pid",
    value: "parent_pid",
    class: "pa-1",
    cellClass: "pa-1",
    divider: true,
    tip: "Родительский процесс, в котором была запущена пачка заданий (за текущую минуту)",
    width: 60,
  },
  {
    text: "Автор",
    value: "kod_user",
    class: "pa-1",
    cellClass: "pa-1",
    divider: true,
    tip: "Последний пользователь, который производил изменение скрипта",
  },
  {
    text: "Парамертры запуска",
    value: "parameters",
    class: "pa-1",
    cellClass: ["pa-1", "text-break"],
    divider: true,
    width: "35%",
    tip: "Настройки, которые использовались при запуске скрипта",
  },
  {
    text: "Результат выполнения",
    value: "result",
    class: "pa-1",
    cellClass: ["pa-1", "text-break"],
    divider: true,
    width: "40%",
    tip: "Скрипт отбрасывает в это поле результат работы, если в этом поле долго висит слово 'выполняется' и родительский pid = 1, то процесс УМЕР",
  },

  {
    text: "старт",
    value: "time_start",
    class: "pa-1",
    cellClass: "pa-1",
    divider: true,
    width: 70,
  },
  {
    text: "выполнение",
    value: "time_end",
    class: "pa-1",
    cellClass: "pa-1",
    divider: true,
    width: 70,
  },
  {
    text: "время",
    value: "time_len",
    class: "pa-1",
    cellClass: "pa-1",
    divider: true,
    width: 70,
  },
  {
    text: "Успех",
    value: "success",
    class: "pa-1",
    cellClass: "pa-1",
    divider: true,
    width: 30,
  },
];
