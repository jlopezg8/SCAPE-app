import * as yup from './utils/localeYup';

// See https://www.apa.org/pi/lgbt/resources/sexuality-definitions.pdf
const sexValues = ['hombre', 'mujer', 'intersexo'] as const;
// Get literal type from array:
// https://stackoverflow.com/questions/44497388/typescript-array-to-string-literal-type
export type Sex = typeof sexValues[number];

export interface Employee {
  idDoc: string;
  firstName: string;
  lastName: string;
  email?: string;
  sex?: Sex;
  birthDate?: Date;
  /** Base64 image */
  photo?: string;
}

/*
 * We tried getting the initial values from the yup scheme by adding a
 * .default('') to each of its fields, but this made sex and birthDate
 * required, since '' would fail those fields validations.
 */
const _employeeInitialValues: { [field in keyof Employee]-?: string } = {
  idDoc: '',
  firstName: '',
  lastName: '',
  email: '',
  sex: '',
  birthDate: '',
  photo: '',
};
export const employeeInitialValues =
  _employeeInitialValues as unknown as Employee;

export const employeeSchema: yup.SchemaOf<Employee> = yup.object({
  idDoc: yup.string().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email(),
  // oneOf([...[v1, v2, ...] as const]) is a workaround for
  // https://github.com/jquense/yup/issues/1298
  sex: yup.mixed<Sex>().oneOf([...sexValues]),
  // There's no way to set the type error message in setLocale, so we have to
  // do it here:
  birthDate: yup.date().typeError('Fecha inválida'),
  photo: yup.string(),
});
