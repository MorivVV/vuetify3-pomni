import { pinia, useIndexStore } from "@/store";
import { StoreDefinition, storeToRefs } from "pinia";

import {
  ajaxData,
  fetchParam,
  IGQLResponse,
  IGraphQLRestGet,
  IRestModifyAnswer,
  IServerLogsGet,
  restDelete,
  restGet,
  restInsert,
  restUpdate,
} from "@/types/restApi";
import { useAutorizationStore } from "@/store/modules/autorization";
import {
  ISnackNotify,
  useNotificationStore,
} from "@/store/modules/notification";
import { ApiBaseURL } from "@/store/function/ApiBaseURL";

const baseApi = "api/v2/";
const notificationMessage = (
  notify: string | { html: string },
  color: string
) => {
  const timeout = 5000;
  const { info } = storeToRefs(useNotificationStore());
  const text =
    typeof notify === "object" && "html" in notify ? notify.html : notify;
  // info.value = info.value.filter((e) => e.timecreate > Date.now() - timeout);
  const pairMessage = info.value.find((e) => e.text === text);
  if (pairMessage) {
    pairMessage.count++;
    pairMessage.view = true;
    pairMessage.timecreate = Date.now();
  } else {
    const message: ISnackNotify = {
      text,
      count: 1,
      color,
      timecreate: Date.now(),
      view: true,
      timeout,
    };
    info.value.push({ ...message });
  }
};
export const toast = {
  warning: (text: string) => notificationMessage(text, "orange"),
  info: (notify: string | { html: string }) =>
    notificationMessage(notify, "green"),
  error: (text: string) => notificationMessage(text, "red"),
};

export const dataApiComposition = function () {
  const store = useIndexStore(pinia);
  const { fetchData, fetchDataGet } = store;

  const r_state = (useStore: StoreDefinition, state: string, value: any) => {
    const store = useStore();
    store[state] = value;
  };
  const checkDataLoad = (result: any, text = "") => {
    if ("count" in result) {
      toast.info(text + "_" + result.count);
    } else {
      if (text === "") {
        text = "Загружено записей: " + result.length;
      } else {
        text += ": " + result.length;
      }
      toast.info(text);
    }
    return true;
  };
  const checkDataModify = (
    result: any,
    text = "Успешно",
    err = "Операция не выполнена"
  ) => {
    let check = false;
    if (result.count !== 0 && result.length !== 0) {
      toast.info(text + ": " + result.count);
      check = true;
    } else {
      toast.error(err);
    }
    return check;
  };
  const r_fetch = (
    url: string,
    data: any,
    state?: string,
    useStore?: StoreDefinition
  ) => {
    const params: fetchParam = {
      data,
    };
    if (state) {
      params.stateName = state;
    }
    if (url) {
      params.url = url;
    }
    return fetchData(params, useStore);
  };
  /**
   * Указываем интерфейсы для проверки валидности полей
   * <keyof ИмяИнтерфейса>
   * ICreateTableFields<keyof ISmprimaryProbsummarym1, "im"> - для алиаса таблицы
   * <string> отключает проверку полей, сохраняя синтаксис
   */

  const r_get = <
    T extends string = string,
    R extends Record<string, any> = Record<string, any>
  >(
      data: restGet<T>,
      state?: string,
      useStore?: StoreDefinition
    ): Promise<R[]> => {
    return r_restApi("restGet", data, state, useStore);
  };

  const r_access = (
    routeName: string,
    state?: string,
    useStore?: StoreDefinition
  ): Promise<any[]> => {
    return r_restApi(
      "checkAccess",
      {
        route_name: routeName,
      },
      state,
      useStore
    );
  };

  const r_update = <T extends string = string>(
    data: restUpdate<T>,
    state?: string
  ): Promise<IRestModifyAnswer> => {
    return r_restApi("restUpdate", data, state);
  };
  const r_insert = <T extends string = string>(
    data: restInsert<T>,
    state?: string
  ): Promise<IRestModifyAnswer> => {
    return r_restApi("restInsert", data, state);
  };
  const r_create = (data: any, state?: string) => {
    return r_restApi("restCreate", data, state);
  };
  const r_delete = <T extends string = string>(
    data: restDelete<T>,
    state?: string
  ): Promise<IRestModifyAnswer> => {
    return r_restApi("restDelete", data, state);
  };
  const r_ajax = (
    data: ajaxData,
    state?: string,
    useStore?: StoreDefinition
  ) => {
    const params: fetchParam = {
      data,
    };
    if (state) {
      params.stateName = state;
    }
    return fetchData(params, useStore);
  };

  const r_getFile = <T extends string = string>(
    data: ajaxData | restGet<T> | IServerLogsGet,
    filename: string,
    type = "xlsxChart"
  ) => {
    const url = ApiBaseURL + baseApi + type;
    const auth = useAutorizationStore();
    const options: RequestInit = {
      headers: {
        "V-Token": auth.token,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    };

    return fetch(url, options)
      .then((res) => {
        const content = decodeURI(
          String(res.headers.get("content-disposition"))
        );
        let remoteName = content.split("filename*=UTF-8''");
        if (remoteName.length < 2) {
          remoteName = content
            .split("filename=")
            .map((e) => e.replaceAll("\"", ""));
        }
        filename += remoteName[1];

        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); // afterwards we remove the element again
      });
  };

  const r_restApi = (
    method: string,
    data: any,
    state?: string,
    useStore?: StoreDefinition
  ) => {
    const params: fetchParam = {
      url: baseApi + method,
      data,
    };
    if (state) {
      params.stateName = state;
    }
    return fetchData(params, useStore);
  };
  const r_graphql = (
    gets: Record<string, IGraphQLRestGet<Record<string, string>>>
  ) => {
    const queryes: string[] = [];
    for (const gqlName in gets) {
      if (Object.prototype.hasOwnProperty.call(gets, gqlName)) {
        const query: string[] = [];
        const get = gets[gqlName].query;
        let fields: string[] = ["id"];
        for (const key in get) {
          if (Object.prototype.hasOwnProperty.call(get, key)) {
            const element = get[key];
            query.push(key + ":" + JSON.stringify(element));

            if (key === "fields") {
              fields = element;
            }
          }
        }
        queryes.push(`${gqlName}:restGet(${query.join(",")}){${fields}}`);
      }
    }
    const gql = { query: "{" + queryes.join(" ") + "}", variables: {} };
    return r_fetch("api/graphql", gql).then((r: IGQLResponse) => {
      if ("data" in r) {
        const data: Record<string, Record<string, any>[]> = r.data;
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (Object.prototype.hasOwnProperty.call(gets, key)) {
              const element = data[key];
              const get = gets[key];
              if ("state" in get && "store" in get && get.state) {
                r_state(get.store, get.state, element);
              }
            }
          }
        }
      }
      return r;
    });
  };
  return {
    r_ajax,
    r_fetch,
    r_access,
    r_restApi,
    r_get,
    r_insert,
    r_update,
    r_delete,
    r_state,
    fetchData,
    fetchDataGet,
    r_create,
    checkDataLoad,
    checkDataModify,
    r_getFile,
    r_graphql,
  };
};
