export const enum EBILLING {
  apartments = "billing.apartments",
  billings = "billing.billings",
  meters = "billing.meters",
  obj_street = "billing.obj_street",
  prices = "billing.prices",
  resources = "billing.resources",
  zdorovie = "billing.zdorovie",
}
export const enum EGAMES {
  battle_city = "games.battle_city",
  game_object_params = "games.game_object_params",
  game_objects = "games.game_objects",
  snake_score = "games.snake_score",
  multiply_results = "games.multiply_results",
  multiply_rounds = "games.multiply_rounds",
}
export const enum EGOODS {
  dns_price = "goods.dns_price",
  dns_products = "goods.dns_products",
  mvideo_price = "goods.mvideo_price",
  mvideo_product = "goods.mvideo_product",
}
export type TBDHOMETABLES = `${EBILLING | EGAMES | EGOODS}`;
