<template>
  <v-row>
    <v-col cols="2">
      <DataTableV
        v-model="selected"
        :headers="mailHeaders"
        :items="inbox_mail"
        show-select
        single-select
      >
        <template #[`item.subject`]="{ item }">
          <div class="blue--text">{{ item.subject }}</div>
          <div>{{ moment(item.date_mail).format(momentFormatTimeShort) }}</div>
        </template>
      </DataTableV>
    </v-col>
    <v-col cols="10"> <div v-html="selected[0]?.html" /> </v-col>
  </v-row>
</template>

<script setup lang="ts">
import DataTableV from "@/components/basic/DataTableV.vue";
import { useAdminStore } from "@/store/modules/admin";
import { ref, toRefs } from "vue";
import { getMailInbox, mailHeaders } from "./inboxData";
import moment from "moment";
import { momentFormatTimeShort } from "@/const/timeFormats";
import { IConfigInboxMail } from "@/types/database/schemas/config";

const { inbox_mail } = toRefs(useAdminStore());
const selected = ref<IConfigInboxMail[]>([]);
getMailInbox();
</script>
