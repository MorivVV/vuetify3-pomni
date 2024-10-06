<template>
  <v-card>
    <v-card-title>
      Таблицы с ограничением
      <v-row align="center" class="ma-1" justify="center">
        <v-col cols="6">
          <AutocompleteVVue
            v-model="newTables"
            hide-details=""
            hide-selected
            item-text="table"
            item-value="table"
            :items="lastTableList"
            label="Выбрать таблицы"
            multiple
            prepend-icon="add_location"
          />
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="blue"
            dark
            fab
            x-small
            @click="addRightTables"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-data-table
            class="elevation-1 striped red lighten-4"
            dense
            :headers="headerRT"
            :items="rights_table"
            :items-per-page="10"
          >
            <template #[`item.tablename`]="{ item }">
              <v-btn block class="text-lowercase" outlined small>
                {{ item.tablename }}
              </v-btn>
            </template>
            <template #[`item.active`]="{ item }">
              <v-simple-checkbox
                v-model="item.active"
                @click="changeRightTable(item)"
              />
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { DataTableHeader } from "vuetify";
import { mapState } from "pinia";
import { useAdminStore } from "@/store/modules/admin";
import { usePostgreStore } from "@/store/modules/postgre";
import AutocompleteVVue from "@/components/basic/AutocompleteV.vue";

export default defineComponent({
  components: { AutocompleteVVue },
  setup () {
    const { r_get, r_update, r_insert } = dataApiComposition();
    return { r_get, r_update, r_insert };
  },
  data () {
    return {
      newTables: [],
    };
  },
  computed: {
    ...mapState(useAdminStore, ["rights_table"]),
    ...mapState(usePostgreStore, ["tableList"]),
    headerRT (): DataTableHeader[] {
      const header: DataTableHeader[] = [
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
      ];

      return header;
    },
    lastTableList (): any[] {
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
      const acc = this.newTables.map((naimen) => {
        return this.r_insert({
          to: "rights_table",
          fields: { naimen },
        });
      });
      Promise.all(acc)
        .then(() => this.getRightsTable())
        .then(() => {
          this.newTables = [];
        });
    },
  },
});
</script>
