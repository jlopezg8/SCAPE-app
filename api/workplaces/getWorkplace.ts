import Workspace from '../../models/Workplace';
import { RequiredArgumentError } from '../errors';
import { get } from '../utils';
import {
  APIWorkplace,
  getEndpoint,
  mapAPIWorkplaceToWorkplace,
  WorkplaceNotFoundError,
} from './common';

/**
 * @throws `'../errors'.RequiredArgumentError` if `id` is not given
 * @throws `'./common'.WorkplaceNotFoundError` if the workspace with `id` was
 *         not found
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function getWorkplace(id: number): Promise<Workspace> {
  if (id == null) throw new RequiredArgumentError('id');
  try {
    const endpoint = getEndpoint(`${id}`);
    const apiWorkplace = await (await get(endpoint)).json() as APIWorkplace;
    return mapAPIWorkplaceToWorkplace(apiWorkplace);
  } catch (err) {
    const error = err as Error;
    switch (error.message) {
      case 'There is no Workplace with that ID':
        throw new WorkplaceNotFoundError(id);
      default:
        throw error;
    }
  }
}
