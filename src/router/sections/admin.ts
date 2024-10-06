import { Route } from "@/types/global";
import routeDatabase from "./admin/database";
import { routelogAudit } from "./admin/logAudit";
import routeSecure from "./admin/secure";

const routeAdmin: Route = {
  path: "/admin",
  order: 1000,
  name: "Admin",
  title: "Администрирование",
  icon: "mdi-tune",
  class: "text-blue",
  component: () => import("@/components/elements/RouterLink.vue"),
  meta: {
    requiresAuth: true,
    title: "Администрирование",
    icon: "mdi-tune",
    class: "text-blue",
  },
  children: [
    routeDatabase,
    {
      path: "cronjobs",
      order: 10,
      name: "AdminCronJobs",
      title: "Задания по расписанию",
      icon: "mdi-clock",
      class: "text-purple",
      component: () => import("@/components/adminka/CronJobsTable.vue"),
      meta: {
        requiresAuth: true,
        title: "Задания по расписанию",
        icon: "mdi-clock",
        class: "text-purple",
      },
    },
    {
      path: "users",
      order: 10,
      name: "AdminUsers",
      title: "Пользователи",
      icon: "mdi-contacts",
      class: "text-green-lighten-2",
      component: () => import("@/components/adminka/Users.vue"),
      meta: {
        requiresAuth: true,
        title: "Пользователи",
        icon: "mdi-contacts",
        class: "text-green-lighten-2",
      },
    },
    {
      path: "streams",
      order: 10,
      name: "AdminStreams",
      title: "Вещание",
      icon: "mdi-view-stream",
      class: "text-green-lighten-2",
      component: () => import("@/components/adminka/Streams.vue"),
      meta: {
        requiresAuth: true,
        title: "Вещание",
        icon: "mdi-view-stream",
        class: "text-green-lighten-2",
      },
    },
    routeSecure,
    {
      path: "uploadfile",
      order: 10,
      name: "AdminUpload",
      title: "Загрузка файлов",
      icon: "mdi-file",
      class: "text-teal",
      component: () => import("@/components/basic/UploadFiles.vue"),
      meta: {
        requiresAuth: true,
        title: "Загрузка файлов",
        icon: "mdi-file",
        class: "text-teal",
      },
    },
    routelogAudit,
    {
      path: "smpattern",
      order: 10,
      name: "AdminSMPattern",
      title: "Преобразование ссылок",
      icon: "mdi-format-paint",
      class: "text-blue-darken-2",
      component: () => import("@/components/adminka/SMParser.vue"),
      meta: {
        requiresAuth: true,
        title: "Преобразование ссылок",
        icon: "mdi-format-paint",
        class: "text-blue-darken-2",
      },
    },
    {
      path: "mailinbox",
      order: 100,
      name: "MailInboxList",
      title: "Почта",
      icon: "mdi-mail",
      class: "text-blue-darken-2",
      component: () => import("@/components/adminka/InboxMail/InboxList.vue"),
      meta: {
        requiresAuth: true,
        title: "Почта",
        icon: "mdi-mail",
        class: "text-blue-darken-2",
      },
    },
  ],
};

export default routeAdmin;
