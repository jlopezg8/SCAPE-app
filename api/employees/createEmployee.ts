import { Employee } from "../../models/Employee";

// TODO: mid: find another way to do localization
import { post, translateBadRequestErrorMessage as t } from '../utils';
import { APIEmployee, getEndpoint, sexApiSexBiMap } from './common';

export default async function createEmployee(employee: Employee) {
  const addEmployeeResponse = await addEmployee(employee);
  if (!employee.photo) {
    return addEmployeeResponse;
  } else {
    const addEmployeePhotoResponse = await addEmployeePhoto(
      mapEmployeeToAddEmployeePhotoParams(employee));
    return JSON.stringify({ addEmployeeResponse, addEmployeePhotoResponse });
  }
}

async function addEmployee(employee: Employee) {
  const apiEmployee = mapEmployeeToApiEmployee(employee);
  return await (
    await t(post(getEndpoint(), apiEmployee), addEmployeeErrorTranslations)
  ).text();
}

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

interface AddEmployeePhotoParams {
  documentId: string;
  encodeImage: string;
  faceListId: string;
}

async function addEmployeePhoto(params: AddEmployeePhotoParams) {
  const endpoint = getEndpoint('AssociateImage');
  return await (
    await t(post(endpoint, params), addEmployeePhotoErrorTranslations)
  ).text();
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

function mapEmployeeToAddEmployeePhotoParams(employee: Employee)
  : AddEmployeePhotoParams
{
  return {
    documentId: employee.idDoc,
    encodeImage: employee.photo!,
    faceListId: 'prueba',
  };
}
