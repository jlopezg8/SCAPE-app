import { RequiredArgumentError } from '../errors';
import { delete_ } from '../utils';
import { EmployeeNotFoundError, getEndpoint } from './common';

/**
 * @throws `'../errors'.RequiredArgumentError` if `idDoc` is empty
 * @throws `'./common'.EmployeeNotFoundError` if the employee with `idDoc` was
 *         not found
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function deleteEmployeeByIdDoc(idDoc: string) {
  if (!idDoc) throw new RequiredArgumentError('idDoc');
  try {
    await delete_(getEndpoint(idDoc));
  } catch (err) {
    const error = err as Error;
    switch (error.message) {
      // This message (included the space at the end) was taken verbatim from
      // the API spec:
      case 'There was an error deleting the employee ':
        throw new EmployeeNotFoundError(idDoc);
      default:
        throw error;
    }
  }
}
