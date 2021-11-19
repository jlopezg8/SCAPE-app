import { RequiredArgumentError } from '../errors';
import { delete_ } from '../utils';
import { getEndpoint, WorkplaceNotFoundError } from './common';

/**
 * @throws `'../errors'.RequiredArgumentError` if `workplaceId` is not given
 * @throws `'./common'.WorkplaceNotFoundError` if the workplace with
 *         `workplaceId` was not found
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function deleteWorkplace(workplaceId: number) {
  if (!workplaceId) throw new RequiredArgumentError('workplaceId');
  try {
    await delete_(getEndpoint(workplaceId.toString()));
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
