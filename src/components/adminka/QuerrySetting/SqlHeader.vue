<template>
  <v-row class="ma-0">
    <v-col cols="2" class="blue lighten-5 pa-1">
      <label class="text-caption">sql_name</label>
      <div
        class="text-h5 mt-2 mb-1 card-title purple--text"
        :class="{ [colorClass]: viewChange.sql_name }"
      >
        <a
          :href="'?sql_name=' + ssq.sql_name"
          target="_blank"
          class="purple--text text-decoration-none"
          >{{ ssq.sql_name }}</a
        >
      </div>
    </v-col>
    <v-col cols="4" class="pa-1">
      <label class="text-caption">Входные параметры</label>
      <p :class="{ [colorClass]: viewChange.sql_params }">
        {{ ssq.sql_params }}
      </p>
    </v-col>
    <v-col cols="1" class="pa-1">
      <label class="text-caption">Отдаваемый параметр</label>
      <p :class="{ [colorClass]: viewChange.result }">
        {{ ssq.result }}
      </p>
    </v-col>
    <v-col cols="2" class="pa-1">
      <SwitchV
        v-model="ssq.need_token"
        :class="{ [colorClass]: viewChange.need_token }"
        class="ma-0 pa-1"
        label="Требуется авторизация"
        disabled
      />
    </v-col>
    <v-col cols="2" class="pa-1">
      <AutocompleteV
        v-if="ssq.kod_database_tuz"
        v-model="ssq.kod_database_tuz"
        :class="{
          [colorClass]: viewChange.data_base || viewChange.kod_database_tuz,
        }"
        disabled
        :label="'ТУЗ ' + ssq.data_base"
        :items="[{ id: 0, naimen: 'Все' }].concat(bd_list_tuz)"
        item-text="naimen"
        item-value="id"
        prepend-icon="account_box"
      />
      <SelectV
        v-else
        v-model="ssq.data_base"
        :class="{
          [colorClass]: viewChange.data_base || viewChange.kod_database_tuz,
        }"
        label="База данных"
        disabled
        :items="bd_list"
        item-text="bd"
        item-value="id"
        prepend-icon="settings_input_hdmi"
      />
    </v-col>
    <v-col class="pa-0">
      <v-row class="ma-0 pa-0">
        <v-col cols="12" class="ma-0 pa-0">
          <div v-if="needCheck" class="red--text text-caption">
            Требуется подтверждение второй рукой
          </div>
        </v-col>
        <v-col v-if="!noBtn" cols="12" class="text-right ma-0 pa-0">
          <BtnIconsV
            :disabled="!admLevel || needCheck"
            color="red"
            title="Удалить"
            icon="delete"
            :action="
              () => {
                emit('delSSQ');
              }
            "
          />
          <BtnIconsV
            :disabled="!eLevel || (!useQuery && !admLevel) || needCheck"
            color="green"
            class="ma-1"
            title="Редактировать"
            icon="edit"
            :action="
              () => {
                emit('edit-sql', true);
              }
            "
          />
          <BtnIconsV
            v-if="!('kod_user_change' in ssq)"
            :disabled="!eLevel"
            color="purple"
            class="ma-1"
            :action="() => $emit('cloneSSQ')"
            icon="control_point_duplicate"
            title="Клонировать"
          />
          <BtnIconsV
            v-if="'kod_user_change' in ssq"
            :disabled="!eLevel || (!useQuery && !admLevel)"
            color="white"
            colorbtn="red"
            title="Отклонить"
            icon="close"
            :action="() => emit('rejectSSQ', ssq.id)"
          />
          <BtnIconsV
            v-if="'kod_user_change' in ssq"
            :disabled="
              !eLevel ||
              (!useQuery && !admLevel) ||
              (Number(ssq.kod_user_change) === +userId && ssq.change_accept)
            "
            color="white"
            colorbtn="green"
            title="Согласовать"
            icon="check"
            :action="() => emit('acceptSSQ', ssq)"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import AutocompleteV from "@/components/basic/AutocompleteV.vue";
import BtnIconsV from "@/components/basic/BtnIconsV.vue";
import SelectV from "@/components/basic/SelectV.vue";
import SwitchV from "@/components/basic/SwitchV.vue";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import { useAdminStore } from "@/store/modules/admin";
import { useAutorizationStore } from "@/store/modules/autorization";
import {
  IKnowledgebaseSysSqlQuery,
  IKnowledgebaseSysSqlQueryAudit,
} from "@/types/database/schemas/knowledgebase";
import { PropType, toRefs } from "vue";
interface ISQLAudit extends IKnowledgebaseSysSqlQueryAudit {
  change_accept: boolean | null;
}
const emit = defineEmits([
  "delSSQ",
  "edit-sql",
  "cloneSSQ",
  "rejectSSQ",
  "acceptSSQ",
]);
defineProps({
  ssq: {
    type: Object as PropType<IKnowledgebaseSysSqlQuery> | PropType<ISQLAudit>,
    required: true,
  },
  viewChange: {
    type: Object as PropType<
      Partial<Record<keyof IKnowledgebaseSysSqlQuery, boolean>>
    >,
    required: true,
  },
  needCheck: {
    type: Boolean,
    required: true,
  },
  useQuery: {
    type: Boolean,
    required: true,
  },
  colorClass: {
    type: String,
    default: "white",
  },
  noBtn: {
    type: Boolean,
    default: false,
  },
});
const { userId } = toRefs(useAutorizationStore());
const { bd_list, bd_list_tuz } = toRefs(useAdminStore());
const { adminLevel, editLevel } = routeAccessLevelCalculate();
const eLevel = editLevel();
const admLevel = adminLevel();
</script>
