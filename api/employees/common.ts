import { BiDirectionalMap } from 'bi-directional-map/dist';

import { Employee } from "../../models/Employee";
import { createEndpointGetter } from '../serverURL';

const baseEndpoint = 'api/employee/';
export const getEndpoint = createEndpointGetter(baseEndpoint);

export interface APIEmployee {
  documentId: string;
  firstName: string;
  lastName: string;
  email?: string;
  sex?: 'M' | 'F' | 'I';
  dateBirth?: Date;
  image?: { image: string }[];
}

export function mapApiEmployeeToEmployee(employee: APIEmployee): Employee {
  return {
    idDoc: employee.documentId,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    sex: employee.sex && sexApiSexBiMap.getKey(employee.sex),
    birthDate: employee.dateBirth ? new Date(employee.dateBirth) : undefined,
    photo: employee.image?.length ? employee.image[0].image : undefined,
  };
}

export const sexApiSexBiMap = new BiDirectionalMap<
  Employee['sex'], APIEmployee['sex']
>({
  hombre: 'M',
  mujer: 'F',
  intersexo: 'I',
});
