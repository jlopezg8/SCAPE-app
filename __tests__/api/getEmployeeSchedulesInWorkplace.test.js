require('dotenv').config();

import fetch from 'isomorphic-fetch';
import { toSatisfyAll } from 'jest-extended';

import { login } from '../../api/auth';
import { getEmployeeSchedulesInWorkplace } from '../../api/employees';
import { EmployeeNotFoundError } from '../../api/employees/common';
import { WorkplaceNotFoundError } from '../../api/workplaces/common';
import { scheduleSchema } from '../../models/Schedule'

global.fetch = fetch;
expect.extend({ toSatisfyAll });

describe('getEmployeeSchedulesInWorkplace tests', () => {
  beforeAll(async () => {
    await login(
      process.env.TEST_EMPLOYER_USERNAME,
      process.env.TEST_EMPLOYER_PASSWORD
    );
  });

  it('getEmployeeSchedulesInWorkplace correctly', async () => {
    const employeeIdDoc = '9999';
    const workplaceId = 68;
    const isValidSchedule = schedule => scheduleSchema.isValidSync(schedule);
    const schedules =
      await getEmployeeSchedulesInWorkplace(employeeIdDoc, workplaceId);
    expect(schedules).toSatisfyAll(isValidSchedule);
  });

  it('throws an error for a nonexistent employee', () => {
    const employeeIdDoc = '1';
    const workplaceId = 68;
    return expect(getEmployeeSchedulesInWorkplace(employeeIdDoc, workplaceId))
      .rejects
      .toThrow(EmployeeNotFoundError);
  });

  // There's an issue with the web API, so this actually returns an empty list:
  it.skip('throws an error for a nonexistent workplace', () => {
    const employeeIdDoc = '9999';
    const workplaceId = 1;
    return expect(getEmployeeSchedulesInWorkplace(employeeIdDoc, workplaceId))
      .rejects
      .toThrow(WorkplaceNotFoundError);
  });
});
