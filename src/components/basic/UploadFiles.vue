<template>
  <div>
    <FilesForm @get-file-list="getFileList" />
    <div class="col">
      <v-pagination
        v-model="page"
        color="blue"
        :length="Math.ceil(searchCount / limit)"
      />
    </div>
    <v-data-table
      :caption="'Файлов ' + searchCount"
      class="striped"
      dense
      :headers="uploadFilesHeader"
      hide-default-footer
      item-key="id"
      :items="uploadFiles"
      :items-per-page="-1"
    >
      <template #[`item.original_name`]="{ item }">
        <a :href="'/' + item.file_name + '/download'" target="blank">{{
          item.original_name
        }}</a><br>
        <video
          v-if="
            item.original_name.indexOf('.avi') > 0 ||
              item.original_name.indexOf('.mp4') > 0 ||
              item.original_name.indexOf('.mkv') > 0
          "
          controls
          height="270"
          width="480"
        >
          <source :src="'/video/' + item.file_name" type="video/mp4">
        </video>
      </template>
      <template #[`item.kod_user`]="{ item }">
        <UserFio :user_id="item.kod_user" />
      </template>
      <template #[`item.kod_post`]="{ item }">
        <a
          :href="'/?terms=&search=&kod_post=' + item.kod_post"
          target="_blank"
        >{{ item.kod_post }}</a>
      </template>
      <template #[`item.active`]="{ item }">
        <SwitchV class="ma-0 pa-1" :value="item.active" />
      </template>
      <template #[`item.file_size`]="{ item }">
        {{ (item.file_size / 1024).toFixed(2) }} Кб
      </template>
      <template #[`item.del`]="{ item }">
        <BtnIconsVVue
          :action="delFile.bind(this, item.file_name)"
          color="red"
          colorbtn="whte"
          icon="delete"
          :title="'Удалить файл с сервера (физическое удаление)'"
        />
      </template>
      <template #[`item.create_time`]="{ item }">
        {{ $moment(item.create_time).format("DD MMMM YYYY hh:mm:ss") }}
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import BtnIconsVVue from "./BtnIconsV.vue";
import FilesForm from "./FilesForm.vue";
import { defineComponent, ref, toRefs } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useAdminStore } from "@/store/modules/admin";
import { DataTableHeader } from "vuetify";
import UserFio from "../elements/UserFio.vue";
import SwitchV from "./SwitchV.vue";

export default defineComponent({
  components: {
    FilesForm,
    BtnIconsVVue,
    UserFio,
    SwitchV,
  },
  setup () {
    const { r_get, r_state, fetchData } = dataApiComposition();
    const files = ref("");
    const page = ref(1);
    const limit = ref(50);
    const uploadFilesHeader: DataTableHeader[] = [
      { text: "#", value: "n", divider: true },
      { text: "Файл", value: "original_name", divider: true },
      { text: "Размер", value: "file_size", divider: true },
      { text: "Пользователь", value: "kod_user", divider: true },
      { text: "Загружен", value: "create_time", divider: true },
      { text: "Связь", value: "kod_post", divider: true },
      { text: "Доступ", value: "active", divider: true },
      { text: "Удалить", value: "del", divider: true },
    ];
    const { uploadFiles, resultMin, searchCount } = toRefs(useAdminStore());
    return {
      r_get,
      r_state,
      fetchData,
      files,
      page,
      limit,
      uploadFiles,
      resultMin,
      searchCount,
      uploadFilesHeader,
    };
  },
  watch: {
    resultMin () {
      this.getFileList();
    },
    page (newVal) {
      this.r_state(useAdminStore, "resultMin", (newVal - 1) * this.limit);
      this.getFileList();
    },
  },
  mounted () {
    this.getFileList();
  },
  methods: {
    delFile (file: string) {
      if (!confirm("Удалить файл?")) {
        return;
      }
      this.fetchData({
        url: file + "/delete",
        data: {},
      }).then((r) => {
        this.$toast({ html: r.result });
        this.getFileList();
      });
    },
    getFileList () {
      this.r_get(
        {
          fields: [
            "f.active",
            "row_number() over(ORDER BY f.id):n",
            "f.original_name",
            "f.create_time",
            "f.file_name",
            "a.kod_post",
            "f.file_size",
            "f.kod_user",
          ],
          from: ["upload_files:f", "bz_post_attach:a"],
          join: ["f.id=(+)a.kod_file"],
          sort: ["-f.id"],
          limit: this.limit,
          page: 1 + this.resultMin / this.limit,
        },
        "uploadFiles",
        useAdminStore
      );
      this.r_get({
        fields: ["count(1):count"],
        from: ["upload_files:f"],
      }).then((r) => {
        if (r.length > 0) {
          this.r_state(useAdminStore, "searchCount", r[0].count);
        }
      });
    },
  },
});
</script>
