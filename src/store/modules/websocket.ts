import { defineStore } from "pinia";

export const useWebsocketStore = defineStore("websocket", {
  state: () => ({
    wsConnect: null as WebSocket | null,
    status: "offline",
    warning: false,
    users_online: [] as IWSUserOnline[],
    ws_channels: [],
    ws_subscribes: [],
    ws_room: [],
    messages: [] as MessageWS[],
    private_messages: [],
  }),
  getters: {},
});
