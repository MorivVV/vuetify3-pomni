<template lang="pug">
.cell.figure(:class="colorClass" @click="activate")
  div(:class="{position : available}")
  slot
</template>

<script lang="ts">
import { Figure } from "@/classes/chess/figures/Figure";
import Vue, { PropType } from "vue";
export default Vue.extend({
  props: {
    color: { type: String },
    figure: { type: Object as PropType<Figure> },
    active: { type: Boolean },
    available: { type: Boolean },
  },
  computed: {
    colorClass(): string {
      let color = "";

      color = ["c-" + this.color, this.figure?.name, this.figure?.color].join(
        " "
      );
      if (this.active) {
        color += " active";
      }
      return color;
    },
  },
  methods: {
    activate() {
      this.$emit("activeteCell");
    },
  },
});
</script>

<style scoped>
.c-black {
  background-color: #795548 !important;
}
.c-white {
  background-color: #ffecb3 !important;
}
.c-white.active {
  background-color: #f4c22e !important;
}
.c-black.active {
  background-color: #aa6349 !important;
}
.cell {
  width: 100px;
  height: 100px;
}
.white .position,
.black .position {
  background-color: rgba(255, 3, 7, 0.639);
}
.position {
  width: 40px;
  height: 40px;
  margin: auto;
  top: 30px;
  position: relative;
  background-color: rgba(0, 128, 0, 0.639);
  border-radius: 50%;
}
.figure {
  background-image: url(/images/Chess_Figures.png);
  background-size: 600px;
  background-position: 100px 100px;
  background-repeat: no-repeat;
}
.figure.white {
  background-position-y: 0;
}
.figure.black {
  background-position-y: -100px;
}
.king {
  background-position-x: 0;
}
.queen {
  background-position-x: -100px;
}
.bishop {
  background-position-x: -200px;
}
.knight {
  background-position-x: -300px;
}
.rook {
  background-position-x: -400px;
}
.pawn {
  background-position-x: -500px;
}
</style>
