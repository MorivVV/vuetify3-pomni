<template>
  <v-container class="login-form mt-5">
    <v-card class="ma-1">
      <v-row class="bg-green white--text ma-0">
        <v-col class="text-center">
          <div v-if="isLoggedIn" class="text-h4 mt-2 mb-1">
            Недостаточно прав для доступа
          </div>
          <div v-else class="text-h4 mt-2 mb-1">Требуется авторизация</div>
        </v-col>
      </v-row>

      <v-row class="ma-1 pt-3">
        <v-col class="pa-0" cols="10" offset-md="1">
          <TextFielsV
            v-model="login"
            label="Введите логин"
            prepend-icon="mdi-account-circle"
          />
        </v-col>
      </v-row>
      <v-row class="ma-1 pt-1">
        <v-col class="pa-0" cols="10" offset-md="1">
          <TextFielsV
            id="password"
            v-model="password"
            class="validate"
            label="Введите пароль"
            name="password"
            prepend-icon="mdi-fingerprint"
            required
            type="password"
            @keypress.native.enter="authorize"
          />
        </v-col>
      </v-row>
      <v-row class="ma-1">
        <v-col class="text-center" cols="4">
          <BtnIconsVVue
            :action="authorize"
            color="white"
            colorbtn="green"
            :disabled="login === '' || password === ''"
            icon="location-enter"
            title="Войти"
          />
        </v-col>
        <v-col class="text-center" cols="4">
          <BtnIconsVVue
            :action="resetPassword"
            color="white"
            colorbtn="pink"
            icon="lock-off"
            title="Забыл пароль (разблокировака)"
          />
        </v-col>
        <v-col class="text-center" cols="4">
          <BtnIconsVVue
            :action="() => $router.push('/register')"
            color="white"
            colorbtn="blue"
            icon="account-plus"
            title="Зарегистрироваться"
          />
        </v-col>
      </v-row>

      <v-row v-if="user_access_level.length" class="ma-0">
        <v-col class="pa-0" cols="12">
          <span class="pl-2">
            Список пользователей с доступом в {{ toUrl }}
          </span>
          <v-divider />
        </v-col>

        <v-col
          v-for="user in user_access_level"
          :key="'access_' + user.kod_user + user.access_level"
          class="pa-0 pt-1 pl-1"
          cols="auto"
        >
          <v-chip
            class="pa-1"
            :color="levels.find((e) => e.id === user.access_level)?.color"
            small
          >
            <UserFio :user_id="user.kod_user" />
            <v-tooltip activator="parent" top><span>{{
              levels.find((e) => e.id === user.access_level)?.name
            }}</span></v-tooltip>
          </v-chip>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-if="reset.active" class="card">
      <v-row class="ma-1 orange center">
        <v-col class="text-center" cols="12">
          <div class="text-h4 mt-2 mb-1">Восстановление пароля</div>
          <div>
            Вы должны иметь доступ к электронной почте, через которую была
            осуществелна регистрация.<br>
            На электронную почту будет отправлен код подтверждения
          </div>
        </v-col>
      </v-row>

      <v-row class="ma-1">
        <v-col cols="7" offset-md="2">
          <TextFielsV
            v-model="reset.tabnum"
            label="Введите табельный номер"
            prepend-icon="mdi-account-outline"
          />
        </v-col>

        <v-col>
          <BtnIconsVVue
            :action="getAccount"
            color="white"
            colorbtn="blue"
            :disabled="!reset.tabnum"
            icon="cached"
            title="Проверить"
          />
        </v-col>
      </v-row>

      <v-row v-if="reset.accept" class="ma-1">
        <v-col cols="7" offset-md="2">
          <TextFielsV
            v-model="reset.email"
            disabled
            :label="'Найден пользователь ' + reset.login"
            prepend-icon="mdi-account-circle"
          />
        </v-col>

        <v-col>
          <BtnIconsVVue
            :action="sendValidate"
            color="white"
            colorbtn="blue"
            :disabled="!reset.email"
            icon="card-account-mail"
            title="Выслать код проверки"
          />
        </v-col>
      </v-row>
      <v-row v-if="reset.validate" class="ma-1">
        <v-col cols="7" offset-md="2">
          <TextFielsV
            v-model="reset.question"
            label="Введите код подтверждения"
            prepend-icon="mdi-vpn"
          />
        </v-col>

        <v-col>
          <BtnIconsVVue
            :action="getPassword"
            color="white"
            colorbtn="green"
            icon="check"
            title="Сбросить пароль"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import BtnIconsVVue from "./basic/BtnIconsV.vue";
import { useIndexStore } from "@/store";
import { useAutorizationStore } from "@/store/modules/autorization";
import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import { ICreateTableFields } from "@/types/database/service";
import { IKnowledgebaseBzUsers } from "@/types/database/schemas/knowledgebase";
import { ICheckroomEmployees } from "@/types/database/schemas/checkroom";
import projectDebug from "@/functions/projectDebug";
import { useRouter } from "vue-router";
import TextFielsV from "./basic/TextFielsV.vue";
import UserFio from "./elements/UserFio.vue";
import { useAdminStore } from "@/store/modules/admin";
interface LoginReset {
  tabnum: string;
  email: string;
  active: boolean;
  kod_user: number;
  question: string;
  validate: boolean;
  accept: boolean;
  login?: string;
}

const router = useRouter();
const { r_fetch, r_ajax, r_get, r_state } = dataApiComposition();
const login = ref("");
const password = ref("");
const reset = ref<LoginReset>({
  tabnum: "",
  email: "",
  active: false,
  kod_user: 0,
  question: "",
  validate: false,
  accept: false,
});
const { isLoggedIn, goToUrl, user_access_level, toUrl } = toRefs(
  useAutorizationStore()
);
const { levels } = toRefs(useAdminStore());
const resetPassword = () => {
  reset.value.active = true;
};
const getPassword = () => {
  reset.value.active = true;
  const num = reset.value.tabnum;
  r_fetch("resetpass", {
    id: num,
    question: reset.value.question,
  }).then((r) => {
    toast.info({ html: r });
    reset.value.active = false;
  });
};
const sendValidate = () => {
  r_fetch("api/confirmUser", {
    userID: reset.value.kod_user,
    mail: reset.value.email,
  }).then((r) => {
    if (r.length > 0) {
      const object: LoginReset = r[0];
      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          const ikey = key as keyof LoginReset;
          const element = object[ikey];
          // @ts-ignore
          reset.value[ikey] = element;
        }
      }
      reset.value.validate = true;
    }
  });
};
const getAccount = () => {
  const num = reset.value.tabnum.replace(/^0+/, "");
  r_ajax({
    sqlname: "getUserAccount",
    tabnum: num,
  }).then((r) => {
    if (r.length > 0) {
      const object: LoginReset = r[0];
      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          const ikey = key as keyof LoginReset;
          const element = object[ikey];
          // @ts-ignore
          reset.value[ikey] = element;
        }
      }
    }
    reset.value.accept = true;
  });
};
const authorize = () => {
  useIndexStore()
    .authorizate({ login: login.value, password: password.value })
    .then((a) => {
      toast.info({ html: a.status });
      r_get<
        | ICreateTableFields<keyof ICheckroomEmployees, "e">
        | ICreateTableFields<keyof IKnowledgebaseBzUsers, "u">
      >({
        fields: ["e.photo30"],
        from: ["checkroom.employees:e", "bz_users:u"],
        join: ["u.tabnum=e.id"],
        filter: {
          "u.login": `=:${login.value}`,
          "e.photo30": "<>:",
        },
      }).then((r) => {
        if (r.length > 0) {
          const photo30 = r[0].photo30;
          r_state(useAutorizationStore, "user_avatar", photo30);
          localStorage.user_avatar = photo30;
        }
      });
      router.push(goToUrl.value);
    })
    .catch((err) => {
      projectDebug(err);
      toast.error("Авторизация не удалась");
    });
};
</script>

<style scoped>
.login-form {
  max-width: 700px;
}
label {
  top: -12px;
}
input.validate {
  height: 1.2rem;
}
</style>
