import { TipsDTH } from "@/components/monitoring/monsm/monSmHeaders";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { EBILLING } from "@/const/schemaEnumsHome";
import { useBillingsStore } from "@/store/modules/billings";
import {
  IBillingApartments,
  IBillingBillings,
  IBillingMeters,
  IBillingPrices,
} from "@/types/database/schemas/billing";
import { ICreateTableFields } from "@/types/database/service";
const { r_get } = dataApiComposition();

export const getAppartamens = () =>
  r_get<keyof IBillingApartments>(
    { from: `${EBILLING.apartments}`, sort: ["naimen"] },
    "apartments",
    useBillingsStore
  );

export const getMeters = (home: number) =>
  r_get<ICreateTableFields<keyof IBillingMeters, "m">>(
    {
      fields: [
        "m.id",
        "m.naimen",
        "m.model",
        "m.num",
        "m.kod_resource",
        "m.counter",
        "m.multiplicity",
        "m.kod_drain",
        "m.active",
        "0:calc_sum",
      ],
      from: [`${EBILLING.meters}:m`],
      filter: { "m.kod_apartments": home, "m.active": true },
      sort: ["m.naimen"],
    },
    "meters",
    useBillingsStore
  );
export const getBillingDates = (home: number) =>
  r_get<
    | "date_bil"
    | ICreateTableFields<keyof IBillingBillings, "b">
    | ICreateTableFields<keyof IBillingMeters, "m">
  >(
    {
      fields: ["DISTINCT", "to_char(b.date_bil,'YYYY-MM-DD'):date_bil"],
      from: [`${EBILLING.billings}:b`, `${EBILLING.meters}:m`],
      join: ["m.id=b.kod_meter"],
      filter: { "m.kod_apartments": home },
      sort: ["-date_bil"],
    },
    "dates",
    useBillingsStore
  );
export const getPrices = (date_billing: string) =>
  r_get<ICreateTableFields<keyof IBillingPrices, "p">>(
    {
      from: [`${EBILLING.prices}:p`],
      filter: {
        "p.active": true,
        "p.date_beg": `<=:${date_billing}`,
      },
      sort: ["-p.date_beg"],
    },
    "prices",
    useBillingsStore
  );
export const headerBillingData: TipsDTH[] = [
  { text: "За что", value: "naimen" },
  { text: "Расчет", value: "calc_sum" },
];
export const getBilling = (kod_home: number, date_billing: string) =>
  r_get<
    | ICreateTableFields<keyof IBillingBillings, "b">
    | ICreateTableFields<keyof IBillingMeters, "m">
  >(
    {
      fields: [
        "b.id",
        "b.value",
        "b.kod_meter",
        "b.date_bil",
        "b.date_add",
        "b.active",
      ],
      from: [`${EBILLING.billings}:b`, `${EBILLING.meters}:m`],
      join: ["m.id=b.kod_meter"],
      filter: {
        "m.kod_apartments": kod_home,
        "b.date_bil": `<=:${date_billing}`,
      },
      sort: ["-b.date_bil"],
    },
    "billings",
    useBillingsStore
  );
