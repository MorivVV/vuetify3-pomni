const routeDatabase = {
  path: "database",
  order: 1000,
  name: "AdminQuerySettingRoot",
  title: "Работа с БД",
  icon: "build",
  class: "blue--text",
  component: () => import("@/components/elements/RouterLink.vue"),
  meta: {
    requiresAuth: true,
    title: "Работа с БД",
    icon: "build",
    class: "blue--text",
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
        icon: "font_download",
        class: "deep-purple--text text--darken-1",
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
        icon: "view_list",
        class: "blue--text text--darken-3",
      },
    },
  ],
};

export default routeDatabase;
