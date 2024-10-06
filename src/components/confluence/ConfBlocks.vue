<template>
  <div class="ma-1">
    <ConfBlockVue />
    <v-row class="ma-1">
      <v-col cols="auto" xl="6">
        <v-dialog
          v-model="dialog"
          max-width="600"
          transition="dialog-top-transition"
        >
          <template #activator="{ on, attrs }">
            <v-btn color="primary" small v-bind="attrs" v-on="on">
              <span style="text-transform: none"> Добавить</span>
            </v-btn>
          </template>

          <v-card>
            <v-toolbar color="primary" dark dense>
              Название нового раздела
            </v-toolbar>
            <v-card-text class="pa-2">
              <TextFielsV
                v-model="nameBlock"
                label="Раздел"
              />
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn @click="addBlock"> Сохранить </v-btn>
              <v-btn text @click="dialog = false"> Отмена </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="auto" xl="6">
        <v-dialog
          v-if="_blocks.length > 0"
          v-model="dialogInside"
          max-width="600"
          transition="dialog-top-transition"
        >
          <template #activator="{ on, attrs }">
            <v-btn color="primary" small v-bind="attrs" v-on="on">
              Расширить
            </v-btn>
          </template>

          <v-card>
            <v-toolbar color="primary" dark dense>
              Название вложенного раздела
            </v-toolbar>
            <v-card-text class="pa-2">
              <TextFielsV
                v-model="nameBlock"
                label="Раздел"
              />
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn @click="addInsideBlock"> Сохранить </v-btn>
              <v-btn text @click="dialogInside = false"> Отмена </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useConfaStore } from "@/store/modules/confa";
import ConfBlockVue from "./ConfBlock.vue";
import { useRoute } from "vue-router";
import { addConfaBlock, getConfaBlocks } from "./confaFunctions";

const route = useRoute();
const { r_state } = dataApiComposition();
const { blocks: _blocks, activeBlock, kodPage } = toRefs(useConfaStore());
const dialog = ref(false);
const dialogInside = ref(false);
const nameBlock = ref("");
const contentBlock = ref("");
const addBlock = () => {
  addConfaBlock(
    nameBlock.value,
    Number(route.params.pageId),
    contentBlock.value
  ).then(() => {
    getData();
    dialog.value = false;
  });
};
const addInsideBlock = () => {
  addConfaBlock(
    nameBlock.value,
    Number(route.params.pageId),
    contentBlock.value,
    activeBlock.value
  ).then(() => {
    getData();
    dialogInside.value = false;
  });
};
const getData = () => {
  const kod_block = activeBlock.value;
  return getConfaBlocks(kodPage.value).then((r) => {
    if (r.length > 0) {
      let block: ConfBlock | undefined;
      if (nameBlock.value) {
        block = r.find((e) => e.name === nameBlock.value);
      } else {
        block = r.find((e) => e.id === kod_block);
      }

      if (block) {
        r_state(useConfaStore, "nameBlock", block.name);
        r_state(useConfaStore, "activeBlock", block.id);
      } else {
        r_state(useConfaStore, "activeBlock", r[0].id);
        r_state(useConfaStore, "nameBlock", r[0].name);
      }
      nameBlock.value = "";
    }
  });
};
if ("pageId" in route.params) {
  r_state(useConfaStore, "kodPage", Number(route.params.pageId));
}
if ("blockId" in route.params) {
  r_state(useConfaStore, "activeBlock", Number(route.params.blockId));
} else {
  const blocks: ConfBlock[] = _blocks.value.filter(
    (e) => e.kod_page === kodPage.value
  );
  if (blocks.length > 0) {
    r_state(useConfaStore, "activeBlock", Number(blocks[0].id));
    r_state(useConfaStore, "nameBlock", Number(blocks[0].name));
  }
}
watch(activeBlock, getData);
getData();
</script>
