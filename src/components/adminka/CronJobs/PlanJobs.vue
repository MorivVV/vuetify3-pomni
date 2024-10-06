<template lang="pug">
div
  v-sheet(tile height="54" class="d-flex")
    v-btn(icon class="ma-2" @click="$refs.calendar.prev()")
      v-icon mdi-chevron-left
    v-select(v-model="type" :items="types" dense outlined hide-details class="ma-2" label="Период")
    v-select(v-model="mode" :items="modes" dense outlined hide-details label="event-overlap-mode" class="ma-2")
    v-btn(icon class="ma-2" @click="$refs.calendar.next()")
      v-icon mdi-chevron-right
  v-sheet(height="800")
    v-calendar(
            ref="calendar"
            v-model="value"
            :weekdays="weekday"
            :type="type"
            :events="events"
            :event-ripple="true"
            :event-margin-bottom="5"
            interval-minutes="4"
            interval-count="360"
            interval-height="72"
            :event-overlap-mode="mode"
            :event-overlap-threshold="30"
            :event-color="getEventColor"
            @change="getEvents")
</template>

<script lang="ts">
import moment from "moment";
import { defineComponent } from "vue";
import { mapState } from "pinia";
import HoursJobsVue from "./HoursJobs.vue";
import { TaskJobSchedule } from "@/classes/cronjob/TaskJobSchedule";
import { useDateConstStore } from "@/store/modules/dateConst";
import { useAdminStore } from "@/store/modules/admin";
window.moment = moment;

export default defineComponent({
  components: { HoursJobsVue },
  data () {
    return {
      type: "day",
      types: ["month", "week", "day", "4day"],
      mode: "column",
      modes: ["stack", "column"],
      weekday: [1, 2, 3, 4, 5, 6, 0],
      colors: [
        "blue",
        "indigo",
        "deep-purple",
        "cyan",
        "yellow",
        "amber",
        "green",
        "lime",
        "teal",
        "light-blue",
        "deep-orange",
        "light-green",
        "orange",
        "purple",
        "grey darken-1",
      ],
      value: "",
      events: [] as IVCalendarItem[],
    };
  },
  computed: {
    ...mapState(useDateConstStore, [
      "months",
      "weekdays",
      "days",
      "hours",
      "minutes",
    ]),
    ...mapState(useAdminStore, ["jobs", "job_scripts"]),
    taskJobs (): TaskJobSchedule[] {
      return this.jobs.map(
        (e) =>
          new TaskJobSchedule(
            e.naimen,
            e.period_start,
            e.period_end,
            e.last_run,
            e.last_done,
            e.period_run_month,
            e.period_run_week,
            e.period_run_day,
            e.period_run_hour,
            e.period_run_minute,
            e.interval_min,
            e.active
          )
      );
    },
  },
  mounted () {
    // this.$projectDebug(this.taskJobs);
  },
  methods: {
    getEvents ({
      start,
      end,
    }: {
      start: IVCalendarPeriod;
      end: IVCalendarPeriod;
    }) {
      const events: IVCalendarItem[] = [];
      // this.$projectDebug(start.date, end.date);
      const beg = new Date(start.date);
      const tdata = new Date(end.date).valueOf();
      const end_date = new Date(tdata + 1000 * 60 * 60 * 24);
      let icolor = 0;
      for (const task of this.taskJobs) {
        const wt = task.getWorkTime();
        if (typeof wt === "string") continue;
        const runList = task.getTaskRunList(beg, end_date);
        let workTime = 0;
        if (typeof wt === "number") {
          workTime = wt + 60;
        }
        for (const date of runList) {
          events.push({
            id: 0,
            name: task.getName(),
            start: date,
            update: false,
            end: new Date(date.valueOf() + 1000 * workTime),
            color: task.getActive()
              ? this.colors[icolor % this.colors.length]
              : "grey",
            timed: true,
          });
        }
        icolor++;
      }
      this.events = events;
    },
    getEventColor (event: IVCalendarItem) {
      return event.color;
    },
    rnd (a: number, b: number) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
});
</script>

<style scoped>
td {
  border: 1px solid silver;
  padding: 1px;
}
</style>
