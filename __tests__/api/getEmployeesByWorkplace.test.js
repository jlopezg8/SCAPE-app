require('dotenv').config();

import fetch from 'isomorphic-fetch';
import { toSatisfyAll } from 'jest-extended';

import { login } from '../../api/auth';
import getEmployeesByWorkplace, {
  WorkplaceNotFoundError,
} from '../../api/employees/getEmployeesByWorkplace';
import { employeeSchema } from '../../models/Employee';

global.fetch = fetch;
expect.extend({ toSatisfyAll });

describe('tests for fetching the employees of a workplace from the API', () => {
  beforeAll(async () => {
    await login(process.env.TEST_EMPLOYER_USERNAME,
                process.env.TEST_EMPLOYER_PASSWORD);
  });

  it('returns a list of employees for an existing workplace', () => {
    const workplaceId = 1;
    const isValidEmployee = employee => employeeSchema.isValidSync(employee);
    return (
      expect(getEmployeesByWorkplace(workplaceId))
        .resolves
        .toSatisfyAll(isValidEmployee)
    );
  });

  it('returns an empty list for a workplace with no employees', () => {
    const workplaceId = 2;
    return (
      expect(getEmployeesByWorkplace(workplaceId))
        .resolves
        .toEqual([])
    );
  });

  it('throws an error for a nonexistent workplace', () => {
    const workplaceId = 3;
    return (
      expect(getEmployeesByWorkplace(workplaceId))
        .rejects
        .toThrow(WorkplaceNotFoundError)
    );
  });
});
