<template>
  <v-card>
    <v-card-title> Таблицы с ограничением к записям </v-card-title>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="table in rights_table"
          :key="'rt_' + table.id"
        >
          <v-expansion-panel-header>
            {{ table.naimen }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            {{ table }}
            <ElementsVue :role-id="roleId" :table-id="table.id" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useAdminStore } from "@/store/modules/admin";
import { usePostgreStore } from "@/store/modules/postgre";
import { mapState } from "pinia";
import ElementsVue from "./Elements.vue";

export default defineComponent({
  components: {
    ElementsVue,
  },
  props: {
    roleId: {
      type: Number,
      required: true,
    },
  },
  setup () {
    const { r_get, r_ajax, r_update } = dataApiComposition();
    return { r_get, r_ajax, r_update };
  },
  data () {
    return {
      newTables: [],
    };
  },
  computed: {
    ...mapState(useAdminStore, ["rights_table"]),
    ...mapState(usePostgreStore, ["tableList"]),
    headerRT () {
      const header = [
        {
          text: "id",
          align: "start",
          filterable: true,
          value: "id",
        },
        {
          text: "Таблица",
          align: "start",
          filterable: true,
          value: "naimen",
        },
        {
          text: "Создан",
          align: "start",
          filterable: true,
          value: "date_add",
        },
        {
          text: "Вкл",
          align: "start",
          filterable: true,
          value: "active",
        },
        { text: "", value: "data-table-expand" },
      ];

      return header;
    },
    lastTableList (): any {
      return this.tableList.filter(
        (e) =>
          this.rights_table
            .map((p: { naimen: any }) => p.naimen)
            .indexOf(e.table) === -1
      );
    },
  },
  mounted () {
    this.getDataBaseTables().then(() => this.getRightsTable());
  },
  methods: {
    getDataBaseTables () {
      return this.r_get(
        {
          fields: [
            "tablename",
            "tableowner",
            "tablespace",
            "concat(schemaname,'.',tablename):table",
            "schemaname",
            "hasindexes",
            "hasrules",
            "hastriggers",
          ],
          from: "pg_catalog.pg_tables",
          sort: ["schemaname", "tablename"],
        },
        "tableList",
        usePostgreStore
      );
    },
    getRightsTable () {
      return this.r_get(
        { from: "rights_table", sort: ["naimen"] },
        "rights_table",
        useAdminStore
      );
    },

    changeRightTable (item: any) {
      return this.r_update({
        to: "rights_table",
        set: item,
        filter: {
          id: item.id,
        },
      });
    },
    addRightTables () {
      if (this.newTables.length === 0) {
        this.$toast({ html: "Необходимо выбрать таблицу" });
        return;
      }
      const acc = this.newTables.map((id) => {
        const tr = this.rights_table.find((e: { id: any }) => e.id === id);
        return this.r_ajax({
          sqlname: "addRoleTableAccess",
          $table: tr?.naimen,
          kod_role: this.roleId,
          kod_table: tr?.id,
        });
      });
      Promise.all(acc).then(() => {
        this.newTables = [];
      });
    },
  },
});
</script>
