import { defineStore } from "pinia";

interface UserState {
  timeUpdate: number;
  users: IAnyObject[];
  users_fio: IUserFullInfo[];
  loading: boolean;
  users_param: IAnyObject[];
}

export const useUserDataStore = defineStore("userData", {
  state: () => ({
    timeUpdate: 0,
    users: [] as IAnyObject[],
    users_fio: [] as IUserFullInfo[],
    loading: false,
    users_param: [] as IAnyObject[],
  }),

  getters: {
    usersFio (state: UserState) {
      interface IUP {
        fio: string;
        short: string;
        full: string;
        last_name: string;
        first_name: string;
        second_name: string;
        login: string;
        tabnum: string;
      }
      const fioData: Record<string, number | IUP> = { time: Date.now() };
      for (const user of state.users_fio) {
        let fio = user.family;
        let short = fio;
        let full = fio;
        if (user.first_name) {
          fio += " " + user.first_name.substr(0, 1) + ".";
          short += " " + user.first_name;
          full += " " + user.first_name;
        }
        if (user.second_name) {
          fio += " " + user.second_name.substr(0, 1) + ".";
          full += " " + user.second_name;
        }
        const parseUser: IUP = {
          fio,
          short,
          full,
          last_name: user.family,
          first_name: user.first_name,
          second_name: user.second_name,
          login: user.login,
          tabnum: user.tabnum,
        };
        fioData[user.id] = parseUser;
      }
      return fioData;
    },
    usersFioArray (state: UserState): IUserFullInfo[] {
      const fioData = state.users_fio.map((user: User) => {
        let fio = user.family;
        let short = fio;
        let full = fio;
        if (user.first_name) {
          fio += " " + user.first_name.substr(0, 1) + ".";
          short += " " + user.first_name;
          full += " " + user.first_name;
        }
        if (user.second_name) {
          fio += " " + user.second_name.substr(0, 1) + ".";
          full += " " + user.second_name;
        }
        const parseUser = {
          ...user,
          fio,
          short,
          full,
          last_name: user.family,
          first_name: user.first_name,
          second_name: user.second_name,
          login: user.login,
          tabnum: user.tabnum,
        };
        return parseUser;
      });
      return fioData;
    },
  },
});
