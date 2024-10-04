import { useDateConstStore } from "@/store/modules/dateConst";

const { weekdays, days, hours, minutes } = useDateConstStore();
export const calcPeriodAbs = (propsJob) => {
  let periodAbs = "";
  const job = { ...propsJob };
  if (job.period_run_day) {
    periodAbs =
      " каждое " +
      days.filter((e) => e.id === job.period_run_day)[0].name +
      " число";
  }
  if (job.period_run_week_array.length) {
    periodAbs +=
      " по " +
      weekdays
        .filter((e) => job.period_run_week_array.includes(+e.id))
        .map((e) => e.short)
        .join(", ");
  }

  if (job.period_run_hour_array.length && job.period_run_minute !== null) {
    periodAbs +=
      " в " +
      hours
        .filter((e) => job.period_run_hour_array.includes(+e.id))
        .map(
          (e) =>
            e.name +
            ":" +
            minutes.filter((e) => e.id === job.period_run_minute)[0].name
        )
        .join(", ");
  } else if (job.period_run_hour_array.length) {
    periodAbs +=
      " в течении " +
      hours
        .filter((e) => job.period_run_hour_array.includes(+e.id))
        .map((e) => e.name)
        .join(", ") +
      " ч.";
  } else if (job.period_run_minute !== null) {
    periodAbs +=
      " каждый час в " +
      minutes.filter((e) => e.id === job.period_run_minute)[0].name +
      " мин.";
  }

  if (job.interval_min !== null) {
    periodAbs += " c интервалом " + job.interval_min + " мин.";
  }
  return periodAbs;
};
export const calcColor = (propsJob, modificator = "") => {
  let color = "white";

  switch (propsJob.result) {
    case "выполняется":
      color = "yellow";
      break;
    case "в очереди":
      color = "blue";
      break;

    default:
      if (!propsJob.last_run) {
        color = "grey";
      } else if (!propsJob.last_done) {
        color = "orange";
      } else if (propsJob.last_run > propsJob.last_done) {
        color = "red";
      } else if (propsJob.active) {
        color = "green";
      }
      break;
  }

  return color + modificator;
};
