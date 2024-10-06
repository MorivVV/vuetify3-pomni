import { Route } from "@/types/global";

export const routelogAudit: Route = {
  path: "audit",
  order: 1000,
  name: "AdminAudit",
  title: "Аудит и логи",
  icon: "mdi-timer-alert",
  class: "text-blue",
  component: () => import("@/components/elements/RouterLink.vue"),
  meta: {
    requiresAuth: true,
    title: "Аудит и логи",
    icon: "mdi-timer-alert",
    class: "text-blue",
  },
  children: [
    {
      path: "/",
      order: 10,
      name: "AdminAudit",
      title: "Аудит",
      icon: "mdi-access-point",
      class: "text-blue",
      component: () => import("@/components/adminka/Audit.vue"),
      meta: {
        requiresAuth: true,
        title: "Аудит",
        icon: "mdi-access-point",
        class: "text-blue",
      },
    },
    {
      path: "logs",
      order: 10,
      name: "AdminAuditServerLogs",
      title: "Получение логов с сервера",
      component: () => import("@/components/adminka/serverLogs/ServerLogs.vue"),
      meta: {
        requiresAuth: true,
        title: "Получение логов с сервера",
        icon: "mdi-view-list",
        class: "text-blue",
      },
    },
  ],
};
