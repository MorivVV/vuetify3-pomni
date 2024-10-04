<template>
  <div id="autorize" class="pa-2">
    <div v-if="isLoggedIn">
      <v-chip color="yellow lighten-4" link pill @click="openProfile">
        <v-avatar left>
          <v-img
            v-if="user_avatar"
            :src="'data:image/png; base64, ' + user_avatar"
          />
          <v-img v-else src="\images\system\f2.png" />
        </v-avatar>
        <UserFioVue type-name="short" />
        <v-icon color="red darken-2" title="Выйти" @click="logOff">exit_to_app</v-icon>
      </v-chip>
      <NotificationBar @open-notify="openBar" />
    </div>
    <div v-else>
      <v-chip color="yellow lighten-4" @click="logIn">
        Войти
        <v-icon color="red accent-3">open_in_browser</v-icon>
      </v-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserFioVue from "../elements/UserFio.vue";
import { useAutorizationStore } from "@/store/modules/autorization";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { toRefs } from "vue";
import { useRouter } from "vue-router";
import NotificationBar from "../elements/NotificationBar.vue";
const emit = defineEmits(["open-notify"]);
const { r_state, r_fetch } = dataApiComposition();
const router = useRouter();
const openProfile = () => {
  router.push("/profile");
};
const logIn = () => {
  router.push("/login");
};
const openBar = (val) => {
  emit("open-notify", val);
};
const { isLoggedIn, user_avatar } = toRefs(useAutorizationStore());
const logOff = () => {
  r_fetch("autorization", {}, "token", useAutorizationStore);
  r_state(useAutorizationStore, "token", "");
  r_state(useAutorizationStore, "user", "");
  r_state(useAutorizationStore, "Fio", "");
  r_state(useAutorizationStore, "routes", "");

  logIn();
};
</script>

<style scoped>
#autorize {
  position: absolute;
  z-index: 1;
  right: 0;
  top: 0;
  padding: 5px;
  border-radius: 0 0 0 8px;
}
</style>
