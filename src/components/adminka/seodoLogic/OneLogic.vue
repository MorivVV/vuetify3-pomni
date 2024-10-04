<template>
  <v-card
    class="red lighten-5"
    :class="{ green: logic.id === 0, teal: logic.active }"
  >
    <v-row class="ma-0">
      <v-col cols="3">
        <v-row class="ma-0">
          <v-col cols="12" class="mb-1 pa-0">
            <v-select
              v-model="logic.task_owner"
              dense
              hide-details
              outlined
              small-chips
              label="Сотрудник"
              :items="employeesSeo"
              item-text="_name"
              item-value="_id"
            />
          </v-col>
          <v-col cols="12" class="mb-1 pa-0">
            <v-select
              v-model="logic.task_action"
              dense
              hide-details
              outlined
              small-chips
              label="Действие"
              :items="actions"
              item-text="_name"
              item-value="id"
            />
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-select
              v-model="logic.doc_type"
              dense
              small-chips
              hide-details
              outlined
              multiple
              label="Тип документа"
              :items="kinds"
              item-text="name"
              item-value="id"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="5">
        <v-row class="ma-0">
          <v-col cols="12" class="pa-0 mb-1">
            <v-autocomplete
              v-model="logic.key_word"
              auto-select-first
              chips
              background-color="green accent-2"
              outlined
              dense
              small-chips
              placeholder="Ключевые слова"
              label="Все ключевые фразы должны входить в описание"
              hide-details
              hide-selected
              :items="key_words"
              item-text="key_word"
              item-value="key_word"
              clearable
              deletable-chips
              multiple
              @update:search-input="newWordAdd"
            />
          </v-col>
        </v-row>
        <v-row class="ma-0">
          <v-col cols="12" class="mb-1 pa-0">
            <v-autocomplete
              v-model="logic.stop_word"
              auto-select-first
              chips
              background-color="red accent-1"
              outlined
              dense
              :search-input="newWord"
              small-chips
              placeholder="Стоп слова"
              label="Останавливаем обработку при нахождении любого слова в описании"
              hide-details
              hide-selected
              :items="key_words"
              item-text="key_word"
              item-value="key_word"
              clearable
              deletable-chips
              multiple
              @update:search-input="newWordAdd"
            />
          </v-col>
        </v-row>
        <v-row v-if="view.sputnik.value" class="ma-0">
          <v-col cols="8" class="pa-0 mt-1">
            <v-autocomplete
              v-model="logic.satellite_word"
              auto-select-first
              chips
              background-color="blue lighten-3"
              outlined
              dense
              :search-input="newWord"
              small-chips
              placeholder="Cлова спутники"
              label="Частичное включение любого слова в описании"
              hide-details
              hide-selected
              :items="key_words"
              item-text="key_word"
              item-value="key_word"
              clearable
              deletable-chips
              multiple
              @update:search-input="newWordAdd"
            />
          </v-col>
          <v-col cols="4" class="pa-0 mt-1">
            <v-text-field
              v-model="logic.min_satellite"
              dense
              outlined
              type="number"
              hide-details
              title="Указываем сколько минимум слов должно быть найдено"
              label="Совпадения слов спутников"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <v-row class="ma-0">
          <v-col cols="12" class="pa-0 mb-1">
            <v-tooltip
              :value="groupExecutor.length > 0"
              bottom
              max-width="400"
              :disabled="groupExecutor.length === 0"
            >
              <template #activator="{ on, attrs }">
                <v-col cols="12" class="mb-1" v-bind="attrs" v-on="on">
                  <v-select
                    v-model="logic.kod_group"
                    dense
                    hide-details
                    outlined
                    small-chips
                    clearable
                    label="Группа рассылки"
                    :items="executor_groups"
                    item-text="naimen"
                    item-value="id"
                    @focus="getExecutors"
                  />
                </v-col>
              </template>
              <span>{{ groupExecutor.map((e) => e._name).join(", ") }}</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row class="ma-0">
          <v-col cols="12" class="pa-0 mb-1">
            <v-list dense class="ma-0 pa-0">
              <v-list-item>
                <v-col cols="9">
                  <v-autocomplete
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
                  />
                </v-col>
                <v-col cols="2">
                  Отв.
                  <v-checkbox
                    v-model="mainActive"
                    dense
                    hide-details
                    title="Ответственный"
                  />
                </v-col>
                <v-col cols="1">
                  <v-btn
                    fab
                    x-small
                    title="Добавить"
                    @click="pushExecutor(execEmp, mainActive)"
                  >
                    <v-icon color="blue"> add </v-icon>
                  </v-btn>
                </v-col>
              </v-list-item>
              <v-list-item
                v-for="e in localExecutor"
                :key="'exex_' + e.id + e.kod_executor"
                :class="colorize(e)"
                class="pa-0 mb-0"
              >
                <v-row class="ma-0 pa-0" align="center">
                  <v-col
                    v-if="employees.find((a) => a._id === e.kod_executor)"
                    class="pa-0"
                    cols="10"
                  >
                    {{ employees.find((a) => a._id === e.kod_executor)._name }}
                  </v-col>
                  <v-col v-else cols="10" class="ma-0 pa-0">
                    {{ e.kod_executor }}
                  </v-col>
                  <v-col cols="1" class="ma-0 pa-0">
                    <v-checkbox
                      v-model="e.main"
                      title="Ответственный"
                      dense
                      hide-details
                    />
                  </v-col>
                  <v-col cols="1" class="ma-0 pa-0">
                    <v-btn fab x-small @click="clearExecutor(e)">
                      <v-icon color="red"> delete </v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" class="ma-0 pa-0">
                    <v-divider />
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="1">
        <v-row class="ma-1" justify="end">
          <v-col cols="auto" class="text-h5 ma-0 pa-0"> #{{ logic.id }} </v-col>
          <v-col cols="auto" class="ma-0 pa-0">
            <v-checkbox
              v-model="logic.active"
              hide-details
              color="green darken-2"
              class="ma-0 pa-0"
              title="Включить/выключить правило"
            />
          </v-col>
        </v-row>

        <v-row
          v-if="logic.kod_user && view.timeadd.value"
          class="ma-0 text-caption"
        >
          <v-col cols="12" class="ma-0 pa-0">
            {{ $moment(logic.date_add).format("доб. DD/MM/YY HH:mm") }}
          </v-col>
          <v-col cols="12" class="ma-0 pa-0">
            <UserFioVue :user_id="logic.kod_user" />
          </v-col>
        </v-row>
        <v-row class="ma-0">
          <v-col cols="12" class="ma-0 pa-0">
            <BtnIconsVVue
              v-if="logic.id > 0 && view.delete.value"
              :disabled="
                !editLevel() &&
                seodoId.filter((e) => ~e.indexOf(logic.task_owner)).length === 0
              "
              :action="delData"
              icon="delete"
              title="Удалить"
              color="red"
            />
            <BtnIconsVVue
              :disabled="
                logic.id === 0 &&
                !editLevel() &&
                seodoId.filter((e) => ~e.indexOf(logic.task_owner)).length === 0
              "
              :action="saveData"
              icon="save"
              title="Сохранить"
              color="blue"
            />
            <BtnIconsVVue
              v-if="logic.id > 0"
              :action="getHistory"
              icon="history"
              title="История"
              color="grey"
            />
          </v-col>
        </v-row>
        <v-row
          v-if="logic.kod_user_modify && view.timeedit.value"
          class="ma-0 mt-2 text-caption"
        >
          <v-col cols="12" class="ma-0 pa-0">
            {{ $moment(logic.date_modify).format("изм. DD/MM/YY HH:mm") }}
          </v-col>
          <v-col
            v-if="logic.kod_user_modify !== logic.kod_user"
            cols="12"
            class="ma-0 pa-0"
          >
            <UserFioVue :user_id="logic.kod_user_modify" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <TableDataVue :data="history" />
  </v-card>
</template>

<script lang="ts">
import TableDataVue from "@/components/basic/TableData.vue";
import { PropType, computed, defineComponent, toRefs } from "vue";
import UserFioVue from "@/components/elements/UserFio.vue";
import BtnIconsVVue from "@/components/basic/BtnIconsV.vue";
import { useSeodoStore } from "@/store/modules/seodo";
import { dataApiComposition } from "@/compositionApi/dataApi";
import {
  ISeodoAutoLogicExecutors,
  ISeodoAutoLogicLogs,
  ISeodoEmployees,
} from "@/types/database/schemas/seodo";
import { ICreateTableFields } from "@/types/database/service";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";

export default defineComponent({
  components: {
    UserFioVue,
    BtnIconsVVue,
    TableDataVue,
  },
  props: {
    logic: { type: Object as PropType<SeodoLogic>, required: true },
    view: { type: Object, required: true },
  },
  setup(props) {
    const { r_get, r_insert, r_delete, r_update, r_ajax } =
      dataApiComposition();
    const { editLevel } = routeAccessLevelCalculate();
    const {
      logics,
      employees,
      actions,
      executor_groups,
      assist,
      kinds,
      executors: ex,
      key_words,
      autoKeyWords,
      employeesSeo,
      seodoId,
    } = toRefs(useSeodoStore());
    const executors = computed(() => {
      return ex.value.filter((e) => e.kod_logic == props.logic.id);
    });
    return {
      editLevel,
      r_insert,
      r_get,
      r_delete,
      r_update,
      r_ajax,
      kinds,
      executors,
      key_words,
      logics,
      employees,
      actions,
      executor_groups,
      assist,
      autoKeyWords,
      employeesSeo,
      seodoId,
    };
  },
  data() {
    return {
      localExecutor: [] as Executor[],
      groupExecutor: [] as Executor[],
      mainActive: false,
      execEmp: "",
      timeLoad: 0,
      newWord: "мин",
      history: [] as { date_add: string }[],
    };
  },
  watch: {
    executors(newVal) {
      this.localExecutor = [...newVal];
    },
  },
  mounted() {
    this.localExecutor = [...this.executors.map((e) => ({ ...e, old: true }))];
  },
  methods: {
    colorize(e: Executor) {
      let color = "green lighten-4";
      if (e.id > 0) {
        color = "grey lighten-3";
        if (e.date_add === "") {
          color = "red lighten-4";
        }
      }
      return color;
    },
    newWordAdd(e: string) {
      if (e) {
        clearTimeout(this.timeLoad);
        this.timeLoad = setTimeout(() => {
          this.key_words.push({ key_word: e });
        }, 1000);
      }
    },
    newExecutor(e: string) {
      this.logic.executors.push(e);
    },
    addNewExecutor(e: string, m: boolean, logicId: number) {
      this.$projectDebug(e);
      return this.r_insert({
        to: "seodo.auto_logic_executors",
        fields: { kod_executor: e, main: m, kod_logic: logicId },
      });
    },
    pushExecutor(e: string, m: boolean) {
      this.$projectDebug(e, m);
      this.localExecutor.push({
        id: 0,
        date_add: "" + Date.now(),
        kod_logic: this.logic.id,
        main: m,
        kod_executor: e,
      });
    },
    clearExecutor(ex: Executor) {
      if (ex.date_add === "") {
        ex.date_add = "" + Date.now();
      } else {
        ex.date_add = "";
      }

      this.localExecutor = this.localExecutor.filter(
        (e) => !(e.date_add === "" && e.id === 0)
      );
    },
    getHistory() {
      const id = this.logic.id;
      this.r_get<keyof ISeodoAutoLogicLogs>({
        fields: [
          "kod_task",
          "field",
          "text",
          "span",
          "match",
          "prioritet",
          "date_add",
        ],
        filter: { kod_logic: id },
        from: "seodo.auto_logic_logs",
        sort: ["-date_add"],
        limit: 500,
      }).then((r) => {
        if (r.length === 0) {
          this.$toast({ html: "Данные не найдены" });
        } else {
          this.history = r.map((e: { date_add: any }) => ({
            ...e,
            date_add: this.$moment(e.date_add).format("YYYY-MM-DD HH:mm:ss"),
          }));
        }
      });
    },
    delData() {
      const id = this.logic.id;
      if (!confirm("Подтвердите удаление правила #" + id)) return;
      this.r_delete({
        filter: { id },
        from: "seodo.auto_logic",
      }).then((r) => {
        if (r.count === 1) {
          this.$toast({ html: "Удалено" });
          this.$emit("getLogic");
        }
        this.$projectDebug(r);
      });
    },
    getExecutors() {
      const kod_group = this.logic.kod_group;
      if (!kod_group) {
        return false;
      }
      return this.r_get<
        | "kod_group"
        | ICreateTableFields<keyof ISeodoAutoLogicExecutors, "ale">
        | ICreateTableFields<keyof ISeodoEmployees, "e">
      >({
        from: ["seodo.auto_logic_executors:ale", "seodo.employees:e"],
        join: ["e._id=ale.kod_executor"],
        sort: ["e._name"],
        filter: { kod_group },
      }).then((r) => {
        if (r.length > 0) {
          this.groupExecutor = r;
        }
      });
    },
    async saveData() {
      let sqlname;
      let kod_logic;
      if (this.logic.id) {
        kod_logic = this.logic.id;
        sqlname = "editSeodoLogic";
      } else {
        sqlname = "addSeodoLogic";
      }

      await this.r_ajax({
        sqlname,
        task_owner: this.logic.task_owner,
        active: this.logic.active,
        executors: this.logic.executors,
        task_action: this.logic.task_action,
        kod_group: this.logic.kod_group,
        stop_word: this.logic.stop_word.map((w) => w.trim()),
        doc_type: this.logic.doc_type.map((w) => w.trim()),
        satellite_word: this.logic.satellite_word.map((w) => w.trim()),
        min_satellite: this.logic.min_satellite,
        key_word: this.logic.key_word.map((w) => w.trim()),
        kod_logic,
      }).then(async (r) => {
        if (r.count === 1) {
          let logicID = this.logic.id;
          if ("rows" in r) {
            logicID = r.rows[0].id;
          }
          for (const ex of this.localExecutor) {
            if (ex.id === 0) {
              await this.addNewExecutor(ex.kod_executor, ex.main, logicID);
            } else if (ex.date_add === "") {
              await this.r_delete({
                from: "seodo.auto_logic_executors",
                filter: { id: ex.id },
              });
            } else {
              await this.r_update<keyof ISeodoAutoLogicExecutors>({
                to: "seodo.auto_logic_executors",
                set: { kod_executor: ex.kod_executor, main: ex.main },
                filter: { id: ex.id },
              });
            }
          }
          this.$emit("updateExecutor");
          this.$toast({ html: "Сохранено" });
          this.$emit("getLogic");
        }
      });
    },
  },
});
</script>

<style scoped>
.col .row {
  margin-left: 0;
  margin-right: 0;
}
.row {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0;
}

.action-card {
  position: absolute;
  right: 0px;
}
.v-card >>> .btn-floating {
  border-radius: 15%;
  margin: 1px;
}
div >>> .v-autocomplete:not(.v-input--is-focused).v-select--chips input {
  max-height: 24px;
}
div >>> .v-list--dense .v-list-item {
  min-height: 34px;
}
</style>
