<template>
  <v-card>
    <v-row align="center" class="ma-1">
      <v-col class="text-h4 text-right" cols="4"> Пользователи </v-col>
      <v-col cols="4">
        <AutocompleteVVue
          v-model="newUser.kod_user"
          auto-select-first
          clearable
          hide-selected
          item-text="full"
          item-value="id"
          :items="lastUsers"
          label="Выбрать пользователя"
          multiple
          prepend-icon="group_add"
        />
      </v-col>
      <v-col cols="2">
        <AutocompleteVVue
          v-model="newUser.access_level"
          dense
          hide-details
          item-text="name"
          item-value="id"
          :items="levels"
          label="Уровень доступа"
          outlined
        />
      </v-col>
      <v-col cols="auto">
        <BtnIconsV
          :action="addUser"
          color="white"
          colorbtn="blue"
          icon="add"
          title="Добавить пользователя"
        />
      </v-col>
    </v-row>
    <v-list
      v-for="user in userList"
      :key="roleId + '_user_' + user.kod_user"
      class="pa-0 ma-0"
      color="blue lighten-5"
      dense
    >
      <v-divider />
      <UserVue :user="user" @del-user="changeRolesUsers" />
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import { useAdminStore } from "@/store/modules/admin";
import { useUserDataStore } from "@/store/modules/usersData";
import UserVue from "./User.vue";
import AutocompleteVVue from "@/components/basic/AutocompleteV.vue";
import BtnIconsV from "@/components/basic/BtnIconsV.vue";

const emit = defineEmits(["RolesUsers"]);
const props = defineProps({
  roleId: {
    type: Number,
    required: true,
  },
});
const { r_insert, checkDataModify } = dataApiComposition();
const newUser = ref({
  kod_user: null as null | number[],
  kod_role: props.roleId,
  access_level: 1,
});
const { roles_users, levels } = toRefs(useAdminStore());
const { usersFioArray } = toRefs(useUserDataStore());
const userList = computed(() => {
  let list: IRoleUser[] = [];
  list = roles_users.value.filter((u) => u.kod_role === props.roleId);
  return list;
});
const lastUsers = computed(() => {
  return usersFioArray.value.filter(
    (e) => userList.value.map((p) => p.kod_user).indexOf(e.id) === -1
  );
});
const changeRolesUsers = () => {
  emit("RolesUsers");
};
const addUser = () => {
  if (newUser.value.kod_user === null) {
    toast.warning("Необходимо указать роль");
    return;
  }
  const users = usersFioArray.value;
  const acc = newUser.value.kod_user.map((kod_user) => {
    return r_insert({
      to: "roles_users",
      fields: { ...newUser.value, kod_user },
    }).then((r) =>
      checkDataModify(
        r,
        "Добавлен " + users.find((e) => e.id === kod_user)?.fio
      )
    );
  });
  Promise.all(acc)
    .then(() => changeRolesUsers())
    .then(() => {
      newUser.value.kod_user = null;
    });
};
</script>

<style scoped>
div >>> .v-expansion-panel-header {
  padding: 10px 24px;
  min-height: 40px;
}
</style>
