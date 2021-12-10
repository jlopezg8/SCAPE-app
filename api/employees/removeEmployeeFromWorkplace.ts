import { Employee, WorkplaceId } from '../../models';
import { RequiredArgumentError } from '../errors';
import { delete_ } from '../utils';
import { WorkplaceNotFoundError } from '../workplaces/common';
import { EmployeeNotFoundError, getEndpoint } from './common';

/**
 * @throws `'../errors'.RequiredArgumentError` if `employeeIdDoc` or
 *         `workplaceId` are not given
 * @throws `'./common'.EmployeeNotFoundError` if the employee with
 *         `employeeIdDoc` was not found
 * @throws `'./common'.WorkplaceNotFoundError` if the workplace with
 *         `workplaceId` was not found
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function removeEmployeeFromWorkplace(
  employeeIdDoc: Employee['idDoc'], workplaceId: WorkplaceId
) {
  if (!employeeIdDoc) throw new RequiredArgumentError('employeeIdDoc');
  if (workplaceId == null) throw new RequiredArgumentError('workplaceId');
  try {
    const url = new URL(getEndpoint('workplace'));
    url.searchParams.set('documentId', employeeIdDoc.toString());
    url.searchParams.set('workPlaceId', workplaceId.toString());
    await delete_(url.toString());
  } catch (err) {
    const error = err as Error;
    switch (error.message) {
      // Looking at the API documentation it seems there aren't responses for
      // nonexistent employees or workplaces:
      /*case 'Doesnt exit employee with that document':
        throw new EmployeeNotFoundError(employeeIdDoc);
      case 'Doesnt exit workplace with that id':
        throw new WorkplaceNotFoundError(workplaceId);*/
      default:
        throw error;
    }
  }
}
