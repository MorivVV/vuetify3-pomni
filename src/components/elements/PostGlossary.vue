<template>
  <v-col cols="12">
    <v-card v-if="post" class="blue lighten-5">
      <v-card-title>
        <v-row>
          <v-col>
            <div
              class="ml-2 card-title indigo--text text--darken-4 text-center"
              v-html="searchView(post.post_title)"
            />
          </v-col>
          <v-col cols="auto">
            <span class="rounded-lg halfway-fab ml-2 pa-1 blue lighten-4">{{
              post.n
            }}</span>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <p v-html="searchView(post.post_content)" />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { mapState } from "pinia";
import { usePostDataStore } from "@/store/modules/postsData";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    post: { type: Object as PropType<Post> },
    edit: Object,
  },
  computed: {
    ...mapState(usePostDataStore, ["terms_list", "search"]),
  },
  methods: {
    searchView (text) {
      if (this.search.length > 2) {
        text = text.replace(
          new RegExp(this.search.split("+").join("|"), "gi"),
          function (match) {
            return "<span class='yellow'>" + match + "</span>";
          }
        );
      }
      return text;
    },
  },
});
</script>

<style scoped>
.card {
  page-break-inside: avoid;
}
.card-title {
  font-weight: bold;
}
.halfway-fab {
  bottom: -32px;
  right: 10px;
}
</style>
