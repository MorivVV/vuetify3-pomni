interface IVCalendarItem {
  [x: string]: string | Date | number | boolean;
  id: number;
  update: boolean;
  name: string;
  start: Date | number;
  end: Date | number;
  color: string;
  timed: boolean;
}
interface IVCalendarPeriod {
  date: string;
  time: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
  hasDay: boolean;
  hasTime: boolean;
  past: boolean;
  present: boolean;
  future: boolean;
}
interface IVCalendarEventTime {
  date: string;
  time: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
  hasDay: boolean;
  hasTime: boolean;
  past: boolean;
  present: boolean;
  future: boolean;
  timeToY: (
    time: string | number | { hour: number; minute: number },
    clamp: boolean
  ) => number | false;
  timeDelta: (
    time: string | number | { hour: number; minute: number }
  ) => number | false;
  minutesToPixels: (minutes: number) => number;
  week: [
    {
      date: string;
      time: string;
      year: number;
      month: number;
      day: number;
      hour: number;
      minute: number;
      weekday: number;
      hasDay: boolean;
      hasTime: boolean;
      past: boolean;
      present: boolean;
      future: boolean;
    }
  ];
}
interface IVCalendarEvent {
  event: IVCalendarItem;
  eventParsed: {
    input: any;
    start: IVCalendarPeriod;
    startIdentifier: number;
    startTimestampIdentifier: number;
    end: IVCalendarPeriod;
    endIdentifier: number;
    endTimestampIdentifier: number;
    allDay: boolean;
    index: number;
    category: string;
  };
  day: {
    outside: boolean;
    index: number;
    week: [
      {
        date: string;
        time: string;
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        weekday: number;
        hasDay: boolean;
        hasTime: boolean;
        past: boolean;
        present: boolean;
        future: boolean;
      }
    ];
    date: string;
    time: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    weekday: number;
    hasDay: boolean;
    hasTime: boolean;
    past: boolean;
    present: boolean;
    future: boolean;
  };
  outside: boolean;
  start: boolean;
  end: boolean;
  timed: boolean;
  singleline: boolean;
  overlapsNoon: boolean;
  formatTime: (time: string, ampm: boolean) => string;
  timeSummary: () => string;
  eventSummary: () => string;
}
