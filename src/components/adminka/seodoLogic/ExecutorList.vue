<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      class="green lighten-4 pa-1 pl-3"
      @click="getExecutors"
    >
      <v-container>
        <v-row>
          <v-col cols="8" class="text-h5 pa-1">
            {{ group.naimen }}
          </v-col>
        </v-row>
      </v-container>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-container>
        <v-row class="ma-1" align="center">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" @click="deleteGroup">
                <v-icon color="red"> delete </v-icon>
              </v-btn>
            </template>
            <span>Удалить группу</span>
          </v-tooltip>
          <v-col cols="5" class="pa-1">
            <v-text-field
              v-model="groupName"
              outlined
              dense
              hide-details
              label="Название группы"
            />
          </v-col>
          <v-col cols="auto" class="pa-1">
            <v-btn v-if="groupName !== group.naimen" @click="renameGroup">
              <v-icon color="blue darken-2"> save </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pa-1">
            <v-list dense class="ma-0 pa-0">
              <v-list-item class="ma-1">
                <v-col cols="8" offset-md="2" class="pa-1">
                  <v-autocomplete
                    ref="new_executor"
                    v-model="execEmp"
                    auto-select-first
                    outlined
                    dense
                    placeholder="Исполнитель"
                    label="Исполнитель/получатель"
                    hide-details
                    hide-selected
                    :items="employees"
                    item-text="_name"
                    item-value="_id"
                    @input="addNewExecutor"
                  />
                </v-col>
              </v-list-item>
              <v-list-item
                v-for="e in executors"
                :key="'exex_' + e.id + e.kod_executor"
                class="purple lighten-5"
              >
                <v-row class="ma-0 pa-0" align="center">
                  <v-col
                    v-if="employees.find((a) => a._id === e.kod_executor)"
                    cols="9"
                    class="pa-1"
                  >
                    {{ employees.find((a) => a._id === e.kod_executor)._name }}
                  </v-col>
                  <v-col v-else cols="10" class="pa-1">
                    {{ e.kod_executor }}
                  </v-col>
                  <v-col cols="2" class="pa-1">
                    <v-checkbox
                      v-model="e.main"
                      label="Отв."
                      dense
                      hide-details
                      @click="saveExecutor(e)"
                    />
                  </v-col>
                  <v-col cols="1" class="pa-1">
                    <v-btn fab x-small @click="clearExecutor(e)">
                      <v-icon color="red"> delete </v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" class="pa-0">
                    <v-divider />
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import { mapState } from "pinia";
import { useSeodoStore } from "@/store/modules/seodo";
import { dataApiComposition } from "@/compositionApi/dataApi";

export default defineComponent({
  props: {
    group: { type: Object as PropType<ExecutorGroups>, required: true },
  },
  setup() {
    const { r_get, r_insert, checkDataModify, r_update, r_delete } =
      dataApiComposition();
    return { r_get, r_insert, checkDataModify, r_update, r_delete };
  },
  data() {
    return {
      execEmp: "",
      groupName: this.group.naimen,
      mainActive: false,
    };
  },
  computed: {
    ...mapState(useSeodoStore, {
      _employees: "employees",
      _executors: "executors",
    }),
    executors(): Executor[] {
      return this._executors;
    },
    employees(): any {
      return this._employees;
    },
  },
  methods: {
    renameGroup() {
      const e = this.groupName;
      if (e !== this.group.naimen) {
        this.r_update<string>({
          to: "seodo.auto_executor_groups",
          set: {
            naimen: e,
          },
          filter: {
            id: this.group.id,
          },
        }).then((r) => {
          this.checkDataModify(r);
          if (r.count === 1) {
            this.group.naimen = e;
          }
        });
      }
    },
    deleteGroup() {
      this.r_delete({
        from: "seodo.auto_executor_groups",
        filter: {
          id: this.group.id,
        },
      }).then((r) => {
        this.checkDataModify(r);
        if (r.count === 1) {
          this.$emit("getGroups");
        } else {
          if (r.err.constraint === "auto_logic_kod_group_fkey") {
            this.$toast({
              html: "Нельзя удалить группу, которая связана с логикой",
            });
          }
          if (r.err.constraint === "auto_logic_executors_kod_group_fkey") {
            this.$toast({
              html: "До удаления группы, нужно удалить всех участников",
            });
          }
        }
      });
    },
    addNewExecutor(e: string) {
      const ref: any = this.$refs.new_executor;
      if (e) {
        this.$nextTick(() => {
          this.execEmp = "";
          ref.internalSearch = null;
        });

        this.r_insert({
          to: "seodo.auto_logic_executors",
          fields: { kod_executor: e, main: false, kod_group: this.group.id },
        })
          .then((r) => this.checkDataModify(r))
          .then(() => this.getExecutors());
      }
    },
    getExecutors() {
      const kod_group = this.group.id;
      return this.r_get<string>(
        {
          from: ["seodo.auto_logic_executors:ale", "seodo.employees:e"],
          join: ["e._id=ale.kod_executor"],
          sort: ["e._name"],
          filter: { kod_group },
        },
        "executors",
        useSeodoStore
      );
    },
    clearExecutor(ex: Executor) {
      this.r_delete({
        from: "seodo.auto_logic_executors",
        filter: { id: ex.id },
      })
        .then((r) => this.checkDataModify(r))
        .then(() => this.getExecutors());
    },
    saveExecutor(ex: Executor) {
      this.r_update<string>({
        to: "seodo.auto_logic_executors",
        set: { kod_executor: ex.kod_executor, main: ex.main },
        filter: { id: ex.id },
      })
        .then((r) => this.checkDataModify(r))
        .then(() => this.getExecutors());
    },
  },
});
</script>
