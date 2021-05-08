import { BiDirectionalMap } from 'bi-directional-map/dist';

import { createEndpointGetter } from './serverURL';
// TODO: low: shouldn't need to specify `/index`, maybe need to change a setting?
import { post } from './utils/index';
import { Employee } from "../models/Employee";

const baseEndpoint = 'api/employee';
const getEndpoint = createEndpointGetter(baseEndpoint);

interface APIEmployee {
  documentId: string,
  firstName: string,
  lastName: string,
  email?: string,
  sex?: 'M' | 'F' | 'I',
  /** What's this? */
  faceListId: string,
  dateBirth?: string,
};

const sexApiSexBiMap = new BiDirectionalMap<Employee['sex'], APIEmployee['sex']>({
  hombre: 'M',
  mujer: 'F',
  intersexo: 'I',
});

function mapEmployeeToApiEmployee(employee: Employee): APIEmployee {
  return {
    documentId: employee.idDoc,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    sex: employee.sex && sexApiSexBiMap.getValue(employee.sex),
    faceListId: 'prueba',
    dateBirth: employee.birthDate?.toISOString(),
    //photo: employee.photo, is not expected by the `insertEmployee` action,
    //                       we have to send it to the `associateFace` action
  };
}

interface AddEmployeePhotoParams {
  documentId: string;
  encodeImage: string;
}

export async function addEmployeePhoto(params: AddEmployeePhotoParams) {
  const endpoint = getEndpoint('AssociateImage');
  console.log('POST', endpoint, params);
  return await (await post(endpoint, params)).text();
}

export async function createEmployee(employee: Employee) {
  const apiEmployee = mapEmployeeToApiEmployee(employee);
  console.log('POST', getEndpoint(), apiEmployee);
  const insertEmployeeResponse = await (
    await post(getEndpoint(), apiEmployee)).text();
  if (!employee.photo) {
    return insertEmployeeResponse;
  } else {
    const associateFaceResponse = await addEmployeePhoto({
      documentId: employee.idDoc,
      encodeImage: employee.photo,
    });
    return JSON.stringify({ insertEmployeeResponse, associateFaceResponse });
  }
}

interface AssociateImageParams {
  faceListId: string;
  encodeImage: string;
}

function mapEmployeeApiToEmployee(employee: APIEmployee): Employee {
  return {
    idDoc: employee.documentId,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    sex: employee.sex && sexApiSexBiMap.getKey(employee.sex),
    birthDate: employee.dateBirth ? new Date(employee.dateBirth) : undefined,
    photo: undefined,
  };
}

export async function getEmployeeByPhoto(photo: string) {
  const endpoint = getEndpoint('GetEmployeeByImage');
  const body: AssociateImageParams = {
    faceListId: 'prueba',
    encodeImage: photo,
  } 
  console.log('POST', endpoint, body);
  const apiEmployee = await (await post(endpoint, body)).json();
  return mapEmployeeApiToEmployee(apiEmployee);
}
