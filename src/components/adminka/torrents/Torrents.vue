<template>
  <v-container>
    <v-row> test </v-row>
    <v-row class="ma-1">
      <v-col
        v-for="torrent in torrentList"
        :key="'row_' + torrent.title"
        cols="12"
        lg="3"
        md="4"
        xl="2"
      >
        <TorrentCartVue :torrent="torrent" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import TorrentCartVue from "./TorrentCart.vue";
import { defineComponent } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";

export default defineComponent({
  components: { TorrentCartVue },
  setup () {
    const { r_fetch } = dataApiComposition();
    return { r_fetch };
  },
  data () {
    return {
      torrentList: [
        {
          title: "Dark.Complete.Series.1080p",
          poster:
            "https://i5.imageban.ru/out/2020/07/02/d22a89a015ad3d1ccdfd47304ad52e53.png",
          data: '{"TorrServer":{"Files":[{"id":1,"path":"Dark.Complete.Series.1080p/Dark.S01E01.mkv","length":4516723647},{"id":2,"path":"Dark.Complete.Series.1080p/Dark.S01E02.mkv","length":3775933727},{"id":3,"path":"Dark.Complete.Series.1080p/Dark.S01E03.mkv","length":3819354729},{"id":4,"path":"Dark.Complete.Series.1080p/Dark.S01E04.mkv","length":3836333096},{"id":5,"path":"Dark.Complete.Series.1080p/Dark.S01E05.mkv","length":3693636285},{"id":6,"path":"Dark.Complete.Series.1080p/Dark.S01E06.mkv","length":4378143784},{"id":7,"path":"Dark.Complete.Series.1080p/Dark.S01E07.mkv","length":4353412854},{"id":8,"path":"Dark.Complete.Series.1080p/Dark.S01E08.mkv","length":4149433128},{"id":9,"path":"Dark.Complete.Series.1080p/Dark.S01E09.mkv","length":4786998204},{"id":10,"path":"Dark.Complete.Series.1080p/Dark.S01E10.mkv","length":4961892705},{"id":11,"path":"Dark.Complete.Series.1080p/Dark.S02E01.mkv","length":4900908181},{"id":12,"path":"Dark.Complete.Series.1080p/Dark.S02E02.mkv","length":5163592349},{"id":13,"path":"Dark.Complete.Series.1080p/Dark.S02E03.mkv","length":6042064105},{"id":14,"path":"Dark.Complete.Series.1080p/Dark.S02E04.mkv","length":5400475000},{"id":15,"path":"Dark.Complete.Series.1080p/Dark.S02E05.mkv","length":4972890546},{"id":16,"path":"Dark.Complete.Series.1080p/Dark.S02E06.mkv","length":5913018250},{"id":17,"path":"Dark.Complete.Series.1080p/Dark.S02E07.mkv","length":5173552627},{"id":18,"path":"Dark.Complete.Series.1080p/Dark.S02E08.mkv","length":5587422931},{"id":19,"path":"Dark.Complete.Series.1080p/Dark.S03E01.mkv","length":3959851529},{"id":20,"path":"Dark.Complete.Series.1080p/Dark.S03E02.mkv","length":4022991674},{"id":21,"path":"Dark.Complete.Series.1080p/Dark.S03E03.mkv","length":3496696394},{"id":22,"path":"Dark.Complete.Series.1080p/Dark.S03E04.mkv","length":3868955870},{"id":23,"path":"Dark.Complete.Series.1080p/Dark.S03E05.mkv","length":4010444112},{"id":24,"path":"Dark.Complete.Series.1080p/Dark.S03E06.mkv","length":3519146739},{"id":25,"path":"Dark.Complete.Series.1080p/Dark.S03E07.mkv","length":4170087052},{"id":26,"path":"Dark.Complete.Series.1080p/Dark.S03E08.mkv","length":5694609087}]}}',
          timestamp: 1652551776,
          name: "Dark.Complete.Series.1080p",
          hash: "d3e98b2e0480112916f30f2d39cd154ba71cd00d",
          stat: 3,
          stat_string: "Torrent working",
          loaded_size: 225853440,
          torrent_size: 118168568605,
          preloaded_bytes: 209715200,
          total_peers: 73,
          pending_peers: 51,
          active_peers: 22,
          connected_seeders: 11,
          half_open_peers: 1,
          bytes_written: 7319506,
          bytes_read: 3273886263,
          bytes_read_data: 3269001216,
          bytes_read_useful_data: 2977316864,
          chunks_read: 199524,
          chunks_read_useful: 181721,
          chunks_read_wasted: 17803,
          pieces_dirtied_good: 353,
          file_stats: [
            {
              id: 1,
              path: "Dark.Complete.Series.1080p/Dark.S01E01.mkv",
              length: 4516723647,
            },
            {
              id: 2,
              path: "Dark.Complete.Series.1080p/Dark.S01E02.mkv",
              length: 3775933727,
            },
            {
              id: 3,
              path: "Dark.Complete.Series.1080p/Dark.S01E03.mkv",
              length: 3819354729,
            },
            {
              id: 4,
              path: "Dark.Complete.Series.1080p/Dark.S01E04.mkv",
              length: 3836333096,
            },
            {
              id: 5,
              path: "Dark.Complete.Series.1080p/Dark.S01E05.mkv",
              length: 3693636285,
            },
            {
              id: 6,
              path: "Dark.Complete.Series.1080p/Dark.S01E06.mkv",
              length: 4378143784,
            },
            {
              id: 7,
              path: "Dark.Complete.Series.1080p/Dark.S01E07.mkv",
              length: 4353412854,
            },
            {
              id: 8,
              path: "Dark.Complete.Series.1080p/Dark.S01E08.mkv",
              length: 4149433128,
            },
            {
              id: 9,
              path: "Dark.Complete.Series.1080p/Dark.S01E09.mkv",
              length: 4786998204,
            },
            {
              id: 10,
              path: "Dark.Complete.Series.1080p/Dark.S01E10.mkv",
              length: 4961892705,
            },
            {
              id: 11,
              path: "Dark.Complete.Series.1080p/Dark.S02E01.mkv",
              length: 4900908181,
            },
            {
              id: 12,
              path: "Dark.Complete.Series.1080p/Dark.S02E02.mkv",
              length: 5163592349,
            },
            {
              id: 13,
              path: "Dark.Complete.Series.1080p/Dark.S02E03.mkv",
              length: 6042064105,
            },
            {
              id: 14,
              path: "Dark.Complete.Series.1080p/Dark.S02E04.mkv",
              length: 5400475000,
            },
            {
              id: 15,
              path: "Dark.Complete.Series.1080p/Dark.S02E05.mkv",
              length: 4972890546,
            },
            {
              id: 16,
              path: "Dark.Complete.Series.1080p/Dark.S02E06.mkv",
              length: 5913018250,
            },
            {
              id: 17,
              path: "Dark.Complete.Series.1080p/Dark.S02E07.mkv",
              length: 5173552627,
            },
            {
              id: 18,
              path: "Dark.Complete.Series.1080p/Dark.S02E08.mkv",
              length: 5587422931,
            },
            {
              id: 19,
              path: "Dark.Complete.Series.1080p/Dark.S03E01.mkv",
              length: 3959851529,
            },
            {
              id: 20,
              path: "Dark.Complete.Series.1080p/Dark.S03E02.mkv",
              length: 4022991674,
            },
            {
              id: 21,
              path: "Dark.Complete.Series.1080p/Dark.S03E03.mkv",
              length: 3496696394,
            },
            {
              id: 22,
              path: "Dark.Complete.Series.1080p/Dark.S03E04.mkv",
              length: 3868955870,
            },
            {
              id: 23,
              path: "Dark.Complete.Series.1080p/Dark.S03E05.mkv",
              length: 4010444112,
            },
            {
              id: 24,
              path: "Dark.Complete.Series.1080p/Dark.S03E06.mkv",
              length: 3519146739,
            },
            {
              id: 25,
              path: "Dark.Complete.Series.1080p/Dark.S03E07.mkv",
              length: 4170087052,
            },
            {
              id: 26,
              path: "Dark.Complete.Series.1080p/Dark.S03E08.mkv",
              length: 5694609087,
            },
          ],
        },
      ] as TorrentInfo[],
    };
  },
  mounted () {
    this.getTor();
  },
  methods: {
    getTor () {
      this.r_fetch("torrents", {
        action: "list",
      }).then((r) => (this.torrentList = r));
    },
  },
});
</script>
