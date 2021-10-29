import Workspace from '../../models/Workplace';
import { APIEmployee, mapApiEmployeeToEmployee } from '../employees/common';
import { createEndpointGetter } from '../serverURL';

const baseEndpoint = 'api/WorkPlace/';
export const getEndpoint = createEndpointGetter(baseEndpoint);

export interface APIWorkplace {
  id?: number;
  name: string;
  address: string;
  latitudePosition?: string;
  longitudePosition?: string;
  description?: string;
  employeeWorkPlace?: { employee: APIEmployee }[];
}

interface EmployeeWorkPlace {
  idWorkPlace: 1;
  startJobDate: "2021-01-01T00:00:00";
  endJobDate: "2022-01-01T00:00:00";
  schedule: "8-12";
  employee: null;
}

export class WorkplaceNotFoundError extends Error {
  constructor(id?: number) {
    const withId = id ? ` with ID "${id}" ` : ' ';
    super(`workplace${withId}not found`);
    this.name = 'WorkplaceNotFoundError';
  }
}

export function mapAPIWorkplaceToWorkplace(workplace: APIWorkplace)
  : Workspace
{
  return {
    id: workplace.id || undefined,
    name: workplace.name,
    description: workplace.description || undefined,
    address: workplace.address,
    latitude: workplace.latitudePosition
      ? parseFloat(workplace.latitudePosition)
      : undefined,
    longitude: workplace.longitudePosition
      ? parseFloat(workplace.longitudePosition)
      : undefined,
    employees: workplace.employeeWorkPlace
      ? workplace.employeeWorkPlace.map(
          ({ employee }) => mapApiEmployeeToEmployee(employee))
      : undefined,
  };
}
