import { dataApiComposition } from "@/compositionApi/dataApi";
import { useAdminStore } from "@/store/modules/admin";
import {
  IKnowledgebaseBzUsers,
  IKnowledgebaseCronJobs,
  IKnowledgebaseCronJobsAudit,
  IKnowledgebaseCronScriptParams,
  IKnowledgebaseCronScripts,
} from "@/types/database/schemas/knowledgebase";
import { ICreateTableFields } from "@/types/database/service";
import { restGet, restGetType } from "@/types/restApi";
import { Ref } from "vue";
const { r_get } = dataApiComposition();
export const getUsers = () =>
  r_get<keyof IKnowledgebaseBzUsers>(
    {
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
    "users",
    useAdminStore
  );

export const getCronScripts = () =>
  r_get<keyof IKnowledgebaseCronScripts>(
    {
      from: "cron_scripts",
      sort: ["naimen_script"],
    },
    "job_scripts",
    useAdminStore
  );
export const getScriptParams = () =>
  r_get<keyof IKnowledgebaseCronScriptParams>(
    {
      from: "cron_script_params",
      sort: ["order_var"],
    },
    "job_scripts_params",
    useAdminStore
  );

const containerJC: restGet<
  | "(pg_catalog.json_array_elements((parameters::json)->0) #>> '{}')"
  | ICreateTableFields<keyof IKnowledgebaseCronJobs, "jcc">
  | ICreateTableFields<keyof IKnowledgebaseCronScripts, "s">
> = {
  from: [
    {
      fields: [
        "(pg_catalog.json_array_elements((parameters::json)->0) #>> '{}'):job_chain",
        "jcc.naimen",
        "jcc.active",
      ],
      from: ["cron_jobs:jcc"],
      filter: {
        "jcc.kod_script": {
          from: ["cron_scripts:s"],
          fields: ["s.id"],
          filter: { "s.naimen_script": "jobChainContainer" },
        },
      },
    },
  ],
  alias: "jc",
};

const genDynamicFilter = (
  filter: Ref,
  routerFilter: Record<string, string>
) => {
  const lFilter = {} as restGetType<
    | ICreateTableFields<keyof IKnowledgebaseCronJobs, "j">
    | ICreateTableFields<keyof IKnowledgebaseCronScripts, "s">
    | ICreateTableFields<keyof IKnowledgebaseCronJobs, "jc">
  >;
  if (filter.value.parameters) {
    lFilter["j.parameters"] = `~*:${filter.value.parameters}`;
    routerFilter["parameters"] = filter.value.parameters;
  }
  if (filter.value.naimen) {
    lFilter["j.naimen"] = `~*:${filter.value.naimen}`;
    routerFilter["naimen"] = filter.value.naimen;
  }
  if (filter.value.cron_host_ip) {
    lFilter["j.cron_host_ip"] = `~*:${filter.value.cron_host_ip}`;
    routerFilter["cron_host_ip"] = filter.value.cron_host_ip;
  }
  if (filter.value.kod_script) {
    lFilter["j.kod_script"] = filter.value.kod_script;
    routerFilter["kod_script"] = String(filter.value.kod_script);
  }
  if (filter.value.kod_user) {
    lFilter["j.kod_user"] = filter.value.kod_user;
    routerFilter["kod_user"] = String(filter.value.kod_user);
  }
  if (filter.value.active !== null) {
    if (typeof filter.value.active === "boolean") {
      lFilter["j.active"] = [
        { "j.active": filter.value.active },
        {
          EXISTS: {
            fields: ["1"],
            from: [containerJC],
            filter: {
              "jc.job_chain": `@@=:j.naimen`,
              "jc.active": true,
            },
          } as any,
        },
      ];
      routerFilter["active"] = String(filter.value.active);
    } else {
      switch (filter.value.active) {
        case "runing":
          lFilter["EXISTS"] = {
            from: [
              {
                fields: ["a.result"],
                from: ["cron_jobs_audit:a"],
                filter: {
                  "a.kod_job": "@@:j.id",
                  "a.time_start": "@@>=:j.last_run-interval'1 hour'",
                },
                limit: 1,
                sort: ["-a.time_start"],
              },
            ],
            filter: {
              result: [{ result: "выполняется" }, { result: "в очереди" }],
            },
          } as any;
          lFilter["j.active"] = [
            { "j.active": true },
            {
              EXISTS: {
                fields: ["1"],
                from: [containerJC],
                filter: {
                  "jc.job_chain": "@@=:j.naimen",
                  "jc.active": true,
                },
              } as any,
            },
          ];
          break;

        case "error_all":
          lFilter["EXISTS"] = {
            from: [
              {
                fields: ["a.result", "a.success", "a.time_end"],
                from: ["cron_jobs_audit:a"],
                filter: {
                  "a.kod_job": "@@:j.id",
                  "a.time_start": "@@>=:j.last_run-interval'1 hour'",
                },
                limit: 1,
                sort: ["-a.time_start"],
              },
            ],
            filter: {
              success: false,
              time_end: "!null",
            },
          } as any;
          break;

        case "error_on":
          lFilter["EXISTS"] = {
            from: [
              {
                fields: ["a.result", "a.success", "a.time_end"],
                from: ["cron_jobs_audit:a"],
                filter: {
                  "a.kod_job": "@@:j.id",
                  "a.time_start": "@@>=:j.last_run-interval'1 hour'",
                },
                limit: 1,
                sort: ["-a.time_start"],
              },
            ],
            filter: {
              success: false,
              time_end: "!null",
            },
          } as any;
          lFilter["j.active"] = [
            { "j.active": true },
            {
              EXISTS: {
                fields: ["1"],
                from: [containerJC],
                filter: {
                  "jc.job_chain": "@@=:j.naimen",
                  "jc.active": true,
                },
              } as any,
            },
          ];
          break;

        case "error_off":
          lFilter["EXISTS"] = {
            from: [
              {
                fields: ["a.result", "a.success", "a.time_end"],
                from: ["cron_jobs_audit:a"],
                filter: {
                  "a.kod_job": "@@:j.id",
                  "a.time_start": "@@>=:j.last_run-interval'1 hour'",
                },
                limit: 1,
                sort: ["-a.time_start"],
              },
            ],
            filter: {
              success: false,
              time_end: "!null",
            },
          } as any;
          lFilter["j.active"] = false;
          break;

        default:
          break;
      }
      routerFilter["active"] = String(filter.value.active);
    }
  }
  return lFilter;
};

export const getCronJobsCount = (
  filter: Ref,
  routerFilter: Record<string, string>
) => {
  const lFilter = genDynamicFilter(filter, routerFilter);
  return r_get<
    | "jc.job_chain"
    | "string_agg(jc.naimen ,', ')"
    | ICreateTableFields<keyof IKnowledgebaseCronScripts, "s">
    | ICreateTableFields<keyof IKnowledgebaseCronJobs, "j">
    | ICreateTableFields<keyof IKnowledgebaseCronJobs, "jc">
    | ICreateTableFields<keyof IKnowledgebaseCronJobsAudit, "a">
  >({
    fields: ["count(1):count"],
    from: ["cron_jobs:j"],
    filter: lFilter,
  });
};

export const getCronJobsData = (
  filter: Ref,
  routerFilter: Record<string, string>,
  limit = 20,
  page = 1,
  sort = ["j.naimen"]
) => {
  const lFilter = genDynamicFilter(filter, routerFilter);

  return r_get<
    | "j.last_done-j.last_run"
    | "jc.job_chain"
    | "string_agg(jc.naimen ,', ')"
    | ICreateTableFields<keyof IKnowledgebaseCronScripts, "s">
    | ICreateTableFields<keyof IKnowledgebaseCronJobs, "j">
    | ICreateTableFields<keyof IKnowledgebaseCronJobs, "jc">
    | ICreateTableFields<keyof IKnowledgebaseCronJobsAudit, "a">
  >(
    {
      fields: [
        "j.*",
        "j.last_done-j.last_run:period_hour",
        {
          fields: ["a.result"],
          from: ["cron_jobs_audit:a"],
          filter: {
            "a.kod_job": "@@:j.id",
            "a.time_start": "@@>=:now()-interval'7 day'",
            "a.time_start@1": "@@<=:now()",
          },
          limit: 1,
          sort: ["-a.time_start"],
        },
        {
          fields: ["string_agg(jc.naimen ,', '):chain"],
          from: [containerJC as any],
          filter: {
            "jc.job_chain": "@@=:j.naimen",
          },
        },
      ],
      from: ["cron_jobs:j"],
      filter: lFilter,
      sort: sort as any,
      limit: limit > 0 ? limit : undefined,
      page: limit > 0 ? page : undefined,
    },
    "jobs",
    useAdminStore
  );
};
