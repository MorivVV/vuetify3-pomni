import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import { useAdminStore } from "@/store/modules/admin";
import {
  IKnowledgebaseBzUsers,
  IKnowledgebasePartitionAccess,
  IKnowledgebaseRoles,
  IKnowledgebaseUserAccess,
} from "@/types/database/schemas/knowledgebase";
import { IGraphQLRestGet } from "@/types/restApi";

const { r_get, r_insert, r_delete, r_graphql } = dataApiComposition();
const users: IGraphQLRestGet<IKnowledgebaseBzUsers> = {
  query: {
    fields: [
      "id",
      "login",
      "tabnum",
      "family",
      "first_name",
      "second_name",
      "login_ip",
      "login_time",
      "create_time",
      "active",
    ],
    from: "bz_users",
    sort: ["family", "first_name"],
  },
  state: "users",
  store: useAdminStore,
};
const partition_access: IGraphQLRestGet<IKnowledgebasePartitionAccess> = {
  query: {
    fields: ["namien", "id", "path", "route", "date_add", "access_all"],
    from: "partition_access",
    sort: ["namien"],
  },
  state: "partitions",
  store: useAdminStore,
};
const user_access: IGraphQLRestGet<IKnowledgebaseUserAccess> = {
  query: {
    fields: ["access_level", "kod_access", "kod_user", "date_add"],
    from: "user_access",
    sort: ["-access_level", "id"],
  },
  state: "access",
  store: useAdminStore,
};
const roles: IGraphQLRestGet<IKnowledgebaseRoles> = {
  query: { from: "roles", sort: ["naimen"] },
  state: "roles",
  store: useAdminStore,
};
const roles_users: IGraphQLRestGet<Record<string, string>> = {
  query: {
    fields: ["ru.*"],
    from: ["roles_users:ru", "bz_users:u"],
    join: ["u.id=ru.kod_user"],
    sort: ["u.family"],
  },
};
export const getGraph = () => {
  return r_graphql({
    users,
    partition_access,
    user_access,
  });
};
export const getPartitions = () =>
  r_get<keyof IKnowledgebasePartitionAccess>(
    partition_access.query,
    "partitions",
    useAdminStore
  );
export const getAccess = () => {
  r_get<keyof IKnowledgebaseUserAccess>(
    user_access.query,
    "access",
    useAdminStore
  );
};
export const getRoles = () => r_get(roles.query, "roles", useAdminStore);

export const getRolesUsers = () =>
  r_get(roles_users.query, "roles_users", useAdminStore);

export const getRolesAccess = () =>
  r_get(
    {
      fields: ["ra.*"],
      from: ["roles_access:ra", "partition_access:pa"],
      join: ["pa.id=ra.kod_access"],
      sort: ["pa.namien"],
    },
    "roles_access",
    useAdminStore
  );

export const addAccess = (userId: number, partId: number) => {
  r_insert<keyof IKnowledgebaseUserAccess>({
    fields: {
      kod_access: partId,
      kod_user: userId,
    },
    to: "user_access",
  }).then((r) => {
    if (r.count) {
      toast.info({
        html: `Доступ предоставлен<br>
        userId:${userId}, partId:${partId}`,
      });
      getAccess();
    }
  });
};
export const delAccess = (userId: number, partId: number) => {
  r_delete<keyof IKnowledgebaseUserAccess>({
    filter: {
      kod_access: partId,
      kod_user: userId,
    },
    from: "user_access",
  }).then((r) => {
    if (r.count) {
      toast.warning(`Доступ закрыт<br>
      userId:${userId}, partId:${partId}`);
      getAccess();
    }
  });
};
