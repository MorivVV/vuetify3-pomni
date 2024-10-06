import { dataApiComposition } from "@/compositionApi/dataApi";
import { useMvideoStore } from "@/store/modules/mvideo";
import {
  IGoodsDnsPrice,
  IGoodsDnsProducts,
} from "@/types/database/schemas/goods";
import { ICreateTableFields } from "@/types/database/service";
const { r_get } = dataApiComposition();
export const getDNSProducts = (
  search: string,
  max_date: string,
  min_price: number,
  max_price: number
) => {
  return r_get<
    | "last_price"
    | "price.last_price"
    | "last_date"
    | ICreateTableFields<keyof IGoodsDnsPrice, "p">
    | ICreateTableFields<keyof IGoodsDnsProducts, "dp">
  >(
    {
      from: [
        {
          alias: "price",
          fields: [
            "dp.*",
            {
              alias: "last_price",
              fields: ["p.current_price::numeric:last_price"],
              from: ["goods.dns_price:p"],
              filter: {
                "p.id": {
                  fields: ["max(p.id):max_id"],
                  from: ["goods.dns_price:p"],
                  filter: { "p.kod_product": "@@:dp.id" },
                },
              },
            },
            {
              fields: ["p.date_price:last_date"],
              from: ["goods.dns_price:p"],
              filter: {
                "p.id": {
                  fields: ["max(p.id):max_id"],
                  from: ["goods.dns_price:p"],
                  filter: { "p.kod_product": "@@:dp.id" },
                },
              },
            },
          ],
          from: ["goods.dns_products:dp"],
          sort: ["dp.dns_name"],
          filter: {
            "dp.dns_name": `~:${search}`,
          },
        },
      ],
      filter: {
        last_date: `>=:${max_date}`,
        last_price: `>=:${min_price}`,
        "price.last_price": `<=:${max_price}`,
      },
    },
    "dns_products",
    useMvideoStore
  );
};

export const getDNSPrice = (search: string) => {
  return r_get<
    | ICreateTableFields<keyof IGoodsDnsPrice, "p">
    | ICreateTableFields<keyof IGoodsDnsProducts, "dp">
  >(
    {
      fields: [
        "p.id",
        "p.current_price::numeric",
        "p.date_price",
        "p.kod_product",
      ],
      from: ["goods.dns_price:p"],
      sort: ["-p.id"],
      filter: {
        "p.kod_product": {
          fields: ["dp.id"],
          from: ["goods.dns_products:dp"],
          sort: ["dp.dns_name"],
          filter: {
            "dp.dns_name": `~:${search}`,
          },
        },
      },
    },
    "dns_prices",
    useMvideoStore
  );
};
