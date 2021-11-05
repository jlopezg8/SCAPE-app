import {
  WorkplaceToCreateOrEdit,
  workplaceToCreateOrEditSchema,
} from '../../models/Workplace';
import { RequiredArgumentError } from '../errors';
import { put } from '../utils';
import {
  createAPIWorkplaceToCreateOrEdit,
  getEndpoint,
  WorkplaceNotFoundError,
} from './common';

/**
 * @throws `'../errors'.RequiredArgumentError` if `workplaceId` is not given
 * @throws `'yup'.ValidationError` if `newWorkplace` does not match
 *         `'../../models/Workplace.workplaceToCreateOrEditSchema'`
 * @throws `'./common'.WorkplaceNotFoundError` if the workplace with
 *         `workplaceId` was not found
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function editWorkplace(
  workplaceId: number, newWorkplace: WorkplaceToCreateOrEdit
) {
  if (workplaceId == null) throw new RequiredArgumentError('workplaceId');
  workplaceToCreateOrEditSchema.validateSync(newWorkplace);
  const apiWorkplace = createAPIWorkplaceToCreateOrEdit(newWorkplace);
  try {
    await put(getEndpoint(workplaceId.toString()), apiWorkplace);
  } catch (err) {
    const error = err as Error;
    switch (error.message) {
      case 'There is no WorkPlace with that Id':
        throw new WorkplaceNotFoundError(workplaceId);
      default:
        throw error;
    }
  }
}
