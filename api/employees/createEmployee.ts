import {
  EmployeeToCreate,
  employeeToCreateSchema,
} from '../../models/Employee';
import { RequiredArgumentError } from '../errors';
import { post } from '../utils';
import addEmployeePhoto from './addEmployeePhoto';
import { APIEmployee, getEndpoint, mapEmployeeToApiEmployee } from './common';

/**
 * @throws `'yup'.ValidationError` if `employee` does not match
 *         `'../../models/Employee.employeeToCreateSchema'`
 * @throws `'../errors'.RequiredArgumentError` if `workplaceId` is not given
 * @throws `EmployeeWithIdDocAlreadyExistsError` if an employee with the given
 *         ID document already exists
 * @throws `EmployeeWithEmailAlreadyExistsError` if an employee with the given
 *         email already exists
 * @throws `MultipleFacesInPhotoError` if in the employee's photo, if given,
 *         multiple faces are identified
 * @throws `PhotoOfAnotherEmployeeError` if the employee's photo, if given, is
 *         of another employee
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function createEmployee(
  employee: EmployeeToCreate, workplaceId: number
) {
  await addEmployee(employee, workplaceId);
  if (employee.photo) {
    await addEmployeePhoto(employee.idDoc, employee.photo);
  }
}

async function addEmployee(employee: EmployeeToCreate, workplaceId: number) {
  if (!workplaceId) throw new RequiredArgumentError('workplaceId');
  employeeToCreateSchema.validateSync(employee);
  const apiEmployee = createAPIEmployeeToCreate(employee, workplaceId);
  try {
    await post(getEndpoint(), apiEmployee);
  } catch (err) {
    const error = err as Error;
    switch (error.message) {
      case 'An employee with the same document id has already been registered':
        throw new EmployeeWithIdDocAlreadyExistsError(employee.idDoc);
      case 'An employee with the same email has already been registered':
        throw new EmployeeWithEmailAlreadyExistsError(employee.email);
      default:
        throw error;
    }
  }
}

interface APIEmployeeToCreate extends APIEmployee {
  workPlaceId: number;
  password: string;
}

function createAPIEmployeeToCreate(
  employee: EmployeeToCreate, workplaceId: number
) : APIEmployeeToCreate {
  return Object.assign(mapEmployeeToApiEmployee(employee), {
    workPlaceId: workplaceId,
    password: employee.password,
  });
}

export class EmployeeWithIdDocAlreadyExistsError extends Error {
  constructor(idDoc: string) {
    super(`an employee with the ID document "${idDoc}" already exists`);
    this.name = 'EmployeeWithIdDocAlreadyExistsError';
  }
}

export class EmployeeWithEmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`an employee with the email "${email}" already exists`);
    this.name = 'EmployeeWithEmailAlreadyExistsError';
  }
}
