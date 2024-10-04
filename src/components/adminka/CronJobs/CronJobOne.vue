<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      style="min-height: 32px"
      class="lighten-4 pa-0"
      :class="color"
    >
      <CronJobOneHead :job="j" />
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <CronJobOneBody :j="j" @getCronJobs="$emit('getCronJobs')" />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import { CronJobTask } from "@/types/cronjobs";
import { computed, defineProps, PropType } from "vue";
import CronJobOneBody from "./CronJobOneBody.vue";
import CronJobOneHead from "./CronJobOneHead.vue";
import { calcColor } from "./jobCalculateFuncrion";
const props = defineProps({
  j: { type: Object as PropType<CronJobTask>, required: true },
});
const color = computed(() => {
  const color = calcColor(props.j);

  return color;
});
</script>

<style scoped>
.v-expansion-panel-content >>> .v-expansion-panel-content__wrap {
  padding: 0;
}
</style>
