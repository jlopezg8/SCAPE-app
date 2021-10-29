import Workspace from '../../models/Workplace';
import { get } from '../utils';
import {
  APIWorkplace,
  getEndpoint,
  mapAPIWorkplaceToWorkplace,
} from './common';

/**
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function getWorkplace(): Promise<Workspace[]> {
  const endpoint = getEndpoint();
  const apiWorkplaces = await (await get(endpoint)).json() as APIWorkplace[];
  return apiWorkplaces.map(mapAPIWorkplaceToWorkplace);
}
