<template lang="pug">
v-container
  .field
    ChessBoardVue
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChessBoardVue from "./chess/ChessBoard.vue";

export default defineComponent({
  components: { ChessBoardVue },
});
</script>

<style scoped>
.field {
  border: 1px solid silver;
  width: calc(100px * 8 + 47px);
}
</style>
