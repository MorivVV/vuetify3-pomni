<template>
  <v-expansion-panel>
    <template v-if="u.children.length > 0">
      <v-expansion-panel-title
        class="pt-0 pb-0"
        :class="{ 'router-link-active': ~$route.path.indexOf(u.name) }"
        :style="{ padding: '0 5px 0 16px' }"
      >
        <v-row align="center">
          <v-col cols="2">
            <v-icon :class="u.meta?.class">
              {{ u.meta?.icon }}
            </v-icon>
          </v-col>
          <v-col class="font-weight-bold" cols="10">
            {{ u.title }}
          </v-col>
          <v-divider />
        </v-row>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="pt-0 pb-0 blue-grey lighten-5">
        <v-expansion-panels :id="uniq_id" accordion>
          <MenuElement
            v-for="(c, i) in u.children"
            :key="i + 'child_' + c.name"
            :u="c"
          />
        </v-expansion-panels>
      </v-expansion-panel-text>
    </template>
    <v-list-item
      v-else
      active-class="indigo--text"
      :class="{ 'router-link-active': ~$route.path.indexOf(u.name) }"
      exact
      link
      :to="u.href"
    >
      <v-row align="center">
        <v-col cols="2">
          <v-icon :class="u.meta?.class">
            {{ u.meta?.icon }}
          </v-icon>
        </v-col>
        <v-col class="font-weight-medium" cols="10">
          {{ u.title }}
        </v-col>
      </v-row>
    </v-list-item>
  </v-expansion-panel>
</template>

<script lang="ts">
import { uniq_id } from "@/compositionApi/UniqIDGenerate";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MenuElement",
  props: {
    u: { type: Object, required: true },
  },
  setup () {
    return { uniq_id: uniq_id() };
  },
});
</script>

<style scoped>
.router-link-active {
  background-color: rgba(0, 0, 0, 0.1);
  border-left: 1px solid white;
  border-right: 1px solid white;
  border-bottom: 1px solid rgb(119, 121, 118);
  border-top: 1px solid rgb(119, 121, 118);
}
.pt-0.pb-0 >>> .v-expansion-panel-content__wrap {
  padding: 2px 10px 10px;
}
</style>
