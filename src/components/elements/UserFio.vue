<template>
  <span>{{ fio }}</span>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useAutorizationStore } from "@/store/modules/autorization";
import { useUserDataStore } from "@/store/modules/usersData";
import projectDebug from "@/functions/projectDebug";

const props = defineProps({
  user_id: { type: Number, default: -1 },
  /**
   * тип отображения имени пользователя
   * fio: короткое Фамилия И. О.
   * full: полное Фамилия Имя Отчество
   * short: полное Фамилия + Имя
   * login: логин пользователя в ПоМни
   * общая логика выводит любое определенное поле по имени
   **/
  typeName: { type: String, default: "fio" },
});
const { r_get, r_state } = dataApiComposition();
const { usersFio, users_fio, loading, timeUpdate } = toRefs(useUserDataStore());
const { userId, userToken } = toRefs(useAutorizationStore());
const fio = computed(() => {
  let uid: number = props.user_id;
  let fio = "---";
  if (props.user_id === -1) {
    uid = Number(userId.value);
  }
  if (uid > 0 && users_fio.value.length) {
    try {
      fio = usersFio.value[uid][props.typeName];
    } catch (error) {
      projectDebug(uid, usersFio.value, error);
    }
  }
  return fio;
});
const getUsers = () => {
  r_state(useUserDataStore, "loading", true);
  r_state(useUserDataStore, "timeUpdate", Date.now());
  r_get<"now()" | keyof IUserFullInfo>(
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
  )
    .then(() =>
      r_get<string>({
        from: "bz_users",
        fields: ["id"],
        filter: {
          session_token: `=:${userToken.value}`,
        },
      })
    )
    .then((r) => {
      if (r.length === 1) {
        r_state(useAutorizationStore, "user_id", r[0].id);
      }
      r_state(useUserDataStore, "loading", false);
    });
};
const checkUsers = () => {
  if (users_fio.value.length === 0) {
    if (!loading.value) getUsers();
  } else if (timeUpdate.value < Date.now() - 100000) {
    getUsers();
  }
};
checkUsers();
</script>
