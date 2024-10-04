const routeKnowledge = {
  path: "/confa",
  order: 15,
  name: "Confluence",
  title: "База знаний",
  icon: "search",
  class: "blue--text",
  component: () => import("@/components/confluence/ConfPages.vue"),
  meta: {
    requiresAuth: true,
    title: "База знаний",
    icon: "search",
    class: "blue--text",
  },
  children: [
    {
      path: "page/:pageId",
      name: "ConfluencePage",
      component: () => import("@/components/confluence/ConfPage.vue"),
      meta: {
        requiresAuth: true,
        title: "Раздел конфлюенс",
        icon: "assessment",
        class: "purple--text",
      },
      children: [
        {
          path: "block/:blockId",
          name: "ConfluencePageBlock",
          component: () => import("@/components/confluence/ConfPage.vue"),
          meta: {
            requiresAuth: true,
            title: "Страница конфлюенс",
            icon: "assessment",
            class: "purple--text",
          },
        },
      ],
    },
  ],
};

export default routeKnowledge;
