<template>
  <div class="">
    <StatusWSVue />
    <v-container v-if="extend">
      <v-row class="ma-3 mt-5">
        <v-col cols="5">
          <v-select
            v-model="channel"
            dense
            outlined
            hide-details
            :items="ws_channels"
            item-value="id"
            item-text="naimen"
            label="Канал"
          />
        </v-col>
        <v-col cols="5">
          <v-select
            v-model="room"
            dense
            outlined
            hide-details
            :items="ws_room"
            item-value="id"
            item-text="naimen"
            label="Комната"
          />
        </v-col>
        <v-col cols="auto">
          <SubscribeWSVue
            :room="room"
            @getSubscribes="
              () => {
                getSubscribes(userToken).then((r) => {
                  if (r.map((e) => e.id).indexOf(room) === -1) {
                    room = String(r[0].id);
                  }
                });
              }
            "
          />
        </v-col>
      </v-row>
      <v-card>
        <v-row class="ma-1">
          <v-row class="ma-1">
            <v-col cols="12">
              <TextTinyMCEVue v-model="message.text" label="Сообщение" />
            </v-col>

            <v-col cols="auto">
              <BtnIconsVVue :action="send" icon="send" title="Отправить" />
            </v-col>

            <v-col v-if="messPrivate" cols="auto" class="col chip">
              <v-chip>
                Лично для {{ messPrivate
                }}<i
                  class="material-icons pointer"
                  @click="privateMessage('', '')"
                  >close</i
                >
              </v-chip>
            </v-col>
          </v-row>
        </v-row>
      </v-card>
      <v-card v-if="extend">
        <MessagesWSVue
          v-for="(mess, ind) in messages"
          :key="'mess_' + mess.id + mess.kod_user"
          :message="mess"
          :num="ind"
          @privateMess="privateMessage"
        />
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import BtnIconsVVue from "../basic/BtnIconsV.vue";
import TextTinyMCEVue from "../basic/TextTinyMCE.vue";
import timeoutApply from "@/functions/timeoutApply";
import { onBeforeUnmount, onMounted, ref, toRefs, watch } from "vue";
import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import SubscribeWSVue from "./wschat/SubscribeWS.vue";
import StatusWSVue from "./wschat/StatusWS.vue";
import MessagesWSVue from "./wschat/MessagesWS.vue";
import { useWebsocketStore } from "@/store/modules/websocket";
import { useAutorizationStore } from "@/store/modules/autorization";
import { getChannels, getRooms, getHistory, getSubscribes } from "./wsChatData";
import { IKnowledgebaseWsSubscribes } from "@/types/database/schemas/knowledgebase";

defineProps({
  extend: { type: Boolean, default: false },
});
const { r_get, r_state } = dataApiComposition();
const room = ref("1");
const messPrivate = ref("");
const channel = ref(1);
const reconect = ref(true);
const message = ref<MessageWS>({
  id: 0,
  text: "",
  action: "message",
  token: "",
  date_add: Date.now(),
  to: "",
  user: { fio: "", token: "" },
});
const {
  messages,
  wsConnect,
  users_online,
  warning,
  private_messages,
  ws_channels,
  ws_room,
  status,
} = toRefs(useWebsocketStore());
const { userFio, userToken, userId } = toRefs(useAutorizationStore());
const privateMessage = (token = "", fio = "") => {
  message.value.to = token;
  messPrivate.value = fio;
};
const send = () => {
  message.value.date_add = Date.now();
  message.value.action = "message";
  message.value.room = +room.value;
  (wsConnect.value as WebSocket).send(JSON.stringify(message.value));
  r_state(useWebsocketStore, "messages", [
    { ...message.value },
    ...messages.value,
  ]);
  message.value.text = "";
};
const notify = (message: MessageWS) => {
  if (warning.value) {
    const title: string = message.user.fio || message.ip || "";
    const options = {
      title,
      body: message.text,
      icon: "/images/system/add_plus.png",
      image: "/images/system/aspomni.png",
      tag: message.user.fio,
    };
    let notification: Notification;
    if (Notification.permission !== "granted") {
      if (Notification.permission === "denied") {
        toast.warning("Уведомления запрещены в браузере");
        r_state(useWebsocketStore, "warning", false);
      }
      Notification.requestPermission(function (permission) {
        // Если пользователь разрешил, то создаём уведомление
        if (permission === "granted") {
          notification = new Notification(title, options);
        } else {
          toast.warning("Уведомления включить не удалось");
        }
      });
    } else {
      notification = new Notification(title, options);
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }
};
const parseMessage = (mes: { data: string }) => {
  if (typeof mes.data !== "string") return;
  const message: MessageWS = JSON.parse(mes.data);
  switch (message.action) {
    case "message":
      if (message.to) {
        r_state(useWebsocketStore, "private_messages", [
          message,
          ...private_messages.value,
        ]);
      } else {
        r_state(useWebsocketStore, "messages", [message, ...messages.value]);
      }

      notify(message);
      break;

    case "enter":
      r_state(useWebsocketStore, "users_online", [
        ...users_online.value,
        message,
      ]);
      break;

    case "reload":
      timeoutApply(10000);
      break;

    case "exit":
      r_state(
        useWebsocketStore,
        "users_online",
        users_online.value.filter((e) => e.soc !== message.soc)
      );
      break;

    default:
      break;
  }
  // this.$projectDebug(message);
  // отправка уведомления
};
const wsconnect = () => {
  let protocol = window.location.protocol;
  protocol = protocol.replace("http", "ws");
  let port = window.location.port;
  if (port === "8080") {
    port = ":3000";
  } else if (port) {
    port = ":" + port;
  }
  if (wsConnect.value === null) {
    r_state(
      useWebsocketStore,
      "wsConnect",
      new WebSocket(protocol + "//" + window.location.hostname + port)
    );
  }

  // обработка входящих сообщений
  (wsConnect.value as WebSocket).onmessage = parseMessage;

  (wsConnect.value as WebSocket).onopen = () => {
    r_state(useWebsocketStore, "status", "online");
  };

  (wsConnect.value as WebSocket).onclose = () => {
    r_state(useWebsocketStore, "status", "offline");
    r_state(useWebsocketStore, "wsConnect", null);
    r_state(useWebsocketStore, "users_online", []);
    if (reconect.value) {
      setTimeout(() => {
        wsconnect();
      }, 1000);
    }
  };

  (wsConnect.value as WebSocket).onerror = (e: any) => {
    status.value = e;
  };
};
watch(channel, (val) =>
  getRooms(val).then((r) => {
    room.value = r[0].id;
  })
);
watch(room, () => getHistory(room.value, userId.value));
watch(userToken, () => {
  message.value.token = userToken.value;
  if (wsConnect.value) {
    wsConnect.value.close();
  }
});
watch(warning, (newVal) => {
  if (newVal) {
    const msg: MessageWS = {
      id: Date.now(),
      user: { fio: "Проверка", token: "" },
      text: "Уведомления включены",
    };
    notify(msg);
  }
});
onMounted(() => {
  getHistory(room.value, userId.value);
  message.value.user.fio = userFio.value;
  message.value.user.token = userToken.value;
  wsconnect();
});
onBeforeUnmount(() => {
  reconect.value = false;
  (wsConnect.value as WebSocket).close();
});
r_get<string>({
  fields: ["notification"],
  from: "bz_users",
  filter: {
    session_token: `=:${userToken.value}`,
    notification: true,
  },
})
  .then((r) => {
    if (r.length === 1) {
      r_state(useWebsocketStore, "warning", true);
    } else {
      r_state(useWebsocketStore, "warning", false);
    }
  })
  .then(() => getChannels())
  .then(() =>
    getRooms(channel.value).then((r) => {
      room.value = r[0].id;
    })
  )
  .then(() =>
    getSubscribes(userToken.value).then((r) => {
      if (
        r
          .map((e: IKnowledgebaseWsSubscribes) => e.kod_room)
          .indexOf(+room.value) === -1
      ) {
        room.value = String(r[0].id);
      }
    })
  );
</script>
