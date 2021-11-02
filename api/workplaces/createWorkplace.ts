import {
  WorkplaceToCreate,
  workplaceToCreateSchema,
} from '../../models/Workplace';
import { post } from '../utils';
import { getEndpoint } from './common';

/**
 * @throws `'yup'.ValidationError` if `workplace` does not match
 *         `'../../models/Workplace'.workplaceToCreateSchema`
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function createEmployee(workplace: WorkplaceToCreate) {
  workplaceToCreateSchema.validateSync(workplace);
  await post(getEndpoint(), createAPIWorkplaceToCreate(workplace));
}

interface APIWorkplaceToCreate {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  description?: string;
}

function createAPIWorkplaceToCreate(workplace: WorkplaceToCreate)
  : APIWorkplaceToCreate
{
  return {
    name: workplace.name,
    address: workplace.address,
    latitude: workplace.latitude.toString(),
    longitude: workplace.longitude.toString(),
    description: workplace.description,
  };
}
