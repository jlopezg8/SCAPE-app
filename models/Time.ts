import * as yup from './utils/localeYup';

export default interface Time {
  hours: number;
  minutes: number;
}

export const timeSchema: yup.SchemaOf<Time> = yup.object({
  hours: yup.number().required().min(0).max(23),
  minutes: yup.number().required().min(0).max(59),
});

/**
 * `time1` < `time2` → <0
 * 
 * `time1` = `time2` → 0
 * 
 * `time1` > `time2` → >0
 */
export function compareTimes(time1: Time, time2: Time) {
  return getMinutesSinceMidnight(time1) - getMinutesSinceMidnight(time2);
}

export function getMinutesSinceMidnight({ hours, minutes }: Time) {
  return hours * 60 + minutes;
}

export function getTimeFromMinutesSinceMidnight(minutesSinceMidnight: number)
  : Time
{
  return {
    hours: Math.trunc(minutesSinceMidnight / 60),
    minutes: minutesSinceMidnight % 60,
  };
}

export function mapTimeToString({ hours, minutes }: Time) {
  const date = new Date();
  date.setHours(hours, minutes);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString#using_options
  return date.toLocaleTimeString([],
    { hour: '2-digit', minute: '2-digit', hour12: true }
  );
}
