<template>
  <v-row align="center" class="ma-0" dense>
    <v-col cols="11" md="6">
      <v-text-field
        dense
        hide-details
        label="Введите текст для поиска"
        outlined
        :value="search"
        @input="setSearch"
        @keypress.enter="setSearch"
      />
    </v-col>
    <v-col cols="10" md="2">
      <v-menu
        ref="menu"
        v-model="dateBegMenu"
        v-model:return-value="date_beg"
        :close-on-content-click="false"
        min-width="auto"
        offset-y
        transition="scale-transition"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            dense
            hide-details
            label="Период с"
            outlined
            prepend-icon="mdi-calendar"
            readonly
            :value="date_beg"
            v-bind="attrs"
            v-on="on"
          />
        </template>
        <v-date-picker scrollable :value="date_beg" @input="setDateBeg" />
      </v-menu>
    </v-col>
    <v-col cols="10" md="2">
      <v-menu
        ref="menu"
        v-model="dateEndMenu"
        v-model:return-value="date_end"
        :close-on-content-click="false"
        min-width="auto"
        offset-y
        transition="scale-transition"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            dense
            hide-details
            label="Период по"
            outlined
            prepend-icon="mdi-calendar"
            readonly
            :value="date_end"
            v-bind="attrs"
            v-on="on"
          />
        </template>
        <v-date-picker scrollable :value="date_end" @input="setDateEnd" />
      </v-menu>
    </v-col>
    <v-col cols="2" md="1">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-badge
            color="blue"
            :content="searchCount"
            overlap
            :value="searchCount"
          >
            <v-icon
              large
              v-bind="attrs"
              v-on="on"
              @click.stop="setSearch('', $event)"
            >
              backspace
            </v-icon>
          </v-badge>
        </template>
        <span>Очистить поле поиска</span>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { usePostDataStore } from "@/store/modules/postsData";
import {
  _ActionsTree,
  _GettersTree,
  StateTree,
  Store,
  StoreDefinition,
} from "pinia";

export default defineComponent({
  props: {
    useState: {
      type: Function as PropType<StoreDefinition>,
      default: () => usePostDataStore,
    },
  },
  setup () {
    const { r_state } = dataApiComposition();
    return { r_state };
  },
  data () {
    return {
      store: undefined as
        | Store<string, StateTree, _GettersTree<StateTree>, _ActionsTree>
        | undefined,
      timeDelay: 0,
      dateBegMenu: false,
      dateEndMenu: false,
    };
  },
  computed: {
    search (): string {
      let search = "";
      if (this.store && "search" in this.store) {
        search = String(this.store.search);
      }
      return search;
    },
    searchCount (): string {
      let searchCount = "";
      if (this.store && "searchCount" in this.store) {
        searchCount = String(this.store.searchCount);
      }
      return searchCount;
    },
    date_beg (): string {
      let date_beg = "";
      if (this.store && "dateBeg" in this.store) {
        date_beg = String(this.store.dateBeg);
      }
      return date_beg;
    },
    date_end (): string {
      let date_end = "";
      if (this.store && "dateEnd" in this.store) {
        date_end = String(this.store.dateEnd);
      }
      return date_end;
    },
  },
  mounted () {
    this.store = this.useState();
    if (this.date_beg === "") {
      this.setDateBeg(this.$moment().subtract(1, "year").format("YYYY-MM-DD"));
    }
    if (this.date_end === "") {
      this.setDateEnd(this.$moment().add(1, "day").format("YYYY-MM-DD"));
    }
  },
  methods: {
    setDateBeg (d: string) {
      this.r_state(this.useState, "dateBeg", d);
      this.dateBegMenu = false;
    },
    setDateEnd (d: string) {
      this.r_state(this.useState, "dateEnd", d);
      this.dateEndMenu = false;
    },
    setSearch (s = "", event) {
      if (this.timeDelay) {
        clearTimeout(this.timeDelay);
      }
      let search = "";

      if (event && "value" in event.target) {
        search = event.target.value;
      } else {
        search = s;
      }
      this.timeDelay = setTimeout(() => {
        this.r_state(this.useState, "resultMin", 0);
        this.r_state(this.useState, "search", search);
      }, 300);
    },
  },
});
</script>

<style scoped>
.lem5 {
  margin-left: -18px;
  margin-right: 10px;
  margin-left: -5px;
  cursor: pointer;
}
</style>

<style scoped>
input {
  height: 2rem;
}
label {
  top: -7px;
}
i.material-icons.prefix {
  top: 0;
}
</style>
