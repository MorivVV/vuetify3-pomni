<template>
  <v-container>
    <v-dialog v-model="activatePlayer" width="800">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Потоковое вещание
        </v-card-title>

        <v-card-text class="text-center">
          <video id="videoElement" controls width="720" />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="activatePlayer = false">
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <table>
      <colgroup>
        <col>
        <col>
        <col>
        <col>
        <col>
        <col>
        <col>
        <col>
        <col>
        <col>
        <col>
        <col>
      </colgroup>
      <thead>
        <tr>
          <th rowspan="2">
            <span><div><span>Канал</span><span /></div></span>
          </th>
          <th rowspan="2">
            <span><div><span>Ипя потока</span><span /></div></span>
          </th>
          <th rowspan="2">
            <span><div><span>ID</span><span /></div></span>
          </th>
          <th rowspan="2">
            <span><div><span>IP</span><span /></div></span>
          </th>
          <th colspan="3">
            <span><div><span>Audio</span><span /></div></span>
          </th>
          <th colspan="3">
            <span><div><span>Video</span><span /></div></span>
          </th>
          <th rowspan="2">
            <span><div><span>Запуск</span><span /></div></span>
          </th>
          <th rowspan="2">
            <span><div><span>Зрители</span><span /></div></span>
          </th>
        </tr>
        <tr>
          <th>
            <span><div><span>кодек</span><span /></div></span>
          </th>
          <th>
            <span><div><span>частота</span><span /></div></span>
          </th>
          <th>
            <span><div><span>канал</span><span /></div></span>
          </th>
          <th>
            <span><div><span>кодек</span><span /></div></span>
          </th>
          <th>
            <span><div><span>разрешение</span><span /></div></span>
          </th>
          <th>
            <span><div><span>fps</span><span /></div></span>
          </th>
        </tr>
      </thead>
      <tbody
        v-for="(streamChanel, chanelName) in streamList"
        :key="'stream' + chanelName"
      >
        <StreamInfoVue
          v-for="(stream, index) in streamChanel"
          :key="'stream' + chanelName + index"
          :chanel-name="chanelName"
          :stream="stream"
          :stream-name="index"
          @view-player="viewPlayer"
        />
      </tbody>
    </table>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StreamInfoVue from "./streams/StreamInfo.vue";
import FlvJs from "node_modules/flv.js/d.ts/flv.d";
import flvjs from "flv.js";

export default defineComponent({
  components: {
    StreamInfoVue,
  },
  data () {
    return {
      streamList: {} as StreamMedia,
      flvPlayer: {} as FlvJs.Player,
      interval: 0,
      activatePlayer: false,
    };
  },
  watch: {
    activatePlayer (newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (flvjs.isSupported()) {
            const videoElement = document.getElementById("videoElement");
            this.flvPlayer = flvjs.createPlayer({
              type: "flv",
              url: "http://" + location.hostname + ":8000/live/test.flv",
            });

            this.flvPlayer.attachMediaElement(videoElement as HTMLMediaElement);
            this.flvPlayer.load();
            this.flvPlayer.play();
            this.$projectDebug(this.flvPlayer);
          }
        });
      } else {
        this.flvPlayer.destroy();
      }
    },
  },
  mounted () {
    this.getStreams();
    this.interval = setInterval(() => {
      this.getStreams();
    }, 5000);
  },
  beforeUnmount () {
    clearInterval(this.interval);
  },
  methods: {
    viewPlayer () {
      this.activatePlayer = true;
    },
    getStreams () {
      fetch("http://" + location.hostname + ":8000/api/streams", {
        headers: {
          method: "GET",
          authorization: "Basic YWRtaW46YWRtaW4=",
        },
      })
        .then((res) => res.json())
        .then((r) => {
          const streamData = r as StreamMedia;
          this.streamList = streamData;
        });
    },
  },
});
</script>
