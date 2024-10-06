import { Route } from "@/types/global";

const routeDatabase: Route = {
  path: "database",
  order: 1000,
  name: "AdminQuerySettingRoot",
  title: "Работа с БД",
  icon: "mdi-database",
  class: "text-blue",
  component: () => import("@/components/elements/RouterLink.vue"),
  meta: {
    requiresAuth: true,
    title: "Работа с БД",
    icon: "mdi-database",
    class: "text-blue",
  },
  children: [
    {
      path: "querysetting",
      order: 10,
      name: "AdminQuerySetting",
      title: "Ajax запросы",
      component: () => import("@/components/adminka/QuerrySetting.vue"),
      meta: {
        requiresAuth: true,
        title: "Ajax запросы",
        icon: "mdi-download",
        class: "text-deep-purple-darken-1",
      },
    },
    {
      path: "tables",
      order: 10,
      name: "AdminPGTable",
      title: "Управление БД Таблицы",
      component: () => import("@/components/adminka/PostgreTableVuetify.vue"),
      meta: {
        requiresAuth: true,
        title: "Управление БД Таблицы",
        icon: "mdi-view-list",
        class: "text-blue-darken-3",
      },
    },
  ],
};

export default routeDatabase;
