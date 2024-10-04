<template>
  <v-dialog v-model="dialog" persistent width="60%">
    <v-card class="blue lighten-5">
      <v-card-title class="ma-0 pa-0 text-h5 blue white--text">
        <v-row class="ma-0 pa-0" align="center">
          <v-col class="ma-0 pa-0">
            <div class="text-center">BazLook</div>
          </v-col>
          <v-col class="pa-0 white--text" cols="auto">
            <i class="material-icons pointer red ma-1" @click="closeForm"
              >close</i
            >
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row class="ma-1">
          <v-col>
            <a @click="genMailUrl">Открыть от своего имени (Outlook)</a>
          </v-col>
          <v-col cols="auto" class="pa-0 text-center">
            <v-row class="ma-0">
              <v-col cols="auto" class="pa-1">
                <span>
                  <CheckBoxTitleV
                    v-model="mail.sms"
                    prepend-icon="sms"
                    color="red"
                    label="SMS"
                    title="Отправка СМС через API"
                  />
                </span>
              </v-col>
              <v-col class="pa-0">
                <span
                  >всего СМС {{ svodSMS.all_count }} <br />
                  за месяц {{ svodSMS.count_month }} с начала месяца
                  {{ svodSMS.count_curr_month }}</span
                >
              </v-col>
              <v-col class="pa-2 pt-1 pb-1" cols="auto">
                <BtnIconsV
                  :action="sendMail"
                  icon="mail"
                  colorbtn="orange darken-3"
                  color="white"
                  title="Отправить письмо"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row align="center" class="ma-0">
          <v-col class="pa-0">
            <TextFielsV
              v-model="mail.head"
              class="white"
              label="Заголовок письма"
            />
          </v-col>
          <v-col class="pa-0" cols="4">
            <AutocompleteV
              class="white"
              :label="`Добавить группу рассылки (${mailFocus})`"
              :items="mail_groups"
              item-text="group_name"
              item-value="id"
              @input="getMailGroup"
            />
          </v-col>
        </v-row>

        <v-row class="ma-0">
          <v-col class="over-y200 pa-0" cols="12">
            <v-autocomplete
              v-if="emails.length"
              v-model="mail.toArray"
              label="Введите адрес получателя"
              :items="emails"
              :item-text="
                (e) =>
                  `${e.email}${
                    mail.sms && e.mobile_phone ? '(' + e.mobile_phone + ')' : ''
                  }`
              "
              item-value="id"
              auto-select-first
              class="mt-1 white"
              outlined
              chips
              dense
              hide-details
              clearable
              deletable-chips
              multiple
              small-chips
              :search-input.sync="searchTo"
              @change="searchTo = ''"
              @update:search-input="addNewEmail"
              @focus="() => setFocus('to')"
            />
          </v-col>
          <v-col class="over-y200 pa-0" cols="12">
            <v-autocomplete
              v-if="emails.length"
              v-model="mail.copyArray"
              label="Копия"
              :items="emails"
              :item-text="
                (e) =>
                  `${e.email}${
                    mail.sms && e.mobile_phone ? '(' + e.mobile_phone + ')' : ''
                  }`
              "
              item-value="id"
              auto-select-first
              class="mt-1 white"
              outlined
              chips
              dense
              hide-details
              clearable
              deletable-chips
              multiple
              small-chips
              :search-input.sync="searchCopy"
              @change="searchCopy = ''"
              @update:search-input="addNewEmail"
              @focus="() => setFocus('copy')"
            />
          </v-col>
        </v-row>

        <v-row v-if="textValue" class="ma-0">
          <v-col class="pa-1 ma-1 over-y">
            <v-textarea
              v-model="mail.text"
              class="white"
              auto-grow
              counter
              outlined
              label="Тело письма"
            />
            <label v-if="attachment.length"
              >Вложения: {{ attachment.length }} шт</label
            >
          </v-col>
        </v-row>
        <v-row v-else class="ma-0">
          <v-col class="pa-0 over-y">
            <TextTinyMCEVue v-model="mail.text" label="Тело письма" />
            <label v-if="attachment.length"
              >Вложения: {{ attachment.length }} шт</label
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import TextTinyMCEVue from "@/components/basic/TextTinyMCE.vue";
import { ref, toRefs } from "vue";
import BtnIconsV from "../basic/BtnIconsV.vue";
import { useDezhStore } from "@/store/modules/dezh";
import { useAutorizationStore } from "@/store/modules/autorization";
import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import { smURLparserComposition } from "@/compositionApi/smURLparser";
import { IKnowledgebaseEmails } from "@/types/database/schemas/knowledgebase";
import TextFielsV from "../basic/TextFielsV.vue";
import AutocompleteV from "../basic/AutocompleteV.vue";
import CheckBoxTitleV from "../basic/CheckBoxTitleV.vue";

const emit = defineEmits(["input", "mail-send"]);
const props = defineProps({
  body: { type: String, default: "" },
  head: { type: String, default: "" },
  to: { type: String, default: "" },
  sms: { type: Boolean, default: false },
  textValue: { type: Boolean, default: false },
  toArray: {
    type: Array,
    default: (): string[] => [],
  },
  copyArray: {
    type: Array,
    default: (): string[] => [],
  },
  copy: { type: String, default: "" },
  attachment: {
    type: Array,
    default: (): number[] => [],
  },
  sended: { type: Boolean, default: false },
});
const mailFocus = ref("to");
const { r_get, r_insert, fetchDataGet, fetchData } = dataApiComposition();
const { urlParser } = smURLparserComposition();
const { mail_groups, emails, mail_list } = toRefs(useDezhStore());
const { isLoggedIn, userFio } = toRefs(useAutorizationStore());
const dialog = ref(!props.sended);
const send = ref(props.sended);
const searchSync = ref(0);
const searchTo = ref("");
const searchCopy = ref("");
const mail = ref({
  to: props.to,
  copy: props.copy,
  attach: props.attachment || [],
  toArray: props.toArray,
  copyArray: props.copyArray,
  head: props.head,
  text: props.body,
  sms: props.sms,
});
const svodSMS = ref({
  all_count: "0",
  count_month: "0",
  count_curr_month: "0",
});
const genMail = () => {
  mail.value.to = emails.value
    .filter((e) => ~mail.value.toArray.indexOf(e.id))
    .map((e) => e.email)
    .join(", ");
  mail.value.copy = emails.value
    .filter((e) => ~mail.value.copyArray.indexOf(e.id))
    .map((e) => e.email)
    .join(", ");
};
const getSMSstatistic = () =>
  r_get<
    | "count(id):all_count"
    | "count(id) filter (where time_add > now()-interval '1 month'):count_month"
    | "count(id) filter (where time_add > date_trunc('month',now())):count_curr_month"
    | keyof IPultSMSystems
  >({
    fields: [
      "count(id):all_count",
      "count(id) filter (where time_add > now()-interval '1 month'):count_month",
      "count(id) filter (where time_add > date_trunc('month',now())):count_curr_month",
    ],
    from: "pult.send_sms",
  }).then((r) => {
    svodSMS.value = r[0];
  });
const sendMail = () => {
  if (!isLoggedIn.value) {
    return;
  }
  genMail();
  if (!props.textValue) {
    mail.value.text = mail.value.text.replace(/<table /g, "<table border='1' ");
    mail.value.text = urlParser(mail.value.text);
    mail.value.text += "<br>Отправленно из " + NAIMEN_POMNI;
    mail.value.text += "<br>Инициатор: <b>" + userFio.value + "</b>";
  } else {
    mail.value.text += ` 
        ${userFio.value}`;
  }

  fetchData({
    url: "api/mail",
    data: {
      ...mail.value,
    },
  }).then((r) => {
    if (r.result === "Письмо отправлено") {
      emit("input", {
        to: mail.value.to,
        copy: mail.value.copy,
        send: true,
      });
      emit("mail-send", true);
      dialog.value = false;
    }
    toast.info(r.result);
    send.value = true;
  });
};
const genMailUrl = () => {
  const to = emails.value
    .filter((e) => ~mail.value.toArray.indexOf(e.id))
    .map((e) => e.email)
    .join(";");
  const cc = emails.value
    .filter((e) => ~mail.value.copyArray.indexOf(e.id))
    .map((e) => e.email)
    .join(";");
  const body = mail.value.text;
  const subj = mail.value.head;
  const href = `mailto:${to}?cc=${cc}&subject=${subj}&body=${body}`;

  location.href = href;
};
const closeForm = () => {
  send.value = true;
  emit("mail-send", false);
};
const setFocus = (value: string) => {
  mailFocus.value = value;
};
const getMailGroup = (id: string) => {
  const group = mail_list.value
    .filter((e) => e.kod_group === +id)
    .map((e) => e.kod_email);
  if (mailFocus.value === "to")
    mail.value.toArray = [...mail.value.toArray, ...group];
  if (mailFocus.value === "copy")
    mail.value.copyArray = [...mail.value.copyArray, ...group];
};
const addNewEmail = (s: string) => {
  if (!s) return;
  s = s.trim().toLowerCase();
  if (!s) return;
  const mail = emails.value.find((e) => ~e.email.toLowerCase().indexOf(s));
  if (mail) return;
  if (
    s.match(
      /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g
    )
  ) {
    if (searchSync.value) {
      clearTimeout(searchSync.value);
    }
    searchSync.value = setTimeout(() => {
      if (!confirm(`Добавить новый адрес: ${s} ?`)) return;
      r_insert<keyof IKnowledgebaseEmails>({
        to: "emails",
        fields: {
          email: s,
        },
      }).then(() => {
        r_get<keyof IKnowledgebaseEmails>(
          {
            from: "emails",
          },
          "emails",
          useDezhStore
        );
      });
    }, 2000);
  }
};
fetchDataGet({
  module: useDezhStore,
  tables: ["mail_list", "place", "emails", "mail_groups"],
}).then(() => {
  genMail();
});
getSMSstatistic();
</script>
