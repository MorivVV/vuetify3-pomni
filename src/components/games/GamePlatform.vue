<template>
  <v-container class="center">
    <v-row justify="center">
      Уровни
      <v-col
        v-for="m in tanksMaps"
        :key="m.id"
        cols="auto"
        class="pa-1"
        @click="
          () => {
            map = JSON.parse(m.map);
            startmove();
          }
        "
      >
        <v-card>{{ m.kod_stage }}</v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="pa-1 text-h4">
        <BtnIconsVVue
          color="orange"
          :action="() => (pause = !pause)"
          :title="'Пауза'"
          :icon="'pause'"
        />
        <BtnIconsVVue
          color="red"
          :action="() => (pause = !pause)"
          :title="'Пауза'"
          :icon="'pause'"
        />
        <BtnIconsVVue
          color="blue"
          :action="saveMap"
          :title="'Сохранить карту'"
          :icon="'save'"
        />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12">
        <v-row class="ma-1">
          <v-col>{{ player1.skin }}</v-col>
          <v-col>{{ player1.health }}</v-col>
          <v-col>{{ player1.speed }}</v-col>
          <v-col>{{ player1.x }}</v-col>
          <v-col>{{ player1.y }}</v-col>
          <v-col>{{ player1.move }}</v-col>
        </v-row>
      </v-col>

      <v-col cols="3">
        Жизни: <span class="big green-text">{{ player1.health }}</span>
        <v-row v-if="+player1.health > 0">
          <i
            v-for="k in +player1.health"
            :key="'helth_' + k"
            class="material-icons medium red-text"
            >favorite</i
          >
        </v-row>
      </v-col>
      <v-col cols="5">
        <canvas id="cnv" map="" width="832" height="832"
          >Обновите браузер</canvas
        >
      </v-col>
      <v-col cols="4">
        <v-row>
          <v-col cols="3 offset-s1">Скин</v-col>
          <v-col cols="2">Броня</v-col>
          <v-col cols="2">Скорость</v-col>
          <v-col cols="2">x</v-col>
          <v-col cols="2">y</v-col>
        </v-row>
        <v-row v-for="t in enemyTanks" :key="'et' + t.uuid">
          <v-col cols="3 offset-s1">{{ t.skin }}</v-col>
          <v-col cols="2">{{ t.health }}</v-col>
          <v-col cols="2">{{ t.speed }}</v-col>
          <v-col cols="2">{{ t.x }}</v-col>
          <v-col cols="2">{{ t.y }}</v-col>
        </v-row>
        Убито: <span class="big red-text">{{ killTanks }}</span>
        <v-row v-for="l in Math.ceil(killTanks / 10)" :key="'level_' + l">
          <template v-if="l * 10 <= killTanks">
            <i
              v-for="k in 10"
              :key="'grede_' + l + '_' + k"
              class="material-icons medium orange-text"
              >grade</i
            >
          </template>
          <template v-else>
            <i
              v-for="k in killTanks % 10"
              :key="'grede_' + l + '_' + k"
              class="material-icons medium orange-text"
              >grade</i
            >
          </template>
        </v-row>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="2"
        ><AutocompleteV
          v-if="gameObjectParams.length"
          :label="'Игрок'"
          :items="gameObjectParams"
          :item-value="'namien'"
          :item-text="'namien'"
          :extend="false"
          @input="changeSkin"
      /></v-col>
      <v-col cols="1">
        <input id="emy" v-model="maxEnemy" type="number" />
      </v-col>
      <v-col cols="2"
        ><AutocompleteV
          v-if="gameObjectParams.length"
          v-model="newBlock"
          :label="'Новый блок'"
          :items="gameObjectParams"
          :item-value="'_id'"
          :item-text="'namien'"
          :extend="false"
      /></v-col>
    </v-row>
    <GameObjectVue />
  </v-container>
</template>

<script lang="ts">
import GameObjectVue from "./GameObject.vue";
import BtnIconsVVue from "@/components/basic/BtnIconsV.vue";
import { defineComponent, toRefs } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { Tank } from "@/classes/TankBattle";
import { useGamesStore } from "@/store/modules/games";
import AutocompleteV from "../basic/AutocompleteV.vue";

export default defineComponent({
  components: {
    GameObjectVue,
    BtnIconsVVue,
    AutocompleteV,
  },
  setup() {
    const { r_get, r_insert } = dataApiComposition();
    const { tanksMaps, gameObjects, gameObjectParams } = toRefs(
      useGamesStore()
    );
    return { r_get, r_insert, tanksMaps, gameObjects, gameObjectParams };
  },
  data() {
    return {
      obj: {} as HTMLCanvasElement,
      killTanks: 0,
      babax: "babax",
      killAnimation: "test3",
      blackBlack: 3,
      maxEnemy: 5,
      track: true,
      timerId: 0,
      newBlock: 1,
      player1: {} as Tank,
      player2: {} as Tank,
      enemyTanks: [] as Tank[],
      map: [] as number[][],
      pause: false,
      blockSize: 32,
      pixelOnBlock: 8,
      cnv: {} as CanvasRenderingContext2D,
    };
  },
  computed: {
    gameObjectsList(): IGameObjects[] {
      const o = this.gameObjectParams.filter((e) => +e.speed > 0);
      return o;
    },
  },
  mounted() {
    this.getObjectParams()
      .then(() => this.getObjects())
      .then(() => this.getMaps())
      .then(() => {
        this.player1 = new Tank(
          this.blockSize * 8,
          this.blockSize * 24,
          ...this.getTankParameter("tank2")
        );
        this.obj = document.getElementById("cnv") as HTMLCanvasElement;
        this.obj.width = 26 * this.blockSize;
        this.obj.height = 26 * this.blockSize;
        this.cnv = this.obj.getContext("2d") as CanvasRenderingContext2D;
        this.obj.addEventListener("mousedown", this.mouseClick);
        this.obj.oncontextmenu = (e) => e.preventDefault();
        this.map = JSON.parse(this.tanksMaps[2].map);
        addEventListener("keydown", this.PressKey);
        //обновление карты
        this.timerId = setInterval(() => {
          if (this.pause) return;
          this.startmove();
          this.enemyMove();
          //анимация пули
          this.movePule();
        }, 30);
        //анимация волн
      });
  },
  beforeDestroy() {
    clearInterval(this.timerId);
  },
  methods: {
    getTankParameter(name: string): [string, number, number, number] {
      const p = this.gameObjectParams.filter((e) => e.namien === name)[0];
      return [p.namien, p.health, p.speed, this.blockSize];
    },
    changeSkin(e: string) {
      console.log(e);
      this.player1 = new Tank(
        this.blockSize * 8,
        this.blockSize * 24,
        ...this.getTankParameter(e)
      );
    },
    intersects(a: { x: number; size: number; y: number }, b: Tank) {
      return (
        Math.abs(a.x - b.x) < a.size + 1 && Math.abs(a.y - b.y) < a.size + 1
      );
    },
    _checkMap(telo: Tank, stopBlock: any, destroy = 0) {
      const pos = this.getVector(telo.move);
      const cloneTelo = { ...telo };
      cloneTelo[pos.coord] += (this.blockSize * pos.vector) / 4;
      const w = Math.floor(cloneTelo.x / this.blockSize);
      // let we = Math.floor((cloneTelo.x + cloneTelo.size) / this.blockSize);
      const h = Math.floor(cloneTelo.y / this.blockSize);
      // let he = Math.floor((cloneTelo.y + cloneTelo.size) / this.blockSize);

      let chk = false;
      console.log(w, h);
      if (w >= 0 && h >= 0 && w < 26 && h < 26) {
        const cell = this.map[h][w];
        const block = this.gameObjectParams.filter(
          (e) => Number(e?._id) === cell
        )[0];
        if (!("stop" in block)) {
          console.log(block);
        }
        if (+block.stop) {
          const obj = new Tank(
            this.blockSize * w,
            this.blockSize * h,
            ...this.getTankParameter(block.namien)
          );
          chk = this.intersects(cloneTelo, obj);
        }
        if (destroy && +block.crash) {
          this.map[h][w] = this.blackBlack;
        }
      } else {
        chk = true;
      }

      return chk;
    },
    checkMap(telo: Tank, stopBlock: number[], destroy = 0, debug = false) {
      let x = telo.x;
      let y = telo.y;
      let w = 0;
      let h = 0;
      const nextWay = 4;
      let ofsety1 = 0;
      let ofsety2 = 0;
      let ofsety3 = 0;
      let ofsetx1 = 0;
      let ofsetx2 = 0;
      let ofsetx3 = 0;
      let checkBlock;
      let chk = false;
      switch (telo.move) {
        case 0: //y--
          y -= nextWay;
          break;
        case 90: //x++
          x += 0;
          break;
        case 180: //y++
          y += 0;
          break;
        case 270: //x--
          x -= nextWay;
          break;
      }
      w = Math.floor(x / this.blockSize);
      h = Math.floor(y / this.blockSize);
      if (debug) {
        console.log(w, h, telo.move);
      }
      switch (telo.move) {
        case 0: //y--
          ofsetx2 = 1;
          if (x % this.blockSize > this.blockSize / 4) {
            ofsetx3 = 2;
          }
          break;
        case 90: //x++
          ofsety2 = 1;
          ofsetx1 = ofsetx2 = ofsetx3 = 2;
          if (y % this.blockSize > this.blockSize / 4) {
            ofsety3 = 2;
          }
          break;
        case 180: //y++
          ofsety1 = 2;
          ofsety2 = 2;
          ofsetx2 = 1;
          ofsety3 = 2;
          if (x % this.blockSize > this.blockSize / 4) {
            ofsetx3 = 2;
          }
          break;
        case 270: //x--
          ofsety2 = 1;
          if (y % this.blockSize > this.blockSize / 4) {
            ofsety3 = 2;
          }
          break;
      }
      if (
        w + ofsetx1 < 0 ||
        h + ofsety1 < 0 ||
        w + ofsetx1 > 25 ||
        h + ofsety1 > 25 ||
        w + ofsetx2 < 0 ||
        h + ofsety2 < 0 ||
        w + ofsetx2 > 25 ||
        h + ofsety2 > 25 ||
        w + ofsetx3 < 0 ||
        h + ofsety3 < 0 ||
        w + ofsetx3 > 25 ||
        h + ofsety3 > 25
      ) {
        chk = true;
      } else {
        checkBlock = this.map[h + ofsety1][w + ofsetx1];
        if (stopBlock.indexOf(checkBlock) !== -1) {
          if (destroy) {
            this.map[h + ofsety1][w + ofsetx1] = this.blackBlack;
          }
          chk = true;
        }
        checkBlock = this.map[h + ofsety2][w + ofsetx2];
        if (stopBlock.indexOf(checkBlock) !== -1) {
          if (destroy) {
            this.map[h + ofsety2][w + ofsetx2] = this.blackBlack;
          }
          chk = true;
        }
        checkBlock = this.map[h + ofsety3][w + ofsetx3];
        if (stopBlock.indexOf(checkBlock) !== -1) {
          if (destroy) {
            this.map[h + ofsety3][w + ofsetx3] = this.blackBlack;
          }
          chk = true;
        }
      }
      return chk;
    },
    startPyle(tank: Tank) {
      const pos = this.getVector(tank.move);
      tank.pulya.x = tank.x;
      tank.pulya.y = tank.y;
      tank.pulya.move = tank.move;
      tank.pulya[pos.coord] += this.blockSize * pos.vector;
    },
    PressKey(e: { keyCode: any; preventDefault: () => void }) {
      if (this.pause) return;

      const step = e.keyCode;
      // console.log(this.player1.x, this.player1.y);
      switch (step) {
        case 32: //пробел - выстрел
          if (this.player1.pulya.x <= 0 && this.player1.pulya.y <= 0) {
            this.startPyle(this.player1);
          }
          break;
        case 37: //лево
        case 65: //A
          this.keyMove(270, this.player1);
          break;
        case 38: //вверх
        case 87: //W
          this.keyMove(0, this.player1);
          break;
        case 39: //право
        case 68: //D
          this.keyMove(90, this.player1);
          break;
        case 40: //вниз
        case 83: //S
          this.keyMove(180, this.player1);
          break;
        default:
          return;
      }
      e.preventDefault();
    },
    getVector(grad: number) {
      let coord: "y" | "x" = "y";
      let vector = 1;
      if (grad % 180 === 90) {
        coord = "x";
      }
      if (grad === 0 || grad === 270) {
        vector = -1;
      }
      return { coord, vector };
    },
    keyMove(grad: number, object: Tank) {
      if (object.move != grad) {
        object.move = grad;
      } else {
        this.track = !this.track;
        const stops = this.gameObjectParams
          .filter((e) => +e.speed === 0 && +e.stop)
          .map((e) => Number(e._id));
        if (!this.checkMap(object, stops, 0)) {
          const pos = this.getVector(grad);
          object[pos.coord] +=
            (object.speed * pos.vector * this.blockSize) / this.pixelOnBlock;
        }
      }
    },
    enemyMove() {
      this.track = !this.track;
      const stops = this.gameObjectParams
        .filter((e) => +e.speed === 0 && +e.stop)
        .map((e) => Number(e._id));
      this.enemyTanks.forEach((e) => {
        if (this.checkMap(e, stops, 0)) {
          e.move += 90 * Math.ceil(Math.random() * 3);
          e.move = e.move % 360;
        } else {
          if (e.pulya.x < 0 && Math.ceil(Math.random() * 3) === 3) {
            this.startPyle(e);
          }
          if (e.pulya.x > 0 && Math.ceil(Math.random() * 50) === 50) {
            e.move += 90 * Math.ceil(Math.random() * 3);
            e.move = e.move % 360;
          } else {
            switch (e.move) {
              case 0:
                e.y -= (e.speed * this.blockSize) / this.pixelOnBlock;
                break;
              case 90:
                e.x += (e.speed * this.blockSize) / this.pixelOnBlock;
                break;
              case 180:
                e.y += (e.speed * this.blockSize) / this.pixelOnBlock;
                break;
              case 270:
                e.x -= (e.speed * this.blockSize) / this.pixelOnBlock;
                break;
              default:
                break;
            }
          }
        }
      });
    },
    startmove() {
      this.cnv.clearRect(0, 0, this.obj.width, this.obj.height);
      for (let o = 0; o < 26; o++)
        for (let m = 0; m < 26; m++) this.changePos(o, m, 0, this.map[m][o]);
      this.changePos(
        this.player1.x / this.blockSize,
        this.player1.y / this.blockSize,
        this.player1.move,
        this.player1.skin
      );
      if (this.enemyTanks.filter((e) => +e.health < 1)) {
        this.enemyTanks = this.enemyTanks.filter((e) => +e.health > 0);
      }

      if (this.enemyTanks.length < this.maxEnemy) {
        let enemy = this.gameObjectsList.length;
        enemy = Math.floor(Math.random() * enemy);
        const randTank = this.gameObjectsList[enemy];
        this.enemyTanks.push(
          new Tank(
            this.blockSize * Math.ceil(Math.random() * 24),
            this.blockSize * 1,
            ...this.getTankParameter(randTank.namien)
          )
        );
      }
      for (const e of this.enemyTanks) {
        this.changePos(
          e.x / this.blockSize,
          e.y / this.blockSize,
          e.move,
          e.skin
        );
        this.changePos(
          e.pulya.x / this.blockSize,
          e.pulya.y / this.blockSize,
          e.pulya.move,
          "bullet"
        );
      }
      this.changePos(
        this.player1.pulya.x / this.blockSize,
        this.player1.pulya.y / this.blockSize,
        this.player1.pulya.move,
        "bullet"
      );
    },
    genObject(name: string | number) {
      const data = this.gameObjects.filter(
        (e) => e.namien === name || e.kod_object == name
      );
      data.forEach((e) => {
        this.fr(e.x, e.y, e.width, e.heigth, e.color);
      });
    },
    movePule() {
      this.movePuleOne(this.player1.pulya);
      for (const e of this.enemyTanks) {
        this.movePuleOne(e.pulya);
      }
    },
    movePuleOne(bull: Tank, debug = false) {
      if (bull.x < 0 && bull.y < 0) {
        bull.move = this.player1.move;
        return 0;
      }
      const sel = bull.move;
      switch (sel) {
        case 0:
          bull.y -= (bull.speed * this.blockSize) / this.pixelOnBlock;
          break;
        case 180:
          bull.y += (bull.speed * this.blockSize) / this.pixelOnBlock;
          break;
        case 270:
          bull.x -= (bull.speed * this.blockSize) / this.pixelOnBlock;
          break;
        case 90:
          bull.x += (bull.speed * this.blockSize) / this.pixelOnBlock;
          break;
        default:
          break;
      }
      if (
        bull.x < 0 ||
        bull.y < 0 ||
        bull.x > this.obj.width ||
        bull.y > this.obj.height
      ) {
        bull.x = -this.blockSize * 2;
        bull.y = -this.blockSize * 2;
      }
      const stops = this.gameObjectParams
        .filter((e) => +e.speed === 0 && +e.stop && +e.crash === 0)
        .map((e) => Number(e._id));
      const crashs = this.gameObjectParams
        .filter((e) => +e.speed === 0 && +e.stop && +e.crash === 1)
        .map((e) => Number(e._id));
      if (
        this.checkMap(bull, crashs, 1, debug) ||
        this.checkMap(bull, stops, 0, debug)
      ) {
        this.changePos(
          bull.x / this.blockSize,
          bull.y / this.blockSize,
          bull.move,
          this.babax
        );
        bull.x = -this.blockSize * 2;
        bull.y = -this.blockSize * 2;
      }
      let allTanks: any[] = [];
      allTanks = allTanks.concat(this.enemyTanks);
      allTanks = allTanks.concat(this.player1);
      allTanks.forEach((e) => {
        if (this.intersects(bull, e)) {
          this.changePos(
            e.x / this.blockSize,
            e.y / this.blockSize,
            bull.move,
            this.babax
          );
          e.health--;
          if (e.health < 1) {
            this.changePos(
              e.x / this.blockSize,
              e.y / this.blockSize,
              bull.move,
              this.killAnimation
            );
            if (
              this.player1.pulya.x === bull.x &&
              this.player1.pulya.y === bull.y
            ) {
              this.killTanks++;
            }
            e.x = Math.floor(Math.random() * 4) * 256;
            e.y = 0;
          }

          bull.x = -this.blockSize * 2;
          bull.y = -this.blockSize * 2;
        }
      });
    },
    changePos(x: number, y: number, grad = 0, obj: string | number = "") {
      this.cnv.translate(x * this.blockSize, y * this.blockSize);
      this.cnv.rotate((Number(grad) * Math.PI) / 180);
      this.cnv.translate(-this.blockSize, -this.blockSize);
      if (obj) {
        this.genObject(obj);
      }
      this.cnv.translate(this.blockSize, this.blockSize);
      this.cnv.rotate((Number(-grad) * Math.PI) / 180);
      this.cnv.translate(-x * this.blockSize, -y * this.blockSize);
    },
    getMaps() {
      return this.r_get(
        {
          from: "games.battle_city",
          sort: ["kod_stage"],
          limit: 20,
          page: 1,
        },
        "tanksMaps",
        useGamesStore
      );
    },
    saveMap() {
      const level = prompt("Введите номер уровня для сохранения");
      this.r_insert({
        fields: {
          kod_stage: level,
          map: JSON.stringify(this.map),
          enemy: 20,
        },
        to: "games.battle_city",
      });
    },
    getObjects() {
      return this.r_get(
        {
          fields: [
            "o.namien",
            "gop.kod_object",
            "gop.ord",
            "gop.x",
            "gop.y",
            "gop.width",
            "gop.heigth",
            "gop.color",
          ],
          from: ["games.game_object_params:gop", "games.game_objects:o"],
          sort: ["gop.ord"],
          join: ["gop.kod_object=o.id"],
        },
        "gameObjects",
        useGamesStore
      );
    },
    getObjectParams() {
      return this.r_get(
        {
          fields: [
            "o.namien",
            "o.health",
            "o.speed",
            "o.crash",
            "o.stop",
            "o.id:_id",
          ],
          from: ["games.game_objects:o"],
          sort: ["o.namien"],
        },
        "gameObjectParams",
        useGamesStore
      );
    },
    mouseClick(e: MouseEvent) {
      const w = 1 + Math.floor(e.offsetX / this.blockSize);
      const h = 1 + Math.floor(e.offsetY / this.blockSize);
      console.log(e);
      console.log(e.offsetX, e.offsetY);
      console.log(w, h);
      if (e.button === 0) this.map[h][w] = +this.newBlock;
      if (e.button === 2) this.map[h][w] = 0;
      this.startmove();
    },
    fr(x: number, y: number, wei: number, hei: number, color = "") {
      if (color !== "") {
        this.cnv.fillStyle = color;
      }
      this.cnv.fillRect(
        (x * this.blockSize) / this.pixelOnBlock,
        (y * this.blockSize) / this.pixelOnBlock,
        (wei * this.blockSize) / this.pixelOnBlock,
        (hei * this.blockSize) / this.pixelOnBlock
      );
    },
  },
});
</script>

<style scoped>
.big {
  font-size: 6rem;
}
.row {
  margin-bottom: 2px;
}
</style>
