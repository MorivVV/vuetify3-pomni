import { dataApiComposition } from "@/compositionApi/dataApi";
import { useUserDataStore } from "@/store/modules/usersData";

const { r_get } = dataApiComposition();
export const getUsersAll = () =>
  r_get(
    {
      fields: [
        "id",
        "family",
        "first_name",
        "second_name",
        "active",
        "login",
        "tabnum",
        "sm_contact_name",
        "sm_full_name",
        "now():time",
      ],
      from: "bz_users",
      sort: ["family", "first_name", "second_name", "id"],
    },
    "users_fio",
    useUserDataStore
  );
