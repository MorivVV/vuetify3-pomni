const routeReports = {
  path: "/reports",
  order: 16,
  name: "ReportsHistory",
  title: "Отчеты",
  icon: "report",
  class: "blue--text",
  component: () => import("@/components/reports/ReportsPages.vue"),
  meta: {
    requiresAuth: true,
    title: "Отчеты",
    icon: "report",
    class: "blue--text",
  },
  children: [
    {
      path: "page/:reportId",
      name: "ReportHistoryPage",
      component: () => import("@/components/reports/ReportHistory.vue"),
      meta: {
        requiresAuth: true,
        title: "История отчета",
        icon: "assessment",
        class: "purple--text",
      },
      children: [
        {
          path: "view/:stateId",
          name: "ReportViewPage",
          component: () => import("@/components/reports/ReportView.vue"),
          meta: {
            requiresAuth: true,
            title: "Просмотр Отчета",
            icon: "format_list_numbered",
            class: "purple--text",
          },
        },
      ],
    },
  ],
};

export default routeReports;
