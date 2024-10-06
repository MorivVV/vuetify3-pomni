import { currentAuthUser } from "@/const/globalRestAPI";
import { useAutorizationStore } from "@/store/modules/autorization";
import { IConfigIndividualUserSettings } from "@/types/database/schemas/config";
import { Ref } from "vue";
import { Router, useRoute } from "vue-router";
import { dataApiComposition } from "./dataApi";

/**
 * Проверка значения в роутере и запись его в переменную
 */
export const parseRouteParameter = (
  refVal: Ref,
  parameter: string,
  func: (string) => any = String,
  route = useRoute()
): boolean => {
  if (parameter in route.query && route.query[parameter]) {
    refVal.value = (route.query[parameter] as string)
      .split(",")
      .map((e) => func(e));
    return true;
  }
  return false;
};

/**
 * Проверка значения в сохраненных настройках пользователя
 */
export const parserUserConfig = (
  refVal: Ref,
  parameter: string,
  func: (string) => any = String
): boolean => {
  const auth = useAutorizationStore();
  const value = auth.user_configs.find((c) => c.parameter_key === parameter);
  if (value && value.parameter_value !== null) {
    refVal.value = value.parameter_value
      .split(",")
      .filter((e) => e)
      .map((e) => func(e));
    return true;
  } else {
    refVal.value = [];
  }
  return false;
};

export const pushRouteParameter = (
  router: Router,
  args: { [x: string]: Ref }
) => {
  const query: { [x: string]: string | undefined } = {};
  const object = args;
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const element = object[key];
      query[key] = element.value.join(",");
      if (query[key] === "") query[key] = undefined;
    }
  }
  router.push({ query: { ...query } });
};

export const saveUserSetting = (
  refVal: Ref,
  parameter_key: string,
  route = useRoute()
) => {
  const { r_update, r_insert } = dataApiComposition();

  const auth = useAutorizationStore();
  const value: string | undefined =
    typeof refVal.value === "boolean" ? refVal.value : refVal.value.join(",");

  const conf = auth.user_configs.find((c) => c.parameter_key === parameter_key);
  if (conf && conf.parameter_value !== value) {
    r_update<keyof IConfigIndividualUserSettings>({
      to: "config.individual_user_settings",
      filter: {
        id: conf.id,
      },
      set: {
        parameter_value: value || "",
      },
    });
  }

  if (!conf) {
    r_insert<keyof IConfigIndividualUserSettings>({
      to: "config.individual_user_settings",
      fields: {
        kod_user: currentAuthUser,
        route_name: route.name,
        parameter_key,
        parameter_value: value,
      },
    });
  }
};
