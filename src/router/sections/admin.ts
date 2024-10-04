import routeDatabase from "./admin/database";
import { routelogAudit } from "./admin/logAudit";
import routeSecure from "./admin/secure";

const routeAdmin = {
  path: "/admin",
  order: 1000,
  name: "Admin",
  title: "Администрирование",
  icon: "tune",
  class: "blue--text",
  component: () => import("@/components/elements/RouterLink.vue"),
  meta: {
    requiresAuth: true,
    title: "Администрирование",
    icon: "tune",
    class: "blue--text",
  },
  children: [
    routeDatabase,
    {
      path: "cronjobs",
      order: 10,
      name: "AdminCronJobs",
      title: "Задания по расписанию",
      icon: "schedule",
      class: "purple--text",
      component: () => import("@/components/adminka/CronJobsTable.vue"),
      meta: {
        requiresAuth: true,
        title: "Задания по расписанию",
        icon: "schedule",
        class: "purple--text",
      },
    },
    {
      path: "users",
      order: 10,
      name: "AdminUsers",
      title: "Пользователи",
      icon: "contacts",
      class: "green--text text--lighten-2",
      component: () => import("@/components/adminka/Users.vue"),
      meta: {
        requiresAuth: true,
        title: "Пользователи",
        icon: "contacts",
        class: "green--text text--lighten-2",
      },
    },
    {
      path: "streams",
      order: 10,
      name: "AdminStreams",
      title: "Вещание",
      icon: "view_stream",
      class: "green--text text--lighten-2",
      component: () => import("@/components/adminka/Streams.vue"),
      meta: {
        requiresAuth: true,
        title: "Вещание",
        icon: "view_stream",
        class: "green--text text--lighten-2",
      },
    },
    routeSecure,
    {
      path: "uploadfile",
      order: 10,
      name: "AdminUpload",
      title: "Загрузка файлов",
      icon: "insert_drive_file",
      class: "teal--text",
      component: () => import("@/components/basic/UploadFiles.vue"),
      meta: {
        requiresAuth: true,
        title: "Загрузка файлов",
        icon: "insert_drive_file",
        class: "teal--text",
      },
    },
    routelogAudit,
    {
      path: "smpattern",
      order: 10,
      name: "AdminSMPattern",
      title: "Преобразование ссылок",
      icon: "format_paint",
      class: "blue--text text--darken-2",
      component: () => import("@/components/adminka/SMParser.vue"),
      meta: {
        requiresAuth: true,
        title: "Преобразование ссылок",
        icon: "format_paint",
        class: "blue--text text--darken-2",
      },
    },
    // {
    //   path: "adressbook",
    //   order: 10,
    //   name: "AddresBookInterface",
    //   title: "Взаимодействие c AddresBook",
    //   icon: "book",
    //   class: "blue--text",
    //   component: () =>
    //     import("@/components/addressbook/AddresBookInterface.vue"),
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    {
      path: "mailinbox",
      order: 100,
      name: "MailInboxList",
      title: "Почта",
      icon: "mail",
      class: "blue--text",
      component: () => import("@/components/adminka/InboxMail/InboxList.vue"),
      meta: {
        requiresAuth: true,
        title: "Почта",
        icon: "mail",
        class: "blue--text",
      },
    },
  ],
};

export default routeAdmin;
