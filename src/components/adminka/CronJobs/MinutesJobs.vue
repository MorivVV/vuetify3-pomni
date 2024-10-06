<template lang="pug">
v-col.pa-1.ma-0(
cols="1"
  :class="checkJobs")
</template>

<script lang="ts">
import moment from "moment";
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useAdminStore } from "@/store/modules/admin";
import { IKnowledgebaseCronJobs } from "@/types/database/schemas/knowledgebase";
window.moment = moment;

export default defineComponent({
  props: {
    minute: Number,
    hour: Number,
    week: Number,
  },
  data () {
    return {
      active: false,
    };
  },
  computed: {
    ...mapState(useAdminStore, ["jobs", "job_scripts"]),
    activeJobs (): IKnowledgebaseCronJobs[] {
      return this.jobs.filter((e) => e.active);
    },
    checkJobs (): string {
      let color = "white";
      const week = this.week as number;
      const hour = this.hour;
      const min = this.minute;
      const date = this.$moment().date() + week - this.$moment().day();
      const month = this.$moment().month();
      const year = this.$moment().year();
      const day = new Date(year, month, date, hour, min);
      const numDay = day.getDate();
      const dayUnix = Number(this.$moment(day).unix());
      const count = this.activeJobs.filter((e) => {
        let a = false;
        // задание включено
        a = e.active;
        // подходит период
        if (e.last_run) {
          const period = dayUnix - Number(this.$moment(e.last_run).unix());
          // this.$projectDebug(period);
          if (period) {
            const test = (period / 60) % e.interval_min;
            a &&= e.interval_min < 2 || (test < 1 && test > 0);
          }
        }
        // совпадает день
        a &&= !e.period_run_day || e.period_run_day === numDay;
        // совпадает неделя
        a &&= !e.period_run_week || e.period_run_week === week;
        // совпадает час
        a &&= !e.period_run_hour || e.period_run_hour === hour;
        // совпадает минута
        a &&= !e.period_run_minute || e.period_run_minute === min;
        // совпадает месяц
        a &&= !e.period_run_month || e.period_run_month === month;
        if (a) {
          this.$projectDebug(e.naimen);
        }
        return a;
      });

      switch (count.length) {
        case 0:
          color = "white";
          break;
        case 1:
          color = "green";
          // projectDebug(count.length, day);
          break;
        case 2:
          color = "yellow";
          // projectDebug(count.length, day);
          break;
        case 3:
          color = "orange";
          // projectDebug(count.length, day);
          break;

        default:
          color = "red";
          // projectDebug(count.length, day);
          break;
      }
      return color;
    },
  },
  mounted () {
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
