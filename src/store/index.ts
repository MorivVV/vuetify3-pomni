// Utilities
import { createPinia, defineStore, Store, type StoreDefinition } from "pinia";
import AESdecrypt from "./function/aesdecrypt";
import { ApiBaseURL } from "./function/ApiBaseURL";
import { useAutorizationStore } from "./modules/autorization";
import { fetchParam } from "@/types/restApi";
import { toast } from "@/compositionApi/dataApi";

interface ISuccessAuth {
  token: string;
  user: string;
  userId: number;
  fio: string;
  routes: string;
  status: string;
}

export const useIndexStore = defineStore("index", {
  state: () => ({}),
  actions: {
    updateState (store: StoreDefinition, state: string, data: any) {
      const useStore = store();
      useStore[state] = data;
    },
    fetchDataGet (param: { module: StoreDefinition; tables: string[] }) {
      const url = "api/v2/restGet";
      const module = param.module || "";
      let tableList = [] as string[];
      if ("tables" in param) {
        tableList = param.tables;
      }
      const arr = tableList.map((table: string) => {
        const p = {
          url,
          data: { from: table, sort: ["2"] },
          stateName: table,
        };
        return this.fetchData(p, module);
      });
      return Promise.all(arr);
    },
    fetchData (param: fetchParam, useStore?: StoreDefinition) {
      let stor: Store;
      if (useStore) {
        stor = useStore();
      }
      const auth = useAutorizationStore();
      let url = "ajax";
      const data = JSON.stringify(param.data);
      const conf: RequestInit = {
        body: data,
        credentials: "same-origin",
        method: "POST",
        headers: {
          "V-Token": auth.token,
          "Content-Type": "application/json;charset=utf-8",
        },
      };

      if ("url" in param && param.url) {
        url = param.url;
      }

      return fetch(ApiBaseURL + url, conf)
        .then(async (response) => {
          let restext: any = "";
          try {
            restext = await response
              .json()
              .catch(() => ({ err: { code: response.status } }));
          } catch (error) {
            restext = await response.text();
          }
          return restext;
        })
        .then((res) => {
          if (res === "Требуется авторизация" || res === "Not Authorized!") {
            toast.warning(res);
            auth.user = "";
            auth.token = "";
            auth.Fio = "";
          } else if (typeof res === "object" && "err" in res) {
            let messageError = "Error -";
            messageError += "code" in res.err ? " code: " + res.err.code : "";
            messageError +=
              "errorNum" in res.err ? " errorNum: " + res.err.errorNum : "";
            messageError +=
              "offset" in res.err ? "<br> offset: " + res.err.offset : "";
            messageError +=
              "routine" in res.err ? "<br> routine: " + res.err.routine : "";
            messageError +=
              "detail" in res.err ? "<br> detail: " + res.err.detail : "";

            toast.error(messageError);
            return [];
          } else {
            if (useStore && param.stateName) {
              stor[param.stateName] = res;
            }
          }
          return res;
        })
        .catch((err) => {
          toast.error(url + " - " + err.message);
          return [];
        });
    },
    authorizate (param: any): Promise<ISuccessAuth> {
      const auth = useAutorizationStore();
      return new Promise((resolve, reject) => {
        const url = "autorization";
        interface LoginData {
          login: string;
          answer?: string;
        }
        const data: LoginData = { login: param.login };
        const conf: RequestInit = {
          body: JSON.stringify(data),
          credentials: "same-origin",
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        };
        fetch(ApiBaseURL + url, conf)
          .then((response) => response.text())
          .then((res) => {
            const pass = param.password as string;
            data.answer = AESdecrypt(res, pass);
            conf.body = JSON.stringify(data);
            return fetch(ApiBaseURL + url, conf).then((response) =>
              response.json()
            );
          })
          .then((res) => {
            if (res !== "password not authorized!!!") {
              auth.user = res.user;
              auth.token = res.token;
              auth.Fio = res.fio;
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
});

export const pinia = createPinia();
