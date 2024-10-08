import { Route } from "@/types/global";

const routeGames: Route = {
  path: "/games",
  order: 30,
  name: "Games",
  title: "Игры",
  icon: "mdi-gamepad-square",
  class: "text-red",
  component: () => import("@/components/elements/RouterLink.vue"),
  meta: {
    requiresAuth: false,
    title: "Игры",
    icon: "mdi-gamepad-square",
    class: "text-red",
  },
  children: [
    {
      path: "matters",
      name: "GamesMatters",
      title: "MattersJS",
      icon: "mdi-gamepad-square",
      class: "text-gray",
      component: () => import("@/components/games/Matters.vue"),
      meta: {
        requiresAuth: false,
        title: "MattersJS",
        icon: "mdi-gamepad-square",
        class: "text-gray",
      },
    },
    {
      path: "platform",
      name: "PlatformReady",
      title: "PlatformReady",
      icon: "mdi-home",
      class: "text-pink",
      component: () => import("@/components/games/PlatformReady.vue"),
      meta: {
        requiresAuth: false,
        title: "PlatformReady",
        icon: "mdi-home",
        class: "text-pink",
      },
    },
    {
      path: "snake",
      name: "GamesSnake",
      title: "Змейка",
      icon: "mdi-snake",
      class: "text-green",
      component: () => import("@/components/games/Snake.vue"),
      meta: {
        requiresAuth: false,
        title: "Змейка",
        icon: "mdi-snake",
        class: "text-green",
      },
    },
    {
      path: "chess",
      name: "GamesChess",
      title: "Шахматы",
      icon: "mdi-chess-king",
      class: "text-black",
      component: () => import("@/components/games/Chess.vue"),
      meta: {
        requiresAuth: false,
        title: "Шахматы",
        icon: "mdi-chess-king",
        class: "text-black",
      },
    },
    {
      path: "mario",
      name: "GamesMario",
      title: "Марио",
      icon: "mdi-gamepad-circle",
      class: "text-blue",
      component: () => import("@/components/games/Mario.vue"),
      meta: {
        requiresAuth: false,
        title: "Марио",
        icon: "mdi-gamepad-circle",
        class: "text-blue",
      },
    },
    {
      path: "battlecity",
      name: "GamesBattleCity",
      title: "Танчики",
      icon: "mdi-tank",
      class: "text-orange",
      component: () => import("@/components/games/GamePlatform.vue"),
      meta: {
        requiresAuth: false,
        title: "Танчики",
        icon: "mdi-tank",
        class: "text-orange",
      },
    },
    {
      path: "trassa",
      name: "GamesTrassa",
      title: "Трасса",
      icon: "mdi-car",
      class: "text-purple",
      component: () => import("@/components/games/Trassa.vue"),
      meta: {
        requiresAuth: false,
        title: "Трасса",
        icon: "mdi-car",
        class: "text-purple",
      },
    },
    {
      path: "canvas",
      name: "GamesCanvas",
      title: "Canvas",
      icon: "mdi-car",
      class: "text-green",
      component: () => import("@/components/games/Canvas.vue"),
      meta: {
        requiresAuth: false,
        title: "Canvas",
        icon: "mdi-car",
        class: "text-green",
      },
    },
    {
      path: "multiply",
      name: "MultiplyTable",
      title: "Таблица умножения",
      icon: "mdi-nfc",
      class: "text-amber",
      component: () => import("@/components/games/MultiplyTable.vue"),
      meta: {
        requiresAuth: false,
        title: "Таблица умножения",
        icon: "mdi-nfc",
        class: "text-amber",
      },
    },
  ],
};

export default routeGames;
