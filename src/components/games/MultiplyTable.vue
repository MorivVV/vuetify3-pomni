<template>
  <div>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <SelectV
          v-model="multiplier"
          label="Множитель"
          :items="multiplySet"
          @input="() => (answers.length = 0)"
        />
      </v-col>
      <v-col cols="auto">
        <BtnIconsV
          icon="play_arrow"
          :colorbtn="`${roundId ? 'green' : 'red'}`"
          color="white"
          title="Начать"
          :action="startRound"
        />
      </v-col>
      <v-col v-if="roundInfo.length" cols="auto" class="text-h4">
        {{
          Math.floor(
            ((roundInfo[0].time_end
              ? +new Date(roundInfo[0].time_end)
              : Date.now()) -
              +new Date(roundInfo[0].time_start)) /
              1000
          )
        }}
        секунд
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <div v-if="roundId || answers.length === multiplyTable.length">
      <MultiplyElement
        v-for="m in multiplyTable"
        :key="m"
        :operand1="m"
        :operand2="multiplier"
        :disable="answers.includes(m)"
        :view-check="answers.length === multiplyTable.length"
        @result="(answer) => resultEvent(answer, m, multiplier)"
      />
    </div>
    <v-row v-if="answers.length === multiplyTable.length">
      <v-col class="text-center text-h2 red--text">
        Твоя оценка
        {{ +roundHistory[0].ans / 2 }}</v-col
      >
    </v-row>
    <DataTableV :items="roundHistory" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SelectV from "../basic/SelectV.vue";
import MultiplyElement from "./multiply/MultiplyElement.vue";
import BtnIconsV from "../basic/BtnIconsV.vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import {
  IGamesMultiplyRounds,
  IGamesMultiplyResults,
} from "@/types/database/schemas/games";
import { currentAuthUser, currentTimestamp } from "@/const/globalRestAPI";
import { ICreateTableFields } from "@/types/database/service";
import DataTableV from "../basic/DataTableV.vue";
const { r_insert, r_get, r_update, checkDataModify } = dataApiComposition();
const multiplySet = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const multiplyTable = ref<number[]>([...multiplySet]);
const multiplier = ref(1);
const answers = ref<number[]>([]);
const roundId = ref(0);
const roundInfo = ref<IGamesMultiplyRounds[]>([]);
const roundHistory = ref<IGamesMultiplyRounds[]>([]);
const randomSet = () => {
  const rnd: number[] = [];
  while (rnd.length < 10) {
    const a = Math.floor(Math.random() * 11);
    if (!rnd.includes(a)) {
      rnd.push(a);
    }
  }
  return rnd;
};
const getRoundHistory = () =>
  r_get<
    | ICreateTableFields<keyof IGamesMultiplyRounds, "r">
    | ICreateTableFields<keyof IGamesMultiplyResults, "rs">
    | "extract(EPOCH from r.time_end-r.time_start)"
    | "sum(CASE when rs.operator1*rs.operator2=rs.answer then 1 else 0 end)"
  >({
    from: ["games.multiply_rounds:r", "games.multiply_results:rs"],
    fields: [
      "r.naimen_round",
      "r.id",
      "r.time_start",
      "r.time_end",
      "extract(EPOCH from r.time_end-r.time_start):timing",
      "sum(CASE when rs.operator1*rs.operator2=rs.answer then 1 else 0 end):ans",
    ],
    join: ["r.id=rs.kod_round"],
    group: ["r.naimen_round", "r.id", "r.time_end", "r.time_start"],
    sort: ["-r.id"],
  }).then((r) => {
    roundHistory.value = r;
    return r;
  });
const getRoundInfo = (naimen_round?: string, id?: number) =>
  r_get<keyof IGamesMultiplyRounds>({
    from: "games.multiply_rounds",
    filter: { naimen_round, id },
  }).then((r) => {
    roundInfo.value = r;
    return r;
  });
const startRound = () => {
  const naimen_round = `${multiplier.value}x${Date()}`;
  answers.value.length = 0;
  r_insert<keyof IGamesMultiplyRounds>({
    to: "games.multiply_rounds",
    fields: {
      kod_user: currentAuthUser,
      naimen_round: naimen_round,
    },
  })
    .then(() => getRoundInfo(naimen_round))
    .then((r) => {
      roundId.value = r[0].id;
      multiplyTable.value = randomSet();
    });
};
const resultEvent = (answer: number, operand1: number, operand2: number) => {
  r_insert<keyof IGamesMultiplyResults>({
    to: "games.multiply_results",
    fields: {
      answer: answer,
      kod_round: roundId.value,
      operator1: operand1,
      operator2: operand2,
    },
  })
    .then(() =>
      r_get<keyof IGamesMultiplyResults>({
        from: "games.multiply_results",
        filter: {
          answer: answer,
          kod_round: roundId.value,
          operator1: operand1,
          operator2: operand2,
          time_add: "@@>:now()-interval'2 sec'",
        },
      })
    )
    .then((r) => {
      answers.value.push(r[0].operator1);
      if (answers.value.length === multiplyTable.value.length) {
        r_update<keyof IGamesMultiplyRounds>({
          to: "games.multiply_rounds",
          filter: { id: roundId.value },
          set: { time_end: currentTimestamp },
        })
          .then(checkDataModify)
          .then((r) => {
            if (r) {
              getRoundHistory();
              roundId.value = 0;
            }
          });
      }
    });
};
getRoundHistory();
</script>
