<template>
  <v-container>
    <v-row class="ma-1">
      <v-col cols="5">
        <TextFielsV
          v-model="password"
          label="открытый пароль"
          prepend-icon="mdi-equalizer"
        />
      </v-col>
      <v-col cols="5">
        <TextFielsV
          v-model="master_password"
          label="мастер-пароль"
          prepend-icon="mdi-fingerprint"
        />
      </v-col>
      <v-col cols="1">
        <BtnIconsV
          :action="
            () => {
              encripted = AESencrypt(password, master_password);
            }
          "
          color="white"
          colorbtn="red"
          :disabled="!(master_password && password)"
          icon="lock"
          title="Зашифровать"
        />
      </v-col>
      <v-col cols="1">
        <BtnIconsV
          :action="
            () => {
              decripted = AESdecrypt(password, master_password);
            }
          "
          color="white"
          colorbtn="green"
          :disabled="!(master_password && password)"
          icon="lock-open"
          title="Расшифровать"
        />
      </v-col>
      <v-col class="ma-0 text-center text-h4" cols="11">
        <TextFielsV v-model="decripted" label="Расшифрованный результат" />
      </v-col>
      <v-col cols="1">
        <BtnIconsV
          :action="
            () => {
              copyToClipboard(decripted);
            }
          "
          color="white"
          colorbtn="blue"
          icon="content-copy"
          title="Копировать в буфер обмена"
        />
      </v-col>
      <v-col class="ma-0 text-center text-h4" cols="11">
        <TextFielsV
          v-model="encripted"
          dense
          label="Зашифрованный результат"
          outlined
        />
      </v-col>
      <v-col cols="1">
        <BtnIconsV
          :action="
            () => {
              copyToClipboard(encripted);
            }
          "
          color="white"
          colorbtn="blue"
          icon="content-copy"
          title="Копировать в буфер обмена"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Все зашифрованные пароли всегда начинаются с префикса U2FsdGVkX1
          </v-card-title>
          <v-card-text>
            Пароли в базе данных хранятся в зашиврованном виде. Мастер-пароль
            для всех паролей один и тот же. Уточнять у администраторов
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import AESdecrypt from "@/store/function/aesdecrypt";
import AESencrypt from "@/store/function/aesencript";
import { toast } from "@/compositionApi/dataApi";
import { ref } from "vue";
import BtnIconsV from "../basic/BtnIconsV.vue";
import TextFielsV from "../basic/TextFielsV.vue";

const password = ref("");
const master_password = ref("");
const encripted = ref("");
const decripted = ref("");
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.info("Скопировано в буфер обмена");
};
</script>
