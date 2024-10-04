<template>
  <div>
    <v-row
      class="ma-0 pa-0 blue darken-4 rounded-lg rounded-b-0"
      align="center"
    >
      <v-col cols="auto" class="pa-0">
        <v-btn color="primary" to="/confa">
          <v-icon> arrow_back </v-icon>
          К списку страниц
        </v-btn>
      </v-col>
      <v-col class="text-h5">
        <span class="white--text">{{ namePage }} </span>
      </v-col>
      <v-col cols="auto">
        <BtnIconsVVue
          title="Удалить страницу"
          icon="delete"
          :action="deletePage"
          color="white"
          colorbtn="red"
          :disabled="!editLevel()"
        />
      </v-col>
    </v-row>
    <v-row class="ma-0">
      <v-col cols="12" md="2" class="teal lighten-5 pa-1">
        <v-row class="ml-1">
          <div class="text-h5 ma-1 mt-2 mb-2">Разделы</div>
        </v-row>
        <ConfBlocksVue />
      </v-col>
      <v-col cols="12" md="10" class="pa-0 ma-0">
        <v-row class="pa-1 ma-0 light-blue lighten-5">
          <v-col class="text-h4 text-center pa-0 ma-0">
            <span>{{ nameBlock }}</span>
            <v-btn
              icon
              fab
              small
              @click="(editNameBlock = true), (newNameBlock = nameBlock)"
            >
              <v-icon>edit</v-icon>
            </v-btn>
            <v-dialog
              v-model="editNameBlock"
              transition="dialog-top-transition"
              max-width="600"
            >
              <v-card>
                <v-toolbar color="primary" dark>
                  Редактирование названия блока
                </v-toolbar>
                <v-card-text class="pa-2 text-center">
                  <v-row class="ma-0">
                    <TextFielsV v-model="newNameBlock" label="Раздел" />
                  </v-row>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <BtnIconsVVue
                    title="Удалить раздел"
                    icon="delete"
                    :action="deleteBlock"
                    color="white"
                    colorbtn="red"
                    :disabled="!editLevel()"
                  />
                  <v-spacer />
                  <v-btn @click="editBlock"> Изменить </v-btn>
                  <v-btn text @click="editNameBlock = false"> Отмена </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
        <div v-if="content.length > 0">
          <ConfContentVue
            v-for="cont in content"
            :key="'content_' + cont.id"
            :data-content="cont"
            @editContent="getContent"
          />
        </div>
        <v-row v-else justify="center" class="ma-1">
          <v-col cols="auto">
            <div class="text-h5 mt-2 mb-1">Записи отсутствуют</div>
          </v-col>
        </v-row>
        <v-row v-if="blocks.length" class="ma-0 pt-2 pb-2 green lighten-5">
          <v-col cols="12" class="pa-1">
            <TextTinyMCEVue v-model="contentBlock" />
          </v-col>
          <v-col col="auto">
            <v-btn color="green" dark @click="addContent">
              Добавить запись
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col col="auto" class="text-center red--text">
            Необходимо добавить раздел
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { currentAuthUser } from "@/const/globalRestAPI";
import { useConfaStore } from "@/store/modules/confa";
import { ref, toRefs, watch } from "vue";
import BtnIconsVVue from "../basic/BtnIconsV.vue";
import TextTinyMCEVue from "../basic/TextTinyMCE.vue";
import ConfBlocksVue from "./ConfBlocks.vue";
import ConfContentVue from "./ConfContent.vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import {
  IConfaBlock,
  IConfaContent,
  IConfaPages,
} from "@/types/database/schemas/confa.t";
import { useRouter } from "vue-router";
import TextFielsV from "../basic/TextFielsV.vue";

const {
  r_delete,
  r_insert,
  r_state,
  r_update,
  r_get,
  checkDataModify,
  checkDataLoad,
} = dataApiComposition();
const { blocks, content, nameBlock, activeBlock, kodPage } = toRefs(
  useConfaStore()
);
const router = useRouter();
const { editLevel } = routeAccessLevelCalculate();
const orderContent = ref(1);
const editNameBlock = ref(false);
const contentBlock = ref("");
const newNameBlock = ref("");
const namePage = ref("");
const getPageInfo = () =>
  r_get<keyof IConfaPages>({
    fields: ["name"],
    from: "confa.pages",
    filter: { id: kodPage.value },
  }).then((r) => {
    if (r.length === 1) {
      namePage.value = r[0].name;
    }
  });
const getContent = () =>
  r_get<keyof IConfaContent>(
    {
      from: "confa.content",
      filter: { kod_block: activeBlock.value, kod_content: "null" },
      sort: ["position", "id"],
    },
    "content",
    useConfaStore
  ).then((r) => {
    if (checkDataLoad(r)) {
      orderContent.value = r.length + 1;
    }
  });
const editBlock = () => {
  r_update<keyof IConfaBlock>({
    to: "confa.block",
    set: {
      name: newNameBlock.value,
    },
    filter: {
      id: activeBlock.value,
    },
  })
    .then((r) => checkDataModify(r))
    .then((result) => {
      if (result) {
        r_state(useConfaStore, "nameBlock", newNameBlock.value);
        const nb = blocks.value.filter((e) => e.id === activeBlock.value);
        nb[0].name = newNameBlock.value;
        editNameBlock.value = false;
      }
    });
};
const addContent = () => {
  r_insert<keyof IConfaContent>({
    to: "confa.content",
    fields: {
      position: orderContent.value,
      version: 1,
      kod_block: activeBlock.value,
      kod_user: currentAuthUser,
      content_text: contentBlock.value,
    },
  })
    .then((r) => checkDataModify(r))
    .then(() => {
      getContent();
      contentBlock.value = "";
    });
};
const deletePage = () => {
  if (kodPage.value) {
    r_delete<keyof IConfaPages>({
      from: "confa.pages",
      filter: {
        id: kodPage.value,
      },
    })
      .then((r) => checkDataModify(r))
      .then((check) => {
        if (check) {
          router.push({
            path: `/confa`,
          });
        }
      });
  }
};
const deleteBlock = () => {
  if (activeBlock.value) {
    r_delete<keyof IConfaBlock>({
      from: "confa.block",
      filter: {
        id: activeBlock.value,
      },
    })
      .then((r) => checkDataModify(r))
      .then((check) => {
        if (check) {
          getPageInfo();
          editNameBlock.value = false;
        }
      });
  }
};
getPageInfo();
watch(activeBlock, getContent);
</script>
