<template>
  <v-container>
    <v-row class="ma-1">
      <div class="container">
        <v-expansion-panels class="pa-1">
          <ExecutorListVue
            v-for="g in executor_groups"
            :key="g.id"
            :group="g"
            @getGroups="getGroups"
          />
        </v-expansion-panels>
        <v-row align="start" justify="center" class="ma-0">
          <v-col cols="10">
            <v-text-field
              v-model="newGroup.naimen"
              outlined
              dense
              hide-details
              class="green--text"
              label="Название для новой группы"
              prepend-icon="contact_mail"
            />
          </v-col>

          <v-col align-self="center" cols="1">
            <BtnIconsVVue
              :action="addGroup"
              icon="add"
              colorbtn="blue darken-3"
              color="white"
              title="Добавить группу рассылки"
            />
          </v-col>
        </v-row>
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import BtnIconsVVue from "@/components/basic/BtnIconsV.vue";
import { defineComponent } from "vue";
import { mapState } from "pinia";
import ExecutorListVue from "./ExecutorList.vue";
import { useSeodoStore } from "@/store/modules/seodo";
import { dataApiComposition } from "@/compositionApi/dataApi";

export default defineComponent({
  components: { ExecutorListVue, BtnIconsVVue },
  setup() {
    const { r_get, r_insert, checkDataModify } = dataApiComposition();
    return { r_get, r_insert, checkDataModify };
  },
  data() {
    return {
      newGroup: { naimen: null as string | null } as ExecutorGroups,
    };
  },
  computed: {
    ...mapState(useSeodoStore, { _executor_groups: "executor_groups" }),
    executor_groups(): ExecutorGroups[] {
      return this._executor_groups;
    },
  },
  mounted() {
    this.getGroups();
    this.getSeodoEmps();
  },
  methods: {
    getGroups() {
      return this.r_get(
        {
          from: "seodo.auto_executor_groups",
        },
        "executor_groups",
        useSeodoStore
      );
    },
    getSeodoEmps() {
      return this.r_get<string>(
        {
          fields: [
            "_id",
            "_position",
            "_name:n",
            "concat(_name,' (',left(_position,position(' ' in _position)-1),')'):_name",
          ],
          from: ["seodo.employees:e"],
          sort: ["_name"],
          filter: {
            test: [
              { _unit: "=:64f812d6-5628-4e77-b77c-e258ec320f0f" },
              { _unit: "=:d62a4d16-c714-4dfb-8fa4-4d724264f7d9" },
            ],
            _status: "<:4",
          },
        },
        "employees",
        useSeodoStore
      );
    },
    addGroup() {
      if (this.newGroup.naimen) {
        this.r_insert({
          to: "seodo.auto_executor_groups",
          fields: { ...this.newGroup },
        })
          .then((r) => this.checkDataModify(r))
          .then(() => this.getGroups());
      }
    },
  },
});
</script>
