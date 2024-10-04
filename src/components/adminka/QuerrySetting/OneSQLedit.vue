<template>
  <v-container fluid>
    <v-card class="ma-1">
      <v-row class="ma-1">
        <v-col cols="2">
          <TextFielsV
            v-model.trim="modSsq.sql_name"
            :rules="[validateRules]"
            label="sql_name"
          />
          <span
            v-if="!validateRules(modSsq.sql_name)"
            class="red--text text-caption"
            >Используются недопустимые символы</span
          >
        </v-col>
        <v-col cols="4">
          <TextFielsV v-model="modSsq.sql_params" label="Входные параметры" />
        </v-col>
        <v-col cols="1">
          <TextFielsV v-model="modSsq.result" label="Отдаваемый параметр" />
        </v-col>
        <v-col cols="2">
          <SwitchV
            v-model="modSsq.need_token"
            class="ma-0 pa-1"
            label="Требуется авторизация"
          />
        </v-col>
        <v-col cols="2">
          <SelectV
            v-model="modSsq.data_base"
            label="База данных"
            :items="bd_list"
            item-text="bd"
            item-value="id"
            prepend-icon="settings_input_hdmi"
          />
          <AutocompleteV
            v-model="modSsq.kod_database_tuz"
            label="ТУЗ"
            :items="[{ id: null, naimen: 'Нет' }].concat(bd_list_tuz)"
            item-text="naimen"
            item-value="id"
            prepend-icon="account_box"
          >
            <template #item="{ item }">
              <span :class="{ 'red--text': item.change_accept }">{{
                item.naimen
              }}</span>
            </template>
          </AutocompleteV>
        </v-col>
        <v-col cols="1" class="text-right">
          <BtnIconsVVue
            colorbtn="red"
            color="white"
            title="Выйти из режима редактирования"
            :action="
              () => {
                $emit('edit-sql', false);
              }
            "
            icon="close"
          />
        </v-col>
      </v-row>
      <v-divider />
      <v-row class="ma-1" justify="end">
        <v-col cols="12">
          <v-textarea
            :id="'query' + modSsq.id"
            v-model="modSsq.sql_query"
            outlined
            hide-details
            label="Текст SQL запроса"
          />
        </v-col>
        <BtnIconsVVue
          :action="saveChange"
          :disabled="!validateRules(modSsq.sql_name)"
          color="white"
          icon="save"
          colorbtn="blue"
          title="Сохранить запрос"
        />
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { PropType, ref, toRefs, watch } from "vue";
import BtnIconsVVue from "@/components/basic/BtnIconsV.vue";
import { useAdminStore } from "@/store/modules/admin";
import { IKnowledgebaseSysSqlQuery } from "@/types/database/schemas/knowledgebase";
import AutocompleteV from "@/components/basic/AutocompleteV.vue";
import TextFielsV from "@/components/basic/TextFielsV.vue";
import SelectV from "@/components/basic/SelectV.vue";
import SwitchV from "@/components/basic/SwitchV.vue";
const emit = defineEmits(["edit-sql"]);
const props = defineProps({
  ssq: {
    type: Object as PropType<IKnowledgebaseSysSqlQuery>,
    required: true,
  },
});
const validateRules = (text: string) => {
  const re = /[\)\()\.\/\\<>:,\*\?"`']/;
  return !re.test(text);
};
const { bd_list, bd_list_tuz } = toRefs(useAdminStore());
const modSsq = ref<IKnowledgebaseSysSqlQuery>({ ...props.ssq });
const saveChange = () => {
  emit("edit-sql", false, modSsq.value);
};

watch(
  () => modSsq.value.kod_database_tuz,
  (val) => {
    const kod_driver = bd_list_tuz.value.find((e) => e.id === val)?.kod_driver;
    if (kod_driver) {
      const data_base = bd_list.value.find(
        (e) => e.kod_driver === kod_driver
      )?.id;
      if (data_base) modSsq.value.data_base = data_base;
    } else {
      modSsq.value.data_base = "pg";
    }
  }
);
</script>
