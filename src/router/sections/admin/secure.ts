const routeSecure = {
  path: "secure",
  order: 1000,
  name: "AdminSecurityRoot",
  title: "Доступы",
  icon: "security",
  class: "red--text",
  component: () => import("@/components/elements/RouterLink.vue"),
  meta: {
    requiresAuth: true,
    title: "Доступы",
    icon: "security",
    class: "red--text",
  },
  children: [
    {
      path: "security",
      order: 10,
      name: "AdminSecurity",
      title: "Настройки доступа",
      icon: "security",
      class: "red--text",
      component: () => import("@/components/adminka/AllowUsers.vue"),
      meta: {
        requiresAuth: true,
        title: "Настройки доступа",
        icon: "verified_user",
        class: "red--text",
      },
    },
    {
      path: "secret",
      order: 10,
      name: "AdminSecretsGenerate",
      title: "Шифрование паролей",
      icon: "security",
      class: "red--text",
      component: () => import("@/components/adminka/PasswordGenerate.vue"),
      meta: {
        requiresAuth: true,
        title: "Шифрование паролей",
        icon: "lock_outline",
        class: "red--text",
      },
    },
    {
      path: "roles",
      order: 10,
      name: "AdminRoles",
      title: "Настройки ролей",
      icon: "security",
      class: "purple--text",
      component: () => import("@/components/adminka/Roles.vue"),
      meta: {
        requiresAuth: true,
        title: "Настройки ролей",
        icon: "supervisor_account",
        class: "purple--text",
      },
    },
  ],
};

export default routeSecure;
