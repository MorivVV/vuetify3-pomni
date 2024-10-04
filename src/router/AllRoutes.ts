import { makeRouter } from "@/functions/makeRouter";
import { Route } from "@/types/global";

const routeModules: Route[] = makeRouter(
  import.meta.glob("@/router/sections/*.ts", { eager: true })
);

export const convertRoutes = (route: Route, path = "") => {
  let href = route.path;
  if (path && href === "/") {
    href = "";
  }
  if (path && href) {
    href = path + "/" + href;
  } else if (path === "") {
    href = path + href;
  } else {
    href = path;
  }
  let order = 10;
  if ("order" in route) {
    order = route.order;
  }
  const url: Route = {
    children: [],
    href,
    title: route.name,
    icon: "search",
    class: "text-green",
    ...route,
    order,
  };
  const childrens: Route[] = [];
  let urlChild: Array<Route> = [];
  if (url.children) {
    urlChild = url.children;
  }
  for (const child of urlChild) {
    if ("title" in child && child.title) {
      childrens.push(convertRoutes(child, href));
    }
  }
  url.children = childrens;
  return url;
};
export const AllRoutes = {
  routes: [
    {
      path: "/login",
      order: 10,
      name: "Login",
      component: () => import("@/components/Login.vue"),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/register",
      order: 10,
      name: "Register",
      component: () => import("@/components/Register.vue"),
      meta: {
        requiresAuth: false,
      },
    },

    ...routeModules,
  ],
};
