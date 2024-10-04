<template>
  <DataTableV
    :caption="`Сводный аудит с ${moment(filter.datebeg).format(
      'YYYY-MM-DD HH:mm:ss'
    )} по ${moment(filter.dateend).format('YYYY-MM-DD HH:mm:ss')}`"
    class="amber lighten-5"
    :headers="svodHeader"
    :items="svodAudit"
  >
    <template #[`item.ip`]="{ item }">
      <span class="blue--text pointer" @click="$emit('ipfilter', item.ip)">{{
        item.ip
      }}</span>
    </template>
    <template #[`item.time_action`]="{ item }">
      {{ moment(item.time_action).format(momentFormatFull) }}
    </template>
    <template #[`item.kod_user`]="{ item }">
      <span
        v-if="item.kod_user"
        class="blue--text pointer"
        @click="$emit('userfilter', item.kod_user)"
      >
        <UserFio :user_id="item.kod_user" />
        -
        <UserFio type-name="login" :user_id="item.kod_user" />
      </span>
    </template>
  </DataTableV>
</template>

<script setup lang="ts">
import { PropType, toRefs } from "vue";
import { useAdminStore } from "@/store/modules/admin";
import DataTableV from "@/components/basic/DataTableV.vue";
import { svodHeader } from "./auditHeaders";
import UserFio from "@/components/elements/UserFio.vue";
import { momentFormatFull } from "@/const/timeFormats";
import moment from "moment";
defineProps({
  filter: {
    type: Object as PropType<{
      ipsearch: string;
      comm: string;
      act: string;
      datebeg: string;
      dateend: string;
      kod_user: number | null;
    }>,
    required: true,
  },
});
const { svodAudit } = toRefs(useAdminStore());
</script>
