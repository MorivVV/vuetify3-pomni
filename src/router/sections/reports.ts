import { Route } from "@/types/global";

const routeReports:Route = {
  path: "/reports",
  order: 16,
  name: "ReportsHistory",
  title: "Отчеты",
  icon: "mdi-file-chart",
  class: "text-blue",
  component: () => import("@/components/reports/ReportsPages.vue"),
  meta: {
    requiresAuth: true,
    title: "Отчеты",
    icon: "mdi-file-chart",
    class: "text-blue",
  },
  children: [
    {
      path: "page/:reportId",
      name: "ReportHistoryPage",
      component: () => import("@/components/reports/ReportHistory.vue"),
      meta: {
        requiresAuth: true,
        title: "История отчета",
        icon: "mdi-tooltip-check",
        class: "text-purple",
      },
      children: [
        {
          path: "view/:stateId",
          name: "ReportViewPage",
          component: () => import("@/components/reports/ReportView.vue"),
          meta: {
            requiresAuth: true,
            title: "Просмотр Отчета",
            icon: "mdi-format-list-numbered",
            class: "text-purple",
          },
        },
      ],
    },
  ],
};

export default routeReports;
