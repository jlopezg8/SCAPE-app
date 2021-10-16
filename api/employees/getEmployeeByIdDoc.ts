import { Employee } from '../../models/Employee';
import { RequiredArgumentError } from '../errors';
import { get } from '../utils';
import { APIEmployee, getEndpoint, mapApiEmployeeToEmployee } from './common';

/**
 * @throws `'../errors'.RequiredArgumentError` if `idDoc` is empty
 * @throws `EmployeeNotFoundError` if the employee with `idDoc` is not found
 * @throws `Error` if there's a network failure or an unknown error
 */
export default async function getEmployeeByIdDoc(idDoc: string)
  : Promise<Employee>
{
  if (!idDoc) throw new RequiredArgumentError('idDoc');
  try {
    const endpoint = getEndpoint(idDoc);
    const apiEmployee = await (await get(endpoint)).json() as APIEmployee;
    return mapApiEmployeeToEmployee(apiEmployee);
  } catch (err) {
    const error = err as Error;
    switch (error.message) {
      case 'Employee doesnt exist with that document':
        throw new EmployeeNotFoundError(idDoc);
      default:
        throw error;
    }
  }
}

export class EmployeeNotFoundError extends Error {
  constructor(idDoc?: string) {
    const withId = idDoc ? ` with ID "${idDoc}" ` : ' ';
    super(`employee${withId}not found`);
    this.name = 'EmployeeNotFoundError';
  }
}
