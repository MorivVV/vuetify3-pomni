import { TipsDTH } from "@/components/monitoring/monsm/monSmHeaders";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { momentFormatDate } from "@/const/timeFormats";
import { useAdminStore } from "@/store/modules/admin";
import { IConfigInboxMail } from "@/types/database/schemas/config";
import moment from "moment";
const { r_get } = dataApiComposition();
export const getMailInbox = () =>
  r_get<keyof IConfigInboxMail>(
    {
      from: "config.inbox_mail",
      fields: [
        "id",
        "uid",
        "subject",
        "date_mail",
        "to_mail",
        "from_mail",
        "body",
        "html",
        "date_add",
      ],
      sort: ["-uid"],
      filter: {
        date_mail: ">:" + moment().format(momentFormatDate),
      },
    },
    "inbox_mail",
    useAdminStore
  );
export const mailHeaders: TipsDTH[] = [{ text: "Тема", value: "subject" }];
