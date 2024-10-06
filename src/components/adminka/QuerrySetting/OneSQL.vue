<template>
  <v-row class="ma-0">
    <OneSQLeditVue v-if="edit" :ssq="ssq" @edit-sql="changeEdit" />
    <OneSQLviewVue
      v-else
      :ssq="ssq"
      @edit-sql="changeEdit"
      @get-s-s-q="$emit('getSSQ')"
    />
  </v-row>
</template>

<script setup lang="ts">
import {
  IKnowledgebaseSysSqlQuery,
  IKnowledgebaseSysSqlQueryAudit,
} from "@/types/database/schemas/knowledgebase";
import { PropType, ref, toRefs } from "vue";
import OneSQLeditVue from "./OneSQLedit.vue";
import OneSQLviewVue from "./OneSQLview.vue";
import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import { useAutorizationStore } from "@/store/modules/autorization";
const emit = defineEmits(["getSSQ"]);
const { r_insert, checkDataModify } = dataApiComposition();
const { userId } = toRefs(useAutorizationStore());
defineProps({
  ssq: {
    type: Object as PropType<IKnowledgebaseSysSqlQuery>,
    required: true,
  },
});
const edit = ref(false);
const changeEdit = (val: boolean, modSsq: IKnowledgebaseSysSqlQuery) => {
  if (modSsq) saveChange(modSsq);
  edit.value = val;
};
const saveChange = (modSsq: IKnowledgebaseSysSqlQuery) => {
  modSsq.kod_user_modify = +userId.value;
  r_insert<keyof IKnowledgebaseSysSqlQueryAudit>({
    to: "sys_sql_query_audit",
    fields: {
      kod_sql: modSsq.id,
      sql_name: modSsq.sql_name,
      sql_query: modSsq.sql_query,
      sql_params: modSsq.sql_params,
      kod_user_change: +userId.value,
      kod_database_tuz: modSsq.kod_database_tuz,
      data_base: modSsq.data_base,
      active: modSsq.active,
      need_token: modSsq.need_token,
      result: modSsq.result,
    },
  })
    .then((r) =>
      checkDataModify(
        r,
        "Запрос сохранен, необходимо подтверждение второй рукой"
      )
    )
    .then((res) => {
      if (res) {
        emit("getSSQ");
      } else {
        toast.error("Сохранение не удалось");
      }
    });
};
</script>
