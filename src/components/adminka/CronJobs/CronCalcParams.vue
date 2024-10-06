<template>
  <div>
    <v-dialog v-model="dialog" width="700">
      <template #activator="{ on, attrs }">
        <v-btn
          color="blue lighten-2"
          dark
          v-bind="attrs"
          v-on="on"
          @click="getParams"
        >
          Список вычисляемых переменных
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Значения переменных зависят от текущего дня
        </v-card-title>
        <v-card-text class="pa-1 ma-0">
          С 27 февраля 2024г добавлены вычисляемые параметры <br>
          Данные параметры можно подставлять в любые поля заданий по расписанию
          <br>
          При запуске заданий параметр будет вычисляться в зависимости от даты
          запуска <br>
          Чтобы посмотреть примеры, в поиске по параметрам задания можно найти
          firstDayOfQuart или yesterDate
        </v-card-text>
        <v-card-title class="ma-0 pa-1 text-subtitle-1 grey lighten-4">
          <v-row class="ma-0">
            <v-col class="pa-0" cols="3"> Переменная </v-col>
            <v-col class="pa-0" cols="3"> Вычислено </v-col>
            <v-col class="pa-0"> Описание </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
          <v-row
            v-for="(param, val) in calcParams"
            :key="'param_' + param.text"
            class="ma-1"
          >
            <v-col class="pa-0" cols="3"> {{ `\$\{${val}\}` }} </v-col>
            <v-col class="pa-0" cols="3">= {{ param.value }}</v-col>
            <v-col class="pa-0">=> {{ param.text }}</v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="dialog = false"> Закрыть </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { dataApiComposition } from "@/compositionApi/dataApi";
import { ref } from "vue";
const dialog = ref(false);
const calcParams = ref<Record<string, { text: string; value: string }>>();
const { r_fetch } = dataApiComposition();
const getParams = () =>
  r_fetch("api/v2/calcParams", {}).then((r) => {
    calcParams.value = r;
  });
</script>
