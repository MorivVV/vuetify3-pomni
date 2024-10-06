<template lang="pug">
v-container
  v-row(justify="center")
    v-btn(@click="init") New
  v-row
    v-col(cols="12")
      .board
        template(v-for="(cells, j) in gameStatus")
          span(v-for="(cell, i) in cells" :key="'line'+j+i")
            ChessCellVue( :key="'fig_' +j+ i + cell.color" :id="'fig_' + i + cell.color"
            :color="cell.color"
            :figure="cell.figure"
            :available="cell.available"
            :active="cell.active"
            @activeteCell = "activeteCell(cell)"
            )
        .lines
          span.char-lines.text-right(v-for="j in 8" :key="'h__'+j") {{ String.fromCharCode(j+64) }}
    v-col(cols="12")
      span.ma-1(v-for="m, ind in moved" :key="'move_'+ind+m") {{m}}
</template>

<script lang="ts">
import { Board } from "@/classes/chess/Board";
import { Cell } from "@/classes/chess/Cell";
import { defineComponent } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useAutorizationStore } from "@/store/modules/autorization";
import { useGamesStore } from "@/store/modules/games";
import { useWebsocketStore } from "@/store/modules/websocket";
import { mapGetters, mapState } from "pinia";
import ChessCellVue from "./ChessCell.vue";

export default defineComponent({
  components: { ChessCellVue },
  setup () {
    const { r_get } = dataApiComposition();
    return { r_get };
  },
  data () {
    return {
      gameStatus: {} as Cell[][],
      moved: [] as string[],
      msgId: 0,
    };
  },
  computed: {
    ...mapState(useGamesStore, ["basicFigureBlack"]),
    ...mapState(useWebsocketStore, ["wsConnect"]),
    ...mapGetters(useAutorizationStore, ["userId", "userToken"]),
  },
  mounted () {
    this.init();
  },
  methods: {
    activeteCell (cell: Cell, wsSend = true) {
      console.log(cell);
      if (wsSend) {
        this.msgId = Date.now();
        const mess: MessageWS = {
          id: this.msgId,
          text: "<p>dfsef</p>",
          action: "message",
          token: "",
          date_add: 1660672344781,
          to: "",
          user: {
            fio: "Моривец Владимир",
            token: this.userToken,
          },
          room: 1,
        };
        mess.id = Date.now();
        mess.text = JSON.stringify({ x: cell.x, y: cell.y });
        mess.user.fio = "Шахматиск";
        mess.action = "chess";
        console.log(this.wsConnect);

        (this.wsConnect as WebSocket).send(JSON.stringify(mess));
      }
      if (cell.isEmpty() && !cell.available) {
        return;
      }
      if (cell.available) {
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            const target = this.gameStatus[i][j];

            if (target.active) {
              target.moveFigure(cell);
              console.log(target);
            }
            target.active = false;
          }
        }
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            const target = this.gameStatus[i][j];
            target.available = false;
            target.active = false;
          }
        }
      } else {
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            const target = this.gameStatus[i][j];
            target.active = false;
            if (cell.figure?.canMove(target as Cell)) {
              target.available = true;
            } else {
              target.available = false;
            }
          }
        }
        cell.active = true;
      }
    },
    init () {
      const board = new Board();
      board.initCells();
      board.addFigures();
      console.log(board);
      console.log(this.gameStatus);

      this.gameStatus = board.cells;
      console.log(this.gameStatus);
      (this.wsConnect as WebSocket).onmessage = (msg: { data: string }) => {
        const dataMsg = JSON.parse(msg.data);
        if (dataMsg.id !== this.msgId) {
          const coord = JSON.parse(dataMsg.text);
          const cell = board.getCell(coord.x, coord.y);
          this.activeteCell(cell, false);
          console.log(coord);
        }
      };
    },
  },
});
</script>

<style scoped>
.board {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: calc(100px * 8 + 45px);
  height: calc(100px * 8 + 60px);
}
.lines {
  width: calc(100px * 8 + 45px);
}
.char-lines {
  color: black;
  width: 100px;
  display: inline-block;
  font-size: 36px;
}
.num-lines {
  color: black;
  font-size: 36px;
  width: 45px;
}
</style>
