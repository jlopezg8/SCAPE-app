import { Employee } from "../../models/Employee";

// TODO: mid: find another way to do localization
// TODO: low: shouldn't need to specify `/index`, maybe need to change a setting?
import { get } from '../utils/index';
import { APIEmployee, getEndpoint, mapApiEmployeeToEmployee } from './common';

export default async function getEmployeesByWorkplace(workplaceId: number)
  : Promise<Employee[]>
{
  const endpoint = getEndpoint(`GetEmployeesByWorkPlace/${workplaceId}`);
  const response: APIResponse = await (await get(endpoint)).json();
  return response.map(({ employee }) => mapApiEmployeeToEmployee(employee));
}

type APIResponse = {
  idWorkPlace: number;
  startJobDate: string;
  endJobDate: string;
  schedule: string;
  employee: APIEmployee;
}[];
