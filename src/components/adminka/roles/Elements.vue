<template>
  <v-row class="ma-0">
    <v-col cols="12">
      <v-btn @click="fullAccess"> Полный доступ </v-btn>
    </v-col>
    <v-col cols="12">
      <v-data-table
        class="elevation-1 striped orange lighten-4"
        dense
        :headers="headerElements"
        :items="accessDataTable"
        :items-per-page="10"
        :loading="loading"
        show-expand
      >
        <template #expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            {{ item.element }}
          </td>
        </template>
        <template #[`item.tablename`]="{ item }">
          <v-btn block class="text-lowercase" outlined small>
            {{ item.tablename }}
          </v-btn>
        </template>
        <template #[`item.access`]="{ item }">
          <v-simple-checkbox
            v-model="item.access"
            @click="changeRightRow(item)"
          />
        </template>
        <template #[`item.element`]="{ item }">
          <v-row>
            <v-col cols="12">
              <v-card class="overflow-auto" height="30">
                {{ item.element }}
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { DataTableHeader } from "vuetify";
import { mapState } from "pinia";
import { useAdminStore } from "@/store/modules/admin";
import { EKNOWLEGEBASE } from "@/const/schemaEnums";

export default defineComponent({
  props: {
    tableId: { type: Number, required: true },
    roleId: { type: Number, required: true },
  },
  setup () {
    const { r_get, r_insert, r_delete, r_ajax, checkDataModify } =
      dataApiComposition();
    return { r_get, r_insert, r_delete, r_ajax, checkDataModify };
  },
  data () {
    return {
      loading: true,
      rights_elements: [] as IRightElement[],
      dataTable: [] as any[],
    };
  },
  computed: {
    ...mapState(useAdminStore, ["rights_table"]),
    tableName (): EKNOWLEGEBASE {
      const name = String(
        this.rights_table.find((e: { id: number }) => e.id === this.tableId)
          ?.naimen
      );
      return name as EKNOWLEGEBASE;
    },
    accessDataTable (): any[] {
      return this.dataTable.map((e: any) => {
        const accessElement = this.rights_elements.filter(
          (r: any) => r.table_identificator === e.id
        );
        return {
          id: e.id,
          element: e,
          accessElement,
          access: accessElement.length > 0,
        };
      });
    },
    headerElements (): DataTableHeader[] {
      const header: DataTableHeader[] = [
        {
          text: "Вкл",
          align: "end",
          filterable: true,
          value: "access",
        },
        {
          text: "Идентификатор",
          align: "start",
          filterable: true,
          value: "id",
        },
        {
          text: "Элемент",
          align: "start",
          filterable: true,
          value: "element",
        },
      ];

      return header;
    },
  },
  mounted () {
    this.loading = true;
    Promise.all([this.getRightsElements(), this.getDataFromTable()]).then(
      () => {
        this.loading = false;
      }
    );
  },
  methods: {
    getDataFromTable () {
      return this.r_get({
        from: this.tableName,
        sort: ["-1"],
        limit: 100,
      }).then((r) => (this.dataTable = r));
    },
    getRightsElements () {
      return this.r_get<string>({
        from: "rights_elements",
        filter: { kod_role: this.roleId, kod_table: this.tableId },
        sort: ["-table_identificator"],
        limit: 100,
      }).then((r) => {
        this.rights_elements = r as IRightElement[];
      });
    },
    fullAccess () {
      this.loading = true;
      return this.r_ajax({
        sqlname: "addRoleTableAccess",
        $table: this.tableName,
        kod_role: this.roleId,
        kod_table: this.tableId,
      })
        .then((r) =>
          this.checkDataModify(
            r,
            "Доступ предоставлен к " + r.count + "строкам"
          )
        )
        .then(() => this.getRightsElements())
        .then(() => {
          this.loading = false;
        });
    },
    changeRightRow (item: any) {
      if (item.access) {
        this.r_insert({
          to: "rights_elements",
          fields: {
            kod_role: this.roleId,
            kod_table: this.tableId,
            table_identificator: item.id,
          },
        }).then((r) => this.checkDataModify(r));
      } else {
        this.r_delete({
          from: "rights_elements",
          filter: {
            id: item.accessElement[0].id,
          },
        }).then((r) => this.checkDataModify(r));
      }
    },
  },
});
</script>
