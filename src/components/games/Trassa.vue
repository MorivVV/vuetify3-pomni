<template>
  <v-container class="center">
    <canvas
      id="example"
      :height="height"
      :width="width"
    >Обновите браузер</canvas>
    <!-- <v-row>
      <v-row>
        <v-col cols="2" v-for="(h, ind) in position[0]" :key="h + ind" v-html="ind"></div>
      </div>
      <div v-for="(d, i) in position" :key="d + i" class="row">
        <v-col cols="2" v-for="(h, ind) in d" :key="i + h + ind" v-html="h"></div>
      </div>ddd
    </div> -->
  </v-container>
</template>

<script lang="ts">
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useGamesStore } from "@/store/modules/games";
import { mapState } from "pinia";
import { defineComponent } from "vue";
const razm = 35;
let step;
let potok = 600;
const speed = 1;
let uscor = 10;
const machine = { w: 320, h: 32 };
const g = 0.81;
let startx, starty;

function intersects (a, b) {
  const ax2 = a.x + a.w;
  const bx2 = b.x + b.w;
  const ay2 = a.y + a.h;
  const by2 = b.y + b.h;
  return a.y < by2 && ay2 > b.y && ax2 > b.x && a.x < bx2;
}
function randomColor () {
  const allowed = "ABCDEF0123456789";
  let S = "#";

  while (S.length < 7) {
    S += allowed.charAt(Math.floor(Math.random() * 16 + 1));
  }
  return S;
}

export default defineComponent({
  setup () {
    const { r_get } = dataApiComposition();
    return { r_get };
  },
  data () {
    return {
      ctx: {} as CanvasRenderingContext2D,
      blockSize: 32,
      pixelOnBlock: 8,
      height: 600,
      width: 1200,
      position: [{ y: 100, x: 10, t: 0, color: "#ffffff", w: 64, h: 64 }],
    };
  },
  computed: {
    ...mapState(useGamesStore, [
      "tanksMaps",
      "gameObjects",
      "gameObjectParams",
    ]),
    gameObjectsList (): IGameObjects[] {
      const o = this.gameObjectParams.filter((e) => +e.speed > 0);
      return o;
    },
  },
  mounted () {
    const example = document.getElementById("example") as HTMLCanvasElement;
    this.ctx = example?.getContext("2d") as CanvasRenderingContext2D;
    addEventListener("keydown", this.PressKey);
    this.getObjects().then(() => {
      this.gowall(400);
    });

    this.ctx.strokeStyle = "#ff00ff";

    addEventListener(
      "touchstart",
      function (e) {
        const touchobj = e.changedTouches[0]; // первая точка прикосновения
        startx = touchobj.clientX; // положение точки касания по x, относительно левого края браузера
        starty = touchobj.clientY;
        // e.preventDefault()
      },
      false
    );

    addEventListener(
      "touchmove",
      function (e) {
        const touchobj = e.changedTouches[0]; // первая точка прикосновения для данного события
        const distx = touchobj.clientX - startx;
        const disty = touchobj.clientY - starty;
        let tou = Number(Math.abs(distx) < Math.abs(disty)) * 2;
        if (tou > 0) tou += Number(disty > 0);
        else tou += Number(distx > 0);
        switch (tou) {
          case 0: // лево
            step = 37;
            break;
          case 1: // право
            step = 39;
            break;
          case 2: // вверх
            step = 38;
            break;
          case 3: // вниз
            step = 40;
            break;
          default:
            step = 65;
            break;
        }
        // e.preventDefault()
      },
      false
    );
  },
  methods: {
    genObject (name) {
      const data = this.gameObjects.filter(
        (e) => e.namien === name || e.kod_object == name
      );
      data.forEach((e) => {
        this.fr(e.x, e.y, e.width, e.heigth, e.color);
      });
    },
    fr (x, y, wei, hei, color = "") {
      if (color !== "") {
        this.ctx.fillStyle = color;
      }
      this.ctx.fillRect(
        (x * this.blockSize) / this.pixelOnBlock,
        (y * this.blockSize) / this.pixelOnBlock,
        (wei * this.blockSize) / this.pixelOnBlock,
        (hei * this.blockSize) / this.pixelOnBlock
      );
    },
    crush () {
      for (let i = 1; i < this.position.length; i++) {
        if (intersects(this.position[0], this.position[i])) {
          console.log(this.position[0], this.position[i]);
          return true;
        }
      }
      return false;
    },
    brick () {
      const x = this.width;
      if (this.position.length > 1 && this.position[1].x < -this.position[1].w) { this.position.splice(1, 1); }
      const y = Math.floor(Math.random() * (510 - 290) + 290);
      if (
        this.position.length < 4 &&
        this.position[this.position.length - 1].x < potok
      ) {
        this.position.push({ x, y, t: 0, color: randomColor(), ...machine });
        potok += 5;
      }
    },
    gowall (ofset) {
      this.ctx.fillStyle = "#3333cc";
      this.ctx.fillRect(0, 0, this.width, this.height);
      if (ofset === 0) {
        ofset = razm * 2 * speed;
        this.brick();
      }
      // let i = 8;
      // for (let j = -10; j < 40; j += 2 * speed) {
      //   this.ctx.clearRect(j * razm + ofset, i * razm, razm * 3, razm);
      // }
      for (let i = 1; i < this.position.length; i++) {
        // this.ctx.fillStyle = this.position[i].color;
        // this.ctx.fillRect(this.position[i].x, this.position[i].y, this.position[i].w, this.position[i].h);
        // this.ctx.strokeRect(this.position[i].x, this.position[i].y, this.position[i].w, this.position[i].h);
        // this.ctx.strokeRect(this.position[i].x + 55, this.position[i].y, this.position[i].h, this.position[i].h);
        // this.ctx.strokeRect(this.position[i].x + 40, this.position[i].y, this.position[i].w * 0.6, this.position[i].h);

        for (let b = 0; b < this.position[i].w; b += this.blockSize) {
          this.ctx.translate(this.position[i].x + b, this.position[i].y);
          this.genObject("brickBlock");
          this.ctx.translate(-this.position[i].x - b, -this.position[i].y);
        }
        this.position[i].x--;
      }
      // столкновение с верхней границей
      if (this.position[0].y <= 0) {
        this.position[0].t *= -1;
      }
      if (this.crush() !== false) {
        this.position[0].t = 0;
      }
      // нахождение в воздухе, свободное падение
      if (this.position[0].y + this.position[0].h < this.height) {
        this.position[0].t += ofset / 1000;
        this.position[0].y += g * this.position[0].t;
      } else {
        this.position[0].t = 0;
        this.position[0].y = this.height - this.position[0].h;
      }

      this.ctx.translate(this.position[0].x, this.position[0].y);
      this.genObject("mario");
      this.ctx.translate(-this.position[0].x, -this.position[0].y);

      setTimeout(this.gowall, uscor, ofset - speed);
    },
    PressKey (e) {
      step = e.keyCode;
      switch (step) {
        case 37: // лево
        case 65: // A
          uscor += 1;
          if (uscor > 20) uscor = 20;
          this.position[0].x -= speed;
          if (this.position[0].x < 0) this.position[0].x = 0;
          break;
        case 38: // вверх
        case 87: // W
          this.position[0].y -= speed;
          if (this.position[0].y < 0) this.position[0].y = 0;
          break;
        case 32: // Пробел
          this.position[0].y -= speed;
          this.position[0].t = -5;
          if (this.position[0].y < 0) this.position[0].y = 0;
          break;
        case 39: // право
        case 68: // D
          uscor -= 1;
          if (uscor < 1) uscor = 1;
          this.position[0].x += speed;
          if (this.position[0].x + this.position[0].w > this.width) { this.position[0].x = this.width - this.position[0].w; }
          break;
        case 40: // вниз
        case 83: // S
          this.position[0].y += speed;
          if (this.position[0].y + this.position[0].h < this.height) { this.position[0].y = this.height - this.position[0].h; }
          break;
        default:
          break;
      }
    },
    getObjects () {
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
  },
});
</script>
