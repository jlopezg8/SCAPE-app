import { Employee, idDocSchema } from './Employee';
import Schedule, { doesAnyScheduleConflict, scheduleSchema } from './Schedule';
import * as yup from './utils/localeYup';
import { WorkplaceId } from './Workplace';

export default interface Employment {
  employeeIdDoc: Employee['idDoc'];
  workplaceId: WorkplaceId;
  schedules: Schedule[];
  startDate?: Date;
  endDate?: Date;
}

export function getEmploymentInitialValues(
  employeeIdDoc: Employee['idDoc'], workplaceId: WorkplaceId
): Employment {
  const _employmentInitialValues: {
    [field in keyof Required<Employment>]: Employment[field] | undefined
  } = {
    employeeIdDoc,
    workplaceId,
    schedules: [],
    startDate: undefined,
    endDate: undefined,
  };
  return _employmentInitialValues as unknown as Employment;
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
