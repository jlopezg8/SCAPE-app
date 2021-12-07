import { Employee, Schedule, WorkplaceId } from '../../models';
import { getTimeFromMinutesSinceMidnight } from '../../models/Time';
import { RequiredArgumentError } from '../errors';
import { get } from '../utils';
import { WorkplaceNotFoundError } from '../workplaces/common';
import { APISchedule, EmployeeNotFoundError, getEndpoint } from './common';

/**
 * @throws `'../errors'.RequiredArgumentError` if `employeeIdDoc` or
 *         `workplaceId` are not given
 * @throws `'./common'.EmployeeNotFoundError` if the employee with
 *         `employeeIdDoc` was not found
 * @throws `'./common'.WorkplaceNotFoundError` if the workplace with
 *         `workplaceId` was not found
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function getEmployeeSchedulesInWorkplace(
  employeeIdDoc: Employee['idDoc'], workplaceId: WorkplaceId
): Promise<Schedule[]> {
  if (!employeeIdDoc) throw new RequiredArgumentError('employeeIdDoc');
  if (workplaceId == null) throw new RequiredArgumentError('workplaceId');
  try {
    const response = await get(getEndpoint('schedule'), {
      documentId: employeeIdDoc,
      workPlaceId: workplaceId,
    });
    const apiSchedules = await response.json() as APISchedule[];
    return apiSchedules.map(mapAPIScheduleToSchedule);
  } catch (err) {
    const error = err as Error;
    switch (error.message) {
      case 'Doesnt exit employee with that document':
        throw new EmployeeNotFoundError(employeeIdDoc);
      // Looking at the API documentation it seems there isn't a response for a
      // nonexistent workplace:
      /*case 'Doesnt exit workplace with that id':
        throw new WorkplaceNotFoundError(workplaceId);*/
      default:
        throw error;
    }
  }
}

function mapAPIScheduleToSchedule(
  { dayOfWeek, startMinute, endMinute }: APISchedule
): Schedule {
  return {
    dayOfWeek,
    startTime: getTimeFromMinutesSinceMidnight(startMinute),
    endTime: getTimeFromMinutesSinceMidnight(endMinute),
  };
}
