<template>
  <v-card height="500">
    <v-row class="ma-0">
      <v-col
        class="blue white-text ma-0 rounded-lg rounded-b-0 text-center"
        cols="12"
        style="height: 50px"
      >{{ torrent.title }}</v-col>

      <v-col class="text-center text-h5" cols="12">
        {{ (torrent.torrent_size / 1024 / 1024 / 1024).toFixed(2) }}
        Гб</v-col>
      <v-col cols="12"><v-img contain height="350" :src="torrent.poster" /></v-col>
      <v-expansion-panels v-if="TorrData.TorrServer.Files">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-col cols="auto">{{ TorrData.TorrServer.Files.length }} Файл</v-col>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list dense>
              <v-subheader>Файлы</v-subheader>
              <v-list-item-group color="primary">
                <v-list-item
                  v-for="file in TorrData.TorrServer.Files"
                  :key="'f' + file.id"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="
                        file.path.substring(
                          file.path.length - 25,
                          file.path.length
                        ) +
                          ' ' +
                          (file.length / 1024 / 1024).toFixed(2) +
                          ' Mb'
                      "
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
export default Vue.extend({
  props: {
    torrent: { type: Object as PropType<TorrentInfo> },
  },
  computed: {
    TorrData (): ServerData {
      return JSON.parse(this.torrent.data);
    },
  },
});
</script>
