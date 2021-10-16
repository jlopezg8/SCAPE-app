import { EmployeeToEdit, employeeToEditSchema } from '../../models/Employee';
// TODO: mid: find another way to do localization:
import { put, translateBadRequestErrorMessage as t } from '../utils';
import { APIEmployee, getEndpoint, mapEmployeeToApiEmployee } from './common';

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
 * @throws `Error` if there's a network failure or an unknown error
 */
export default async function editEmployee(
  initialIdDoc: string, employee: EmployeeToEdit
) {
  employeeToEditSchema.validateSync(employee);
  const apiEmployee = createAPIEmployeeToEdit(employee);
  // This operation does not return any descriptive error message, so if
  // something goes wrong there's no way of knowing why:
  await put(getEndpoint(initialIdDoc), apiEmployee);
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
