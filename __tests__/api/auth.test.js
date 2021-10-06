import fetch from 'isomorphic-fetch';

import { InvalidCredentialsError, login } from '../../api/auth';
import { RequiredArgumentError } from '../../api/errors';

global.fetch = fetch;

describe('auth API tests', () => {
  it('returns an error message for invalid credentials', () => {
    const email = 'invalid@credentials.com',
          password = 'incorrect horse battery staple';
    return (
      expect(login(email, password)).rejects.toThrow(InvalidCredentialsError));
  });

  it('returns a role and an access token with valid credentials', async () => {
    const email = 'employee@ontime.com', password = 'ontime';
    const { role, accessToken } = await login(email, password);
    expect(role).toBe('employee');
    expect(accessToken).toBeTruthy();
  });

  it('returns an error message for empty credentials', () => {
    const email = '', password = '';
    return (
      expect(login(email, password)).rejects.toThrow(RequiredArgumentError)
    );
  });

  it('returns an error message for null credentials', async () => {
    const email = null, password = null;
    return (
      expect(login(email, password)).rejects.toThrow(RequiredArgumentError)
    );
  });
});
