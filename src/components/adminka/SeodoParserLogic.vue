<template>
  <v-container>
    <div class="text-h4 mt-2 mb-1">Логика СЭОДО</div>

    <v-row align="center" class="ma-1 mb-2">
      <v-col cols="2">
        <v-autocomplete
          v-model="search.task_owner"
          outlined
          dense
          hide-details
          clearable
          label="Сотрудник"
          :items="[{ _name: 'Все', _id: null }].concat(employeesSeo)"
          item-text="_name"
          item-value="_id"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="search.task_action"
          outlined
          dense
          hide-details
          clearable
          label="Действие"
          :items="[{ _name: 'Все', id: null }].concat(actions)"
          item-text="_name"
          item-value="id"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="search.active"
          outlined
          dense
          hide-details
          clearable
          :items="[
            { text: 'Все', value: null },
            { text: 'Нет', value: false },
            { text: 'Да', value: true },
          ]"
          item-text="text"
          item-value="value"
          :label="`Активные`"
        />
      </v-col>
      <v-col cols="2">
        <v-autocomplete
          v-model="search.kod_executor"
          outlined
          dense
          hide-details
          clearable
          label="Исполнитель"
          :items="[{ _name: 'Все', _id: null }].concat(executorsEmp)"
          item-text="_name"
          item-value="_id"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="search.kod_group"
          outlined
          dense
          hide-details
          clearable
          label="Группа рассылки"
          :items="[{ naimen: 'Все', id: null }].concat(executor_groups)"
          item-text="naimen"
          item-value="id"
        />
      </v-col>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-col cols="1">
            <v-switch
              v-if="!editLevel()"
              inset
              color="warning"
              v-bind="attrs"
              :value="auto_on"
              label="Рубильник"
              v-on="on"
              @click="setRun"
            />
          </v-col>
        </template>
        <span>Последнее изменение</span>
      </v-tooltip>
    </v-row>
    <v-expansion-panels class="ma-1 ml-3 mr-3">
      <v-expansion-panel>
        <v-expansion-panel-header color="teal lighten-5">
          Расширенные сервисы: Выбор ассистентов, замена исполнителей,
          отображение
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row class="ma-0 mt-2">
            <v-col cols="12" class="ma-0 pa-0">
              <v-select
                v-if="!editLevel()"
                outlined
                dense
                hide-details
                multiple
                label="Ответственность за"
                :items="employees"
                item-value="_id"
                item-text="n"
                :value="assistList"
                @input="editAsist"
              />
            </v-col>
          </v-row>
          <v-row class="ma-0 mt-2">
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col cols="12" class="ma-0 pa-0">
              <span>Полная замена исполнителя во всех правилах</span>
            </v-col>
            <v-col cols="5" class="ma-0 pa-0">
              <v-autocomplete
                v-model="oldExecutor"
                auto-select-first
                outlined
                dense
                placeholder="Исполнитель"
                label="Текущий исполнитель"
                hide-details
                hide-selected
                :items="executorsEmp"
                item-text="_name"
                item-value="_id"
              />
            </v-col>
            <v-col cols="5" class="ml-1 pa-0">
              <v-autocomplete
                v-model="newExecutor"
                auto-select-first
                outlined
                dense
                placeholder="Исполнитель"
                label="Новый исполнитель"
                hide-details
                hide-selected
                :items="employees"
                item-text="_name"
                item-value="_id"
              />
            </v-col>
            <v-col cols="auto" class="ml-1 pa-0">
              <BtnIconsVVue
                :action="replaceExecutor"
                title="Заменить"
                colorbtn="black"
                color="orange"
                icon="refresh"
              />
            </v-col>
          </v-row>
          <v-row class="ma-1">
            <v-col cols="12" class="ma-0 pa-0">
              <span>Отображение компонентов:</span>
            </v-col>

            <v-col
              v-for="(v, i) in view"
              :key="'view_' + i"
              cols="2"
              class="ma-0 pa-0"
            >
              <v-checkbox
                v-model="v.value"
                dense
                hide-details
                :label="v.name"
              />
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row class="ma-1">
      <v-col cols="11">
        <div class="text-center">
          <v-pagination v-model="page" :length="paginationList" circle />
        </div>
      </v-col>
      <v-col cols="1">
        <v-text-field
          v-model="limit"
          outlined
          dense
          hide-details
          label="На странице"
          type="number"
        />
      </v-col>
    </v-row>
    <v-row v-if="loading" class="ma-1">
      <OneLogicVue
        v-for="l in logics"
        :key="'logic_' + l.id"
        :logic="l"
        :view="view"
        @getLogic="getLogic"
        @updateExecutor="getExecutors"
      />
    </v-row>
    <v-row v-else class="ma-4" align="center" justify="center">
      <v-progress-circular :size="70" :width="7" color="purple" indeterminate />
    </v-row>

    <v-row class="mb-2 mt-2">
      <v-col cols="12" class="text-center"> <v-divider />Новое правило </v-col>
    </v-row>

    <OneLogicVue
      v-if="employees.length"
      :logic="newLogic"
      :view="view"
      @getLogic="getLogic"
      @updateExecutor="getExecutors"
    />
  </v-container>
</template>

<script lang="ts">
import { currentTimestamp } from "@/const/globalRestAPI";
import { defineComponent, toRefs } from "vue";
import BtnIconsVVue from "../basic/BtnIconsV.vue";
import OneLogicVue from "./seodoLogic/OneLogic.vue";
import { useSeodoStore } from "@/store/modules/seodo";
import { useAutorizationStore } from "@/store/modules/autorization";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { ICreateTableFields } from "@/types/database/service";
import {
  ISeodoAssistents,
  ISeodoAutoLogicSettings,
  ISeodoEmployees,
} from "@/types/database/schemas/seodo";
import { IKnowledgebaseBzUsers } from "@/types/database/schemas/knowledgebase";
import { ICheckroomEmployees } from "@/types/database/schemas/checkroom";
export default defineComponent({
  components: {
    OneLogicVue,
    BtnIconsVVue,
  },
  setup() {
    const { editLevel } = routeAccessLevelCalculate();
    const { r_get, r_state, r_update, r_delete, r_insert } =
      dataApiComposition();
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
    const { userId, userToken } = toRefs(useAutorizationStore());
    return {
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
      editLevel,
      r_get,
      r_state,
      r_update,
      r_delete,
      r_insert,
      userId,
      userToken,
    };
  },
  data() {
    return {
      page: 1 as number,
      limit: 10 as number,
      paginationList: 0 as number,
      loading: false,
      view: {
        sputnik: { name: "Слова спутники", value: true },
        timeadd: { name: "Инфо о добавлении", value: true },
        timeedit: { name: "Изменения", value: true },
        delete: { name: "Кнопка удаления", value: false },
      },
      assistList: [] as string[],
      auto_on: false,
      timeLoad: 0,
      newExecutor: "",
      oldExecutor: "",
      time_change: "",
      activeExecutors: [] as string[],
      search: {
        task_action: null,
        task_owner: null,
        kod_executor: null,
        kod_group: null,
        active: null,
      } as LogicSearch,
      newLogic: {
        id: 0,
        task_owner: "",
        executors: [] as string[],
        task_action: [] as string[],
        stop_word: [] as string[],
        doc_type: [] as string[],
        satellite_word: [] as string[],
        min_satellite: 0,
        key_word: [] as string[],
        active: false,
      },
    };
  },
  computed: {
    executorsEmp(): any {
      return this.employees.filter(
        (e: any) => this.activeExecutors.indexOf(e._id) > -1
      );
    },
  },
  watch: {
    page() {
      this.loading = false;
      this.getLogic();
    },
    limit() {
      this.loading = false;
      this.getLogic();
    },
    search: {
      handler() {
        clearTimeout(this.timeLoad);
        this.page = 1;
        this.loading = false;
        this.timeLoad = setTimeout(() => {
          this.getLogic();
        }, 500);
      },
      deep: true,
    },
  },
  mounted() {
    this.getGroups();
    this.r_get(
      {
        from: "seodo.assistents",
        filter: {
          kod_user: +this.userId,
        },
      },
      "assist",
      useSeodoStore
    ).then((r) => {
      if (r.length > 0) {
        this.assistList = r.map((e: { emp_seodo: any }) => e.emp_seodo);
      }
    });
    this.getActiveExecutors();
    this.getKinds();
    this.getExecutors();
    this.r_get<
      | ICreateTableFields<keyof ISeodoAssistents, "sa">
      | ICreateTableFields<keyof ISeodoEmployees, "e">
      | ICreateTableFields<keyof IKnowledgebaseBzUsers, "u">
      | ICreateTableFields<keyof ICheckroomEmployees, "ce">
    >({
      fields: ["e._id", "u.id", "u.family", "u.first_name", "sa.emp_seodo"],
      from: [
        "checkroom.employees:ce",
        "bz_users:u",
        "seodo.employees:e",
        "seodo.assistents:sa",
      ],
      join: [
        "ce.id=u.tabnum",
        "u.first_name=e._first_name",
        "u.family=e._last_name",
        "ce.emppatronymic=e._middle_name",
        "u.id=(+)sa.kod_user",
      ],
      filter: {
        "u.id": +this.userId,
        "e._status": "<:4",
      },
    }).then((r) => {
      if (r.length > 0) {
        let acc = r.map((e: { [x: string]: string }) => e.emp_seodo);
        acc = acc.concat(r.map((e: { [x: string]: string }) => e._id));
        this.r_state(useSeodoStore, "seodoId", acc);
      }
    });

    this.getSeodoKeyWords()
      .then(() => this.getSeodoEmps())
      .then(() => this.getLogic());
  },
  methods: {
    replaceExecutor() {
      if (this.newExecutor && this.oldExecutor) {
        this.r_update({
          to: "seodo.auto_logic_executors",
          set: { kod_executor: this.newExecutor },
          filter: { kod_executor: `=:${this.oldExecutor}` },
        }).then((r) => {
          if (r.count > 0) {
            this.newExecutor = this.oldExecutor = "";
            this.getExecutors();
            this.$toast({ html: `Произведена замена в ${r.count} правилах` });
          }
        });
      }
    },
    async editAsist(e: string[]) {
      const cur: string[] = this.assistList;

      await cur
        .filter((c: string) => !~e.indexOf(c))
        .map((r) =>
          this.r_delete({
            from: "seodo.assistents",
            filter: {
              emp_seodo: `=:${r}`,
              kod_user: +this.userId,
            },
          })
        );

      await e
        .filter((c: string) => !~cur.indexOf(c))
        .map((r: string) =>
          this.r_insert({
            to: "seodo.assistents",
            fields: {
              emp_seodo: r,
              kod_user: this.userId,
              user_add: this.userId,
            },
          })
        );
      this.assistList = e;
    },
    setRun() {
      this.$toast({ html: "ХыДыЩщщ..." });
      this.r_update<keyof ISeodoAutoLogicSettings>({
        to: "seodo.auto_logic_settings",
        set: {
          setting_active: !this.auto_on,
          date_mod: currentTimestamp,
        },
        filter: {
          setting_key: "=:run_script",
        },
      }).then((r) => {
        if (r.count == 1) {
          this.auto_on = !this.auto_on;
          let action = "<span class='red--text' >Выключенно</span>";
          if (this.auto_on) {
            action = "<span class='green--text' >Включенно</span>";
          }
          this.$toast({ html: action });
        } else {
          this.$toast({ html: "Что-то пошло не так" });
        }
      });
    },
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
      return this.r_get<"test" | keyof ISeodoEmployees>(
        {
          fields: [
            "_id",
            "_position",
            "_name:n",
            "concat(_name,' (',left(_position,position(' ' in _position)-1),')'):_name",
          ],
          from: "seodo.employees",
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
    getExecutors() {
      return this.r_get(
        {
          from: "seodo.auto_logic_executors",
          sort: ["-main", "id"],
        },
        "executors",
        useSeodoStore
      );
    },
    getKinds() {
      return this.r_get(
        {
          fields: ["_id:id", "_name:name"],
          from: "seodo.kind",
          sort: ["_name"],
        },
        "kinds",
        useSeodoStore
      );
    },
    getActiveExecutors() {
      return this.r_get({
        fields: ["DISTINCT", "kod_executor"],
        from: "seodo.auto_logic_executors",
      }).then((r) => {
        if (r.length) {
          this.activeExecutors = r.map((e: any) => e.kod_executor);
        }
      });
    },
    getSeodoKeyWords() {
      let temp_word: string[] = [];
      return this.r_get({
        fields: ["DISTINCT", "key_word[ind]:key_word"],
        from: [
          {
            fields: ["generate_subscripts(key_word,1):ind", "key_word"],
            from: "seodo.auto_logic",
          },
        ],
      })
        .then((r) => {
          temp_word = temp_word.concat(r);
          return this.r_get({
            fields: ["DISTINCT", "satellite_word[ind]:key_word"],
            from: [
              {
                fields: [
                  "generate_subscripts(satellite_word,1):ind",
                  "satellite_word",
                ],
                from: "seodo.auto_logic",
              },
            ],
          });
        })
        .then((r) => {
          temp_word = temp_word.concat(r);
          return this.r_get({
            fields: ["DISTINCT", "stop_word[ind]:key_word"],
            from: [
              {
                fields: ["generate_subscripts(stop_word,1):ind", "stop_word"],
                from: "seodo.auto_logic",
              },
            ],
          });
        })
        .then((r) => {
          temp_word = temp_word.concat(r);
          this.r_state(useSeodoStore, "key_words", temp_word);
        });
    },
    getLogicCount() {
      const filter: any = {};
      const object: LogicSearch = this.search;
      for (const keyt in object) {
        const key: keyof LogicSearch = keyt as keyof LogicSearch;
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          const element = object[key];
          if (key && element !== null) {
            if (key === "kod_executor") {
              filter["id"] = {
                fields: ["kod_logic"],
                from: "seodo.auto_logic_executors:ale",
                filter: {
                  kod_executor: element,
                },
              };
            } else {
              filter[key] = element;
            }
          }
        }
      }
      this.r_get({
        from: "seodo.auto_logic",
        fields: ["count(1):cnt"],
        filter,
      }).then((r) => {
        this.paginationList = Math.ceil(r[0].cnt / this.limit);
      });
    },
    getLogic() {
      this.getLogicCount();
      const filter: any = {};
      const object: LogicSearch = this.search;
      for (const keyt in object) {
        const key: keyof LogicSearch = keyt as keyof LogicSearch;
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          const element = object[key];
          if (key && element !== null) {
            if (key === "kod_executor") {
              filter["id"] = {
                fields: ["kod_logic"],
                from: "seodo.auto_logic_executors:ale",
                filter: {
                  kod_executor: element,
                },
              };
            } else {
              filter[key] = element;
            }
          }
        }
      }
      this.r_get(
        {
          fields: [
            "id",
            "key_word",
            "satellite_word",
            "min_satellite",
            "active",
            "stop_word",
            "task_owner",
            "executors",
            "task_action",
            "doc_type",
            "date_add",
            "kod_user",
            "kod_group",
            "date_modify",
            "kod_user_modify",
          ],
          from: "seodo.auto_logic",
          filter,
          sort: ["id"],
          limit: this.limit,
          page: this.page,
        },
        "logics",
        useSeodoStore
      ).then(() => {
        this.loading = true;
      });
      this.r_get(
        {
          from: "seodo.auto_logic_actions",
          sort: ["_name"],
        },
        "actions",
        useSeodoStore
      );
      this.r_get({
        from: "seodo.auto_logic_settings",
      }).then((settings) => {
        for (const setting of settings) {
          if (setting.setting_key === "run_script") {
            this.auto_on = setting.setting_active;
            this.time_change = this.$moment(setting.date_mod).format(
              "HH:mm:ss DD.MM.YY"
            );
          }
        }
      });
    },
  },
});
</script>

<style scoped>
.row >>> nav i {
  height: 34px;
}
.row >>> nav {
  background-color: transparent;
  height: 48px;
  line-height: 32px;
}
</style>
