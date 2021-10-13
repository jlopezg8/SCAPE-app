require('dotenv').config();

import fetch from 'isomorphic-fetch';

import { InvalidCredentialsError, login } from '../../api/auth';
import { RequiredArgumentError } from '../../api/errors';

global.fetch = fetch;

describe('auth API tests', () => {
  it('returns a role and an access token for valid credentials', async () => {
    const {
      TEST_EMPLOYEE_USERNAME: email,
      TEST_EMPLOYEE_PASSWORD: password,
    } = process.env;
    const { role, accessToken } = await login(email, password);
    expect(role).toBe('employee');
    expect(accessToken).toBeTruthy();
  });

  it('throws an error for undefined credentials', async () => {
    const email = undefined, password = undefined;
    return (
      expect(login(email, password)).rejects.toThrow(RequiredArgumentError)
    );
  });

  it('throws an error for null credentials', async () => {
    const email = null, password = null;
    return (
      expect(login(email, password)).rejects.toThrow(RequiredArgumentError)
    );
  });

  it('throws an error for empty credentials', () => {
    const email = '', password = '';
    return (
      expect(login(email, password)).rejects.toThrow(RequiredArgumentError)
    );
  });

  it('throws an error for invalid credentials', () => {
    const email = 'invalid@credentials.com',
          password = 'incorrect horse battery staple';
    return (
      expect(login(email, password)).rejects.toThrow(InvalidCredentialsError));
  });
});
