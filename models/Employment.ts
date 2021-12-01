import { Employee, idDocSchema } from './Employee';
import Schedule, { doesAnyScheduleConflict, scheduleSchema } from './Schedule';
import * as yup from './utils/localeYup';
import Workplace from './Workplace';

export default interface Employment {
  employeeIdDoc: Employee['idDoc'];
  workplaceId: NonNullable<Workplace['id']>;
  schedules: Schedule[];
  startDate?: Date;
  endDate?: Date;
}

const optionalDateSchema = yup.date().typeError('Fecha inválida');

export const employmentSchema: yup.SchemaOf<Employment> = yup.object({
  employeeIdDoc: idDocSchema,
  workplaceId: yup.number().required(),
  schedules: yup.array<Schedule>().of(scheduleSchema).required().test(
    'scheduling-conflicts-free',
    'Conflicto de horarios',
    areSchedulesConflictFree,
  ),
  startDate: optionalDateSchema,
  endDate: optionalDateSchema.when('startDate',
    (startDate: Date | undefined, schema: typeof optionalDateSchema) =>
      startDate
        ? schema.min(startDate, 'Debe ser después de la fecha de inicio')
        : schema
  ),
});

type DeepMaybeSchedules = yup.TypeOf<typeof scheduleSchema>[] | undefined;

function areSchedulesConflictFree(schedules: DeepMaybeSchedules) {
  const theSchedules = schedules as Schedule[] | undefined;
  return !(theSchedules && doesAnyScheduleConflict(theSchedules));
}

/**
 * Annoyingly, yup's test execution order "cannot be guaranteed", so the
 * `areSchedulesConflictFree` test could run before the `required` test.
 */
/*function ensureSchedules(schedules: DeepMaybeSchedules)
  : Schedule[] | undefined
{
  return schedules && schedules.every(schedule =>
    schedule?.dayOfWeek != null
    && schedule?.startTime != null
    && schedule?.endTime != null
  ) ? schedules as Schedule[] : undefined;
}*/
