import {
  getDayOfWeek,
  getLocalTimeZone,
  isWeekday,
  today,
} from "@internationalized/date";

export const getInitDate = () => {
  const initDate = today(getLocalTimeZone()).add({ days: 2 });

  return isWeekday(initDate, LOCALE)
    ? initDate
    : getDayOfWeek(initDate, LOCALE) === 6
      ? initDate.add({ days: 1 })
      : initDate.add({ days: 2 });
};
