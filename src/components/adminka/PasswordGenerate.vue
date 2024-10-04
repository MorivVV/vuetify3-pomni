<template>
  <v-container>
    <v-row class="ma-1">
      <v-col cols="5">
        <v-text-field
          v-model="password"
          outlined
          prepend-icon="graphic_eq"
          label="открытый пароль"
          dense
          hide-details
        />
      </v-col>
      <v-col cols="5">
        <v-text-field
          v-model="master_password"
          outlined
          prepend-icon="fingerprint"
          label="мастер-пароль"
          dense
          hide-details
        />
      </v-col>
      <v-col cols="1">
        <BtnIconsV
          :disabled="!(master_password && password)"
          color="white"
          colorbtn="red"
          icon="lock"
          title="Зашифровать"
          :action="
            () => {
              encripted = AESencrypt(password, master_password);
            }
          "
        />
      </v-col>
      <v-col cols="1">
        <BtnIconsV
          :disabled="!(master_password && password)"
          color="white"
          colorbtn="green"
          icon="lock_open"
          title="Расшифровать"
          :action="
            () => {
              decripted = AESdecrypt(password, master_password);
            }
          "
        />
      </v-col>
      <v-col cols="11" class="ma-0 text-center text-h4">
        <v-text-field
          v-model="decripted"
          outlined
          hide-details
          dense
          label="Расшифрованный результат"
        ></v-text-field>
      </v-col>
      <v-col cols="1">
        <BtnIconsV
          color="white"
          colorbtn="blue"
          icon="content_copy"
          title="Копировать в буфер обмена"
          :action="
            () => {
              copyToClipboard(decripted);
            }
          "
        />
      </v-col>
      <v-col cols="11" class="ma-0 text-center text-h4">
        <v-text-field
          v-model="encripted"
          outlined
          dense
          label="Зашифрованный результат"
        ></v-text-field>
      </v-col>
      <v-col cols="1">
        <BtnIconsV
          color="white"
          colorbtn="blue"
          icon="content_copy"
          title="Копировать в буфер обмена"
          :action="
            () => {
              copyToClipboard(encripted);
            }
          "
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

<script lang="ts">
import AESdecrypt from "@/store/function/aesdecrypt";
import AESencrypt from "@/store/function/aesencript";
import { toast } from "@/compositionApi/dataApi";
import { defineComponent, ref } from "vue";
import BtnIconsV from "../basic/BtnIconsV.vue";

export default defineComponent({
  components: { BtnIconsV },
  setup() {
    const password = ref("");
    const master_password = ref("");
    const encripted = ref("");
    const decripted = ref("");
    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      toast.info("Скопировано в буфер обмена");
    };

    return {
      password,
      master_password,
      encripted,
      decripted,
      AESdecrypt,
      AESencrypt,
      copyToClipboard,
    };
  },
});
</script>
