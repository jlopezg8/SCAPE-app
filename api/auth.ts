import Role, { UnsupportedRoleError } from '../models/Role';
import { RequiredArgumentError } from './errors';
import { createEndpointGetter } from './serverURL';
import { postURLEncodedFormData, setAccessToken } from './utils';

const baseEndpoint = 'api/user/';
const getEndpoint = createEndpointGetter(baseEndpoint);

export async function login(username: string, password: string) {
  if (!username) throw new RequiredArgumentError('username');
  if (!password) throw new RequiredArgumentError('password');
  try {
    const response = await postURLEncodedFormData(
      getEndpoint('login'), { username, password });
    const { scope: apiRole, access_token: accessToken } =
      await response.json() as LoginResponse;
    const role = roles.get(apiRole);
    if (!role) throw new UnsupportedRoleError(role);
    setAccessToken(accessToken);
    return { role, accessToken };
  } catch (err) {
    const error = err as Error;
    switch (error.message) {
      case 'There was an error with credentials':
        throw new InvalidCredentialsError();
      default:
        throw error;
    }
  }
}

interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  scope: string;
}

const roles = new Map<string, Role>([
  ['Admin'   , 'admin'   ],
  ['Employer', 'employer'],
  ['Employee', 'employee'],
]);

export class InvalidCredentialsError extends Error {
  constructor() {
    super();
    this.name = 'InvalidCredentialsError';
  }
}

export async function logout() {
  setAccessToken(undefined);
}
