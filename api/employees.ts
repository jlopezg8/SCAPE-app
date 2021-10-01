// TODO: high: break this into submodules, find another way to do localization

import { BiDirectionalMap } from 'bi-directional-map/dist';

import { Employee } from "../models/Employee";
import { createEndpointGetter } from './serverURL';
// TODO: low: shouldn't need to specify `/index`, maybe need to change a setting?
import { post, translateBadRequestErrorMessage as t } from './utils/index';

const baseEndpoint = 'api/employee/';
const getEndpoint = createEndpointGetter(baseEndpoint);

interface APIEmployee {
  documentId: string,
  firstName: string,
  lastName: string,
  email?: string,
  sex?: 'M' | 'F' | 'I',
  dateBirth?: Date,
}

const sexApiSexBiMap = new BiDirectionalMap<
  Employee['sex'], APIEmployee['sex']
>({
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
    // It seems yup doesn't cast employee.birthDate to a Date if the initial
    // value is '' (a string), so we'll have to do it ourselves:
    dateBirth: employee.birthDate && new Date(employee.birthDate),
    //photo: employee.photo, is not expected by the `insertEmployee` action,
    //                       we have to send it to the `associateFace` action
  };
}

const addEmployeeErrorTranslations = new Map<string, string>([
  [
    'The document, name and lastname fields are required',
    'Introduce el documento de identidad, el nombre y el apellido'
  ],
  [
    'Email address entered is not valid',
    'Correo inválido'
  ],
  [
    'Document entered is not valid',
    'Usa 10 dígitos, y sólo dígitos, para el documento de identidad'
  ],
  [
    'Sex entered is not valid',
    'Sexo no reconocido. Ponte en contacto con Soporte.'
  ],
  [
    'An employee with the same document id has already been registered',
    'Ya se ha registrado un empleado con ese documento de identidad'
  ],
  [
    'An employee with the same email has already been registered',
    'Ese correo ya está en uso. Prueba con otro.'
  ],
]);

async function addEmployee(employee: Employee) {
  const apiEmployee = mapEmployeeToApiEmployee(employee);
  return await (
    await t(post(getEndpoint(), apiEmployee), addEmployeeErrorTranslations)
  ).text();
}

interface AddEmployeePhotoParams {
  documentId: string;
  encodeImage: string;
  faceListId: string;
}

const addEmployeePhotoErrorTranslations = new Map<string, string>([
  [
    'The image must contain only one face',
    'Usa una foto que contenga una, y sólo una, cara'
  ],
  [
    'The image has already been associated with an employee',
    'Esa foto corresponde a un empleado ya registrado'
  ],
]);

async function addEmployeePhoto(params: AddEmployeePhotoParams) {
  const endpoint = getEndpoint('AssociateImage');
  return await (
    await t(post(endpoint, params), addEmployeePhotoErrorTranslations)
  ).text();
}

function mapEmployeeToAddEmployeePhotoParams(employee: Employee)
  : AddEmployeePhotoParams
{
  return {
    documentId: employee.idDoc,
    encodeImage: employee.photo!,
    faceListId: 'prueba',
  };
}

export async function createEmployee(employee: Employee) {
  const addEmployeeResponse = await addEmployee(employee);
  if (!employee.photo) {
    return addEmployeeResponse;
  } else {
    const addEmployeePhotoResponse = await addEmployeePhoto(
      mapEmployeeToAddEmployeePhotoParams(employee));
    return JSON.stringify({ addEmployeeResponse, addEmployeePhotoResponse });
  }
}

interface AssociateImageParams {
  faceListId: string;
  encodeImage: string;
}

const getEmployeeByPhotoErrorTranslations = new Map<string, string>([
  [
    'The image must contain only one face',
    'Usa una foto que contenga una, y sólo una, cara'
  ],
  [
    'No persistedFaceid found for this face',
    'Esa foto no corresponde a ningún empleado registrado'
  ],
  [
    'No Employee found in Database for this persistedFaceId',
    'Esa foto no corresponde a ningún empleado registrado'
  ],
]);

function mapApiEmployeeToEmployee(employee: APIEmployee): Employee {
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

export async function getEmployeeByPhoto(photo: string): Promise<Employee> {
  const endpoint = getEndpoint('GetEmployeeByImage');
  const body: AssociateImageParams = {
    faceListId: 'prueba',
    encodeImage: photo,
  };
  const apiEmployee = await (
    await t(post(endpoint, body), getEmployeeByPhotoErrorTranslations)
  ).json();
  return mapApiEmployeeToEmployee(apiEmployee);
}

interface RecordAttendanceParams {
  employeeDocId: string;
  type: 'clock-in' | 'clock-out';
  timestamp?: Date;
}

interface AddAttendanceParams {
  documentEmployee: string;
  type: 'I' | 'O';
  dateTime: string;
}

async function recordAttendance(
  { employeeDocId, type, timestamp = new Date() }: RecordAttendanceParams
) {
  const endpoint = createEndpointGetter('api/attendance')();
  const body: AddAttendanceParams = {
    documentEmployee: employeeDocId,
    type: type === 'clock-in' ? 'I' : 'O',
    dateTime: timestamp.toISOString(),
  };
  return await (await post(endpoint, body)).text();
}

export function clockIn(employeeDocId: string, timestamp?: Date) {
  return recordAttendance({ employeeDocId, type: 'clock-in', timestamp });
}

export function clockOut(employeeDocId: string, timestamp?: Date) {
  return recordAttendance({ employeeDocId, type: 'clock-out', timestamp });
}
