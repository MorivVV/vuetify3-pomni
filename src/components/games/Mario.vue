<template>
  <v-container>
    <v-row class="ma-1">
      <v-col cols="1">{{ frameCalc }}</v-col>
      <v-col cols="1">{{ frameCount }}</v-col>
      <v-col cols="1">{{
        Math.ceil((1000 * frameCount) / (frameCalc - frameStart))
      }}</v-col>
    </v-row>
    <canvas id="mario_world" :height="height" :width="width"
      >Обновите браузер</canvas
    >
    <div>
      <v-row class="ma-1">
        <div class="col s1" @click="test">кто</div>
        <v-col
          v-for="(h, ind) in players[0]"
          :key="h + ind"
          cols="1"
          v-html="ind"
        ></v-col>
      </v-row>
      <div v-for="(d, i) in players" :key="'player' + d + i" class="row">
        <v-col cols="1">игрок</v-col>
        <v-col
          v-for="(h, ind) in d"
          :key="i + h + ind"
          cols="1"
          v-html="h"
        ></v-col>
      </div>
      <!-- <div v-for="(d, i) in coins" :key="'coin' + d + i" class="row">
        <v-col cols="1">монета</div>
        <v-col cols="1" v-for="(h, ind) in d" :key="i + h + ind" v-html="h"></div>
      </div> -->
      <!-- <div v-for="(d, i) in structures" :key="'structures' + d + i" class="row">
        <v-col cols="1">преграда</div>
        <v-col cols="1" v-for="(h, ind) in d" :key="i + h + ind" v-html="h"></div>
      </div> -->
    </div>
  </v-container>
</template>

<script lang="ts">
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useGamesStore } from "@/store/modules/games";
import { mapState } from "pinia";
import { defineComponent } from "vue";
import { Point, /*Vektor,*/ Rectangle } from "../../functions/geometry";
const g = 5;

export default defineComponent({
  setup() {
    const { r_get } = dataApiComposition();
    return { r_get };
  },
  data() {
    return {
      ctx: {} as CanvasRenderingContext2D,
      blockSize: 32,
      pixelOnBlock: 8,
      timerId: 0,
      frameTime: 12,
      frameStart: Date.now(),
      frameCalc: Date.now(),
      frameCount: 0,
      speed: 5,
      score: 0,
      level: 0,
      joystick: {
        left: false,
        right: false,
        up: false,
        down: false,
        jump: false,
        turbo: false,
        pause: false,
      },
      pause: false,
      height: 600,
      width: 1200,
      skins: [
        "greenBlock",
        "brickBlock",
        "betonBlock",
        "iceBlock",
        "waterBlock",
        "brickBlock",
        "betonBlock",
        "greenBlock",
        "waterBlock",
        "brickBlock",
        "betonBlock",
        "greenBlock",
        "waterBlock",
      ],
      startx: 0,
      starty: 0,
      playerSkins: [
        "minion",
        "erenHe",
        "mileK",
        "mileK2",
        "mileK3",
        "amoungUS1",
        "minion2",
        "amoungUS2",
      ],
      players: [
        {
          pos: new Point(100, 10),
          y: 100,
          x: 10,
          t: 0,
          skin: "mario",
          size: 1,
          w: 0,
          h: 0,
        },
      ],
      structures: [
        {
          pos: new Point(1110, 550),
          y: 550,
          x: 1110,
          t: 0,
          skin: "betonBlock",
          size: 1,
          w: 32,
          h: 32,
        },
      ],
      coins: [
        {
          pos: new Point(1110, 500),
          y: 550,
          x: 1110,
          t: 0,
          skin: "BitCoin",
          size: 1,
          w: 32,
          h: 32,
        },
      ],
    };
  },
  computed: {
    ...mapState(useGamesStore, {
      _tanksMaps: "tanksMaps",
      _gameObjects: "gameObjects",
      _gameObjectParams: "gameObjectParams",
    }),
    tanksMaps(): IBattleStage[] {
      return this._tanksMaps;
    },
    gameObjects(): IGameObjectsParams[] {
      return this._gameObjects;
    },
    gameObjectParams(): IGameObjects[] {
      return this._gameObjectParams;
    },
    gameObjectsList(): IGameObjects[] {
      const o = this.gameObjectParams.filter((e) => +e.speed > 0);
      return o;
    },
  },
  mounted() {
    const mario_world = document.getElementById(
      "mario_world"
    ) as HTMLCanvasElement;
    mario_world.width = this.width;
    mario_world.height = this.height;

    this.ctx = mario_world.getContext("2d") as CanvasRenderingContext2D;
    // addEventListener("touchstart", this.touchStart, false);
    // addEventListener("touchmove", this.touchMove, false);
    addEventListener("keydown", this.downKey);
    addEventListener("keyup", this.upKey);

    this.getObjects().then(() => {
      this.players = this.players.map((e) => ({
        ...e,
        ...this.calcSize(e.skin, e.size),
      }));
      this.structures = this.structures.map((e) => ({
        ...e,
        ...this.calcSize(e.skin, e.size),
      }));
      this.timerId = setInterval(() => {
        if (this.pause) return;
        this.goWorld();
      }, this.frameTime);
    });
  },
  beforeDestroy() {
    clearInterval(this.timerId);
  },
  methods: {
    calcSize(name: string | number, size = 1) {
      const data = this.gameObjects.filter(
        (e) => e.namien === name || e.kod_object == name
      );
      const minX = Math.min(...data.map((e) => e.x));
      const maxX = Math.max(...data.map((e) => e.x + e.width));
      const minY = Math.min(...data.map((e) => e.y));
      const maxY = Math.max(...data.map((e) => e.y + e.heigth));
      return {
        w: ((maxX - minX) * this.blockSize * size) / this.pixelOnBlock,
        h: ((maxY - minY) * this.blockSize * size) / this.pixelOnBlock,
      };
    },
    genObject(name: string | number, size = 1) {
      const data = this.gameObjects.filter(
        (e) => e.namien === name || e.kod_object == name
      );
      data.forEach((e) => {
        this.fr(e.x, e.y, e.width, e.heigth, e.color, size);
      });
    },

    fr(x: number, y: number, wei: number, hei: number, color = "", size = 1) {
      if (color !== "") {
        this.ctx.fillStyle = color;
      }
      this.ctx.fillRect(
        (x * this.blockSize * size) / this.pixelOnBlock,
        (y * this.blockSize * size) / this.pixelOnBlock,
        (wei * this.blockSize * size) / this.pixelOnBlock,
        (hei * this.blockSize * size) / this.pixelOnBlock
      );
    },
    crush(items: string | any[]) {
      const pos: number[] = [];
      for (let i = 0; i < items.length; i++) {
        const testPosition = this.intersects(this.players[0], items[i]);
        if (
          testPosition.left &&
          testPosition.right &&
          testPosition.top &&
          testPosition.bottom
        ) {
          pos.push(i);
        }
      }
      return pos;
    },
    intersects(
      a: {
        pos: any;
        y?: number;
        x?: number;
        t?: number;
        skin?: string;
        size?: number;
        w: any;
        h: any;
      },
      b: { pos: { y: number; x: number }; h: any }
    ) {
      const ax2 = a.pos.x + a.w;
      // let bx2 = b.pos.x + b.w;
      const ay2 = a.pos.y + a.h;
      const by2 = b.pos.y + b.h;
      return {
        left: false,
        // left: a.pos.x <= bx2,
        right: ax2 >= b.pos.x,
        top: a.pos.y <= by2,
        bottom: ay2 >= b.pos.y,
      };
    },
    brick(count: number) {
      if (this.structures[0].pos.x < -this.width) this.structures.splice(0, 1);
      if (this.coins.length && this.coins[0].pos.x < -this.width)
        this.coins.splice(0, 1);
      if (this.structures[this.structures.length - 1].pos.x > this.width)
        return;
      let x = this.width;
      const y = Math.floor(Math.random() * (510 - 290) + 290);

      const sizes = this.calcSize(this.skins[this.level]);

      for (let i = 0; i < count; i++) {
        x += sizes.w;
        this.structures.push({
          pos: { x, y },
          x,
          y,
          t: 0,
          skin: this.skins[this.level],
          size: 1,
          ...sizes,
        });
        if (Math.ceil(10 * Math.random()) > 2) {
          this.coins.push({
            pos: { x, y: y - sizes.h },
            x,
            y,
            t: 0,
            skin: "BitCoin",
            size: 0.5,
            ...sizes,
          });
        } else {
          if (Math.ceil(10 * Math.random()) === 2) {
            const pos = Math.floor(Math.random() * this.playerSkins.length);
            const skin = this.playerSkins[pos];
            this.coins.push({
              pos: { x, y: y - sizes.h },
              x,
              y,
              t: 0,
              skin: skin,
              size: 0.5,
              ...sizes,
            });
          }
        }
      }
    },
    test() {
      const player = new Rectangle(
        this.players[0].pos,
        this.players[0].w,
        this.players[0].h
      );
      const block = new Rectangle(
        this.structures[0].pos,
        this.structures[0].w,
        this.structures[0].h
      );
      // const tst = player.cross(block);
      this.pause = !this.pause;
      this.ctx.fillRect(this.players[0].pos.x, this.players[0].pos.y, 4, 4);
      this.ctx.fillRect(
        this.players[0].pos.x + this.players[0].w,
        this.players[0].pos.y + this.players[0].h,
        4,
        4
      );
      this.ctx.fillRect(0, 100, 4, 4);
      this.ctx.fillRect(
        this.structures[0].pos.x,
        this.structures[0].pos.y,
        4,
        4
      );
      this.ctx.fillStyle = "#f00";
      // @ts-ignore
      this.ctx.fillRect(tst.x, tst.y, 5, 5);

      console.log(player);
      console.log(block);
      // console.log(tst);
    },
    goWorld() {
      if (this.pause) return;
      this.frameCalc = Date.now();
      this.frameCount++;
      this.ctx.fillStyle = "#7f7";
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "bold 48px monospace";
      this.ctx.fillText("Мир " + (1 + this.level), this.width / 2 - 100, 50);
      this.ctx.fillStyle = "#ffff00";
      this.ctx.fillText(String(this.score), this.width - 100, 50);
      // рисуем объекты
      this.printObjects(this.structures);
      // рисуем монеты
      this.printObjects(this.coins);
      if (this.joystick.jump && this.players[0].t === 0) {
        this.players[0].t = -3;
        this.players[0].pos.y += -1;
        if (this.players[0].pos.y < 0) this.players[0].pos.y = 0;
      }
      if (this.joystick.left) {
        this.players[0].pos.x += -this.speed;
        if (this.players[0].pos.x + this.players[0].w < this.width / 2) {
          this.players[0].pos.x = this.width / 2 - this.players[0].w;
        }
      }
      if (this.joystick.right) {
        this.players[0].pos.x += this.speed;
        if (this.players[0].pos.x - this.players[0].w > this.width / 2) {
          this.players[0].pos.x = this.width / 2 + this.players[0].w;
          const lenBlock = Math.ceil(Math.random() * 10);
          this.brick(lenBlock);
        }
      }
      if (this.joystick.up) {
        this.players[0].pos.y += -1;
        if (this.players[0].pos.y < 0) this.players[0].pos.y = 0;
      }

      // столкновение с верхней границей
      if (this.players[0].pos.y <= 0) {
        this.players[0].t *= -1;
      }
      // собираем монеты
      this.giveCoins();

      const elArr = this.crush(this.structures);
      for (const el of elArr) {
        const block = this.structures[el];
        if (
          (block.pos.y < this.players[0].pos.y &&
            block.pos.y + block.h > this.players[0].pos.y) ||
          (block.pos.y > this.players[0].pos.y &&
            block.pos.y < this.players[0].pos.y + this.players[0].h)
        ) {
          // if (this.joystick.right) {
          //   this.players[0].pos.x = block.pos.x - this.players[0].w;
          // }
          // if (this.joystick.left) {
          //   this.players[0].pos.x = block.pos.x + block.w;
          // }
        }
        if (
          (block.pos.x < this.players[0].pos.x &&
            block.pos.x + block.w > this.players[0].pos.x) ||
          (block.pos.x > this.players[0].pos.x &&
            block.pos.x < this.players[0].pos.x + this.players[0].w)
        ) {
          if (
            this.players[0].pos.y + this.players[0].h > block.pos.y &&
            this.players[0].pos.y + this.players[0].h < block.pos.y + block.h
          ) {
            this.players[0].pos.y = block.pos.y - this.players[0].h;
          }
          if (
            block.pos.y + block.h > this.players[0].pos.y &&
            block.pos.y + block.h < this.players[0].pos.y + this.players[0].h
          ) {
            this.players[0].pos.y = block.pos.y + block.h;
            this.structures = this.structures.filter((e, i) => i !== el);
          }
        }

        this.players[0].t *= -1;
        this.players[0].pos.y += g * this.players[0].t;
        this.players[0].t = 0;
      }
      if (elArr.length === 0) {
        // нахождение в воздухе, свободное падение
        if (this.players[0].pos.y + this.players[0].h < this.height) {
          this.players[0].t += this.frameTime / 100;
          this.players[0].pos.y += g * this.players[0].t;
        } else {
          this.players[0].t = 0;
          this.players[0].pos.y = this.height - this.players[0].h;
        }
      }
      this.players[0].pos.y = Math.ceil(this.players[0].pos.y);

      if (this.joystick.left) {
        this.ctx.translate(
          this.players[0].pos.x + this.players[0].w,
          this.players[0].pos.y
        );
        this.ctx.scale(-1, 1);
      } else {
        this.ctx.translate(this.players[0].pos.x, this.players[0].pos.y);
      }
      this.genObject(this.players[0].skin, this.players[0].size);
      if (this.joystick.left) {
        this.ctx.scale(-1, 1);
        this.ctx.translate(
          -this.players[0].pos.x - this.players[0].w,
          -this.players[0].pos.y
        );
      } else {
        this.ctx.translate(-this.players[0].pos.x, -this.players[0].pos.y);
      }
    },
    printObjects(items: string | any[]) {
      let speed = 0;
      if (this.joystick.right) speed = -1;
      if (this.joystick.left) speed = 1;
      if (this.players[0].pos.x + this.players[0].w * speed < this.width / 2)
        speed = 0;
      for (let i = 0; i < items.length; i++) {
        items[i].pos.x += speed * this.speed;
        if (items[i].pos.x + items[i].w > 0) {
          for (let b = 0; b < items[i].w; b += this.blockSize) {
            this.ctx.translate(items[i].pos.x + b, items[i].pos.y);
            this.genObject(items[i].skin, items[i].size);
            this.ctx.translate(-items[i].pos.x - b, -items[i].pos.y);
          }
        }
      }
    },
    giveCoins() {
      const coinArr = this.crush(this.coins);
      for (const coin of coinArr) {
        const newSkin = this.coins[coin].skin;
        if (newSkin !== "BitCoin") {
          this.playerSkins = this.playerSkins.filter((e) => e !== newSkin);
          this.playerSkins.push(this.players[0].skin);
          this.players = this.players.map((e) => ({
            ...e,
            skin: newSkin,
            ...this.calcSize(newSkin, e.size),
          }));
        }
        this.score++;
        if (this.score > (this.level + 1) * 100) {
          this.level++;
          this.players = this.players.map((e) => ({
            ...e,
            size: e.size + 0.5,
            ...this.calcSize(e.skin, e.size + 0.5),
          }));
        }
      }
      this.coins = this.coins.filter((e, i) => !~coinArr.indexOf(i));
    },
    upKey(e: any) {
      this.PressKey(e, false);
    },
    downKey(e: any) {
      this.PressKey(e, true);
    },
    PressKey(e: { keyCode: number }, value: boolean) {
      const step = e.keyCode;
      switch (step) {
        case 37: //лево
        case 65: //A
          this.joystick.left = value;
          break;
        case 38: //вверх
        case 87: //W
          this.joystick.up = value;
          break;
        case 32: //Пробел
          this.joystick.jump = value;
          break;
        case 39: //право
        case 68: //D
          this.joystick.right = value;
          break;
        case 40: //вниз
        case 83: //S
          this.joystick.down = value;
          break;
        default:
          break;
      }
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
    touchStart(e: { changedTouches: any[] }) {
      const touchobj = e.changedTouches[0]; // первая точка прикосновения
      this.startx = parseInt(touchobj.clientX); // положение точки касания по x, относительно левого края браузера
      this.starty = parseInt(touchobj.clientY);
      this.joystick = {
        left: false,
        right: false,
        up: false,
        down: false,
        jump: false,
        turbo: false,
        pause: false,
      };
    },
    touchMove(e: { changedTouches: any[] }) {
      const touchobj = e.changedTouches[0]; // первая точка прикосновения для данного события
      const distx = parseInt(touchobj.clientX) - this.startx;
      const disty = parseInt(touchobj.clientY) - this.starty;
      let tou = Number(Math.abs(distx) < Math.abs(disty)) * 2;
      if (tou > 0) tou += Number(disty > 0);
      else tou += Number(distx > 0);
      switch (tou) {
        case 0: //лево
          this.joystick.left = true;
          break;
        case 1: //право
          this.joystick.right = true;
          break;
        case 2: //вверх
          this.joystick.jump = true;
          break;
        case 3: //вниз
          this.joystick.down = true;
          break;
        default:
          this.joystick.jump = false;
          break;
      }
      //e.preventDefault()
    },
  },
});
</script>

<style scoped>
.col .row {
  margin-left: 0;
  margin-right: 0;
}
</style>
