<template>
  <v-container>
    <canvas
      id="mario_world"
      ref="canvas"
      :height="height"
      :width="width"
      @mousedown.stop="startBrush"
      @mousemove="showCoordinates"
      @mouseup="stopBrush"
    >Обновите браузер</canvas>
    <v-row>
      <v-col col="4"><v-text-field v-model="x" label="x" type="number" /></v-col>
      <v-col col="4"><v-text-field v-model="y" label="y" type="number" /></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { BasicPlanform } from "@/classes/platform/BasicPlatform";
import { Player } from "@/classes/platform/Player";
import { Texture } from "@/classes/platform/Texture";
import { GameBlock } from "@/classes/platform/GameBlock";
import { BonusBlock } from "@/classes/platform/BonusBlock";
import { defineComponent } from "vue";
// import { Enemy } from "@/classes/platform/Enemy";

export default defineComponent({
  data () {
    return {
      joystick: {
        left: false,
        right: false,
        up: false,
        down: false,
        jump: false,
        turbo: false,
        pause: false,
      },
      coinAudio: new Audio(),
      jumpAudio: new Audio(),
      fallDownAudio: new Audio(),
      height: 800,
      width: 1800,
      x: 0,
      y: 0,
      speed: 3,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      freedom: true,
      canvas: {} as CanvasRenderingContext2D,
      myCanvas: undefined as unknown as HTMLCanvasElement,
      timer: 0,
      counter: 0,
      objectCounter: 0,
      objects: [] as Array<BasicPlanform | Player | Texture>,
      click: false,
    };
  },
  watch: {
    freedom (newVal) {
      if (!newVal) {
        this.soundClick(this.fallDownAudio);
      }
    },
  },
  mounted () {
    if ("canvas" in this.$refs && this.$refs.canvas) {
      this.myCanvas = this.$refs.canvas as HTMLCanvasElement;
      this.canvas = this.myCanvas.getContext("2d") as CanvasRenderingContext2D;
      addEventListener("keydown", this.downKey);
      addEventListener("keyup", this.upKey);
    }
    this.coinAudio.src = "/audio/b0a15ee2e1ad0c9.mp3";
    this.jumpAudio.src = "/audio/rubberband-02.mp3";
    this.fallDownAudio.src = "/audio/411c45ceaa06c92.mp3";
    this.init(0, 0);

    this.timer = setInterval(this.reloadScreen, 1000 / 120);
  },
  beforeUnmount () {
    clearInterval(this.timer);
    removeEventListener("keydown", this.downKey);
    removeEventListener("keyup", this.upKey);
  },
  methods: {
    PressKey (e: { keyCode: any }, value: boolean) {
      const step = e.keyCode;
      switch (step) {
        case 37: // лево
        case 65: // A
          this.joystick.left = value;
          break;
        case 38: // вверх
        case 87: // W
          this.joystick.up = value;
          break;
        case 32: // Пробел
          this.joystick.jump = value;
          break;
        case 39: // право
        case 68: // D
          this.joystick.right = value;
          break;
        case 40: // вниз
        case 83: // S
          this.joystick.down = value;
          break;
        default:
          break;
      }
    },
    upKey (e: any) {
      this.PressKey(e, false);
    },
    downKey (e: any) {
      this.PressKey(e, true);
    },
    loadImage (
      src: string,
      name: string
    ): Promise<{ img: HTMLImageElement; name: string }> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ img, name });
        img.onerror = reject;
        img.src = src;
      });
    },
    init (x: number, y: number, offset = 0) {
      const imageUrls = [
        { name: "brick", url: "/images/Battle_City_bricks.png" },
        {
          name: "mario",
          url: "/images/1640373258_18-abrakadabra-fun-p-spraiti-dlya-skretch-mirror.png",
        },
        {
          name: "enemy",
          url: "/images/1631761552_18-papik-pro-p-prikolnie-risunki-detei-19.png",
        },
        { name: "coin", url: "/images/Game-Gold-Coin-PNG-Free-Image.png" },
        { name: "chess", url: "/images/Chess_Figures.png" },
        {
          name: "fon",
          url: "/images/1617470215_1-p-oboi-multyashnoe-nebo-1.jpg",
        },
      ];
      const a = imageUrls.map((e) => this.loadImage(e.url, e.name));

      Promise.all(a).then((a) => {
        const brick = a.find((e) => e.name === "brick")
          ?.img as HTMLImageElement;
        const mario = a.find((e) => e.name === "mario")
          ?.img as HTMLImageElement;
        const coin = a.find((e) => e.name === "coin")?.img as HTMLImageElement;
        // const enemy = a.find((e) => e.name === "enemy")
        //   ?.img as HTMLImageElement;
        const fon = a.find((e) => e.name === "fon")?.img as HTMLImageElement;
        // const chess = a.find((e) => e.name === "chess")
        //   ?.img as HTMLImageElement;
        if (offset === 0) {
 this.objects.push(
            new Texture(
              this.canvas,
              x,
              y,
              fon,
              0,
              0,
              false,
              this.myCanvas.width,
              this.myCanvas.height
            )
          );
}
        for (let index = 0; index < 50; index++) {
          this.objects.push(
            new Texture(
              this.canvas,
              x,
              y,
              brick,
              index * 44 + offset,
              64 * 2,
              true,
              undefined,
              undefined,
              0.7
            )
          );
        }
        for (let index = 0; index < 50; index++) {
          this.objects.push(
            new Texture(
              this.canvas,
              x,
              y,
              brick,
              index * 44 + offset,
              64 * 8,
              true,
              undefined,
              undefined,
              0.7
            )
          );
          this.objects.push(
            new BonusBlock(
              this.canvas,
              x,
              y,
              coin,
              (index + 2) * 44 + offset,
              466,
              true,
              64,
              undefined,
              0.7
            )
          );
        }
        for (let index = 0; index < 50; index++) {
          this.objects.push(
            new GameBlock(
              this.canvas,
              x,
              y,
              brick,
              index * 64 + offset,
              12 * 64,
              true
            )
          );
        }
        for (let index = 22; index < 40; index++) {
          this.objects.push(
            new GameBlock(
              this.canvas,
              x,
              y,
              brick,
              index * 64 + offset,
              6 * 64,
              true
            )
          );
        }
        for (let index = 10; index < 19; index++) {
          this.objects.push(
            new GameBlock(
              this.canvas,
              x,
              y,
              brick,
              index * 64 + offset,
              9 * 64,
              true
            )
          );
        }
        for (let index = 5; index < 19; index++) {
          this.objects.push(
            new GameBlock(
              this.canvas,
              x,
              y,
              brick,
              index * 64 + offset,
              3 * 64,
              true
            )
          );
        }
        for (let index = 5; index < 19; index++) {
          this.objects.push(
            new BonusBlock(
              this.canvas,
              x,
              y,
              coin,
              index * 64 + offset,
              2 * 64,
              true,
              64,
              64,
              1
            )
          );
        }
        // this.objects.push(
        //   new Enemy(
        //     this.canvas,
        //     x,
        //     y,
        //     enemy,
        //     64 * 10 + offset,
        //     64 * 8,
        //     true,
        //     64,
        //     64,
        //     1
        //     // { cropX: 0, cropY: 0, cropWidth: 180, cropHeight: 180 }
        //   )
        // );
        this.objects.push(
          new GameBlock(
            this.canvas,
            x,
            y,
            brick,
            10 * 64 + offset,
            11 * 64,
            true
          )
        );
        this.objects.push(
          new GameBlock(
            this.canvas,
            x,
            y,
            brick,
            10 * 64 + offset,
            10 * 64,
            true
          )
        );
        this.objects.push(
          new GameBlock(
            this.canvas,
            x,
            y,
            brick,
            20 * 64 + offset,
            11 * 64,
            true
          )
        );
        this.objects.push(
          new GameBlock(
            this.canvas,
            x,
            y,
            brick,
            20 * 64 + offset,
            10 * 64,
            true
          )
        );
        if (offset === 0) {
          this.objectCounter = this.objects.length - 1;
          this.objects.push(
            new Player(this.canvas, x, y, mario, 64, 64 * 8, true, 22, 28, 3, {
              cropX: 2140,
              cropY: 70,
              cropWidth: 220,
              cropHeight: 280,
            })
          );
        }
      });
    },
    offsetMap (x: number, y: number, retry = false) {
      this.objects.filter((e) => e.canMove).forEach((e) => e.setCoord(x, y));
      const player = this.objects.filter((e) => e instanceof Player);

      const canCrash = this.objects.filter(
        (o) =>
          o.canCrash() &&
          !player.includes(o) &&
          o.getAbsolutePosition().x1 > 0 &&
          o.getAbsolutePosition().x1 < this.myCanvas.width / 2
      );
      // console.log(player);
      // console.log(canCrash);
      const crash = canCrash.filter(
        (e) => player.filter((o) => o.cross(e as BasicPlanform)).length > 0
      );
      const check = crash.length === 0;
      this.objects = this.objects.filter(
        (o) => crash.filter((e) => o === e && e.canDestroy()).length === 0
      );
      // console.log(crash);
      crash
        .filter((c) => c.canDestroy())
        .forEach(() => {
          this.soundClick(this.coinAudio);
          this.counter++;
        });
      if (check && crash.length > 0) {
        if (this.x >= 700) {
          console.log(this.x, crash[0].getX());

          this.x = crash[0].getX() + 700;
        } else {
          this.x = player[0].getX();
        }

        this.y = player[0].getY();
      }

      return check || retry;
    },
    soundClick (audio: HTMLAudioElement) {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    },
    reloadScreen () {
      if (this.joystick.down) this.y += 1 * this.speed;
      if (this.joystick.up) this.y -= 1 * this.speed;
      if (this.joystick.left) this.x -= 1 * this.speed;
      if (this.joystick.right) {
        this.x += 1 * this.speed;
      }
      if (this.x < 0) {
        this.x = 0;
      }
      const newMap = this.x % 3000;
      if (newMap > 2000 && newMap < 2004) {
        const iter = Math.ceil(this.x / 3000);
        const iterArr = Math.floor(
          (this.objects.length + this.counter) / this.objectCounter
        );
        console.log(iterArr, iter);
        console.log(this.objects.length - 2 + this.counter, this.objectCounter);

        if (iterArr === iter) {
          this.init(0, 0, iter * 3000);
        }
      }
      if (this.joystick.jump && !this.freedom) {
        this.soundClick(this.jumpAudio);
        this.freedom = true;
        const a = this.y - 250;
        const int = setInterval(() => {
          this.y -= 5;
          if (this.y <= a) {
            clearInterval(int);
          }
        }, 5);
        setTimeout(() => clearInterval(int), 255);
      }
      if (this.offsetMap(this.x, this.y)) {
        this.lastX = this.x;
        this.lastY = this.y;
      } else {
        // this.x = this.lastX;
        // this.y = this.lastY;
        // this.offsetMap(this.lastX, this.lastY, true);
      }
      const canvas = this.canvas;
      this.gravity();
      canvas.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
      // this.canvas.globalAlpha = 0.7;
      this.objects
        .filter(
          (o) =>
            (o.getAbsolutePosition().x1 >= 0 &&
              o.getAbsolutePosition().x1 <= this.myCanvas.width) ||
            (o.getAbsolutePosition().x2 >= 0 &&
              o.getAbsolutePosition().x2 <= this.myCanvas.width)
        )
        .forEach((e) => e.draw());
      canvas.fillStyle = "yellow";
      canvas.font = "30px Verdana";
      canvas.fillText(String(this.counter), 20, 70);
    },
    gravity () {
      if (this.y > 200) return;
      const y = this.y + 1 * this.speed;
      if (this.offsetMap(this.x, y)) {
        this.lastX = this.x;
        this.lastY = this.y;
        this.y = y;
        this.freedom = true;
      } else {
        // this.x = this.lastX;
        // this.y = this.lastY;
        this.freedom = false;
        // this.offsetMap(this.lastX, this.lastY, true);
      }
    },
    startBrush (e: MouseEvent) {
      this.click = true;
      this.startX = e.offsetX - this.x;
      this.startY = e.offsetY - this.y;
    },
    stopBrush () {
      this.click = false;
    },
    showCoordinates (e: MouseEvent) {
      if (this.click) {
        if (e.buttons === 1) {
          const x = e.offsetX - this.startX;
          const y = e.offsetY - this.startY;
          if (this.offsetMap(x, y)) {
            this.lastX = this.x;
            this.lastY = this.y;
            this.x = x;
            this.y = y;
          } else {
            // this.x = this.lastX;
            // this.y = this.lastY;
            // this.offsetMap(this.lastX, this.lastY, true);
          }
        }
      }
    },
  },
});
</script>
