<template>
  <div class="collection-header">
    <div class="text-h4 mt-2 mb-1">
      {{ g.GR }}
    </div>
    <div v-for="u in groupUserList" :key="u.EKSID" class="collection-item">
      <span class="blue--text">{{ u.FIO }} </span>
      <span>{{ u.ID }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "pinia";
import { useAuditDataStore } from "@/store/modules/auditData";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    g: { type: Object, required: true },
  },
  computed: {
    ...mapGetters(useAuditDataStore, ["userList"]),
    groupUserList() {
      const ug: any = [];
      const id = +this.g.ID;
      for (const key in this.userList) {
        if (Object.prototype.hasOwnProperty.call(this.userList, key)) {
          if (+this.userList[key].KG === id) {
            ug.push(this.userList[key]);
          }
        }
      }
      ug.sort((a, b) => {
        if (a.FIO > b.FIO) return 1;
        if (a.FIO < b.FIO) return -1;
        return 0;
      });
      return ug;
    },
  },
});
</script>
