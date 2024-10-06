import { Route } from "@/types/global";

const routeSecure: Route = {
  path: "secure",
  order: 1000,
  name: "AdminSecurityRoot",
  title: "Доступы",
  icon: "mdi-security",
  class: "text-red",
  component: () => import("@/components/elements/RouterLink.vue"),
  meta: {
    requiresAuth: true,
    title: "Доступы",
    icon: "mdi-security",
    class: "text-red",
  },
  children: [
    {
      path: "security",
      order: 10,
      name: "AdminSecurity",
      title: "Настройки доступа",
      icon: "mdi-security-network",
      class: "text-red",
      component: () => import("@/components/adminka/AllowUsers.vue"),
      meta: {
        requiresAuth: true,
        title: "Настройки доступа",
        icon: "mdi-security-network",
        class: "text-red",
      },
    },
    {
      path: "secret",
      order: 10,
      name: "AdminSecretsGenerate",
      title: "Шифрование паролей",
      icon: "mdi-security",
      class: "text-red",
      component: () => import("@/components/adminka/PasswordGenerate.vue"),
      meta: {
        requiresAuth: true,
        title: "Шифрование паролей",
        icon: "mdi-lock-outline",
        class: "text-red",
      },
    },
    {
      path: "roles",
      order: 10,
      name: "AdminRoles",
      title: "Настройки ролей",
      icon: "mdi-account-supervisor-circle",
      class: "text-purple",
      component: () => import("@/components/adminka/Roles.vue"),
      meta: {
        requiresAuth: true,
        title: "Настройки ролей",
        icon: "mdi-account-supervisor-circle",
        class: "text-purple",
      },
    },
  ],
};

export default routeSecure;
