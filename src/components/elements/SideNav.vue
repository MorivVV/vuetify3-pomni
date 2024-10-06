<template>
  <div>
    <v-col class="top-menu" :class="{ 'menu-view': subMenuView }" cols="auto">
      <BtnIconsV
        :action="
          () => {
            menuView = true;
          }
        "
        color="blue"
        icon="menu"
        title="Открыть меню"
      />
      <BtnIconsV
        :action="
          () => {
            goTo(0, {});
          }
        "
        color="green"
        icon="arrow-up"
        title="Прокрутить вверх"
      />
    </v-col>
    <v-app-bar color="blue" density="compact" elevation="4">
      <template #prepend>
        <BtnIconsV
          :action="openCloseMenu"
          color="blue"
          icon="menu"
          title="Открыть меню"
        />
      </template>
      <v-app-bar-title class="text-h4 white--text">{{ NAIMEN_SITE }}</v-app-bar-title>
      <v-row align="center" class="ma-0 white--text">
        <v-col cols="auto" />

        <v-col class="text-center pa-0 ma-0">
          <span
            v-for="p in route.matched"
            :key="'parent_' + p.name"
            class="pa-1"
          >
            <v-btn class="pa-1" plain text :to="{ name: p.name }">
              <span
                class="bg-white pa-1 mr-1 rounded"
                style="display: inline-block"
              >
                <v-icon :class="p.meta?.class ?? 'white'" size="24">
                  {{ p.meta?.icon }}
                </v-icon>
              </span>
              <span class="text-h5 white--text" style="text-transform: none">
                {{ p.meta?.title }}
              </span>
            </v-btn>
          </span>
        </v-col>
        <v-col cols="2" />
      </v-row>
      <template #append>
        <Secure @open-notify="openBar" />
      </template>
    </v-app-bar>
    <NotificationList
      :notification-view="notificationView"
      @open-notify="openBar"
    />
    <v-navigation-drawer v-model="menuView" fixed temporary :width="350">
      <v-expansion-panels accordion hover tile>

        <MenuElementVue
          v-for="u in props.urls"
          :key="'parent_' + u.href"
          :u="u"
        />
        <v-expansion-panel>
          <v-expansion-panel-title>
            <i class="material-icons">filter_drama</i>Сетевая активность
          </v-expansion-panel-title>
          <v-expansion-panel-text eager>
            <WSChatVue />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, PropType, ref, watch } from "vue";
import BtnIconsV from "../basic/BtnIconsV.vue";
import MenuElementVue from "./Menu/MenuElement.vue";
import WSChatVue from "./WSChat.vue";
import { useRoute } from "vue-router";
import NotificationList from "./NotificationList.vue";
import Secure from "../basic/Secure.vue";
import { useGoTo } from "vuetify";
interface Route {
  name: string;
  path: Array<string>;
  href?: string;
  title: string;
  icon: string;
  class?: string;
  children: Array<Route>;
}
const goTo = useGoTo();
const notificationView = ref(false);

const openBar = (val) => {
  notificationView.value = val;
};
const route = useRoute();

const props = defineProps({
  urls: {
    type: Array as unknown as PropType<Array<Route>>,
    required: true,
  },
});
const subMenuView = ref(false);
const menuView = ref(false);
const NAIMEN_SITE = ref(NAIMEN_POMNI);

const openCloseMenu = () => {
  menuView.value = !menuView.value;
};
const scrollDown = () => {
  if (document.documentElement.scrollTop >= 50 && !menuView.value) {
    subMenuView.value = true;
  } else {
    subMenuView.value = false;
  }
};
watch(
  () => route.meta?.title,
  (val) => {
    document.title = NAIMEN_SITE.value + " - " + val;
  }
);
onMounted(() => {
  window.addEventListener("scroll", scrollDown);
});
onBeforeMount(() => {
  window.removeEventListener("scroll", scrollDown);
});
</script>

<style scoped>
.top-menu.menu-view {
  left: -20px;
  z-index: 2;
}
.top-menu.menu-view:hover {
  left: -5px;
  z-index: 1000;
  background-color: rgba(46, 137, 241, 0.87);
}
.top-menu {
  position: fixed;
  left: -72px;
  top: 6px;
  background-color: rgba(46, 137, 241, 0.47);
  border-radius: 5px;
  color: rgb(246, 250, 212);
  z-index: 0;
  padding: 5px;
  transition: 0.2s ease-out;
}

</style>
