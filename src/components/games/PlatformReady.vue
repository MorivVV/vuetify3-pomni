<template>
  <div>
    <div>
      <LoaderCircle v-if="loading" />
    </div>

    <canvas ref="canvas" map="" width="900" height="900"
      >Обновите браузер</canvas
    >
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, toRefs } from "vue";
import { useGamesStore } from "@/store/modules/games";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { ICreateTableFields } from "@/types/database/service";
import {
  IGamesGameObjectParams,
  IGamesGameObjects,
} from "@/types/database/schemas/games";
import LoaderCircle from "../basic/LoaderCircle.vue";
import { StructureBase } from "./platform/StructureBase";
import { useMouse } from "@vueuse/core";
const canvas = ref<HTMLCanvasElement>();
const render = ref<CanvasRenderingContext2D>();
const refreshInterval = ref(10);
const animateTimer = ref(0);
const { x, y } = useMouse();
const posX = ref(0);
const posY = ref(0);
const loading = ref(true);
const { r_get } = dataApiComposition();
const { gameObjects } = toRefs(useGamesStore());
r_get<
  | ICreateTableFields<keyof IGamesGameObjects, "o">
  | ICreateTableFields<keyof IGamesGameObjectParams, "gop">
>(
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
    sort: ["gop.kod_object", "gop.ord"],
    join: ["gop.kod_object=o.id"],
  },
  "gameObjects",
  useGamesStore
);
const init = () => {
  loading.value = false;
  let offsetX = 0;
  let offsetY = 0;
  let kObj = 0;
  const size = 4;
  let oobj: StructureBase | null = null;
  for (const object of gameObjects.value) {
    if (kObj !== object.kod_object) {
      if (oobj) {
        // oobj.rotate(45);
        oobj.paint(offsetX, offsetY);
      }
      oobj = new StructureBase(render.value, size);
      offsetX += 80;
    }
    if (offsetX > 800) {
      offsetY += 70;
      offsetX = 0;
    }
    oobj?.addObject(
      object.x,
      object.y,
      object.heigth,
      object.width,
      object.color
    );
    // await new Promise((res) => setTimeout(() => res(true), 10));
    kObj = object.kod_object;
  }
  oobj?.paint(offsetX, offsetY);
  return oobj;
};
onMounted(async () => {
  render.value = canvas.value?.getContext("2d") as CanvasRenderingContext2D;
  console.log(canvas.value);

  await new Promise((res) => setTimeout(() => res(true), 200));
  const oobj = init();
  const rect = canvas.value?.getBoundingClientRect();
  console.log(rect);
  posX.value = rect.x;
  posY.value = rect.y;
  let grad = 0;
  animateTimer.value = setInterval(() => {
    render.value?.clearRect(0, 0, canvas.value?.width, canvas.value?.height);
    init();
    oobj?.rotate(grad++);
    oobj?.paint(x.value - posX.value, y.value - posY.value);
  }, refreshInterval.value);
});
onUnmounted(() => {
  clearInterval(animateTimer.value);
});
</script>
<style scoped>
canvas {
  border: 1px solid black;
}
</style>
