<template>
  <v-container class="ma-0 pa-0 amber lighten-5" fluid>
    <v-row class="ma-0">
      <v-hover v-slot="{ hover }" close-delay="100" open-delay="100">
        <v-col class="overflow-auto" cols="12">
          <v-row class="ma-0 pa-0" justify="end">
            <v-col class="text-right" cols="1" offset="11">
              <v-tooltip v-if="hover" bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    absolute
                    color="green"
                    dark
                    fab
                    x-small
                    v-on="on"
                    @click="activeEdit"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                </template>
                <span class="text-caption">
                  <div>Версия №{{ dataContent.version }}</div>
                  <div v-if="dataContent.date_modify">
                    {{
                      $moment(dataContent.date_modify).format(
                        " изм. DD.MM.YYYY HH:mm:ss"
                      )
                    }}
                  </div>
                  <div v-if="dataContent.kod_user_modify">
                    <UserFioVue :user_id="dataContent.kod_user_modify" />
                  </div>
                  <span>
                    {{
                      $moment(dataContent.date_add).format(
                        " доб. DD.MM.YYYY HH:mm:ss"
                      )
                    }}
                  </span>
                  <div>
                    Автор:
                    <UserFioVue :user_id="dataContent.kod_user" />
                  </div>
                </span>
              </v-tooltip>
            </v-col>
          </v-row>

          <div class="content" v-html="content" />
        </v-col>
      </v-hover>

      <v-dialog
        v-model="dialog"
        max-width="1200"
        transition="dialog-top-transition"
      >
        <v-card>
          <v-toolbar color="green" dark dense>
            Редактирование параграфа
          </v-toolbar>
          <v-card-text class="pa-2 text-center">
            <v-row class="ma-0">
              <v-col cols="12">
                <TextTinyMCEVue
                  v-if="editor"
                  v-model="content_text"
                  class="over-y"
                  label="Содержание записи"
                />
                <v-progress-circular v-else color="primary" indeterminate />
              </v-col>
            </v-row>
            <v-row
              v-if="content_versions.length > 0"
              align="center"
              class="ma-0"
            >
              <v-col cols="12">
                <v-tabs v-model="tab">
                  <v-tabs-slider color="blue" />

                  <v-tab
                    v-for="item in content_versions"
                    :key="'tab_' + item.id"
                  >
                    Версия {{ item.version }}
                  </v-tab>
                </v-tabs>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions
            v-if="content_versions.length > 0"
            class="justify-end"
          >
            <v-row class="ma-1">
              <v-col class="text-caption" cols="auto">
                Автор:
                <UserFioVue :user_id="dataContent.kod_user" />
              </v-col>
              <v-col class="text-caption" cols="auto">
                {{
                  $moment(dataContent.date_add).format(
                    " доб. DD.MM.YYYY HH:mm:ss"
                  )
                }}
              </v-col>
              <v-col
                v-if="dataContent.date_modify"
                class="text-caption"
                cols="auto"
              >
                {{
                  $moment(dataContent.date_modify).format(
                    " изм. DD.MM.YYYY HH:mm:ss"
                  )
                }}
              </v-col>
              <v-col
                v-if="dataContent.kod_user_modify"
                class="text-caption"
                cols="auto"
              >
                <UserFioVue :user_id="dataContent.kod_user_modify" />
              </v-col>
            </v-row>
            <v-row class="ma-1">
              <v-col cols="auto">
                <v-btn
                  color="red"
                  :disabled="!moderatorLevel()"
                  @click="deleteContent"
                >
                  Удалить все
                </v-btn>
              </v-col>

              <v-col cols="2">
                <v-text-field
                  v-model="orderContent"
                  dense
                  hide-details
                  label="Позиция среди блоков"
                  outlined
                  title="Позиция среди блоков"
                  type="number"
                />
              </v-col>
              <v-col cols="auto">
                <v-btn
                  color="red lighten-2"
                  :disabled="
                    content_versions[tab].version === dataContent.version
                  "
                  @click="deleteVersion"
                >
                  Удалить вер.{{ content_versions[tab].version }}
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  color="green lighten-2"
                  :disabled="
                    content_versions[tab].version !== dataContent.version
                  "
                  @click="editContent"
                >
                  Сохранить
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn @click="dialog = false"> Отмена </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row class="ma-0 pa-0">
      <v-col class="ma-0 pa-0">
        <v-divider />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { currentAuthUser, currentTimestamp } from "@/const/globalRestAPI";
import { useConfaStore } from "@/store/modules/confa";
import { defineComponent, PropType } from "vue";
import { mapState } from "pinia";
import TextTinyMCEVue from "../basic/TextTinyMCE.vue";
import UserFioVue from "../elements/UserFio.vue";
import { smURLparserComposition } from "@/compositionApi/smURLparser";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import { ICreateTableFields } from "@/types/database/service";
import { IConfaContent } from "@/types/database/schemas/confa.t";

export default defineComponent({
  components: { TextTinyMCEVue, UserFioVue },
  props: {
    dataContent: { type: Object as PropType<ConfContent>, required: true },
  },
  setup () {
    const { urlParser } = smURLparserComposition();
    const { moderatorLevel } = routeAccessLevelCalculate();
    const { r_state, r_get, r_delete, r_insert, r_update, checkDataModify } =
      dataApiComposition();
    return {
      urlParser,
      r_state,
      r_get,
      r_delete,
      checkDataModify,
      r_insert,
      r_update,
      moderatorLevel,
    };
  },
  data () {
    return {
      dialog: false,
      editor: false,
      tab: 0,
      content_text: "",
      orderContent: 1,
    };
  },
  computed: {
    ...mapState(useConfaStore, ["content_versions"]),
    content (): string {
      return this.urlParser(this.dataContent.content_text);
    },
  },
  watch: {
    dialog (newVal) {
      if (newVal === false) {
        this.r_state(useConfaStore, "content_versions", []);
      }
    },
    tab (newVal) {
      // this.$projectDebug(newVal);
      // this.$projectDebug(this.content_versions);

      if (this.content_versions.length > 0) {
        this.editor = false;
        this.r_get({
          from: "confa.content",
          filter: {
            id: this.content_versions[newVal].id,
          },
        }).then((r: ConfContent[]) => {
          this.editor = true;
          if (r.length > 0) {
            this.content_text = r[0].content_text;
          }
        });
      }
    },
  },
  mounted () {
    this.content_text = this.dataContent.content_text;
    this.orderContent = this.dataContent.position;
  },
  methods: {
    loadVersion () {
      this.r_get<
        | ICreateTableFields<keyof IConfaContent, "cc1">
        | ICreateTableFields<keyof IConfaContent, "cc2">
      >(
        {
          fields: [
            "cc1.version",
            "cc1.kod_content",
            "cc1.id",
            {
              fields: ["count(1)::integer:cnt"],
              from: ["confa.content:cc2"],
              filter: {
                "cc2.kod_content": "@@:cc1.kod_content",
                "cc1.kod_content@1": this.dataContent.id,
              },
            },
          ],
          from: ["confa.content:cc1"],
          sort: ["-cc1.version"],
          filter: {
            "cc1.kod_content": [
              { "cc1.kod_content": this.dataContent.id },
              { "cc1.id": this.dataContent.id },
            ],
          },
        },
        "content_versions",
        useConfaStore
      ).then((/* r: ConfContent[] */) => {
        this.tab = 0;
      });
    },
    activeEdit () {
      this.dialog = true;
      this.loadVersion();
      setTimeout(() => {
        this.editor = true;
      }, 200);
    },
    deleteVersion () {
      this.r_delete({
        from: "confa.content",
        filter: {
          id: this.content_versions[this.tab].id,
        },
      })
        .then((r) => this.checkDataModify(r))
        .then((res) => {
          if (res) {
            this.loadVersion();
            this.$emit("editContent");
          }
        });
    },
    deleteContent () {
      this.r_delete({
        from: "confa.content",
        filter: {
          id: {
            from: "confa.content",
            fields: ["id"],
            sort: ["-id"],
            filter: {
              test: [
                { id: this.dataContent.id },
                { kod_content: this.dataContent.id },
              ],
            },
          },
        },
      })
        .then((r) => this.checkDataModify(r))
        .then((res) => {
          if (res) {
            this.$emit("editContent");
            this.dialog = false;
          }
        });
    },
    editContent () {
      this.$projectDebug(this.content_text);
      this.r_update<keyof IConfaContent>({
        to: "confa.content",
        set: {
          content_text: this.content_text,
          position: this.orderContent,
          kod_user_modify: currentAuthUser,
          date_modify: currentTimestamp,
          version: this.dataContent.version + 1,
        },
        filter: {
          id: this.dataContent.id,
        },
      })
        .then((r) => this.checkDataModify(r))
        .then((result) => {
          if (result) {
            this.$emit("editContent");
            this.dialog = false;
            this.r_insert({
              to: "confa.content",
              fields: {
                kod_block: this.dataContent.kod_block,
                content_text: this.dataContent.content_text,
                position: this.dataContent.position,
                version: this.dataContent.version,
                date_add: this.dataContent.date_add,
                kod_user: this.dataContent.kod_user,
                date_modify: this.dataContent.date_modify,
                kod_user_modify: this.dataContent.kod_user_modify,
                kod_content: this.dataContent.id,
              },
            });
          }
        });
    },
  },
});
</script>

<style scoped>
.content >>> td {
  border: solid 1px silver;
  padding: 2px;
}
</style>
