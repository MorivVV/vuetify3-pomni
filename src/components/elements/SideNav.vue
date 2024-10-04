<template>
  <div>
    <v-col class="top-menu" :class="{ 'menu-view': subMenuView }" cols="auto">
      <BtnIconsVVue
        :action="
          () => {
            menuView = true;
          }
        "
        color="blue"
        icon="menu"
        title="Открыть меню"
      />
      <BtnIconsVVue
        :action="
          () => {
            goTo(0, {});
          }
        "
        color="green"
        icon="expand-less"
        title="Прокрутить вверх"
      />
    </v-col>
    <v-toolbar color="blue" dense elevation="4">
      <v-row align="center" class="ma-0 white--text">
        <v-col cols="auto">
          <BtnIconsVVue
            :action="
              () => {
                menuView = true;
              }
            "
            color="blue"
            icon="menu"
            title="Открыть меню"
          />
        </v-col>
        <v-col class="text-h4 white--text" cols="auto">
          {{ NAIMEN_SITE }}
        </v-col>

        <v-col class="text-center pa-0 ma-0">
          <span
            v-for="p in route.matched"
            :key="'parent_' + p.name"
            class="pa-1"
          >
            <v-btn class="pa-1" plain text :to="{ name: p.name }">
              <span
                class="white pa-1 mr-1 rounded"
                style="display: inline-block"
              >
                <v-icon :class="p.meta?.class ?? 'white'">
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
    </v-toolbar>
    <NotificationList
      :notification-view="notificationView"
      @open-notify="openBar"
    />
    <v-navigation-drawer v-model="menuView" fixed temporary :width="350">
      <v-expansion-panels accordion hover tile>
        <v-list-item class="blue">
          <span class="mr-3">
            <BtnIconsVVue
              :action="openMenu"
              color="blue"
              icon="chevron_left"
              title="Свернуть меню"
            />
          </span>
          <v-row align="center" class="ma-0 blue white--text menu">
            {{ NAIMEN_SITE }}
          </v-row>
        </v-list-item>
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
    <Secure @open-notify="openBar" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, PropType, ref, watch } from "vue";
import BtnIconsVVue from "../basic/BtnIconsV.vue";
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

const openMenu = () => {
  menuView.value = false;
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
.menu {
  height: 48px;
  font-size: 2.1rem;
  /* padding-top: 7px; */
}
</style>
