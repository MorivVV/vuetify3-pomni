<template>
  <v-row class="ma-1">
    <v-col cols="12">
      <v-card class="horizontal lighten-5" :class="{ green: user.active }">
        <v-row>
          <v-col class="card-image" cols="auto">
            <img
              v-if="user.fullphoto"
              :src="'data:image/png; base64, ' + user.fullphoto"
              :style="{ width: '140px', margin: '5px' }"
            >
            <img
              v-else-if="user.photo30"
              :src="'data:image/png; base64, ' + user.photo30"
              :style="{ width: '100px', margin: '25px' }"
            >
            <img
              v-else
              src="\images\system\f2.png"
              :style="{ width: '140px', margin: '5px' }"
            >
          </v-col>
          <v-col>
            <v-row>
              <v-col class="pa-1" cols="3">
                <div class="card-content">
                  <p class="text-h5">
                    {{ user.empfamilyname }} {{ user.empgivenname }}
                    {{ user.emppatronymic }}
                  </p>
                  <p>{{ user.jobtitle }}</p>
                  <label class="text-caption">Табельный номер</label>
                  <p>{{ user.tabnum }}</p>
                  <label class="text-caption">День рождения</label>
                  <p>{{ user.birthday }}</p>
                  <label class="text-caption">Логин Omega</label>
                  <p>{{ user.loginomega }}</p>
                  <label class="text-caption">Логин Sigma</label>
                  <p>{{ user.loginsigma }}</p>
                </div>
              </v-col>

              <v-col class="pa-1" cols="3">
                <div class="card-content">
                  <label class="text-caption">Логин {{ NAIMEN_SITE }}</label>
                  <p>{{ user.login || "нет" }}</p>
                  <label class="text-caption">Зарегистрирован</label>
                  <p>{{ user.create_time || "нет" }}</p>
                  <label v-if="user.login_ip">IP</label>
                  <p>{{ user.login_ip }}</p>
                  <label class="text-caption">Последняя авторизация</label>
                  <p>{{ user.login_time }}</p>
                  <label class="text-caption">Гардероб</label>
                  <p>{{ user.checkroom }}</p>
                  <label class="text-caption">Актуализация</label>
                  <p>
                    {{ $moment(user.date_moditify).format(momentFormatFull) }}
                  </p>
                </div>
              </v-col>

              <v-col class="pa-1" cols="3">
                <div class="card-content">
                  <label class="text-caption">Подразделение</label>
                  <p>{{ user.deptname }}</p>
                  <label class="text-caption">Agile</label>
                  <p>{{ user.agileroles }}</p>
                  <label class="text-caption">Функциональный руководитель</label>
                  <p>{{ user.funcdir }}</p>
                  <label class="text-caption">Линейный руководитель</label>
                  <p>{{ user.dir }}</p>
                </div>
              </v-col>

              <v-col class="pa-1" cols="3">
                <div class="card-content">
                  <label class="text-caption">Внутренний</label>
                  <p>{{ user.empinnerphone }}</p>
                  <label class="text-caption">Мобильный</label>
                  <p>{{ user.empmobilephone }}</p>
                  <label v-if="user.emailalpha">Почта Alpha
                    {{
                      user.mainmail === user.emailalpha ? "(основная)" : ""
                    }}</label>
                  <p>{{ user.emailalpha }}</p>
                  <label v-if="user.emailomega">Почта Omega
                    {{
                      user.mainmail === user.emailomega ? "(основная)" : ""
                    }}</label>
                  <p>{{ user.emailomega }}</p>
                  <label v-if="user.emailsigma">Почта Sigma
                    {{
                      user.mainmail === user.emailsigma ? "(основная)" : ""
                    }}</label>
                  <p>{{ user.emailsigma }}</p>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { momentFormatFull } from "@/const/timeFormats";
import { ICheckroomEmployees } from "@/types/database/schemas/checkroom";
import { IKnowledgebaseBzUsers } from "@/types/database/schemas/knowledgebase";
import { PropType } from "vue";

defineProps({
  user: {
    type: Object as PropType<
      ICheckroomEmployees & IKnowledgebaseBzUsers & { checkroom: string }
    >,
    required: true,
  },
});
const NAIMEN_SITE = NAIMEN_POMNI;
</script>

<style scoped>
p {
  margin: 1px;
  padding: 1px;
}
</style>
