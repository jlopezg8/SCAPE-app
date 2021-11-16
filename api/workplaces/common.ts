import Workplace, { WorkplaceToCreateOrEdit } from '../../models/Workplace';
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

export interface APIWorkplaceToCreateOrEdit {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  description?: string;
}

export function createAPIWorkplaceToCreateOrEdit(
  workplace: WorkplaceToCreateOrEdit
) : APIWorkplaceToCreateOrEdit {
  return {
    name: workplace.name,
    address: workplace.address,
    latitude: workplace.location.latitude.toString(),
    longitude: workplace.location.longitude.toString(),
    description: workplace.description,
  };
}

export function mapAPIWorkplaceToWorkplace(workplace: APIWorkplace)
  : Workplace
{
  return {
    id: workplace.id || undefined,
    name: workplace.name,
    description: workplace.description || undefined,
    address: workplace.address,
    location:
         workplace.latitudePosition != null
      && workplace.longitudePosition != null
        ? {
            latitude: parseFloat(workplace.latitudePosition),
            longitude: parseFloat(workplace.longitudePosition),
          }
        : undefined,
    employees: workplace.employeeWorkPlace
      ? workplace.employeeWorkPlace.map(
          ({ employee }) => mapApiEmployeeToEmployee(employee))
      : undefined,
  };
}

export class WorkplaceNotFoundError extends Error {
  constructor(id?: number) {
    const withId = id ? ` with ID "${id}" ` : ' ';
    super(`workplace${withId}not found`);
    this.name = 'WorkplaceNotFoundError';
  }
}
