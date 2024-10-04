import { TipsDTH } from "@/components/monitoring/monsm/monSmHeaders";

export const auditHeader: TipsDTH[] = [
  {
    value: "time_action",
    text: "Время",
    divider: true,
    tip: "Время действия",
  },
  {
    value: "kod_user",
    text: "Пользователь",
    divider: true,
    tip: "Зарегистрированный пользователь",
  },
  {
    value: "token",
    text: "Токен",
    divider: true,
    tip: "Токен авторизации пользователя",
  },
  {
    value: "ip",
    text: "IP",
    divider: true,
    tip: "IP адрес клиента",
  },
  {
    value: "browser",
    text: "Браузер",
    divider: true,
    tip: "Браузер используемый пользователем",
  },
  {
    value: "comment",
    text: "Действие",
    divider: true,
    tip: "Действие совершенное пользователем",
  },
  {
    value: "action",
    text: "Параметры",
    divider: true,
    tip: "Параметры переданные в запросе",
  },
];
export const svodHeader: TipsDTH[] = [
  {
    value: "time_action",
    text: "Активность",
    divider: true,
    tip: "Время последнего действия",
  },
  {
    value: "cnt",
    text: "Действия",
    divider: true,
    tip: "Количество действий за выбранное время",
  },
  {
    value: "ip",
    text: "IP",
    divider: true,
    tip: "IP адрес клиента",
  },
  {
    value: "agent",
    text: "Браузер",
    divider: true,
    tip: "Браузер используемый пользователем",
  },
  {
    value: "kod_user",
    text: "Пользователь",
    divider: true,
    tip: "Зарегистрированный пользователь",
  },
];
