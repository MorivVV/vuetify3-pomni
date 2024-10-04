<template>
  <v-card>
    <v-card-title primary-title> Фильтры для скачивания логов </v-card-title>
    <v-card-text>
      <v-row class="ma-1">
        <v-col cols="2">
          <v-select
            v-model="filter.typeLog"
            clearable
            outlined
            hide-details=""
            dense
            label="Расширение файлов"
            :items="typesLogs"
            prepend-icon="settings_input_hdmi"
          />
        </v-col>
        <v-col cols="2">
          <DatetimePickerV
            v-model="filter.datebeg"
            class="v-input--dense v-text-field--outlined"
            :time-picker-props="timeProps"
            :date-picker-props="{ 'first-day-of-week': 1 }"
            time-format="HH:mm:ss"
            datetime="timestamp"
            label="Период с"
          />
        </v-col>
        <v-col cols="2">
          <DatetimePickerV
            v-model="filter.dateend"
            class="v-input--dense v-text-field--outlined"
            :time-picker-props="timeProps"
            :date-picker-props="{ 'first-day-of-week': 1 }"
            time-format="HH:mm:ss"
            datetime="timestamp"
            label="Период по"
          />
        </v-col>

        <v-col cols="3">
          <v-text-field
            v-model="filter.fileName"
            outlined
            hide-details=""
            dense
            clearable
            label="Совпадение в названии файла"
          />
        </v-col>
        <v-col cols="1">
          <BtnIconsV
            colorbtn="blue darken-2"
            color="white"
            class="small-btn"
            :action="getServerLogs"
            icon="cloud_download"
            title="Скачать логи с сервера"
          />
        </v-col>
        <v-col cols="1">
          <BtnIconsV
            colorbtn="blue darken-4"
            color="white"
            class="small-btn"
            :action="getServerLogList"
            icon="pageview"
            title="Посмотреть список файлов на сервере"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card>
      <v-card-text>
        <div>
          Файлы с логами (.log) построены по следующему принципу - сохранение в
          новый файл каждый час, где в названии
        </div>
        <div>cron_ = задания по расписанию</div>
        <div>server_ = работа с запросами с badkend сайта</div>
        <div>
          errors_ = только ошибки (ошибки так же дублируются в основной файл)
        </div>
      </v-card-text>
      <v-card-text>
        .tar.gz - это архив всех файлов с логами за сутки T-1, где 2023112400 в
        формате год месяц дата 00часов, в таком файле будут логи за 23 ноября
        2023г
      </v-card-text>
      <v-card-text>
        В списке файлов так же можно получить файл .xlsx из выгрузок за текущий
        день
      </v-card-text>
    </v-card>
    <DataTableV
      caption="Список файлов на сервере"
      :items="fileList"
      :headers="HeadersServerFiles"
    >
      <template #[`item.stat.atime`]="{ item }">
        {{ moment(item.stat.ctime).format(momentFormatFull) }}
      </template>
      <template #[`item.stat.mtime`]="{ item }">
        {{ moment(item.stat.mtime).format(momentFormatFull) }}
      </template>
      <template #[`item.stat.size`]="{ item }">
        <span v-if="item.stat.size > 2000000">
          {{ Number(item.stat.size / 1024 / 1024).toFixed(2) }} Мб
        </span>
        <span v-else> {{ Number(item.stat.size / 1024).toFixed(2) }} Кб </span>
        <BtnIconsV
          colorbtn="blue darken-2"
          color="white"
          class="small-btn"
          :action="() => getServerFile(item)"
          icon="cloud_download"
          title="Скачать файл"
        />
      </template>
    </DataTableV>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { HeadersServerFiles } from "./HeadersServerFiles";
import BtnIconsV from "@/components/basic/BtnIconsV.vue";
import { IServerLogsGet } from "@/types/restApi";
import DatetimePickerV from "../../basic/DatetimePickerV.vue";
import DataTableV from "@/components/basic/DataTableV.vue";
import moment from "moment";
import { momentFormatFull } from "@/const/timeFormats";

interface IFileStat {
  dev: number;
  mode: number;
  nlink: number;
  uid: number;
  gid: number;
  rdev: number;
  blksize: number;
  ino: number;
  size: number;
  blocks: number;
  atimeMs: number;
  mtimeMs: number;
  ctimeMs: number;
  birthtimeMs: number;
  atime: string;
  mtime: string;
  ctime: string;
  birthtime: string;
}
interface IServerFileInfo {
  filename: string;
  path: string;
  stat: IFileStat;
}

const { r_getFile, r_fetch } = dataApiComposition();
const filter = ref<IServerLogsGet>({
  typeLog: "txt",
  datebeg: new Date(Date.now() - 60000).toISOString(),
  dateend: new Date().toISOString(),
});
const typesLogs = ["txt", "log", "json", "xlsx", "gz"];
const fileList = ref<IServerFileInfo[]>([]);
const timeProps = {
  format: "24hr",
  useSeconds: true,
  ampmInTitle: true,
};
const getServerLogs = () => {
  r_getFile(filter.value as any, "", "serverLogs");
};
const getServerFile = (item: IServerFileInfo) => {
  const filter = {
    fileName: item.filename,
    typeLog: String(item.filename.split(".").pop()),
    datebeg: item.stat.mtimeMs - 1000,
    dateend: item.stat.mtimeMs + 5 * 60 * 1000,
  };
  r_getFile(filter, "", "serverLogs");
};
const getServerLogList = () => {
  r_fetch("api/v2/serverLogs", { view: "" }).then((r) => {
    fileList.value = r;
  });
};
</script>
