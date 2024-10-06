<template>
  <v-container>
    <v-card>
      <v-card-title>
        Список ролей
        <v-row align="center" class="ma-1" justify="center">
          <v-col cols="4">
            <TextFielsV
              v-model="newRole.naimen"
              label="Новая роль"
              prepend-icon="mdi-dns"
            />
          </v-col>
          <v-col cols="6">
            <TextFielsV v-model="newRole.description" label="Описание роли" />
          </v-col>
          <v-col cols="auto">
            <BtnIconsV :action="addRoles" color="blue" icon="plus" />
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row align="center" class="ma-1 text-h5">
          <v-col cols="4"> Название </v-col>
          <v-col cols="5"> Описание </v-col>
          <v-col cols="3">
            <v-row>
              <v-col class="text-right text-subtitle-2" cols="4">
                Полный доступ
              </v-col>
              <v-col class="text-right" cols="4"> Вкл. </v-col>
              <v-col class="text-right" cols="4"> + </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-expansion-panels>
          <v-expansion-panel v-for="role in roles" :key="'role_' + role.id">
            <v-expansion-panel-header class="green lighten-5">
              <v-row align="center">
                <v-col class="text-h5 pt-0 pb-0" cols="4">
                  {{ role.naimen }}
                </v-col>
                <v-col class="pt-0 pb-0" cols="6">
                  {{ role.description }}
                </v-col>
                <v-col class="pt-0 pb-0" cols="1">
                  <div
                    @click.stop="
                      setRole(role.id, 'full_access', role.full_access)
                    "
                  >
                    <CheckBoxTitleV
                      v-model="role.full_access"
                      :readonly="!adminSuperLevel()"
                    />
                  </div>
                </v-col>
                <v-col class="pt-0 pb-0" cols="1">
                  <div @click.stop="setRole(role.id, 'active', role.active)">
                    <CheckBoxTitleV
                      v-model="role.active"
                      :readonly="!adminSuperLevel()"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row class="ma-0 pa-1">
                <v-col>
                  <RoleUsersVue
                    :role-id="role.id"
                    @roles-users="getRolesUsers"
                  />
                </v-col>
              </v-row>
              <v-row class="ma-0 pa-1">
                <v-col>
                  <RolePartitionsVue
                    :role-id="role.id"
                    @roles-access="getRolesAccess"
                  />
                </v-col>
              </v-row>
              <v-row class="ma-0 pa-1">
                <v-col>
                  <RoleTablesVue :role-id="role.id" />
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
    <RightTablesVue />
  </v-container>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import { useAdminStore } from "@/store/modules/admin";
import RightTablesVue from "./roles/RightTables.vue";
import RolePartitionsVue from "./roles/RolePartitions.vue";
import RoleTablesVue from "./roles/RoleTables.vue";
import RoleUsersVue from "./roles/RoleUsers.vue";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import TextFielsV from "../basic/TextFielsV.vue";
import BtnIconsV from "../basic/BtnIconsV.vue";
import {
  getPartitions,
  getRoles,
  getRolesAccess,
  getRolesUsers,
} from "./AllowUsers/accessMetods";
import CheckBoxTitleV from "../basic/CheckBoxTitleV.vue";

const { adminSuperLevel } = routeAccessLevelCalculate();
const { r_insert, checkDataModify, r_update } = dataApiComposition();
const newRole = ref({
  naimen: "",
  description: "",
});
const { roles } = toRefs(useAdminStore());
const setRole = (id: number, field: string, value: boolean) => {
  if (!adminSuperLevel()) return;
  if (confirm("Действие " + (value ? "включит" : "выключит") + " доступ")) {
    r_update({
      to: "roles",
      set: { [field]: value },
      filter: { id },
    }).then((r) => checkDataModify(r));
  }
};
const addRoles = () => {
  if (newRole.value.naimen === "") {
    toast.info({ html: "Необходимо указать роль" });
    return;
  }

  r_insert({
    to: "roles",
    fields: newRole.value,
  })
    .then(() => getRoles())
    .then(() => {
      newRole.value.naimen = "";
    });
};
getRoles()
  .then(() => getPartitions())
  .then(() => getRolesAccess())
  .then(() => getRolesUsers());
</script>

<style scoped>
div >>> .v-expansion-panel-header {
  padding: 10px 24px;
  min-height: 40px;
}
</style>
