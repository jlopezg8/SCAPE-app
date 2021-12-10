import { Employment, Schedule } from '../../models';
import { employmentSchema } from '../../models/Employment';
import { getMinutesSinceMidnight } from '../../models/Time';
import { post } from '../utils';
import { WorkplaceNotFoundError } from '../workplaces/common';
import { APISchedule, EmployeeNotFoundError, getEndpoint } from './common';

/**
 * @throws `'yup'.ValidationError` if `employment` does not match
 *         `'../../models/Employment'.employmentSchema`
 * @throws `'./common'.EmployeeNotFoundError` if the employee with
 *         `employment.employeeIdDoc` was not found
 * @throws `'../workplaces/common'.WorkplaceNotFoundError` if the workplace
 *         with `employment.workplaceId` was not found
 * @throws `Error` if there was a network failure or an unknown error
 */
export default
async function putEmployeeEmploymentInWorkplace(employment: Employment) {
  employmentSchema.validateSync(employment);
  const apiEmployment = mapEmploymentToAPIEmployment(employment);
  try {
    await post(getEndpoint('schedule'), apiEmployment);
  } catch (err) {
    const error = err as Error;
    switch (error.message) {
      case 'Doesnt exit employee with that document':
        throw new EmployeeNotFoundError(employment.employeeIdDoc);
      case 'Doesnt exit workplace with that id':
        throw new WorkplaceNotFoundError(employment.workplaceId);
      default:
        throw error;
    }
  }
}

interface APIEmployment {
  documentId: string;
  workPlaceId: number;
  startJobDate?: Date;
  endJobDate?: Date;
  schedule: APISchedule[];
}

function mapEmploymentToAPIEmployment(employment: Employment): APIEmployment {
  return {
    documentId: employment.employeeIdDoc,
    workPlaceId: employment.workplaceId,
    startJobDate: employment.startDate,
    endJobDate: employment.endDate,
    schedule: employment.schedules.map(mapScheduleToAPISchedule),
  };
}

function mapScheduleToAPISchedule(schedule: Schedule): APISchedule {
  return {
    dayOfWeek: schedule.dayOfWeek,
    startMinute: getMinutesSinceMidnight(schedule.startTime),
    endMinute: getMinutesSinceMidnight(schedule.endTime),
  }
}
