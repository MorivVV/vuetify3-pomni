<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>Настройки</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col cols="2"><v-select
            v-if="gameObjectParams.length"
            v-model="idBlock"
            dense
            hide-details
            :item-text="'namien'"
            :item-value="'_id'"
            :extend="false"
            :items="gameObjectParams"
            :label="'Объект'"
            outlined
            @input="setObject"
          /></v-col>

          <v-col cols="5 range-field" :style="'background:' + rgb">
            <label
              class="red white-text"
              for="red"
            >красный {{ color.red }} ({{
              Number(color.red).toString(16)
            }})</label>
            <input
              id="red"
              v-model="color.red"
              max="255"
              min="0"
              type="range"
            >
            <label
              class="green white-text"
              for="green"
            >зеленый {{ color.green }} ({{
              Number(color.green).toString(16)
            }})</label>
            <input
              id="green"
              v-model="color.green"
              max="255"
              min="0"
              type="range"
            >
            <label
              class="blue white-text"
              for="blue"
            >синий {{ color.blue }} ({{
              Number(color.blue).toString(16)
            }})</label>
            <input
              id="blue"
              v-model="color.blue"
              max="255"
              min="0"
              type="range"
            >
          </v-col>
          <v-col cols="1">
            <BtnIconsVVue
              :action="saveObject"
              class="blue btn-small"
              :icon="'save'"
              :title="'Сохранить'"
            />
            <BtnIconsVVue
              :action="clearObject"
              class="grey btn-small"
              :icon="'clear'"
              :title="'Очистить'"
            />
          </v-col>
          <v-col cols="2">
            <v-col cols="3"><v-text-field
              v-model="mouse.xMove"
              dense
              hide-details
              :label="'x'"
              outlined
            /></v-col>
            <v-col cols="3"><v-text-field
              v-model="mouse.yMove"
              dense
              hide-details
              :label="'y'"
              outlined
            /></v-col>
            <v-col cols="3"><v-text-field
              dense
              hide-details
              :label="'width'"
              outlined
              :value="1 + mouse.xMove - mouse.x"
            /></v-col>
            <v-col cols="3"><v-text-field
              dense
              hide-details
              :label="'heigth'"
              outlined
              :value="1 + mouse.yMove - mouse.y"
            /></v-col>
          </v-col>
        </v-row>
        <v-row>
          <v-text-field
            v-model="nBlock.namien"
            class="col s3 white"
            dense
            hide-details
            :label="'Имя'"
            outlined
          /><v-text-field
            v-model="nBlock.namien"
            class="col s3 white"
            dense
            hide-details
            :label="'Имя'"
            outlined
          /><v-text-field
            v-model="nBlock.namien"
            class="col s3 white"
            dense
            hide-details
            :label="'Имя'"
            outlined
          /><v-text-field
            v-model="nBlock.namien"
            class="col s3 white"
            dense
            hide-details
            :label="'Имя'"
            outlined
          /><v-text-field
            v-model="nBlock.namien"
            class="col s3 white"
            dense
            hide-details
            :label="'Имя'"
            outlined
          />
          <v-col cols="3"><v-text-field
            v-model="nBlock.health"
            class="white"
            dense
            hide-details
            :label="'Броня'"
            outlined
          /></v-col>
          <v-col cols="2"><v-text-field
            v-model="nBlock.speed"
            class="white"
            dense
            hide-details
            :label="'Скорость'"
            outlined
          /></v-col>
          <v-col cols="2"><v-text-field
            v-model="nBlock.crash"
            class="white"
            dense
            hide-details
            :label="'Разрушение'"
            outlined
          /></v-col>
          <v-col cols="2"><v-text-field
            v-model="nBlock.stop"
            class="white"
            dense
            hide-details
            :label="'Преграда'"
            outlined
          /></v-col>
        </v-row>
        <div class="row grey">
          <canvas
            id="block"
            class="grey lighten-1"
            height="32"
            map=""
            width="32"
          >Обновите браузер</canvas>
          <v-col cols="12">
            <div
              v-for="(e, i) in blockData"
              :key="e.x + 'tag' + i"
              class="chip"
            >
              <i
                class="material-icons"
                :style="'color:' + e.color"
                @click="getColor(e.color)"
              >color_lens</i>
              {{ e.x }},{{ e.y }} {{ e.width }}-{{ e.heigth }}
              <i class="material-icons" @click="delFrame(e)">close</i>
            </div>
          </v-col>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { mapState } from "pinia";
// import InputWithLabelVue from "@/components/basic/InputWithLabel.vue";
import BtnIconsVVue from "@/components/basic/BtnIconsV.vue";
import { defineComponent } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useGamesStore } from "@/store/modules/games";
import { EGAMES } from "@/const/schemaEnumsHome";
import { ICreateTableFields } from "@/types/database/service";
import {
  IGamesGameObjectParams,
  IGamesGameObjects,
} from "@/types/database/schemas/games";

export default defineComponent({
  components: { BtnIconsVVue },
  setup () {
    const { r_get, r_delete, r_insert, r_update } = dataApiComposition();
    return { r_get, r_delete, r_insert, r_update };
  },
  data () {
    return {
      obj: {} as HTMLCanvasElement,
      mouseIsDown: false,
      mouse: { x: 0, y: 0, xMove: 0, yMove: 0 },
      nBlock: { namien: "" } as IGameObjects,
      idBlock: "1",
      blockData: [] as IGameObjectsParams[],
      blockSize: 128,
      pixelOnBlock: 8,
      color: { red: 255, green: 0, blue: 0 },
      cnv: {} as CanvasRenderingContext2D,
    };
  },
  computed: {
    ...mapState(useGamesStore, ["gameObjects", "gameObjectParams"]),
    rgb (): string {
      const col = `rgb(${this.color.red},${this.color.green},${this.color.blue})`;
      return col;
    },
  },
  mounted () {
    this.getObjects()
      .then(() => this.getObjectParams())
      .then(() => {
        this.obj = document.getElementById("block") as HTMLCanvasElement;
        this.obj.width = 2 * this.blockSize;
        this.obj.height = 2 * this.blockSize;
        this.cnv = this.obj.getContext("2d") as CanvasRenderingContext2D;
        this.obj.onmousedown = this.MouseKeyD;
        this.obj.onmouseup = this.MouseKeyU;
        this.obj.onmousemove = this.MouseKeyM;
        this.setObject(this.idBlock);
      });
  },
  methods: {
    fr (x: number, y: number, wei: number, hei: number, color = "") {
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
    delFrame (del: IGameObjectsParams) {
      this.blockData = this.blockData.filter((e) => e !== del);
      this.genData(this.blockData);
    },
    getColor (rgb: string) {
      const m = rgb.match(/\d+/g);
      if (m) {
        this.color.red = +m[0];
        this.color.green = +m[1];
        this.color.blue = +m[2];
      }
    },
    clearObject () {
      this.cnv.clearRect(0, 0, this.obj.width, this.obj.height);
      this.blockData = [];
    },
    async saveObject () {
      console.log(this.blockData);
      const block = { ...this.nBlock };

      delete block._id;
      if (
        this.gameObjectParams.filter((e) => e._id === +this.idBlock).length ===
        0
      ) {
        await this.r_insert({
          fields: { ...block },
          to: `${EGAMES.game_objects}`,
        });
      } else {
        this.r_update<string>({
          filter: { id: this.nBlock._id },
          to: `${EGAMES.game_objects}`,
          set: { ...block },
        });
      }
      let blockId: any;
      this.r_get<ICreateTableFields<keyof IGamesGameObjects, "o">>({
        fields: ["o.id"],
        from: [`${EGAMES.game_objects}:o`],
        filter: { "o.namien": `=:${this.nBlock.namien}` },
      })
        .then((r) => {
          blockId = r[0].id;
          return this.r_delete({
            from: `${EGAMES.game_object_params}`,
            filter: { kod_object: blockId },
          });
        })
        .then(() => {
          console.log(blockId);
          this.blockData.forEach(async (e, i) => {
            delete e.namien;
            await this.r_insert({
              fields: { ...e, ord: i, kod_object: blockId },
              to: "games.game_object_params",
            }).then((r) => {
              if (r.count === 1) {
                this.$toast({ html: "Сохранен фрагмент " + i });
              } else {
                this.$toast({ html: "Ошибка сохранения фрагмента " + i });
              }
            });
          });
        });
    },
    setObject (id: string | number) {
      const block = this.gameObjectParams.filter((e) => e._id == id);
      if (block.length === 0) {
        return;
      }
      this.nBlock = block[0];
      this.genObject(id);
    },
    genObject (id: string | number) {
      this.cnv.clearRect(0, 0, this.obj.width, this.obj.height);
      const data = this.gameObjects.filter((e) => e.kod_object == id);
      this.blockData = [];
      data.forEach((e) => {
        this.fr(e.x, e.y, e.width, e.heigth, e.color);
        this.blockData.push({ ...e });
      });
      console.log(this.blockData);
    },
    genData (data: any[]) {
      this.cnv.clearRect(0, 0, this.obj.width, this.obj.height);
      data.forEach(
        (e: {
          x: number;
          y: number;
          width: number;
          heigth: number;
          color: string | undefined;
        }) => {
          this.fr(e.x, e.y, e.width, e.heigth, e.color);
        }
      );
      console.log(this.blockData);
    },
    MouseKeyD (e: MouseEvent) {
      // console.log(e);
      this.mouseIsDown = true;
      const x = Math.floor((e.offsetX * this.pixelOnBlock) / this.blockSize);
      const y = Math.floor((e.offsetY * this.pixelOnBlock) / this.blockSize);
      this.mouse.x = x;
      this.mouse.y = y;
      this.fr(x, y, 1, 1, this.rgb);
    },
    MouseKeyM (e: MouseEvent) {
      // console.log(e);
      const x = Math.floor((e.offsetX * this.pixelOnBlock) / this.blockSize);
      const y = Math.floor((e.offsetY * this.pixelOnBlock) / this.blockSize);
      if (this.mouseIsDown) {
        if (this.mouse.xMove !== x || this.mouse.yMove !== y) {
          console.log(
            this.mouse.x,
            this.mouse.y,
            1 + this.mouse.xMove - this.mouse.x,
            1 + this.mouse.yMove - this.mouse.y
          );
          this.mouse.xMove = x;
          this.mouse.yMove = y;
          this.fr(
            this.mouse.x,
            this.mouse.y,
            1 + this.mouse.xMove - this.mouse.x,
            1 + this.mouse.yMove - this.mouse.y,
            this.rgb
          );
        }
      } else {
        console.log(x, y);
      }
    },
    MouseKeyU () {
      this.mouseIsDown = false;
      const data = {
        x: this.mouse.x,
        y: this.mouse.y,
        width: 1 + this.mouse.xMove - this.mouse.x,
        heigth: 1 + this.mouse.yMove - this.mouse.y,
        color: this.rgb,
      };
      const find = this.blockData.filter(
        (e) =>
          e.x === data.x &&
          e.y === data.y &&
          e.width === data.width &&
          e.heigth === data.heigth
      );
      if (find.length > 0) {
        find[0].color = this.rgb;
        console.log("Совпало");
      } else {
        this.blockData.push({
          ...data,
          namien: "",
          kod_object: 0,
          ord: 0,
        });
      }
      this.genData(this.blockData);
    },
    getObjectParams () {
      return this.r_get<ICreateTableFields<keyof IGamesGameObjects, "o">>(
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
    getObjects () {
      return this.r_get<
        | ICreateTableFields<keyof IGamesGameObjectParams, "gop">
        | ICreateTableFields<keyof IGamesGameObjects, "o">
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
          from: [
            `${EGAMES.game_object_params}:gop`,
            `${EGAMES.game_objects}:o`,
          ],
          sort: ["o.namien", "gop.ord"],
          join: ["gop.kod_object=o.id"],
        },
        "gameObjects",
        useGamesStore
      );
    },
  },
});
</script>

<style scoped>
label {
  width: 20%;
  display: inline-block;
}
input[type="range"] {
  max-width: 75%;
  margin: 5px;
}
.row {
  margin-bottom: 1px;
}
</style>
