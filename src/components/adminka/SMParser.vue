<template>
  <div>
    <SMurlService />
    <table>
      <thead>
        <tr>
          <th>Pattern (Регулярка)</th>
          <th>file (сущность)</th>
          <th>query (приналдежность)</th>
          <th>
            Стиль (вид ссылки)
            <a href="/school/mcolors" target="_blank">Справочник цветов</a>
          </th>
          <th width="150">Ссылка на</th>
          <th width="90">Применять</th>
          <th width="50" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in sm_url_patterns" :key="p.id">
          <td>
            <v-text-field
              v-model="p.pattern"
              outlined
              hide-details
              dense
              type="text"
              :class="p.link_style"
            />
          </td>
          <td>
            <v-text-field
              v-model="p.file"
              outlined
              hide-details
              dense
              type="text"
            />
          </td>
          <td>
            <v-text-field
              v-model="p.query"
              outlined
              hide-details
              dense
              type="text"
            />
          </td>
          <td>
            <v-text-field
              v-model="p.link_style"
              outlined
              hide-details
              dense
              type="text"
              :class="p.link_style"
            />
          </td>
          <td>
            <v-select
              v-if="urlResource.length > 0"
              v-model="p.kod_resource"
              outlined
              hide-details
              dense
              :items="urlResource"
              item-value="id"
              item-text="url_name"
            />
          </td>
          <td>
            <v-switch v-model="p.avcive" hide-details class="pa-0 ma-0" />
          </td>
          <td>
            <BtnIconsVVue
              class="btn-small blue darken-2"
              icon="save"
              title="Сохранить изменения"
              :action="editRegPattern.bind(this, p)"
            />
          </td>
        </tr>
        <tr>
          <td>
            <v-text-field
              v-model="newPat.pattern"
              outlined
              hide-details
              dense
              type="text"
            />
          </td>
          <td>
            <v-text-field
              v-model="newPat.file"
              outlined
              hide-details
              dense
              type="text"
            />
          </td>
          <td>
            <v-text-field
              v-model="newPat.query"
              outlined
              hide-details
              dense
              type="text"
            />
          </td>
          <td>
            <v-text-field
              v-model="newPat.link_style"
              outlined
              hide-details
              dense
              type="text"
            />
          </td>
          <td>
            <v-select
              v-if="urlResource.length > 0"
              v-model="newPat.kod_resource"
              outlined
              hide-details
              dense
              :items="urlResource"
              item-value="id"
              item-text="url_name"
            />
          </td>
          <td>
            <v-switch v-model="newPat.avcive" hide-details class="pa-0 ma-0" />
          </td>
          <td>
            <BtnIconsVVue
              colorbtn="indigo"
              color="white"
              icon="add"
              title="Добавить"
              :action="addRegPattern.bind(this, newPat)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import SMurlService from "@/views/SMurlService.vue";
import { mapGetters, mapState } from "pinia";
import BtnIconsVVue from "@/components/basic/BtnIconsV.vue";
import { useServiceManagerStore } from "@/store/modules/ServiceManagerData";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    SMurlService,
    BtnIconsVVue,
  },
  setup() {
    const { fetchDataGet, fetchData, r_ajax } = dataApiComposition();
    return { fetchDataGet, fetchData, r_ajax };
  },
  data() {
    return {
      newPat: {
        pattern: "",
        kod_resource: 1,
        query: "",
        link_style: "",
        avcive: true,
        file: "",
      },
    };
  },
  computed: {
    ...mapGetters(useServiceManagerStore, ["urlResource"]),
    ...mapState(useServiceManagerStore, ["sm_url_patterns"]),
  },
  mounted() {
    this.getRegPattern();
  },
  methods: {
    getRegPattern() {
      this.fetchDataGet({
        module: useServiceManagerStore,
        tables: ["url_resource", "sm_url_patterns"],
      });
    },
    editRegPattern(p) {
      this.fetchData({
        data: { sqlname: "editSMParser", ...p },
      }).then((res) => {
        if (res.count == 1) {
          this.$toast({ html: "Сохранение успешно" });
        } else {
          this.$toast({ html: "Сохранение не удалось" });
        }
      });
    },
    addRegPattern(p) {
      this.r_ajax({ sqlname: "addSMParser", ...p }).then((res) => {
        if (res.count == 1) {
          this.$toast({ html: "Добавление успешно" });
          this.newPat.pattern = "";
          this.newPat.query = "";
          this.newPat.link_style = "";
          this.newPat.file = "";
          this.newPat.avcive = true;
          this.newPat.kod_resource = 1;
          this.getRegPattern();
        } else {
          this.$toast({ html: "Добавление не удалось" });
        }
      });
    },
  },
});
</script>

<style scoped>
table,
th,
td {
  border: 1px solid silver;
  font-size: 10pt;
  padding: 4px;
}
.input-field {
  margin: 0;
}
table {
  table-layout: fixed;
}
td >>> .select-wrapper input.select-dropdown,
td >>> input[type="text"]:not(.browser-default) {
  margin: 0;
  height: 2.25rem;
}
</style>
