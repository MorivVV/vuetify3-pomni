<template>
  <v-container>
    <router-view v-if="'pageId' in $route.params" />
    <template v-else>
      <v-row align="center" class="ma-1" justify="center">
        <v-col cols="4">
          <v-text-field
            v-model="search"
            dense
            hide-details
            label="Поиск в записях"
            outlined
          />
        </v-col>
        <v-col cols="auto">
          <BtnIconsVVue
            :action="() => getConfSearchResults(search)"
            color="white"
            colorbtn="green"
            icon="search"
            title="Найти"
          />
        </v-col>
      </v-row>
      <v-row v-if="content_search.length">
        <v-col
          v-for="cont in content_search"
          :key="'search_' + cont.kod_page + 'content_' + cont.id"
          cols="4"
        >
          <v-card class="green lighten-5">
            <v-card-subtitle class="blue white--text">
              <span class="font-weight-bold">{{ cont.page_name }} -> {{ cont.name }}</span>
              <v-spacer />
              <BtnIconsVVue
                :action="() => setBlock(cont)"
                icon="fast_forward"
                title="Перейти"
              />
            </v-card-subtitle>
            <v-card-text>
              <span v-html="cont.content_text" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="ma-0 pa-0">
        <v-col
          v-for="page in pages"
          :key="'page_' + page.id"
          class="d-flex pa-1"
          cols="12"
        >
          <v-card
            class="pa-1 align-self-stretch blue lighten-5"
            height="40"
            :title="page.name"
            width="100%"
          >
            <v-btn
              block
              class="text-h6"
              color="blue darken-4"
              text
              :to="{ name: 'ConfluencePage', params: { pageId: page.id } }"
            >
              <span
                class="d-inline-block text-truncate"
                style="max-width: 1000px"
              >
                {{ page.name }}</span>
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
      <v-row align="center" class="ma-0" justify="center">
        <v-col col="8">
          <v-text-field
            v-model="namePage"
            dense
            hide-details
            label="Название новой страницы"
            outlined
          />
        </v-col>
        <v-col col="1">
          <BtnIconsVVue
            :action="addPage"
            icon="add"
            title="Добавить страницу"
          />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { currentAuthUser } from "@/const/globalRestAPI";
import { computed, ref, toRefs } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useConfaStore } from "@/store/modules/confa";
import BtnIconsVVue from "../basic/BtnIconsV.vue";
import { getConfSearchResults, getPagesData } from "./confaFunctions";
import { useRouter } from "vue-router";

const { r_state, r_insert, checkDataModify } = dataApiComposition();
const router = useRouter();
const namePage = ref("");
const search = ref("");
const { pages, content_search: _content_search } = toRefs(useConfaStore());
const content_search = computed(() => {
  return _content_search.value.map((e) => {
    const addCHar = 50;
    let pos = e.content_text.indexOf(search.value);
    let content_text = "";
    while (pos !== -1 && search.value) {
      let startpos = pos - addCHar;
      let endpos = startpos + search.value.length + addCHar * 2;
      if (startpos < 0) startpos = 0;
      if (endpos > e.content_text.length) endpos = e.content_text.length;
      const text = e.content_text
        .substring(startpos, endpos)
        .replace(
          search.value,
          "<span class='yellow'>" + search.value + "</span>"
        );
      content_text += "<br>" + text;
      pos = e.content_text.indexOf(search.value, pos + 1);
    }

    return { ...e, content_text };
  });
});

const addPage = () => {
  r_insert({
    to: "confa.pages",
    fields: { name: namePage.value, kod_user: currentAuthUser },
  })
    .then((r) => checkDataModify(r))
    .then(() => {
      getPagesData();
      namePage.value = "";
    });
};

const setBlock = (block: IConfSearchContent) => {
  router
    .push({
      path: `/confa/page/${block.kod_page}/block/${block.id}`,
    })
    .then(() => {
      r_state(useConfaStore, "activeBlock", block.id);
      r_state(useConfaStore, "nameBlock", block.name);
    });
};

getPagesData();
</script>
