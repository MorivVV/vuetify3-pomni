import { IConfigIndividualUserSettings } from "@/types/database/schemas/config";
import { defineStore } from "pinia";
import { cookieRead } from "../function/getCookies";
interface IUserInfo {
  result: string;
  fio: string;
  emailAlpha: string;
  emailSigma: string;
  emailOmega: string;
  group: string[];
  room: string;
  address: string;
  post: string;
  id: number;
  phone: string;
  mobile: string;
}
interface ILocalInfo {
  tabnum: number;
  fio: string;
  post: string;
  email_alpha: string;
  email_omega: string;
  email_sigma: string;
  phone_inner: string;
  phone_mobile: string;
  address: string;
  room: string;
  date_add: string;
}
export const useAutorizationStore = defineStore("autorization", {
  state: () => ({
    userInfo: undefined as unknown as { r: IUserInfo; localInfo: ILocalInfo },
    userProfile: [],
    toUrl: "/",
    Fio: cookieRead("FIO"),
    token: cookieRead("HASHIP"), // localStorage.getItem('token') || '',
    user: cookieRead("USER"),
    user_id: cookieRead("DIU"),
    user_access_level: [] as { kod_user: number; access_level: number }[],
    user_avatar: localStorage.user_avatar || "",
    user_configs: [] as IConfigIndividualUserSettings[],
  }),
  getters: {
    isLoggedIn (state): boolean {
      return !!state.token;
    },
    userFio (state): string {
      return state.Fio;
    },
    userId (state): string {
      return state.user_id;
    },
    userToken (state): string {
      return state.token;
    },
    goToUrl (state): string {
      return state.toUrl;
    },
    userAddressBook (state) {
      return state.userInfo as unknown as IUserInfo;
    },
    userLogin (state): string {
      return state.user;
    },
  },
});
