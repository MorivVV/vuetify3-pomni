<template>
  <div class="ma-0">
    <template v-for="block in blocks">
      <v-row
        v-if="block.kod_block === include"
        :key="'block_' + block.id"
        class="ma-0 ml-2 pa-0"
      >
        <v-col
          v-if="block.kod_block === include"
          class="pointer pa-0 pl-1"
          :class="{
            'light-blue darken-3': activeBlock === block.id,
            'white--text': activeBlock === block.id,
            'blue--text': activeBlock !== block.id,
          }"
          @click="setBlock(block)"
        >
          {{ block.name }}
        </v-col>
        <v-col class="pa-0" cols="12">
          <ConfBlock
            :key="'sub_block_' + block.id"
            v-model="activeBlock"
            :include="block.id"
          />
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, toRefs } from "vue";
import { useRouter } from "vue-router";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useConfaStore } from "@/store/modules/confa";
const router = useRouter();
const props = defineProps({
  include: { type: Number, default: null },
  value: Number,
});

const { r_state } = dataApiComposition();
const { blocks: _blocks, activeBlock, kodPage } = toRefs(useConfaStore());

const blocks = computed(() => {
  return _blocks.value.filter((e: ConfBlock) => e.kod_block === props.include);
});
const setBlock = (block: ConfBlock) => {
  r_state(useConfaStore, "activeBlock", block.id);
  r_state(useConfaStore, "nameBlock", block.name);
  router.push({
    path: `/confa/page/${kodPage.value}/block/${block.id}`,
  });
};
</script>

<script lang="ts">
export default defineComponent({
  name: "ConfBlock",
});
</script>
