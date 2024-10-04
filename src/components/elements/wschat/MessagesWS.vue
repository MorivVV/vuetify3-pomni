<template>
  <v-row class="ma-0 pr-1 pl-1">
    <v-col cols="12" class="ma-0 pa-0">
      <v-row
        v-if="nextDate"
        class="ma-0 pa-0 light-blue darken-3"
        justify="center"
      >
        <v-col cols="auto" class="pa-1 white--text font-weight-bold">
          {{ moment(message.date_add).format("DD MMMM YYYY") }}</v-col
        >
      </v-row>
      <v-row
        v-if="doubleMessage"
        class="ma-0 pa-0 mt-1"
        :justify="!otherUser ? 'end' : 'start'"
        align="end"
      >
        <v-col cols="auto" class="ma-0 pa-0" :order="otherUser ? 1 : 2">
          <v-card
            class="ma-0 pa-1 lighten-3"
            :class="otherUser ? 'green' : 'blue'"
            @click="privateMessage(message.token, message.user)"
          >
            <UserFioVue
              v-if="'kod_user' in message"
              :user_id="message.kod_user"
            />
            <span v-else>{{ message.user.fio }}</span>
          </v-card>
        </v-col>
      </v-row>
      <v-row
        class="ma-0 pa-0"
        :justify="!otherUser ? 'end' : 'start'"
        align="center"
      >
        <v-col
          v-if="nextMinute"
          cols="auto"
          class="ma-0 pa-0"
          :order="!otherUser ? 1 : 2"
        >
          <v-card class="ma-0 pa-0 ml-1 mr-1 text-caption">
            {{ moment(message.date_add).format("HH:mm") }}
          </v-card>
        </v-col>
        <v-col cols="auto" class="ma-0 pa-0" :order="otherUser ? 1 : 2">
          <v-card class="ma-0">
            <span v-html="message.text" />
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { PropType, computed, toRefs } from "vue";
import UserFioVue from "../UserFio.vue";
import { useWebsocketStore } from "@/store/modules/websocket";
import { useAutorizationStore } from "@/store/modules/autorization";
import moment from "moment";

const emit = defineEmits(["privateMess"]);
const props = defineProps({
  message: { type: Object as PropType<MessageWS>, required: true },
  num: { type: Number, required: true },
});
const { userToken, userId } = toRefs(useAutorizationStore());
const { messages } = toRefs(useWebsocketStore());
const nextDate = computed(() => {
  if (props.num === 0) return true;
  const prevMessage = messages.value[props.num - 1];
  return (
    moment(prevMessage.date_add).format("DDMMYYYY") !==
    moment(props.message.date_add).format("DDMMYYYY")
  );
});
const nextMinute = computed(() => {
  if (props.num === 0) return true;
  const prevMessage = messages.value[props.num - 1];
  return (
    moment(prevMessage.date_add).format("DDMMYYYYHHmm") !==
    moment(props.message.date_add).format("DDMMYYYYHHmm")
  );
});
const otherUser = computed(() => {
  if ("kod_user" in props.message) {
    return Number(props.message.kod_user) === +userId.value;
  } else {
    return props.message.user.token === userToken.value;
  }
});
const doubleMessage = computed(() => {
  let check = false;
  if (props.num === 0) return true;
  if (props.num > 0) {
    const prevMessage = messages.value[props.num - 1];
    if (prevMessage.kod_user !== props.message.kod_user) check = true;
  }

  return check;
});

const privateMessage = (token = "", fio = "") => {
  emit("privateMess", token, fio);
};
</script>

<style scoped>
.v-card >>> p {
  padding: 1px;
  margin: 1px;
}
</style>
