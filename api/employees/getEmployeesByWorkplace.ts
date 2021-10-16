import { Employee } from '../../models/Employee';
import { RequiredArgumentError } from '../errors';
import { get } from '../utils';
import { APIEmployee, getEndpoint, mapApiEmployeeToEmployee } from './common';

export default async function getEmployeesByWorkplace(workplaceId: number)
  : Promise<Employee[]>
{
  if (workplaceId == null) throw new RequiredArgumentError('workplaceId');
  try {
    const endpoint = getEndpoint(`GetEmployeesByWorkPlace/${workplaceId}`);
    const response = await (await get(endpoint)).json() as APIResponse;
    return response.map(({ employee }) => mapApiEmployeeToEmployee(employee));
  } catch (err) {
    const error = err as Error;
    switch (error.message) {
      case 'There is no Workplace with that ID':
        throw new WorkplaceNotFoundError(workplaceId);
      default:
        throw error;
    }
  }
}

type APIResponse = {
  idWorkPlace: number;
  startJobDate: string;
  endJobDate: string;
  schedule: string;
  employee: APIEmployee;
}[];

export class WorkplaceNotFoundError extends Error {
  constructor(workplaceId?: number) {
    const withId = workplaceId ? ` with ID "${workplaceId}" ` : ' ';
    super(`workplace${withId}not found`);
    this.name = 'WorkplaceNotFoundError';
  }
}
