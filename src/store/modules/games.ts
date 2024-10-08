import { defineStore } from "pinia";

export const useGamesStore = defineStore("games", {
  state: () => ({
    snake: [] as ISnakeScore[],
    gameObjects: [] as IGameObjectsParams[],
    gameObjectParams: [] as IGameObjects[],
    tanksMaps: [],
    basicFigureBlack: [
      { figure: "rook", color: "black" },
      { figure: "knight", color: "black" },
      { figure: "bishop", color: "black" },
      { figure: "queen", color: "black" },
      { figure: "king", color: "black" },
      { figure: "bishop", color: "black" },
      { figure: "knight", color: "black" },
      { figure: "rook", color: "black" },
      { figure: "pawn", color: "black" },
      { figure: "pawn", color: "black" },
      { figure: "pawn", color: "black" },
      { figure: "pawn", color: "black" },
      { figure: "pawn", color: "black" },
      { figure: "pawn", color: "black" },
      { figure: "pawn", color: "black" },
      { figure: "pawn", color: "black" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "", color: "" },
      { figure: "pawn", color: "white" },
      { figure: "pawn", color: "white" },
      { figure: "pawn", color: "white" },
      { figure: "pawn", color: "white" },
      { figure: "pawn", color: "white" },
      { figure: "pawn", color: "white" },
      { figure: "pawn", color: "white" },
      { figure: "pawn", color: "white" },
      { figure: "rook", color: "white" },
      { figure: "knight", color: "white" },
      { figure: "bishop", color: "white" },
      { figure: "queen", color: "white" },
      { figure: "king", color: "white" },
      { figure: "bishop", color: "white" },
      { figure: "knight", color: "white" },
      { figure: "rook", color: "white" },
    ],
  }),

  getters: {},
});
