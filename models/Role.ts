import * as yup from './utils/localeYup';

const roleValues = ['admin', 'employer', 'employee'] as const;
// Get literal type from array:
// https://stackoverflow.com/questions/44497388/typescript-array-to-string-literal-type
type Role = typeof roleValues[number];
export default Role;

// oneOf([...[v1, v2, ...] as const]) is a workaround for
// https://github.com/jquense/yup/issues/1298:
export const roleSchema = yup.mixed<Role>().oneOf([...roleValues]);

export class InvalidRoleError extends Error {
  constructor(givenRole: string | undefined) {
    super(`role: expected one of ${roleValues}`
            + givenRole ? `but "${givenRole}" was given` : '');
    this.name = 'InvalidRoleError';
  }
}
