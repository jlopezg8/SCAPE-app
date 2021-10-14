import { Employee } from "../../models/Employee";

// TODO: mid: find another way to do localization
import { post, translateBadRequestErrorMessage as t } from '../utils';
import { APIEmployee, getEndpoint, mapApiEmployeeToEmployee } from './common';

export default async function getEmployeeByPhoto(photo: string)
  : Promise<Employee>
{
  const endpoint = getEndpoint('GetEmployeeByImage');
  const body: AssociateImageParams = {
    faceListId: 'prueba',
    encodeImage: photo,
  };
  const apiEmployee: APIEmployee = await (
    await t(post(endpoint, body), getEmployeeByPhotoErrorTranslations)
  ).json();
  return mapApiEmployeeToEmployee(apiEmployee);
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
