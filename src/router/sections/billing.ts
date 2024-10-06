import { Route } from "@/types/global";

const routeBilling: Route = {
  path: "/billing",
  name: "Billing",
  title: "Кварплата",
  icon: "mdi-bank",
  class: "text-purple",
  component: () => import("@/components/elements/RouterLink.vue"),
  meta: {
    requiresAuth: false,
    title: "Кварплата",
    icon: "mdi-bank",
    class: "text-purple",
  },
  children: [
    {
      path: "home",
      name: "HomeBilling",
      title: "Объекты",
      icon: "mdi-domain",
      class: "text-green",
      component: () => import("@/components/billing/HomeBilling.vue"),
      meta: {
        requiresAuth: false,
        title: "Объекты",
        icon: "mdi-domain",
        class: "text-green",
      },
    },
    {
      path: "home2",
      name: "HomeBilling2",
      title: "Объекты2",
      icon: "mdi-domain",
      class: "text-green",
      component: () => import("@/components/billing/HomeBilling2.vue"),
      meta: {
        requiresAuth: false,
        title: "Объекты2",
        icon: "mdi-domain",
        class: "text-green",
      },
    },
    {
      path: "prices",
      name: "BillingPrices",
      title: "Расценки",
      icon: "mdi-scale-balance",
      class: "text-blue",
      component: () => import("@/components/billing/BillingPrices.vue"),
      meta: {
        requiresAuth: false,
        title: "Расценки",
        icon: "mdi-scale-balance",
        class: "text-blue",
      },
    },
    {
      path: "settings",
      name: "HomeSettings",
      title: "Настройки",
      icon: "mdi-human-queue",
      class: "text-blue",
      component: () => import("@/components/billing/HomeSettings.vue"),
      meta: {
        requiresAuth: false,
        title: "Настройки",
        icon: "mdi-human-queue",
        class: "text-blue",
      },
    },
    {
      path: "zdorovie",
      name: "HomeZdorovie",
      title: "Дневник давления",
      icon: "mdi-timeline",
      class: "orange--text",
      component: () => import("@/components/billing/ZdorovieMonitoring.vue"),
      meta: {
        requiresAuth: false,
        title: "Дневник давления",
        icon: "mdi-timeline",
        class: "orange--text",
      },
    },
  ],
};

export default routeBilling;
