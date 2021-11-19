import {
  WorkplaceToCreateOrEdit,
  workplaceToCreateOrEditSchema,
} from '../../models/Workplace';
import { post } from '../utils';
import { createAPIWorkplaceToCreateOrEdit, getEndpoint } from './common';

/**
 * @throws `'yup'.ValidationError` if `workplace` does not match
 *         `'../../models/Workplace'.workplaceToCreateOrEditSchema`
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function createEmployee(
  workplace: WorkplaceToCreateOrEdit
) {
  workplaceToCreateOrEditSchema.validateSync(workplace);
  await post(getEndpoint(), createAPIWorkplaceToCreateOrEdit(workplace));
}
