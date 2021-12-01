import { BiDirectionalMap } from 'bi-directional-map/dist';

import { Employee } from '../../models/Employee';
import { createEndpointGetter } from '../serverURL';

const baseEndpoint = 'api/employee/';
export const getEndpoint = createEndpointGetter(baseEndpoint);

export interface APIEmployee {
  documentId: string;
  firstName: string;
  lastName: string;
  email: string;
  sex?: 'M' | 'F' | 'I';
  dateBirth?: Date;
  image?: { image: string }[];
}

export interface APISchedule {
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
}

export class EmployeeNotFoundError extends Error {
  constructor(idDoc?: string) {
    const withId = idDoc ? ` with ID "${idDoc}" ` : ' ';
    super(`employee${withId}not found`);
    this.name = 'EmployeeNotFoundError';
  }
}

export function mapApiEmployeeToEmployee(employee: APIEmployee): Employee {
  return {
    idDoc: employee.documentId,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    sex: employee.sex ? sexApiSexBiMap.getKey(employee.sex) : undefined,
    birthDate: employee.dateBirth ? new Date(employee.dateBirth) : undefined,
    photo: employee.image?.length ? employee.image[0].image : undefined,
  };
}

export function mapEmployeeToApiEmployee(employee: Employee) : APIEmployee {
  return {
    documentId: employee.idDoc,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    sex: employee.sex && sexApiSexBiMap.getValue(employee.sex),
    dateBirth: employee.birthDate,
    //image: employee.photo, is not expected by the "insert employee" action,
    //                       we have to send it to the "associate face" action
  };
}

export const sexApiSexBiMap = new BiDirectionalMap<
  Employee['sex'], APIEmployee['sex']
>({
  hombre: 'M',
  mujer: 'F',
  intersexo: 'I',
});
