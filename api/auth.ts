import Role, { InvalidRoleError } from '../models/Role';
import { createEndpointGetter } from './serverURL';
// TODO: low: shouldn't need to specify `/index`, maybe need to change a setting?
import {
  postURLEncodedFormData,
  setAccessToken,
  translateBadRequestErrorMessage as t
} from './utils/index';

const baseEndpoint = 'api/user';
const getEndpoint = createEndpointGetter(baseEndpoint);

export async function login(username: string, password: string) {
  const response = await t(
    postURLEncodedFormData(getEndpoint('login'), { username, password }),
    loginErrorTranslations);
  const { scope: apiRole, access_token: accessToken } =
    await response.json() as LoginResponse;
  const role = roles.get(apiRole);
  if (!role) {
    throw new InvalidRoleError(role);
  }
  setAccessToken(accessToken);
  return { role, accessToken };
}

const loginErrorTranslations = new Map<string, string>([
  ['There was an error with credentials', 'Usuario o contraseña incorrectos'],
]);

interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  scope: string;
}

// FIXME: high: rename API roles when the time comes:
const roles = new Map<string, Role>([
  ['Admin'    , 'admin'   ],
  ['Employeer', 'employer'],
  ['Employee' , 'employee'],
]);

export async function logout() {
  setAccessToken(undefined);
}
