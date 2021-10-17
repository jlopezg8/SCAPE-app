import { EmployeeToEdit, employeeToEditSchema } from '../../models/Employee';
import { put } from '../utils';
import {
  APIEmployee,
  EmployeeNotFoundError,
  getEndpoint,
  mapEmployeeToApiEmployee,
} from './common';

/*export default async function editEmployee(employee: EmployeeToEdit) {
  const editEmployeeResponse = await _editEmployee(employee);
  // TODO: high: how to det if the user added a photo or changed the prev one:
  if (!employee.photo) {
    return editEmployeeResponse;
  } else {
    const addEmployeePhotoResponse = await addEmployeePhoto(
      mapEmployeeToAddEmployeePhotoParams(employee));
    return JSON.stringify({ editEmployeeResponse, addEmployeePhotoResponse });
  }
}*/

/**
 * @throws `'yup'.ValidationError` if `employee` does not match
 *         `'../../models/Employee.employeeToEditSchema'`
 * @throws `'./common'.EmployeeNotFoundError` if the employee with `idDoc` was
 *         not found
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function editEmployee(
  initialIdDoc: string, employee: EmployeeToEdit
) {
  employeeToEditSchema.validateSync(employee);
  const apiEmployee = createAPIEmployeeToEdit(employee);
  try {
    await put(getEndpoint(initialIdDoc), apiEmployee);
  } catch (err) {
    const error = err as Error;
    switch (error.message) {
      // This message (included the space at the end) was taken verbatim:
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
