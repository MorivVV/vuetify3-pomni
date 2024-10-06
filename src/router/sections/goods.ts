import { Route } from "@/types/global";

const routeMvideo: Route = {
  path: "/goods",
  name: "Mvideo",
  title: "Товары",
  icon: "mdi-basket",
  class: "text-red",
  component: () => import("@/components/elements/RouterLink.vue"),
  meta: {
    requiresAuth: true,
    title: "Товары",
    icon: "mdi-basket",
    class: "text-red",
  },
  children: [
    {
      path: "mvideo",
      name: "Mvideo",
      title: "Mvideo",
      icon: "mdi-basket",
      class: "text-red",
      component: () => import("@/components/mvideo/Mvideo.vue"),
      meta: {
        requiresAuth: true,
        title: "Mvideo",
        icon: "mdi-basket",
        class: "text-red",
      },
    },
    {
      path: "dns",
      name: "GoodsMain",
      title: "DNS",
      icon: "mdi-basket",
      class: "text-orange",
      component: () => import("@/components/goods/GoodsMain.vue"),
      meta: {
        requiresAuth: true,
        title: "DNS",
        icon: "mdi-basket",
        class: "text-orange",
      },
    },
  ],
};

export default routeMvideo;
