<template>
  <v-container>
    <v-row>
      <v-col col="4">
        <h5 class="center">
          Съел яблок: {{ shake.length - startSnake.length }}
        </h5>
      </v-col>
      <v-col col="4">
        <h5 class="center">Скорость:{{ speed }}</h5>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <TableDataVue :allrow="false" :data="snake" :test="testScore" />
      </v-col>
      <v-col class="text-center" cols="auto">
        <table class="center" style="width: auto">
          <tbody>
            <tr v-for="y in fieldSize" :key="y + 'tr'">
              <SnakeCellVue
                v-for="x in fieldSize"
                :key="y + 'td' + x"
                :apples="apples"
                :b="x"
                :i="y"
                :snake="shake"
              />
            </tr>
          </tbody>
        </table>
      </v-col>
      <v-col>
        <BtnIconsVVue :action="testApi" title="Test" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { dataApiComposition } from "@/compositionApi/dataApi";
import { EKNOWLEGEBASE } from "@/const/schemaEnums";
import { EGAMES } from "@/const/schemaEnumsHome";
import { useGamesStore } from "@/store/modules/games";
import { useUserDataStore } from "@/store/modules/usersData";
import {
  IKnowledgebaseBzAudit,
  IKnowledgebaseBzIpAddres,
  IKnowledgebaseBzUsers,
  IKnowledgebaseBzUsersParams,
  IKnowledgebaseEmails,
} from "@/types/database/schemas/knowledgebase";
import { ICreateTableFields } from "@/types/database/service";
import { Point } from "chart.js";
import { mapGetters, mapState } from "pinia";
import { defineComponent, ref } from "vue";
import BtnIconsVVue from "../basic/BtnIconsV.vue";
import TableDataVue from "../basic/TableData.vue";
import SnakeCellVue from "./snake/SnakeCell.vue";
enum KEY {
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40,
}

export default defineComponent({
  components: { TableDataVue, SnakeCellVue, BtnIconsVVue },
  setup () {
    const demoRUN = ref(true);

    const move = (key: number): Point => {
      const point: Point = { x: 0, y: 0 };
      switch (key) {
        case KEY.LEFT:
          point.x--;
          break;
        case KEY.UP:
          point.y--;
          break;
        case KEY.RIGHT:
          point.x++;
          break;
        case KEY.DOWN:
          point.y++;
          break;
      }
      return point;
    };

    const demoAI = (apples: Point[], shake: Point[], key: number) => {
      if (!demoRUN.value) return key;
      const xApple = apples.map((a) => a.x);
      const yApple = apples.map((a) => a.y);
      const xSnake = shake.map((a) => a.x);
      const ySnake = shake.map((a) => a.y);
      if (shake.length === 0) return key;
      const shakeHead = shake[shake.length - 1];

      if (xApple.indexOf(shakeHead.x) > -1) {
        if (key === KEY.LEFT || key === KEY.RIGHT) {
          if (yApple[xApple.indexOf(shakeHead.x)] > shakeHead.y) {
            key = KEY.DOWN;
          } else {
            key = KEY.UP;
          }
        }
        return key;
      }
      if (yApple.indexOf(shakeHead.y) > -1) {
        if (key === KEY.UP || key === KEY.DOWN) {
          if (xApple[yApple.indexOf(shakeHead.y)] > shakeHead.x) {
            key = KEY.RIGHT;
          } else {
            key = KEY.LEFT;
          }
        }
        return key;
      }
      const random = Math.random() * 10;

      if (random < 7) return key;
      const test = random < 3;
      switch (key) {
        case KEY.LEFT:
          key = test ? KEY.UP : KEY.DOWN;
          break;
        case KEY.UP:
          key = test ? KEY.RIGHT : KEY.LEFT;
          break;
        case KEY.DOWN:
          key = test ? KEY.RIGHT : KEY.LEFT;
          break;
        case KEY.RIGHT:
          key = test ? KEY.UP : KEY.DOWN;
          break;

        default:
          break;
      }

      const point = move(key);
      const nextSnake: Point = {
        x: shakeHead.x + point.x,
        y: shakeHead.y + point.y,
      };
      if (xSnake.includes(nextSnake.x) && ySnake.includes(nextSnake.y)) {
        console.log("Хотели", nextSnake);
        key = demoAI(apples, shake, key);
        console.log("Меняем направление на", key);
      }

      return key;
    };
    const { r_get, r_insert } = dataApiComposition();
    const testApi = () => {
      r_get<
        | "ip_address"
        | ICreateTableFields<keyof IKnowledgebaseBzUsers, "u" | "uu">
        | ICreateTableFields<keyof IKnowledgebaseBzUsersParams, "up">
        | ICreateTableFields<keyof IKnowledgebaseEmails, "e">
        | ICreateTableFields<keyof IKnowledgebaseBzIpAddres, "ip">
        | ICreateTableFields<keyof IKnowledgebaseBzAudit, "a">
      >({
        fields: [
          "u.first_name",
          "u.login_ip:test",
          "ip_address",
          {
            fields: ["e.email"],
            from: ["emails:e"],
            filter: { "e.id": "@@:u.kod_email" },
          },
          {
            fields: ["e.email:omega"],
            from: ["bz_users_params:up"],
            filter: {
              "up.param_key": "=:user_emailOmega",
              "up.kod_user": "@@:u.id",
            },
          },
        ],
        from: [
          `${EKNOWLEGEBASE.bz_users}:u`,
          "emails:e",
          "bz_users_params:up",
          {
            alias: "a",
            fields: ["ip.ip:ip_address", "a.kod_user"],
            from: ["bz_audit:a", "bz_ip_addres:ip"],
            join: ["a.kod_ip_addres=ip.id"],
            filter: {
              "ip.ip": "~:85",
              "up.kod_user": [
                {
                  "up.kod_user": {
                    fields: ["DISTINCT", "a.kod_user"],
                    from: ["bz_audit:a"],
                    filter: { "a.time_action": ">:2023-01-01" },
                  },
                },
                { "up.kod_user": 6 },
                { "up.kod_user": 7 },
                { "up.kod_user": 8 },
                { "up.kod_user": 9 },
                { "up.kod_user": 10 },
              ],
              "a.time_action": ">:2022-05-01",
            },
            limit: 10,
          },
        ],
        join: ["u.kod_email=(+)e.id", "u.id=a.kod_user"],
        filter: {
          "u.login_time": ">:2022-01-01",
          "u.id": {
            fields: ["uu.id"],
            from: [`${EKNOWLEGEBASE.bz_users}:uu`],
            filter: {
              "uu.login": [
                { "uu.login": "=:morivvv" },
                { "uu.login": "=:emoriv" },
              ],
            },
          },
        },
        sort: ["-ip_address"],
        limit: 10,
      });
    };
    return { r_get, r_insert, move, demoAI, demoRUN, testApi };
  },
  data () {
    return {
      fieldSize: 24,
      shake: [] as Point[],
      apples: [] as Point[],
      point: { x: 10, y: 10 } as Point,
      key: KEY.RIGHT,
      speed: 600,
      timer: 0,
      startSnake: [7, 8, 9, 10].map((e) => ({ x: e, y: 10 })),
    };
  },
  computed: {
    ...mapState(useGamesStore, ["snake"]),
    ...mapGetters(useUserDataStore, ["usersFioArray"]),
    testScore (): { [x: string]: any }[] {
      return [
        {
          key_field: "kod_user",
          valdata: this.usersFioArray,
          name: "Пользователь",
          id: "id",
          naimen: "short",
        },
        {
          key_field: "score",
          valdata: [],
          name: "Очки",
          id: "",
          naimen: "",
        },

        {
          key_field: "date_add",
          name: "Дата",
          func: (e: string) => this.$moment(e).format("YYYY-MM-DD HH:mm:ss"),
        },
      ];
    },
  },
  watch: {
    "point.x" (newVal) {
      if (this.checkField(newVal, "x")) {
        this.progress();
      }
    },
    "point.y" (newVal) {
      if (this.checkField(newVal, "y")) {
        this.progress();
      }
    },
    speed (newVal) {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        const point = this.move(this.key);
        if (point.x !== 0) this.point.x += point.x;
        if (point.y !== 0) this.point.y += point.y;
      }, newVal);
    },
  },
  mounted () {
    this.testApi();
    this.getScores();

    this.progress();
    this.shake = [...this.startSnake];
    this.newApple();
    this.newApple();
    this.newApple();
    this.newApple();
    document.addEventListener("keydown", this.pressKey);
    this.speed = 400;
  },
  methods: {
    checkField (newVal: number, coord: keyof Point) {
      let change = true;
      if (newVal > this.fieldSize) {
        this.point[coord] = 1;
        change = false;
      }
      if (newVal < 1) {
        this.point[coord] = this.fieldSize;
        change = false;
      }
      return change;
    },
    getScores () {
      return this.r_get<ICreateTableFields<keyof ISnakeScore, "ss">>(
        {
          fields: ["ss.id", "ss.score", "ss.kod_user", "ss.date_add"],
          from: [`${EGAMES.snake_score}:ss`],
          sort: ["-ss.score"],
          limit: 20,
        },
        "snake",
        useGamesStore
      );
    },
    setScores () {
      return this.r_insert({
        to: `${EGAMES.snake_score}`,
        fields: {
          kod_user: "${currentUser}",
          score: this.shake.length - this.startSnake.length,
        },
      }).then((r) => {
        console.log(r);
        this.getScores();
      });
    },
    progress () {
      if (this.crash()) {
        if (this.shake.length - this.startSnake.length > 1) {
          this.setScores();
        }

        this.shake = [...this.startSnake.map((e) => ({ ...e }))];
        this.point = { x: 10, y: 10 };
        this.key = KEY.RIGHT;
        this.speed = 400;
      } else {
        this.shake.push({ ...this.point });
        this.key = this.demoAI(this.apples, this.shake, this.key);
        if (this.getApple()) {
          const s = this.shake[this.shake.length - 1];
          this.apples = this.apples.filter((e) => e.x !== s.x && e.y !== s.y);
          this.newApple();
          this.speed = Math.ceil(this.speed * 0.98);
        } else {
          this.shake.shift();
        }
      }
    },
    newApple () {
      let x = Math.ceil(Math.random() * 20);
      let y = Math.ceil(Math.random() * 20);
      while (
        this.apples.findIndex((e) => e.x === x && e.y === y) > -1 ||
        this.shake.findIndex((e) => e.x === x && e.y === y) > -1
      ) {
        x = Math.ceil(Math.random() * 20);
        y = Math.ceil(Math.random() * 20);
      }
      this.apples.push({ x, y });
      console.log(this.apples);
    },
    getApple () {
      let result = false;
      const s = this.shake[this.shake.length - 1];
      if (this.apples.findIndex((e) => e.x === s.x && e.y === s.y) > -1) {
        result = true;
      }
      return result;
    },
    crash () {
      let result = false;
      const s = this.shake[this.shake.length - 1];
      const body = this.shake.findIndex((e) => e.x === s.x && e.y === s.y);
      if (body >= 0 && body < this.shake.length - 1) {
        result = true;
      }
      return result;
    },
    pressKey (e: any) {
      this.key = e.keyCode;
      this.demoRUN = false;
    },
  },
});
</script>

<style scoped>
table,
th,
td {
  border: solid 1px silver;
  height: 30px;
  border-spacing: 0px;
}
</style>
