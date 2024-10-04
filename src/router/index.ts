import { createRouter, createWebHistory } from "vue-router";
import { AllRoutes } from "./AllRoutes";
import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import { useAutorizationStore } from "@/store/modules/autorization";
import { IConfigIndividualUserSettings } from "@/types/database/schemas/config";
import { ECONFIG } from "@/const/schemaEnums";
import { ICreateTableFields } from "@/types/database/service";
import { restGet } from "@/types/restApi";
import {
  IKnowledgebasePartitionAccess,
  IKnowledgebaseRolesAccess,
  IKnowledgebaseRolesUsers,
} from "@/types/database/schemas/knowledgebase";
import { currentAuthUser } from "@/const/globalRestAPI";
import { pinia } from "@/store";
const routes = AllRoutes.routes;

const clientVersion = {
  id: CLIENT_VERSION_ID,
  site_version: CLIENT_VERSION_TEXT,
};
const { r_insert, r_get, r_restApi, r_access } = dataApiComposition();
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeEach(async (to, _from, next) => {
  const auth = useAutorizationStore(pinia);
  r_restApi("getVersion", undefined).then((r) => {
    if (+r > clientVersion.id) {
      toast.warning("Доступна новая версия, необходимо обновить страницу(F5)");
    } else if (r && +r < clientVersion.id) {
      r_insert({
        to: "bz_version",
        fields: {
          ...clientVersion,
        },
      }).then((i) => {
        if (i.count === 1) r_restApi("checkVersion", undefined);
      });
    }
  });
  const path = String(to.name);
  let access = false;
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (auth.isLoggedIn) {
      const accessLevel = await r_access(path).then(
        (r) => r as never as { access_level: number }
      );

      if (accessLevel.access_level > 0) {
        access = true;
        const getSettings: restGet<
          ICreateTableFields<keyof IConfigIndividualUserSettings, "us">
        > = {
          from: [`${ECONFIG.individual_user_settings}:us`],
          fields: [
            "us.parameter_key",
            "us.parameter_value",
            "us.id",
            "us.route_name",
            "us.kod_user",
          ],
          filter: {
            "us.kod_user": `=:${currentAuthUser}`,
            "us.route_name": `=:${path}`,
          },
        };
        await r_get(getSettings, "user_configs", useAutorizationStore);
        if ("meta" in to && to.meta) {
          to.meta.level = accessLevel.access_level;
        }
      }
      if (access) {
        next();
        return;
      }
    }
    if (to.fullPath !== "/login") {
      auth.toUrl = to.fullPath;
    }
    r_get<
      | "CASE WHEN ra.access_level> ru.access_level THEN ra.access_level ELSE ru.access_level END access_level"
      | "access_level"
      | ICreateTableFields<keyof IKnowledgebaseRolesAccess, "ra">
      | ICreateTableFields<keyof IKnowledgebaseRolesUsers, "ru">
      | ICreateTableFields<keyof IKnowledgebasePartitionAccess, "pa">
    >(
      {
        fields: [
          "ru.kod_user",
          "CASE WHEN ra.access_level> ru.access_level THEN ra.access_level ELSE ru.access_level END access_level",
        ],
        from: ["roles_access:ra", "roles_users:ru", "partition_access:pa"],
        join: ["ru.kod_role=ra.kod_role", "ra.kod_access=pa.id"],
        filter: {
          "pa.route": path,
        },
        sort: ["-access_level"],
      },
      "user_access_level",
      useAutorizationStore
    );
    next("/login");
  } else {
    const accessLevel = (await r_access(path)) as never as {
      access_level: number;
    };
    if (accessLevel.access_level > 0) {
      if ("meta" in to && to.meta) {
        to.meta.level = accessLevel.access_level;
      }
    }
    next();
  }
});
