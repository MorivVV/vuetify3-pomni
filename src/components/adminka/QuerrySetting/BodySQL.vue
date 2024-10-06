<template>
  <div>
    <label class="text-caption">Текст SQL запроса</label>
    <v-card
      class="overflow-auto"
      elevation="0"
      max-height="500"
      :outlined="false"
    >
      <v-card-text class="pre" v-html="sqlViewChange" />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { highlight } from "sql-highlight";
import { computed } from "vue";
const props = defineProps({
  color: {
    type: String,
    required: true,
  },
  sqlQuery: {
    type: String,
    required: true,
  },
  sqlQueryMod: {
    type: String,
    required: true,
  },
});
const sqlHighLighting = (sql: string) => highlight(sql, { html: true });

const sqlHLtext = (sql1: string, sql2: string) => {
  if (sql1 === sql2) return sql1;
  const s1 = sql1.split("\n");
  const s2 = sql2.split("\n");
  const sql: string[] = [];
  let diff = 0;
  for (let index = 0; index < s1.length; index++) {
    const element1 = s1[index];
    const element2 = s2[index];
    if (element1 !== element2) {
      if (diff) {
        let upCheck = true;
        for (let i = index - diff; i < s2.length; i++) {
          const element2 = s2[i];
          if (element1 === element2) {
            sql.push(element1);
            upCheck = false;
            break;
          }
        }
        if (upCheck) {
 sql.push(
            `<span class="${props.color} pl-1 pr-1">${s1[index]}</span>`
          );
}
      } else {
        sql.push(`<span class="${props.color} pl-1 pr-1">${s1[index]}</span>`);
      }

      diff++;
    } else {
      sql.push(element1);
    }
  }
  return sql.join("\n");
};
const sqlViewChange = computed(() =>
  sqlHLtext(sqlHighLighting(props.sqlQuery), sqlHighLighting(props.sqlQueryMod))
);
</script>

<style scoped>
.pre {
  display: block;
  white-space: pre;
  margin: 1em 0px;
  font-family: monospace, monospace;
  font-size: 1em;
}
.pre >>> .sql-hl-keyword {
  color: indigo;
  font-weight: bold;
}
.pre >>> .sql-hl-special {
  color: darkblue;
}
.pre >>> .sql-hl-number {
  color: blue;
}
.pre >>> .sql-hl-bracket {
  color: darkorange;
}
.pre >>> .sql-hl-comment {
  color: silver;
}
.pre >>> .sql-hl-function {
  color: palevioletred;
}
.pre >>> .sql-hl-string {
  color: green;
}
</style>
