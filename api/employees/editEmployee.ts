import {
  Employee,
  EmployeeToEdit,
  employeeToEditSchema,
} from '../../models/Employee';
import { RequiredArgumentError } from '../errors';
import { put } from '../utils';
import addEmployeePhoto from './addEmployeePhoto';
import {
  APIEmployee,
  EmployeeNotFoundError,
  getEndpoint,
  mapEmployeeToApiEmployee,
} from './common';

/**
 * TODO: high: support updating the employee's photo.
 * @throws `'../errors'.RequiredArgumentError` if `oldEmployee.idDoc` is empty
 * @throws `'yup'.ValidationError` if `newEmployee` does not match
 *         `'../../models/Employee.employeeToEditSchema'`
 * @throws `'./common'.EmployeeNotFoundError` if the employee with `idDoc` was
 *         not found
 * @throws `MultipleFacesInPhotoError` if multiple faces are identified in the
 *         new photo, if given
 * @throws `PhotoOfAnotherEmployeeError` if the new photo, if given, is of
 *         another employee
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function editEmployee(
  oldEmployee: Employee, newEmployee: EmployeeToEdit
) {
  await _editEmployee(oldEmployee.idDoc, newEmployee);
  if (!oldEmployee.photo && newEmployee.photo) {
    await addEmployeePhoto(newEmployee.idDoc, newEmployee.photo);
  }
}

async function _editEmployee(initialIdDoc: string, employee: EmployeeToEdit) {
  if (!initialIdDoc) throw new RequiredArgumentError('initialIdDoc');
  employeeToEditSchema.validateSync(employee);
  const apiEmployee = createAPIEmployeeToEdit(employee);
  try {
    await put(getEndpoint(initialIdDoc), apiEmployee);
  } catch (err) {
    const error = err as Error;
    switch (error.message) {
      // This message (included the space at the end) was taken verbatim from
      // the API spec:
      case 'There was an error editing the employee ':
        throw new EmployeeNotFoundError(initialIdDoc);
      default:
        throw error;
    }
  }
}

interface APIEmployeeToEdit extends APIEmployee {
  password?: string;
}

function createAPIEmployeeToEdit(employee: EmployeeToEdit)
  : APIEmployeeToEdit
{
  return Object.assign(mapEmployeeToApiEmployee(employee), {
    password: employee.password,
  });
}
