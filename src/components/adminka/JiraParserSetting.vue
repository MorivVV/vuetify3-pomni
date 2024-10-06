<template>
  <div>
    <div class="text-h4 mt-2 mb-1">Настройки сбора дефектов из Jira</div>
    <table>
      <thead>
        <tr>
          <th>Наименование проекта</th>
          <th>Jira ID</th>
          <th>Дефект</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in projectBug" :key="p.id" class="green lighten-4">
          <td>{{ p.naimen }}</td>
          <td>{{ p.project }}</td>
          <td>
            <v-checkbox
              v-model="p.get_bags"
              class="ma-0 pa-0"
              hide-details
              @change="updateProject(p.id, p.get_bags)"
            />
          </td>
        </tr>
        <tr v-for="p in projectNoBug" :key="p.id" class="blue lighten-5">
          <td>{{ p.naimen }}</td>
          <td>{{ p.project }}</td>
          <td>
            <v-checkbox
              v-model="p.get_bags"
              class="ma-0 pa-0"
              hide-details
              @change="updateProject(p.id, p.get_bags)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { mapState } from "pinia";
import { useJiraStore } from "@/store/modules/jira";
import { defineComponent } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { IKnowledgebaseJiraProjects } from "@/types/database/schemas/knowledgebase";
interface IJiraProject {
  id: number;
  project: string;
  naimen: string;
  time_add: string;
  active: boolean;
  get_bags: boolean;
}
export default defineComponent({
  setup () {
    const { r_get, r_update } = dataApiComposition();
    return { r_get, r_update };
  },
  computed: {
    ...mapState(useJiraStore, ["projectList"]),
    projectBug (): IJiraProject[] {
      const bug = this.projectList.filter((e) => e.get_bags);
      return bug;
    },
    projectNoBug (): IJiraProject[] {
      const bug = this.projectList.filter((e) => !e.get_bags);
      return bug;
    },
  },
  mounted () {
    this.getProjects();
  },
  methods: {
    updateProject (id: number, val: boolean) {
      this.r_update<keyof IKnowledgebaseJiraProjects>({
        to: "jira.jira_projects",
        set: {
          get_bags: val,
        },
        filter: {
          id,
        },
      }).then((r) => this.$toast({ html: r.count }));
    },
    getProjects () {
      this.r_get<keyof IKnowledgebaseJiraProjects>(
        {
          from: "jira.jira_projects",
          filter: {
            active: true,
          },
          sort: ["naimen"],
        },
        "projectList",
        useJiraStore
      );
    },
  },
});
</script>
