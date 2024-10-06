<template>
  <td width="30" :class="colorize"></td>
</template>

<script lang="ts">
import { Point } from "chart.js";
import { defineComponent, onBeforeUnmount, PropType, ref } from "vue";

export default defineComponent({
  props: {
    b: Number,
    i: Number,
    snake: { type: Array as PropType<Point[]>, default: () => [] },
    apples: { type: Array as PropType<Point[]>, default: () => [] },
  },
  setup() {
    const head = ref(0);
    const interval = setInterval(() => {
      head.value++;

      if (head.value === 3) head.value = 0;
    }, 500);
    onBeforeUnmount(() => {
      clearInterval(interval);
    });
    return { head };
  },
  computed: {
    colorize() {
      const sl = this.snake.length;
      let color = "";
      if (sl === 0) return color;
      const b = this.b;
      const i = this.i;

      const currentIndex = this.snake.findIndex((e) => e.x === b && e.y === i);
      if (currentIndex < sl - 1 && currentIndex > 0) {
        const nextCell = this.snake[currentIndex + 1];
        const curCell = this.snake[currentIndex];
        const prevCell = this.snake[currentIndex - 1];
        const offset =
          String(nextCell.x - curCell.x) +
          String(nextCell.y - curCell.y) +
          String(curCell.x - prevCell.x) +
          String(curCell.y - prevCell.y);

        switch (offset) {
          case "1010": //right
          case "-23010": //right
          case "10-230": //right
            color = "snake snake-body rotate90";
            break;
          case "-10-10": //left
          case "230-10": //left
          case "-10230": //left
            color = "snake snake-body rotate-90";
            break;
          case "0-10-1": //up
          case "0230-1": //up
          case "0-1023": //up
            color = "snake snake-body";
            break;
          case "0101": //down
          case "0-2301": //down
          case "010-23": //down
            color = "snake snake-body";
            break;
          case "01-10": //left down
          case "0-23-10": //left down
          case "01230": //left down
          case "0-23230": //left down
            color = "snake snake-angle rotate-90";
            break;
          case "-100-1": //up left
          case "-10023": //up left
          case "230023": //up left
          case "2300-1": //up left
            color = "snake snake-angle";
            break;
          case "-1001": //down left
          case "-100-23": //down left
          case "2300-23": //down left
          case "23001": //down left
            color = "snake snake-angle rotate90";
            break;
          case "0-110": //right up
          case "02310": //right up
          case "023-230": //right up
          case "0-1-230": //right up
            color = "snake snake-angle rotate90";
            break;
          case "0-1-10": //left up
          case "023-10": //left up
          case "0-1230": //left up
          case "023230": //left up
            color = "snake snake-angle rotate180";
            break;
          case "100-1": //up right
          case "10023": //up right
          case "-230023": //up right
          case "-2300-1": //up right
            color = "snake snake-angle rotate-90";
            break;
          case "0110": //right down
          case "0-2310": //right down
          case "01-230": //right down
          case "0-23-230": //right down
            color = "snake snake-angle";
            break;
          case "1001": //down right
          case "100-23": //down right
          case "-2300-23": //down right
          case "-23001": //down right
            color = "snake snake-angle rotate180";
            break;
          default:
            console.log(offset);
        }
      }
      if (b === this.snake[sl - 1].x && i === this.snake[sl - 1].y) {
        color = "snake snake-head" + this.head;
        const curCell = this.snake[currentIndex];
        const prevCell = this.snake[currentIndex - 1];
        const offset =
          String(curCell.x - prevCell.x) + String(curCell.y - prevCell.y);
        switch (offset) {
          case "10": //right
          case "-230": //right
            color += " rotate-90";
            break;

          case "-10": //left
          case "230": //left
            color += " rotate90";
            break;

          case "0-1": //up
          case "023": //up
            color += " rotate180";
            break;

          case "01": //down
          case "0-23": //down
            color += "";
            break;

          default:
            console.log(offset);
        }
      }
      if (b === this.snake[0].x && i === this.snake[0].y) {
        color = "snake snake-tail";
        const curCell = this.snake[0];
        const prevCell = this.snake[1];
        const offset =
          String(curCell.x - prevCell.x) + String(curCell.y - prevCell.y);
        switch (offset) {
          case "10": //left
          case "-230": //left
            color += " rotate-90";
            break;
          case "-10": //right
          case "230": //right
            color += " rotate90";
            break;
          case "0-1": //down
          case "023": //down
            color += " rotate180";
            break;
          case "01": //up
          case "0-23": //up
            color += "";
            break;
          default:
            console.log(offset);
        }
      }
      if (this.apples.findIndex((e) => e.x === b && e.y === i) > -1) {
        color = "apple-green";
      }

      return color;
    },
  },
});
</script>

<style scoped>
.snake {
  background-image: url(/images/Snake_sprite.png);
  background-repeat: no-repeat;
  background-size: 90px;
}
.snake-head0 {
  background-position: 1% 100%;
}
.snake-head1 {
  background-position: 1% 50%;
}
.snake-head2 {
  background-position: 1% 1%;
}
.snake-body {
  background-position: 98% 98%;
}
.snake-angle {
  background-position: 99% 2%;
}
.rotate-90 {
  transform: rotate(-90deg);
}
.rotate90 {
  transform: rotate(90deg);
}
.rotate180 {
  transform: rotate(180deg);
}
.rotate0 {
  transform: rotate(0deg);
}
.snake-down-left {
  background-position: 98% 98%;
}
.snake-tail {
  background-position: 50% 115%;
}
.apple-green {
  background: center/100% no-repeat url(/images/Apple-icon.png);
}
</style>
