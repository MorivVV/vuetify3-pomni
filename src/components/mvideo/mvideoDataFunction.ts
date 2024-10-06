import { useMvideoStore } from "@/store/modules/mvideo";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { TTipsDTH } from "@/types/database/service";
const { r_get } = dataApiComposition();
export const mvideoHeaders: TTipsDTH<IMProduct>[] = [
  {
    value: "id",
    text: "Артикул",
    divider: true,
    tip: "Идентификатор (артикул) товара",
  },
  { value: "name", text: "Товар", divider: true, tip: "Наименование товара" },
  {
    value: "last_price",
    text: "Текущая цена",
    divider: true,
    tip: "Последняя цена",
  },
  {
    value: "last_isfinalprice",
    text: "Финальная цена",
    divider: true,
    tip: "Цена не снижается ниже при использовании бонусов",
  },
  {
    value: "date_price",
    text: "Дата цены",
    divider: true,
    tip: "Дата последнего изменения цены",
  },
  {
    value: "date_add",
    text: "Добавлен",
    divider: true,
    tip: "Дата добавления в мониторинг",
  },
];
export const getProducts = (search: string) => {
  return r_get<string>(
    {
      fields: [
        "t0.*",
        {
          fields: ["saleprice:last_price"],
          from: ["goods.mvideo_price:p"],
          filter: {
            id: "@@:t0.last_price_id",
          },
        },
        {
          fields: ["date_price:date_price"],
          from: ["goods.mvideo_price:p"],
          filter: {
            id: "@@:t0.last_price_id",
          },
        },
        {
          fields: ["isfinalprice:last_isfinalprice"],
          from: ["goods.mvideo_price:p"],
          filter: {
            id: "@@:t0.last_price_id",
          },
        },
      ],
      from: [
        {
          fields: [
            "mp.*",
            {
              from: ["goods.mvideo_price:p"],
              fields: ["max(p.id):last_price_id"],
              filter: { productid: "@@:mp.id" },
            },
          ],
          from: ["goods.mvideo_product:mp"],
          filter: {
            name: `~:${search}`,
          },
          sort: ["name"],
        },
      ],
    },
    "products",
    useMvideoStore
  );
};
