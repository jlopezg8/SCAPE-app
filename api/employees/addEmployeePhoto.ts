import { RequiredArgumentError } from '../errors';
import { post } from '../utils';
import { getEndpoint } from './common';

/**
 * @throws `'../errors'.RequiredArgumentError` if `employeeIdDoc` or `photo`
 *         are empty
 * @throws `MultipleFacesInPhotoError` if multiple faces are identified in the
 *         photo
 * @throws `PhotoOfAnotherEmployeeError` if the photo is of another employee
 * @throws `Error` if there was a network failure or an unknown error
 */
export default async function addEmployeePhoto(
  employeeIdDoc: string, photo: string
) {
  if (!employeeIdDoc) throw new RequiredArgumentError('employeeIdDoc');
  if (!photo) throw new RequiredArgumentError('photo');
  const params: AssociateImageParams = {
    documentId: employeeIdDoc,
    encodeImage: photo,
    faceListId: 'prueba',
  }
  try {    
    await post(getEndpoint('AssociateImage'), params);
  } catch (err) {
    const error = err as Error;
    switch (error.message) {
      case 'The image must contain only one face':
        throw new MultipleFacesInPhotoError();
      case 'The image has already been associated with an employee':
        throw new PhotoOfAnotherEmployeeError();
      default:
        throw error;
    }
  }
}

interface AssociateImageParams {
  documentId: string;
  encodeImage: string;
  faceListId: string;
}

export class MultipleFacesInPhotoError extends Error {
  constructor() {
    super('multiple faces identified in the photo');
    this.name = 'MultipleFacesInPhotoError';
  }
}

export class PhotoOfAnotherEmployeeError extends Error {
  constructor() {
    super('this photo is of another employee');
    this.name = 'PhotoOfAnotherEmployeeError';
  }
}
