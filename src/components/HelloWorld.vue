<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <v-img class="mb-4" height="150" src="@/assets/logo.png" />

      <div class="text-center">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>

        <h1 class="text-h2 font-weight-bold">Vuetify</h1>
      </div>

      <div class="py-4" />

      <v-row>
        <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
            image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
            prepend-icon="mdi-abjad-hebrew"
            rounded="lg"
            variant="outlined"
          >
            <template #image>
              <v-img position="top right" />
            </template>

            <template #title>
              <h2 class="text-h5 font-weight-bold">Get started</h2>
            </template>

            <template #subtitle>
              <div class="text-subtitle-1">
                Replace this page by removing
                <v-kbd>{{ ` <HelloWorld />` }} </v-kbd> in
                <v-kbd>pages/index.vue</v-kbd>.
              </div>
            </template>

            <v-overlay
              contained
              model-value
              opacity=".12"
              persistent
              scrim="primary"
            />
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            href="https://vuetifyjs.com/"
            prepend-icon="mdi-account-cancel"
            rel="noopener noreferrer"
            rounded="lg"
            subtitle="Learn about all things Vuetify in our documentation."
            target="_blank"
            title="Documentation"
            variant="text"
          >
            <v-overlay
              contained
              model-value
              opacity=".06"
              persistent
              scrim="primary"
            />
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            href="https://vuetifyjs.com/introduction/why-vuetify/#feature-guides"
            prepend-icon="mdi-star-circle-outline"
            rel="noopener noreferrer"
            rounded="lg"
            subtitle="Explore available framework Features."
            target="_blank"
            title="Features"
            variant="text"
          >
            <v-overlay
              contained
              model-value
              opacity=".06"
              persistent
              scrim="primary"
            />
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            href="https://vuetifyjs.com/components/all"
            prepend-icon="mdi-widgets-outline"
            rel="noopener noreferrer"
            rounded="lg"
            subtitle="Discover components in the API Explorer."
            target="_blank"
            title="Components"
            variant="text"
          >
            <v-overlay
              contained
              model-value
              opacity=".06"
              persistent
              scrim="primary"
            />
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            href="https://discord.vuetifyjs.com"
            prepend-icon="mdi-account-group-outline"
            rel="noopener noreferrer"
            rounded="lg"
            subtitle="Connect with Vuetify developers."
            target="_blank"
            title="Community"
            variant="text"
          >
            <v-overlay
              contained
              model-value
              opacity=".06"
              persistent
              scrim="primary"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import {
  IAliasTableFields,
  IJMQL,
  mqlFetchQuery,
  Query,
  TMergeTInterface,
} from "@morivvv/json-sql-builder";
import { FromTables } from "@morivvv/json-sql-builder/dist/queryBuilder/FromTables";
interface IConfaBlock {
  table: "confa.block";
  name: null | string;
  kod_block: null | number;
  kod_page: number;
  content: null | string;
  kod_user: null | number;
  date_modify: null | string;
  kod_user_modify: null | number;
  date_add: null | string;
  id: number;
}
type ICBP = TMergeTInterface<
  IAliasTableFields<IConfaBlock, "b">,
  IAliasTableFields<IConfaBlock, "bp">
>;
const a: IJMQL<ICBP> = {
  from: ["confa.block:b", "confa.block:bp"],
  fields: ["b.content", "bp.content:pc", "b.id", "b.name"],
  join: ["b.kod_block=bp.id"],
};
FromTables.accessTable = ["confa"];
const test = new Query(a, 0, "", 0);

onMounted(() => {
  console.log(test.getSelect(), test.getValues());

  mqlFetchQuery<ICBP>(
    a,
    "http://localhost:3000/api/v2/restGet",
    "e86e97d517deacce309deadc96d54ae5"
  ).then((r) => {
    console.log(r);
  });
});
</script>
