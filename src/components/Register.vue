<template>
  <v-container class="container login-form">
    <v-card>
      <v-row class="ma-1">
        <v-col class="text-center">
          <div class="text-h4 mt-2 mb-1">Регистрация по табельному номеру</div>
        </v-col>
      </v-row>
      <v-row align="center" class="ma-1 text-center" justify="center">
        <v-col cols="6">
          <TextFielsV
            v-model="tabnum"
            :label="'Введите свой Табельный №'"
            prepend-icon="account-circle"
          />
        </v-col>
        <v-col cols="1">
          <BtnIconsVVue
            :action="register"
            color="white"
            colorbtn="green"
            :disabled="tabnum.length < 4"
            title="Проверка регистрации"
          />
        </v-col>
      </v-row>
      <v-divider />
    </v-card>

    <v-card v-if="userAddressBook">
      <v-row v-if="userAddressBook.id" class="ma-1">
        <v-col cols="4"> Табельный номер </v-col>
        <v-col cols="8">
          {{ userAddressBook.id }}
        </v-col>
      </v-row>
      <v-row class="ma-1">
        <v-col cols="4"> Сотрудник </v-col>
        <v-col cols="8">
          {{ userAddressBook.fio }}
        </v-col>
      </v-row>
      <v-row class="ma-1">
        <div v-if="userAddressBook.emailSigma" class="col s4">Почта Alpha</div>
        <div v-else class="col s4">Логин пользователя</div>
        <v-col cols="8">
          {{ userAddressBook.emailAlpha }}
        </v-col>
      </v-row>
      <v-row v-if="userAddressBook.emailOmega" class="ma-1">
        <v-col cols="4"> Почта Omega </v-col>
        <v-col cols="8">
          {{ userAddressBook.emailOmega }}
        </v-col>
      </v-row>
      <v-row v-if="userAddressBook.emailSigma" class="ma-1">
        <v-col cols="4"> Почта Sigma </v-col>
        <v-col cols="8">
          {{ userAddressBook.emailSigma }}
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <div class="text-h5 mt-2 mb-1" v-html="userAddressBook.result" />
        </v-col>
      </v-row>

      <v-row v-if="userAddressBook.id" class="ma-1">
        <v-col cols="11">
          <TextFielsV v-model="question" label="Секретный ключ из почты" />
        </v-col>

        <v-col class="text-center" cols="1">
          <BtnIconsVVue
            :action="activate"
            color="white"
            colorbtn="blue"
            :disabled="question.length !== 32"
            icon="check"
            title="Активировать"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import BtnIconsVVue from "./basic/BtnIconsV.vue";
import { useAutorizationStore } from "@/store/modules/autorization";
import { ref, toRefs, watch } from "vue";
import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import { useRouter } from "vue-router";
import TextFielsV from "./basic/TextFielsV.vue";

const router = useRouter();
const { r_state, r_fetch } = dataApiComposition();
const tabnum = ref("");
const question = ref("");
const { userAddressBook } = toRefs(useAutorizationStore());
const register = () => {
  r_fetch(
    "register",
    { tabnum: tabnum.value },
    "userInfo",
    useAutorizationStore
  );
};
const activate = () => {
  const id = userAddressBook.value.id;
  const q = question.value.trim();
  r_fetch(
    "activate",
    { id, question: q },
    "userInfo",
    useAutorizationStore
  );
};
watch(userAddressBook, (newVal: string) => {
  if (newVal === "Пользователь успешно активирован") {
    toast.info(newVal);
    toast.info("Логин и пароль отправлены на почту");
    router.push("/login");
    question.value = "";
    r_state(useAutorizationStore, "userInfo", "");
  }
});
</script>

<style scoped>
.login-form {
  max-width: 700px;
}
label {
  top: -7px;
}
</style>
