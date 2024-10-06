<template>
  <v-container class="home">
    <v-row class="ma-1">
      <div class="text-center text-h4 mt-2 mb-1 col s4">
        Сотрудники сопрвождения
      </div>
      <v-col cols="4">
        <v-text-field
          v-model="search"
          dense
          hide-details
          :label="'Поиск по ФИО, логину, IP'"
          outlined
          prepend-icon="search"
        />
      </v-col>
    </v-row>

    <div v-if="loading" class="center">
      <LoaderCircle />
    </div>
    <div v-else-if="users.length" class="collection with-header">
      <UserCardVue
        v-for="user in users"
        :key="'id_' + user.empid"
        :user="user"
      />
    </div>
    <div v-else class="text-h4 mt-2 mb-1 text-center">Не найдено</div>
  </v-container>
</template>

<script lang="ts">
import { mapState } from "pinia";

import LoaderCircle from "@/components/basic/LoaderCircle.vue";
import UserCardVue from "@/components/elements/UserCard.vue";
import { defineComponent } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useUserDataStore } from "@/store/modules/usersData";

export default defineComponent({
  components: {
    UserCardVue,
    LoaderCircle,
  },
  mixins: [],
  setup () {
    const { r_ajax } = dataApiComposition();
    return { r_ajax };
  },
  data () {
    return {
      search: "",
      loading: true,
    };
  },
  watch: {
    search (newVal) {
      this.getUsers(newVal);
    },
  },
  computed: {
    ...mapState(useUserDataStore, ["users"]),
  },
  mounted () {
    this.getUsers("");
  },
  methods: {
    getUsers (s) {
      this.loading = true;
      this.r_ajax(
        {
          sqlname: "getAllEmployees",
          search: "%" + s + "%",
        },
        "users",
        useUserDataStore
      ).then(() => (this.loading = false));
    },
  },
});
</script>
