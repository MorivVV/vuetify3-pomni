const routeSeodo = {
  path: "seodo",
  order: 1000,
  name: "SeodoParserLogicRoot",
  title: "СЭОДО",
  icon: "dialpad",
  class: "green--text text--darken-2",
  component: () => import("@/components/elements/RouterLink.vue"),
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: "logic",
      order: 10,
      name: "SeodoParserLogic",
      title: "Логика СЭОДО",
      icon: "assignment_turned_in",
      class: "green--text text--darken-2",
      component: () => import("@/components/adminka/SeodoParserLogic.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "groups",
      order: 10,
      name: "SeodoParserLogicGroup",
      title: "Группы исполнителей",
      icon: "group",
      class: "blue--text text--darken-2",
      component: () =>
        import("@/components/adminka/seodoLogic/ExecutorGroups.vue"),
      meta: {
        requiresAuth: true,
      },
    },
  ],
};

export default routeSeodo;
