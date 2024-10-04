<template>
  <v-row class="ma-1 card">
    <v-col cols="12">
      <v-list>
        <v-list-item>
          <v-list-item-icon class="text-right">
            Мой статус
            <v-icon
              class="ml-1"
              :color="status === 'online' ? 'green' : 'red'"
              :title="status"
            >
              cast_connected
            </v-icon>
          </v-list-item-icon>

          <v-col v-if="activateWarning" class="pa-1 ma-1" cols="auto">
            <CheckBoxTitleV
              label="Уведомлять"
              :value="warning"
              @change="changeWarn"
            />
          </v-col>
        </v-list-item>
        <v-divider />
      </v-list>
      <v-row>
        <v-col class="text-caption">Пользователи онлайн</v-col>
      </v-row>
      <v-row ref="parentRow" class="ma-0">
        <template v-for="u in users_online" :key="'item_' + u.soc">
          <v-col
            class="pa-1 pt-0 ma-0"
            :cols="parentRow?.clientWidth > 500 ? 3 : 12"
            dense
          >
            <v-card class="pa-0 ma-0">
              <v-card-title class="pa-1 ma-0 text-subtitle-2">
                <v-list-item-icon class="pa-0 ma-0">
                  <v-icon color="green" small> brightness_1 </v-icon>
                </v-list-item-icon>
                <UserFioVue type-name="fio" :user_id="+u.user" /> ({{ u.ip }})
              </v-card-title>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useAutorizationStore } from "@/store/modules/autorization";
import { useWebsocketStore } from "@/store/modules/websocket";
import UserFioVue from "../UserFio.vue";
import CheckBoxTitleV from "@/components/basic/CheckBoxTitleV.vue";

const { r_state, r_update, checkDataModify } = dataApiComposition();
const { users_online, warning, status } = toRefs(useWebsocketStore());
const { userToken } = toRefs(useAutorizationStore());
const parentRow = ref();

const activateWarning =
  window.location.protocol === "https:" ||
  window.location.hostname === "localhost";
const changeWarn = (e: boolean) => {
  let text = "выключены";
  if (e) {
    text = "включены";
  }
  r_update<string>({
    to: "bz_users",
    set: {
      notification: e,
    },
    filter: {
      session_token: `=:${userToken.value}`,
    },
  }).then((r) => checkDataModify(r, "Уведомления " + text));
  r_state(useWebsocketStore, "warning", e);
};
</script>
