<template lang="pug">
v-row.ma-0.d-flex( v-if="active" :class="current")
  MinutesJobsVue(
v-for="m in minutes.filter(e=>e.id>=0)" 
  :key="'w'+week+'_h'+hour+'_m'+m.id" 
  :hour="hour" 
  :minute="Number(m.id)" 
  :week="week" )
v-row.ma-0.d-flex( v-else)  
  v-col.pa-0.grey( cols="auto" style="width: 50px; height: 25px;" )
</template>

<script lang="ts">
import moment from "moment";
window.moment = moment;
import { defineComponent } from "vue";
import { mapState } from "pinia";
import MinutesJobsVue from "./MinutesJobs.vue";
import { useDateConstStore } from "@/store/modules/dateConst";

export default defineComponent({
  components: { MinutesJobsVue },
  props: {
    hour: { type: Number, required: true },
    week: { type: Number, required: true },
  },
  data() {
    return {
      active: false,
    };
  },
  computed: {
    ...mapState(useDateConstStore, ["minutes"]),
    current(): string {
      const week = this.week as number;
      const hour = this.hour;
      const date = this.$moment().date() + week - this.$moment().day();
      const month = this.$moment().month();
      const year = this.$moment().year();
      const day = new Date(year, month, date, hour);
      const dayCur = new Date(
        year,
        month,
        this.$moment().date(),
        this.$moment().hour()
      );

      let color = "white";
      if (this.$moment(day).unix() === this.$moment(dayCur).unix()) {
        this.$projectDebug(day, dayCur);
        color = "blue lighten-4";
      }
      return color;
    },
  },
  mounted() {
    setTimeout(() => {
      this.active = true;
    }, 5);
  },
});
</script>

<style scoped>
td {
  border: 1px solid silver;
  padding: 1px;
}
</style>
