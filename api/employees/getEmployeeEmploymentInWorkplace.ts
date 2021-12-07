import { Employee, Employment, WorkplaceId } from '../../models';
import getEmployeeSchedulesInWorkplace from './getEmployeeSchedulesInWorkplace';

/**
 * Currently, there's no API endpoint for getting an employee's employment in a
 * workplace, so this just gets the schedules but not the start and end dates.
 * 
 * @throws `'../errors'.RequiredArgumentError` if `employeeIdDoc` or
 *         `workplaceId` are not given
 * @throws `'./common'.EmployeeNotFoundError` if the employee with
 *         `employeeIdDoc` was not found
 * @throws `'./common'.WorkplaceNotFoundError` if the workplace with
 *         `workplaceId` was not found
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function getEmployeeEmploymentInWorkplace(
  employeeIdDoc: Employee['idDoc'], workplaceId: WorkplaceId
): Promise<Employment> {
  const schedules =
    await getEmployeeSchedulesInWorkplace(employeeIdDoc, workplaceId);
  return {
    employeeIdDoc,
    workplaceId,
    schedules,
    startDate: undefined,
    endDate: undefined,
  };
}
