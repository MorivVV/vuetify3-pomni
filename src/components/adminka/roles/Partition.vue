<template>
  <v-list-item class="pa-0 ma-0">
    <v-list-item-content class="ma-0 pl-1 pa-0">
      <v-row align="center" class="ma-0">
        <v-col v-if="currentPartition" cols="6" class="pl-1 pa-0 ma-0">
          {{ currentPartition.namien }}
        </v-col>
        <v-col v-if="currentPartition" cols="4" class="pl-1 pa-0 ma-0">
          {{ currentPartition.path }}
        </v-col>
        <v-col cols="1" class="pl-1 pa-1 ma-0" :class="nameLevel?.color">
          {{ nameLevel?.name }} ({{ partition.access_level }})
        </v-col>
        <v-col cols="1" class="text-right pl-1 pa-0 ma-0">
          <v-btn fab x-small color="red" dark @click="delPartition">
            <v-icon> delete </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-list-item-content>
  </v-list-item>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useAdminStore } from "@/store/modules/admin";

const emit = defineEmits(["delPartition"]);
const props = defineProps({
  partition: {
    type: Object,
    required: true,
  },
});
const { r_delete, checkDataModify } = dataApiComposition();
const { partitions, levels } = toRefs(useAdminStore());
const currentPartition = computed(() => {
  const p = partitions.value.find((e) => e.id === props.partition.kod_access);
  return p;
});
const nameLevel = computed(() => {
  return levels.value.find((e) => e.id === props.partition.access_level);
});
const delPartition = () => {
  r_delete({
    from: "roles_access",
    filter: {
      id: props.partition.id,
    },
  })
    .then((r) => checkDataModify(r))
    .then(() => {
      emit("delPartition");
    });
};
</script>
