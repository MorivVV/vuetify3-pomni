import { dataApiComposition } from "@/compositionApi/dataApi";
import { useWebsocketStore } from "@/store/modules/websocket";
import {
  IKnowledgebaseBzUsers,
  IKnowledgebaseWsMessage,
  IKnowledgebaseWsSubscribes,
} from "@/types/database/schemas/knowledgebase";
import { ICreateTableFields } from "@/types/database/service";
const { r_get } = dataApiComposition();

export const getRooms = (channel: number) =>
  r_get(
    {
      from: "ws_room",
      filter: {
        kod_channel: channel,
      },
    },
    "ws_room",
    useWebsocketStore
  );

export const getChannels = () =>
  r_get(
    {
      from: "ws_channels",
    },
    "ws_channels",
    useWebsocketStore
  );

export const getHistory = (room: string, userId: string) => {
  r_get<string | keyof MessageWS>(
    {
      fields: [
        "m.id",
        "m.action",
        "m.date_add",
        "concat(family,' ',first_name):user",
        "m.kod_user",
        "u.session_token:token",
        "m.text",
        "m.kod_user_to:to",
      ],
      from: ["ws_message:m", "bz_users:u"],
      join: ["m.kod_user=u.id"],
      sort: ["-m.id"],
      filter: {
        kod_user_to: "null",
        kod_chatroom: `=:${room}`,
      },
      limit: 100,
      page: 1,
    },
    "messages",
    useWebsocketStore
  );
  r_get<
    | ICreateTableFields<keyof IKnowledgebaseWsMessage, "m">
    | ICreateTableFields<keyof IKnowledgebaseBzUsers, "u">
  >(
    {
      fields: [
        "m.id",
        "m.action",
        "m.date_add",
        "m.kod_user:user",
        "u.session_token:token",
        "m.text",
        "m.kod_user_to:to",
      ],
      from: ["ws_message:m", "bz_users:u"],
      join: ["m.kod_user=u.id"],
      sort: ["-m.id"],
      filter: {
        "m.kod_user_to": `=:${userId}`,
      },
      limit: 100,
      page: 1,
    },
    "private_messages",
    useWebsocketStore
  );
};

export const getSubscribes = (userToken: string) =>
  r_get<
    | ICreateTableFields<keyof IKnowledgebaseWsSubscribes, "s">
    | ICreateTableFields<keyof IKnowledgebaseBzUsers, "u">
  >(
    {
      fields: ["s.*"],
      from: ["ws_subscribes:s", "bz_users:u"],
      join: ["s.kod_user=u.id"],
      filter: {
        "u.session_token": `=:${userToken}`,
      },
    },
    "ws_subscribes",
    useWebsocketStore
  );
