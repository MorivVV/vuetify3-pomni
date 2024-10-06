<template>
  <v-container fluid>
    <v-data-iterator
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      hide-default-footer
      :items="items"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
    >
      <template #header>
        <v-toolbar class="mb-1" color="blue darken-3" dark>
          <v-text-field
            v-model="search"
            clearable
            flat
            hide-details
            label="Search"
            prepend-inner-icon="mdi-magnify"
            solo-inverted
          />
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer />
            <v-select
              v-model="sortBy"
              flat
              hide-details
              :items="keys"
              label="Sort by"
              prepend-inner-icon="mdi-magnify"
              solo-inverted
            />
            <v-spacer />
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn color="blue" depressed large :value="false">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn color="blue" depressed large :value="true">
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template #default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.naimen"
            cols="12"
            lg="3"
            md="4"
            sm="6"
          >
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                {{ item.naimen }}
              </v-card-title>
              <HomeMeterVue :meter="item" />
              <v-divider />

              <v-list dense>
                <v-list-item v-for="(key, index) in filteredKeys" :key="index">
                  <v-list-item-content
                    :class="{ 'blue--text': sortBy === key }"
                  >
                    {{ key }}:
                  </v-list-item-content>

                  <v-list-item-content
                    class="align-end"
                    :class="{ 'blue--text': sortBy === key }"
                  >
                    {{ item[key.toLowerCase()] }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template #footer>
        <v-row align="center" class="mt-2" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn
                class="ml-2"
                color="primary"
                dark
                text
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer />

          <span class="mr-4 grey--text">
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            class="mr-1"
            color="blue darken-3"
            dark
            fab
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            class="ml-1"
            color="blue darken-3"
            dark
            fab
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

// { // "id": 20, // "naimen": "Интерент", // "model": "", // "num": "", //
"kod_apartments": 1, // "kod_resource": 19, // "counter": false, // "date_add":
"2022-02-23T18:27:41.536Z", // "active": true, // "multiplicity": 1, //
"kod_drain": null, // "calc_sum": 0 // }

<script>
import HomeMeterVue from "./home/HomeMeter.vue";

export default {
  components: { HomeMeterVue },
  props: {
    items: Array,
  },
  data () {
    return {
      itemsPerPageArray: [4, 8, 12],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: "naimen",
      keys: [
        "naimen",
        "model",
        "date_add",
        "multiplicity",
        "kod_resource",
        "Sodium",
        "Calcium",
        "Iron",
      ],
    };
  },
  computed: {
    numberOfPages () {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys () {
      return this.keys.filter((key) => key !== "naimen");
    },
  },
  methods: {
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number;
    },
  },
};
</script>
