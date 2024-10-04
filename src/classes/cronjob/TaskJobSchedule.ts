import moment from "moment";
import { Moment } from "moment";
const timeDiff = (time1: Moment, time2: Moment) => {
  return time1.unix() - time2.unix();
};
export class TaskJobSchedule {
  private naimen: string;
  private start: string;
  private result: string;
  private end: string | null;
  private last_run: string | null;
  private last_done: string | null;
  private month: number | null;
  private week: number | null;
  private day: number | null;
  private hour: number | null;
  private minute: number | null;
  private interval: number | 0;
  private active: boolean;

  constructor(
    naimen: string,
    start: string,
    end: null | string,
    last_run: null | string,
    last_done: null | string,
    month: null | number,
    week: null | number,
    day: null | number,
    hour: null | number,
    minute: null | number,
    interval: number,
    active: boolean,
    result = ""
  ) {
    this.naimen = naimen;
    this.start = start;
    this.last_run = last_run;
    this.last_done = last_done;
    this.end = end;
    this.month = month;
    this.week = week;
    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.interval = interval;
    this.active = active;
    this.result = result;
  }
  private checkBasic(currentValue: number | null, otherValue: number): boolean {
    if (!currentValue) {
      return true;
    } else {
      return currentValue === otherValue;
    }
  }
  // проверка месяца
  checkMonth(month: number) {
    if (!this.month) {
      if (!this.day || this.day < 29) {
        return true;
      } else {
        switch (month) {
          case 3:
          case 6:
          case 8:
          case 10:
            return this.day < 31;
          case 1:
            const date = new Date();
            const year = date.getFullYear();
            return year % 4 === 0;
          default:
            return true;
        }
      }
    } else {
      return this.month === month + 1;
    }
  }
  // проверка недели
  checkWeek(week: number) {
    return this.checkBasic(this.week, week + 1);
  }
  // проверка дня
  checkDay(day: number) {
    return this.checkBasic(this.day, day);
  }
  // проверка часа
  checkHour(hour: number) {
    return this.checkBasic(this.hour, hour);
  }
  // проверка минут
  checkMinute(minute: number) {
    return this.checkBasic(this.minute, minute);
  }
  // проверка интервала
  checkInterval(new_period: Date) {
    if (this.interval < 2) {
      return true;
    } else {
      if (this.last_run) {
        const last_run = new Date(this.last_run);
        const milisecondsLR = last_run.getTime();
        const milisecondsNP = new_period.getTime();
        const period_interval = Math.floor(
          (milisecondsNP - milisecondsLR) / 60000
        );
        return period_interval % this.interval === 0;
      } else {
        return true;
      }
    }
  }
  // проверка периода выполнения
  checkPeriod(new_period: Date) {
    const start = new Date(this.start);
    const start_ms = start.getTime();
    const new_period_ms = new_period.getTime();
    if (new_period_ms < start_ms) {
      return false;
    }
    if (this.end) {
      const end = new Date(this.end);
      const end_ms = end.getTime();
      return new_period_ms < end_ms;
    } else {
      return true;
    }
  }
  // все проверки
  checkAll(year = 0, month = 0, week = 0, day = 0, hour = 0, minute = 0) {
    if (year === 0) {
      const cur_period = new Date();
      year = cur_period.getFullYear();
      month = cur_period.getMonth();
      week = cur_period.getDay();
      day = cur_period.getDate();
      hour = cur_period.getHours();
      minute = cur_period.getMinutes();
    }
    const new_period = new Date(year, month, day, hour, minute);

    if (!this.checkInterval(new_period)) {
      return false;
    }
    if (!this.checkPeriod(new_period)) {
      return false;
    }
    if (!this.checkMonth(month)) {
      return false;
    }
    if (!this.checkWeek(week)) {
      return false;
    }
    if (!this.checkDay(day)) {
      return false;
    }
    if (!this.checkHour(hour)) {
      return false;
    }
    if (!this.checkMinute(minute)) {
      return false;
    }
    return true;
  }

  nextRun(startDate = moment()) {
    if (
      moment(this.start) > startDate ||
      (this.end && moment(this.end) < startDate)
    ) {
      return new Date(0);
    }
    const startYear = startDate.year();
    const startMonth = startDate.month();
    const startHour = startDate.hour();
    const startDay = startDate.date();
    const startMinute = startDate.minute();
    const nextTime: Moment = moment(startDate).year(startYear).second(0);
    // let year = startYear;
    let month = this.month;
    let day = this.day;
    let hour = this.hour;
    let minute = this.minute;
    // проверка месяца
    if (month) {
      month = month - 1;
    } else {
      month = startMonth;
    }
    nextTime.month(month);
    // прибавим год, если дата меньше требуемой
    if (timeDiff(startDate, nextTime) > 59) {
      nextTime.add(1, "year");
    }

    // проверяем день
    if (!day) {
      day = startDay;
    }
    nextTime.date(day);
    // прибавим месяц, если дата меньше требуемой
    if (timeDiff(startDate, nextTime) > 59) {
      nextTime.add(1, "month");
    }

    // проверяем неделю
    if (this.week) {
      let week = this.week - 1;
      if (nextTime.day() < week) {
        week = week + 7;
      }
      nextTime.day(week);
    }
    // прибавим неделю, если дата меньше требуемой
    if (timeDiff(startDate, nextTime) > 59) {
      nextTime.add(1, "week");
    }

    // проверяем час
    if (!hour) {
      hour = startHour;
    }
    nextTime.hour(hour);
    // прибавим неделю или день, если дата меньше требуемой
    if (timeDiff(startDate, nextTime) > 59) {
      nextTime.add(1, this.week === null ? "day" : "week");
    }

    // проверяем минуты
    if (!minute) {
      minute = startMinute;
    }
    nextTime.minute(minute);
    // прибавим день неделю или час, если дата меньше требуемой
    if (timeDiff(startDate, nextTime) > 59) {
      nextTime.add(
        1,
        this.week !== null ? "week" : this.hour !== null ? "day" : "hour"
      );
    }

    // nextTime = moment({ year, month, day, hour, minute });
    if (this.interval > 1) {
      const period = Math.ceil(timeDiff(nextTime, moment(this.last_run)) / 60);
      nextTime.add((period % this.interval) + this.interval, "minutes");
    }
    return nextTime.toDate();
  }

  getWorkTime() {
    if (!this.last_run) return "-";
    const begin = moment(this.last_run).unix();
    const end =
      this.result === "выполняется"
        ? moment().unix()
        : moment(this.last_done).unix();
    return end - begin;
  }

  getTaskRunList(
    period_beg = new Date(),
    period_end = new Date(Date.now() + 1000 * 60 * 60 * 24)
  ) {
    const list: Date[] = [];
    let beg = period_beg;
    let i = 0;
    while (beg < period_end && i < 1000 && beg >= period_beg) {
      i++;
      beg = this.nextRun(moment(beg).add(1, "minute")) as Date;
      list.push(beg);
    }
    return list;
  }

  getActive() {
    return this.active;
  }

  getName() {
    return this.naimen;
  }
}
