import Time, {
  compareTimes,
  getMinutesSinceMidnight,
  timeSchema,
} from "./Time";
import * as yup from './utils/localeYup';

export default interface Schedule {
  dayOfWeek: number;
  startTime: Time;
  endTime: Time;
}

export function getScheduleInitialValues(): Schedule {
  const _scheduleInitialValues: {
    [field in keyof Required<Schedule>]: undefined
  } = {
    dayOfWeek: undefined,
    startTime: undefined,
    endTime: undefined,
  };
  return _scheduleInitialValues as unknown as Schedule;
}

export const scheduleSchema: yup.SchemaOf<Schedule> = yup.object({
  dayOfWeek: yup.number().required().min(1).max(7),
  startTime: timeSchema.required(),
  endTime: timeSchema.required().when('startTime',
    (startTime: Time, schema: typeof timeSchema) =>
      schema.test(
        'after-start-time',
        'Debe ser después de la hora de inicio',
        endTime => endTime?.hours != null && endTime?.minutes != null &&
          compareTimes(endTime as Time, startTime) > 0
      )
  ),
});

export function doSchedulesConflict(
  { dayOfWeek: dayOfWeek1, startTime: startTime1, endTime: endTime1 }: Schedule,
  { dayOfWeek: dayOfWeek2, startTime: startTime2, endTime: endTime2 }: Schedule,
) {
  if (dayOfWeek1 === dayOfWeek2) {
    const startMinutesSinceMidnight1 = getMinutesSinceMidnight(startTime1);
    const startMinutesSinceMidnight2 = getMinutesSinceMidnight(startTime2);
    const endMinutesSinceMidnight1 = getMinutesSinceMidnight(endTime1);
    const endMinutesSinceMidnight2 = getMinutesSinceMidnight(endTime2);
    // What's the most efficient way to test if two ranges overlap?
    // https://stackoverflow.com/a/12888920/10150433
    if (startMinutesSinceMidnight1 < endMinutesSinceMidnight2
        && startMinutesSinceMidnight2 < endMinutesSinceMidnight1)
    {
      return true;
    }
  }
  return false;
}

export function doesAnyScheduleConflict(schedules: Schedule[]) {
  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      if (doSchedulesConflict(schedules[i], schedules[j])) {
        return true;
      }
    }
  }
  return false;
}
