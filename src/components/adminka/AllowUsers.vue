<template>
  <v-container>
    <div class="text-h5 mt-2 mb-1">Доступы к разделам сайта</div>
    <v-container>
      <v-row class="ma-1">
        <v-col>
          <BtnIconsVVue
            :action="checkPartitions"
            color="white"
            colorbtn="purple"
            icon="sync-circle"
            title="Синхронизировать разделы в БД"
          />
        </v-col>
        <v-col>
          <TextFielsV
            v-model="sPartition"
            label="Поиск по разделам"
            prepend-icon="search-web"
          />
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-expansion-panels>
        <PartitionAccessVue
          v-for="p in partitionFilter"
          :key="p.id"
          :part="p"
          @change-level="changeLevel"
        />
      </v-expansion-panels>
      <v-row class="ma-1">
        <v-col>
          <TextFielsV
            v-model="sFio"
            label="Поиск по пользователю"
            prepend-icon="mdi-magnify"
          />
        </v-col>
      </v-row>
      <v-expansion-panels>
        <UserAccessVue
          v-for="u in usersFilter"
          :key="u.id"
          :user="u"
          @change-level="changeLevel"
        />
      </v-expansion-panels>
    </v-container>

    <v-dialog v-model="dialog" max-width="300px" scrollable>
      <v-card>
        <v-card-title>Настройка уровня доступа</v-card-title>
        <v-divider />
        <v-card-text>
          <v-radio-group v-model="level" column>
            <v-radio
              v-for="l in levels"
              :key="'level_' + l.id"
              :label="l.name"
              :value="l.id"
            />
          </v-radio-group>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Отменить
          </v-btn>
          <v-btn color="blue darken-1" text @click="updateLevel">
            Изменить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import PartitionAccessVue from "./AllowUsers/PartitionAccess.vue";
import UserAccessVue from "./AllowUsers/UserAccess.vue";
import { AllRoutes, convertRoutes } from "@/router/AllRoutes";
import BtnIconsVVue from "@/components/basic/BtnIconsV.vue";
import { useAdminStore } from "@/store/modules/admin";
import { computed, defineComponent, ref, toRefs } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import {
  IKnowledgebaseBzUsers,
  IKnowledgebasePartitionAccess,
  IKnowledgebaseUserAccess,
} from "@/types/database/schemas/knowledgebase";
import { getAccess, getGraph } from "./AllowUsers/accessMetods";
import TextFielsV from "../basic/TextFielsV.vue";
import { IPartitionAccess, Route } from "@/types/global";

const parseRecursive = (
  r: Route,
  pr: { name: string; path: string; title: string }[],
  title = ""
) => {
  if (title) {
    title += " -> " + r.meta?.title ?? r.title;
  } else {
    title += r.meta?.title ?? r.title;
  }

  pr.push({ name: r.name, path: String(r.href), title });

  if ("children" in r) {
    const object = r.children;
    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        const element = object[key];
        parseRecursive(element, pr, title);
      }
    }
  }
};

export default defineComponent({
  components: {
    PartitionAccessVue,
    UserAccessVue,
    BtnIconsVVue,
    TextFielsV,
  },
  setup () {
    const { r_get, r_insert, r_update } = dataApiComposition();
    const sFio = ref("");
    const sPartition = ref("");
    const dialog = ref(false);
    const modallevel = ref(false);
    const level = ref(1);
    const partId = ref(1);
    const userId = ref(1);
    const { users, partitions, levels } = toRefs(useAdminStore());
    const urlRoute = computed(() => {
      const urls = AllRoutes.routes.map((r) => convertRoutes(r, "", false));
      return urls;
    });
    const changeLevel = (
      currlevel: number,
      part_id: number,
      user_id: number
    ) => {
      level.value = currlevel;
      partId.value = part_id;
      userId.value = user_id;
      dialog.value = true;
    };
    getGraph();
    return {
      r_get,
      r_insert,
      r_update,
      sFio,
      sPartition,
      dialog,
      modallevel,
      level,
      partId,
      userId,
      users,
      partitions,
      levels,
      urlRoute,
      changeLevel,
      getAccess,
      getGraph,
      AllRoutes,
    };
  },
  computed: {
    partitionRoutes () {
      const partition: IPartitionAccess[] = this.partitions;
      const pr = [];
      if (partition.length === 0) {
        return [];
      }
      this.urlRoute.forEach((r) => {
        parseRecursive(r, pr, "");
      });

      return pr;
    },
    usersFilter () {
      let u: IKnowledgebaseBzUsers[] = this.users;
      const f = this.sFio.toLowerCase();
      if (u.length) {
        u = u.filter(
          (e) =>
            ~(
              String(e.family).toLowerCase() +
              String(e.first_name).toLowerCase() +
              e.login.toLowerCase() +
              e.tabnum
            ).indexOf(f)
        );
      }
      return u;
    },
    partitionFilter () {
      let p: IPartitionAccess[] = this.partitions;
      const f = this.sPartition.toLowerCase();
      if (p.length) {
        p = p.filter(
          (e: { namien: string; route: string }) =>
            ~(e.namien.toLowerCase() + e.route.toLowerCase()).indexOf(f)
        );
      }
      return p;
    },
  },
  methods: {
    updateLevel () {
      const partId = this.partId;
      const userId = this.userId;
      const level = +this.level;

      this.r_update<keyof IKnowledgebaseUserAccess>({
        set: {
          access_level: level,
        },
        filter: {
          kod_access: partId,
          kod_user: userId,
        },
        to: "user_access",
      }).then((r) => {
        if (r.count) {
          this.$toast({ html: "Доступ изменен" });
          this.getAccess();
        } else {
          this.$toast({ html: "Доступ изменить не удалось" });
        }
        this.dialog = false;
        this.modallevel = false;
      });
    },
    checkPartitions () {
      if (this.partitionRoutes.length === 0) {
        this.$toast({ html: "Новых разделов не найдено" });
      }
      const prom = this.partitionRoutes.map(
        (e: { name: string; path: string; title: string }) => {
          const rout = this.partitions.filter((p) => p.route === e.name);
          if (rout.length > 0) {
            const pathRout = rout[0];
            if (
              !pathRout.path ||
              pathRout.path !== e.path ||
              pathRout.namien !== e.title
            ) {
              return this.r_update<keyof IKnowledgebasePartitionAccess>({
                set: {
                  path: e.path,
                  namien: e.title,
                },
                to: "partition_access",
                filter: { id: pathRout.id },
              }).then((r) => {
                if (r.count) {
                  this.$toast({ html: "Раздел " + e.path + " обновлен" });
                }
              });
            }
          } else {
            return this.r_insert<keyof IKnowledgebasePartitionAccess>({
              fields: {
                namien: e.title,
                route: e.name,
                path: e.path,
                access_all: false,
              },
              to: "partition_access",
            }).then((r) => {
              if (r.count) {
                this.$toast({ html: "Раздел " + e.name + " добавлен" });
              }
            });
          }
        }
      );
      Promise.all(prom).then(() => getGraph());
    },
  },
});
</script>
