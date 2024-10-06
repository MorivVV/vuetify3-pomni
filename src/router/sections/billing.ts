import { Route } from "@/types/global";

const routeBilling: Route = {
  path: "/billing",
  name: "Billing",
  title: "Кварплата",
  icon: "payment",
  class: "purple--text",
  component: () => import("@/components/elements/RouterLink.vue"),
  meta: {
    requiresAuth: false,
    title: "Кварплата",
    icon: "payment",
    class: "purple--text",
  },
  children: [
    {
      path: "home",
      name: "HomeBilling",
      title: "Объекты",
      icon: "domain",
      class: "green--text",
      component: () => import("@/components/billing/HomeBilling.vue"),
      meta: {
        requiresAuth: false,
        title: "Объекты",
        icon: "domain",
        class: "green--text",
      },
    },
    {
      path: "home2",
      name: "HomeBilling2",
      title: "Объекты2",
      icon: "domain",
      class: "green--text",
      component: () => import("@/components/billing/HomeBilling2.vue"),
      meta: {
        requiresAuth: false,
        title: "Объекты2",
        icon: "domain",
        class: "green--text",
      },
    },
    {
      path: "prices",
      name: "BillingPrices",
      title: "Расценки",
      icon: "account_balance",
      class: "blue--text",
      component: () => import("@/components/billing/BillingPrices.vue"),
      meta: {
        requiresAuth: false,
        title: "Расценки",
        icon: "account_balance",
        class: "blue--text",
      },
    },
    {
      path: "settings",
      name: "HomeSettings",
      title: "Настройки",
      icon: "add_to_queue",
      class: "blue--text",
      component: () => import("@/components/billing/HomeSettings.vue"),
      meta: {
        requiresAuth: false,
        title: "Настройки",
        icon: "add_to_queue",
        class: "blue--text",
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
