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
              :class="p.link_style"
              dense
              hide-details
              outlined
              type="text"
            />
          </td>
          <td>
            <v-text-field
              v-model="p.file"
              dense
              hide-details
              outlined
              type="text"
            />
          </td>
          <td>
            <v-text-field
              v-model="p.query"
              dense
              hide-details
              outlined
              type="text"
            />
          </td>
          <td>
            <v-text-field
              v-model="p.link_style"
              :class="p.link_style"
              dense
              hide-details
              outlined
              type="text"
            />
          </td>
          <td>
            <v-select
              v-if="urlResource.length > 0"
              v-model="p.kod_resource"
              dense
              hide-details
              item-text="url_name"
              item-value="id"
              :items="urlResource"
              outlined
            />
          </td>
          <td>
            <v-switch v-model="p.avcive" class="pa-0 ma-0" hide-details />
          </td>
          <td>
            <BtnIconsVVue
              :action="editRegPattern.bind(this, p)"
              class="btn-small blue darken-2"
              icon="save"
              title="Сохранить изменения"
            />
          </td>
        </tr>
        <tr>
          <td>
            <v-text-field
              v-model="newPat.pattern"
              dense
              hide-details
              outlined
              type="text"
            />
          </td>
          <td>
            <v-text-field
              v-model="newPat.file"
              dense
              hide-details
              outlined
              type="text"
            />
          </td>
          <td>
            <v-text-field
              v-model="newPat.query"
              dense
              hide-details
              outlined
              type="text"
            />
          </td>
          <td>
            <v-text-field
              v-model="newPat.link_style"
              dense
              hide-details
              outlined
              type="text"
            />
          </td>
          <td>
            <v-select
              v-if="urlResource.length > 0"
              v-model="newPat.kod_resource"
              dense
              hide-details
              item-text="url_name"
              item-value="id"
              :items="urlResource"
              outlined
            />
          </td>
          <td>
            <v-switch v-model="newPat.avcive" class="pa-0 ma-0" hide-details />
          </td>
          <td>
            <BtnIconsVVue
              :action="addRegPattern.bind(this, newPat)"
              color="white"
              colorbtn="indigo"
              icon="add"
              title="Добавить"
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
  setup () {
    const { fetchDataGet, fetchData, r_ajax } = dataApiComposition();
    return { fetchDataGet, fetchData, r_ajax };
  },
  data () {
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
  mounted () {
    this.getRegPattern();
  },
  methods: {
    getRegPattern () {
      this.fetchDataGet({
        module: useServiceManagerStore,
        tables: ["url_resource", "sm_url_patterns"],
      });
    },
    editRegPattern (p) {
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
    addRegPattern (p) {
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
