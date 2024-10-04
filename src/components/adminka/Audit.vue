<template>
  <v-container>
    <v-row align="center" class="ma-1">
      <v-col class="ma-0 pa-0" cols="3">
        <v-row class="ma-0 pa-0">
          <v-col class="ma-0 pa-0" cols="6">
            <DatetimePickerVVue
              v-model="filter.datebeg"
              class="v-input--dense v-text-field--outlined"
              :date-picker-props="{ 'first-day-of-week': 1 }"
              datetime="timestamp"
              label="Период с"
              time-format="HH:mm:ss"
              :time-picker-props="timeProps"
            />
          </v-col>
          <v-col class="ma-0 pa-0" cols="6">
            <DatetimePickerVVue
              v-model="filter.dateend"
              :date-picker-props="{ 'first-day-of-week': 1 }"
              datetime="timestamp"
              label="Период по"
              time-format="HH:mm:ss"
              :time-picker-props="timeProps"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col class="ma-0 pa-0" cols="2">
        <AutocompleteVVue
          v-if="usersFioArray.length"
          v-model="filter.kod_user"
          item-text="full"
          item-value="id"
          :items="userList"
          label="Пользователь"
        />
      </v-col>
      <v-col class="ma-0 pa-0" cols="3">
        <v-row class="ma-0 pa-0">
          <v-col class="ma-0 pa-0" cols="6">
            <TextFielsV v-model="filter.token" label="Токен" />
          </v-col>
          <v-col class="ma-0 pa-0" cols="6">
            <TextFielsV v-model="filter.ipsearch" label="ip адрес" />
          </v-col>
        </v-row>
      </v-col>
      <v-col class="ma-0 pa-0" cols="2">
        <TextFielsV v-model="filter.comm" label="Действие" />
      </v-col>
      <v-col class="ma-0 pa-0" cols="2">
        <TextFielsV v-model="filter.act" label="Параметры" />
      </v-col>
    </v-row>
    <AuditSvodVue
      :filter="filter"
      @ipfilter="filter.ipsearch = $event"
      @userfilter="filter.kod_user = $event"
    />
    <DataTableV
      caption="Подробный аудит"
      :headers="auditHeader"
      :items="userAudit"
    >
      <template #[`item.kod_user`]="{ item }">
        <span
          v-if="item.kod_user"
          class="blue--text pointer"
          @click="filter.kod_user = item.kod_user"
        >
          <UserFio type-name="login" :user_id="item.kod_user" />
          (<UserFio :user_id="item.kod_user" />)
        </span>
      </template>
      <template #[`item.time_action`]="{ item }">
        {{ moment(item.time_action).format(momentFormatFull) }}
      </template>
      <template #[`item.comment`]="{ item }">
        <span class="blue--text pointer" @click="filter.comm = item.comment">{{
          item.comment
        }}</span>
      </template>
      <template #[`item.ip`]="{ item }">
        <span class="blue--text pointer" @click="filter.ipsearch = item.ip">{{
          item.ip
        }}</span>
      </template>
      <template #[`item.token`]="{ item }">
        <span class="blue--text pointer" @click="filter.token = item.token">{{
          item.token
        }}</span>
      </template>
    </DataTableV>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watch } from "vue";
import AuditSvodVue from "./Audit/AuditSvod.vue";
import { useAdminStore } from "@/store/modules/admin";
import AutocompleteVVue from "../basic/AutocompleteV.vue";
import DatetimePickerVVue from "../basic/DatetimePickerV.vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { ICreateTableFields } from "@/types/database/service";
import {
  IKnowledgebaseBrowserList,
  IKnowledgebaseBzAudit,
  IKnowledgebaseBzIpAddres,
} from "@/types/database/schemas/knowledgebase";
import DataTableV from "../basic/DataTableV.vue";
import { auditHeader } from "./Audit/auditHeaders";
import UserFio from "../elements/UserFio.vue";
import moment from "moment";
import { useUserDataStore } from "@/store/modules/usersData";
import TextFielsV from "../basic/TextFielsV.vue";
import { momentFormatFull } from "@/const/timeFormats";

const { r_get } = dataApiComposition();

const timeProps = {
  format: "24hr",
  useSeconds: true,
  ampmInTitle: true,
};
const filter = ref({
  ipsearch: "",
  comm: "",
  act: "",
  token: "",
  datebeg: moment().subtract(1, "hour").format(momentFormatFull) as string,
  dateend: moment().format(momentFormatFull) as string,
  kod_user: null as number | null,
});
const { userAudit } = toRefs(useAdminStore());
const { usersFioArray } = toRefs(useUserDataStore());
const userList = computed(() => {
  const list: { id: null | number; full: string }[] = [
    { id: null, full: "Все" },
  ];
  return list.concat(
    usersFioArray.value.map((e) => ({ id: e.id, full: e.full }))
  );
});
const getAudit = () => {
  const dateBeg = moment(filter.value.datebeg).toISOString();
  const dateEnd = moment(filter.value.dateend).toISOString();
  let ip;
  let comment;
  let action;
  let kod_user;
  let token;
  if (filter.value.ipsearch) {
    ip = "~:" + filter.value.ipsearch;
  }
  if (filter.value.comm) {
    comment = "~:" + filter.value.comm;
  }
  if (filter.value.act) {
    action = "~:" + filter.value.act;
  }
  if (filter.value.kod_user) {
    kod_user = filter.value.kod_user;
  }
  if (filter.value.token) {
    token = filter.value.token;
  }
  const filters = {
    time_action: `>=:${dateBeg}`,
    "a.time_action": `<=:${dateEnd}`,
    ip,
    comment,
    action,
    kod_user,
    token,
  };
  r_get<string>(
    {
      fields: [
        "a.kod_user",
        "ip.ip",
        "count(1):cnt",
        "max(a.time_action):time_action",
        "substr(bl.browser_name, 1,119) agent",
      ],
      from: ["bz_audit:a", "bz_ip_addres:ip", "browser_list:bl"],
      join: ["a.kod_ip_addres=(+)ip.id", "a.kod_browser=(+)bl.id"],
      filter: { ...filters },
      group: ["a.kod_user", "ip.ip", "substr(bl.browser_name, 1,119)"],
      sort: ["ip.ip"],
    },
    "svodAudit",
    useAdminStore
  );
  return r_get<
    | "browser_name"
    | "ip"
    | keyof IKnowledgebaseBzAudit
    | ICreateTableFields<keyof IKnowledgebaseBzAudit, "a">
    | ICreateTableFields<keyof IKnowledgebaseBzIpAddres, "ip">
    | ICreateTableFields<keyof IKnowledgebaseBrowserList, "bl">
  >(
    {
      fields: ["a.*", "ip.ip", "bl.browser_name:browser"],
      from: ["bz_audit:a", "bz_ip_addres:ip", "browser_list:bl"],
      join: ["a.kod_ip_addres=(+)ip.id", "a.kod_browser=(+)bl.id"],
      filter: { ...filters },
      limit: 1000,
      sort: ["-a.id"],
    },
    "userAudit",
    useAdminStore
  );
};
watch(filter, getAudit, {
  deep: true,
});
onMounted(() => {
  getAudit();
});
</script>

<style scoped>
.container
  >>> .v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr
  > td {
  padding: 0 4px;
}
</style>
