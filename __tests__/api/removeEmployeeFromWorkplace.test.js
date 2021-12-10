require('dotenv').config();

import fetch from 'isomorphic-fetch';

import { login } from '../../api/auth';
import { removeEmployeeFromWorkplace } from '../../api/employees';

global.fetch = fetch;

describe('removeEmployeeFromWorkplace tests', () => {
  beforeAll(async () => {
    await login(
      process.env.TEST_EMPLOYER_USERNAME,
      process.env.TEST_EMPLOYER_PASSWORD
    );
  });

  // TODO: mid: putEmployeeEmploymentInWorkplace first, so we can ensure
  // there's something to remove:
  it('removeEmployeeFromWorkplace correctly', () => {
    const employeeIdDoc = '9999';
    const workplaceId = 68;
    return expect(removeEmployeeFromWorkplace(employeeIdDoc, workplaceId))
      .resolves
      .not.toThrow();
  });
});
