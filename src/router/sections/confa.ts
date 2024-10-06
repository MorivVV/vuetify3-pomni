import { Route } from "@/types/global";

const routeKnowledge:Route = {
  path: "/confa",
  order: 15,
  name: "Confluence",
  title: "База знаний",
  icon: "mdi-search-web",
  class: "text-blue",
  component: () => import("@/components/confluence/ConfPages.vue"),
  meta: {
    requiresAuth: true,
    title: "База знаний",
    icon: "mdi-search-web",
    class: "text-blue",
  },
  children: [
    {
      path: "page/:pageId",
      order: 20,
      name: "ConfluencePage",
      component: () => import("@/components/confluence/ConfPage.vue"),
      meta: {
        requiresAuth: true,
        title: "Раздел конфлюенс",
        icon: "mdi-google-assistant",
        class: "text-purple",
      },
      children: [
        {
          path: "block/:blockId",
          order: 20,
          name: "ConfluencePageBlock",
          component: () => import("@/components/confluence/ConfPage.vue"),
          meta: {
            requiresAuth: true,
            title: "Страница конфлюенс",
            icon: "mdi-google-assistant",
            class: "text-purple",
          },
        },
      ],
    },
  ],
};

export default routeKnowledge;
