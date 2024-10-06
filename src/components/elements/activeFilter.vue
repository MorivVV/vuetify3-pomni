<template>
  <v-chip v-if="val != '' && reasonList">
    <template v-if="val.indexOf(',') > 0">
      Причины:
      <span
        v-for="r in val.split(',')"
        :key="r"
        v-html="'+' + reasonList[r].NAIMEN"
      />
    </template>
    <span v-else v-html="nameChip" />
    <i
      class="close material-icons"
      title="убрать фильтр"
      @click="removeFilter(ind)"
    >close</i>
  </v-chip>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { useAuditDataStore } from "@/store/modules/auditData";

export default defineComponent({
  props: {
    val: { type: String, required: true },
    ind: { type: String, required: true },
  },
  setup () {
    const { reasonList } = toRefs(useAuditDataStore());
    const filterName = {
      auddate: "Дата аудита",
      dateend: "Период по",
      reason: "Причина",
      login: "Логин ЕКС",
      tabnum: "Табельный",
      diary: "Журнал аудита",
      method: "Операция",
      grp: "Группа",
    };
    return { reasonList, filterName };
  },
  computed: {
    nameChip (): string {
      let value = this.val;
      if (this.ind === "reason") {
        value = this.reasonList[this.val].NAIMEN;
      }
      return this.filterName[this.ind] + " = " + value;
    },
  },
  methods: {
    removeFilter (id: string) {
      const newQuery = { ...this.$route.query };
      const path = this.$route.path;
      delete newQuery[id];
      this.$router.replace({ path, query: newQuery });
    },
  },
});
</script>
